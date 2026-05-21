import { desc, eq, inArray, sql } from "drizzle-orm";
import {
  inquiries,
  inquiryReplies,
} from "@/db/schema";
import {
  inquiryFallbackRecords,
  inquiryStatuses,
  unansweredInquiryStatuses,
  type InquiryListResult,
  type InquiryHistoryItem,
  type InquiryRecord,
  type InquiryReply,
  type InquiryStatus,
} from "@/data/inquiry-content";
import type { CurrentAppUser } from "@/lib/auth-session";
import { getDb, hasDatabaseConnection } from "@/lib/db";
import {
  createInquiryReplyEmailHtml,
  sendGmailEmail,
} from "@/lib/email";

type CreateInquiryInput = {
  name?: unknown;
  phone?: unknown;
  email?: unknown;
  interest?: unknown;
  preferredChannel?: unknown;
  subject?: unknown;
  message?: unknown;
  locale?: unknown;
  privacyAccepted?: unknown;
  sourcePath?: unknown;
};

type ListInquiryOptions = {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  unansweredOnly?: boolean;
};

type UpdateInquiryInput = {
  status?: unknown;
  assignedTo?: unknown;
};

type ReplyInquiryInput = {
  subject?: unknown;
  body?: unknown;
};

export async function createInquiry(input: CreateInquiryInput) {
  assertDatabase();

  const name = String(input.name ?? "").trim();
  const phone = String(input.phone ?? "").trim();
  const email = String(input.email ?? "").trim().toLowerCase();
  const message = String(input.message ?? "").trim();
  const privacyAccepted = Boolean(input.privacyAccepted);

  if (!name) {
    throw new Error("이름을 입력해주세요.");
  }

  if (!phone) {
    throw new Error("연락처를 입력해주세요.");
  }

  if (!email || !email.includes("@")) {
    throw new Error("답변을 받을 이메일을 입력해주세요.");
  }

  if (!message) {
    throw new Error("문의 내용을 입력해주세요.");
  }

  if (!privacyAccepted) {
    throw new Error("개인정보 수집 및 상담 회신에 동의해주세요.");
  }

  const [created] = await getDb()
    .insert(inquiries)
    .values({
      name,
      phone,
      email,
      interest: String(input.interest ?? "").trim(),
      preferredChannel: String(input.preferredChannel ?? "email").trim() || "email",
      subject: String(input.subject ?? "").trim() || "상담 문의",
      message,
      locale: String(input.locale ?? "ko").trim() || "ko",
      privacyAccepted,
      sourcePath: String(input.sourcePath ?? "").trim(),
      status: "new",
    })
    .returning({ id: inquiries.id });

  return created?.id;
}

export async function listInquiries(options: ListInquiryOptions = {}): Promise<InquiryListResult> {
  if (!hasDatabaseConnection()) {
    return filterFallback(options);
  }

  const page = Math.max(1, Number(options.page ?? 1));
  const pageSize = Math.min(50, Math.max(5, Number(options.pageSize ?? 10)));
  const offset = (page - 1) * pageSize;
  const conditions = buildInquiryConditions(options);
  const whereClause = sql.join(conditions, sql` and `);

  try {
    const rows = await getDb()
      .select({
        id: inquiries.id,
        name: inquiries.name,
        phone: inquiries.phone,
        email: inquiries.email,
        interest: inquiries.interest,
        preferredChannel: inquiries.preferredChannel,
        subject: inquiries.subject,
        message: inquiries.message,
        status: inquiries.status,
        assignedTo: inquiries.assignedTo,
        locale: inquiries.locale,
        privacyAccepted: inquiries.privacyAccepted,
        sourcePath: inquiries.sourcePath,
        createdAt: inquiries.createdAt,
        updatedAt: inquiries.updatedAt,
        repliedAt: inquiries.repliedAt,
        closedAt: inquiries.closedAt,
        replyCount: sql<number>`(select count(*)::int from inquiry_replies where inquiry_id = ${inquiries.id})`,
        latestReplyAt: sql<string | null>`(select max(created_at) from inquiry_replies where inquiry_id = ${inquiries.id})`,
      })
      .from(inquiries)
      .where(whereClause)
      .orderBy(desc(inquiries.createdAt))
      .limit(pageSize)
      .offset(offset);

    const [totalRow] = await getDb()
      .select({ count: sql<number>`count(*)::int` })
      .from(inquiries)
      .where(whereClause);

    const replies = await listRepliesForInquiryIds(rows.map((item) => item.id));
    const histories = await listHistoryForInquiryEmails(rows.map((item) => item.email));
    const counts = await getInquiryCounts();

    return {
      source: "database",
      items: rows.map((row) => hydrateInquiry(row, replies[row.id] ?? [], histories[row.email] ?? [])),
      total: Number(totalRow?.count ?? 0),
      page,
      pageSize,
      counts,
    };
  } catch (error) {
    console.error("Failed to list inquiries", error);
    return filterFallback(options);
  }
}

export async function updateInquiry(id: string, input: UpdateInquiryInput) {
  assertDatabase();

  const status = normalizeInquiryStatus(input.status);
  const assignedTo = String(input.assignedTo ?? "").trim();

  await getDb()
    .update(inquiries)
    .set({
      status,
      assignedTo,
      closedAt: status === "closed" ? sql`now()` : null,
      updatedAt: sql`now()`,
    })
    .where(eq(inquiries.id, id));
}

export async function replyToInquiry(id: string, input: ReplyInquiryInput, admin: CurrentAppUser) {
  assertDatabase();

  const inquiry = await getInquiryById(id);
  const subject = String(input.subject ?? "").trim() || `BAKSAL BEAUTY 상담 문의 답변`;
  const body = String(input.body ?? "").trim();

  if (!body) {
    throw new Error("답변 내용을 입력해주세요.");
  }

  if (!inquiry.email) {
    throw new Error("문의자 이메일이 없어 답변을 발송할 수 없습니다.");
  }

  try {
    const sent = await sendGmailEmail({
      to: inquiry.email,
      subject,
      text: body,
      html: createInquiryReplyEmailHtml({ name: inquiry.name, message: body }),
    });

    const [reply] = await getDb()
      .insert(inquiryReplies)
      .values({
        inquiryId: id,
        adminName: admin.name,
        adminEmail: admin.email,
        sentTo: inquiry.email,
        subject,
        body,
        status: "sent",
      })
      .returning({ id: inquiryReplies.id });

    await getDb()
      .update(inquiries)
      .set({
        status: "replied",
        assignedTo: admin.email,
        repliedAt: sql`now()`,
        updatedAt: sql`now()`,
      })
      .where(eq(inquiries.id, id));

    return {
      id: reply?.id,
      messageId: sent.messageId,
    };
  } catch (error) {
    await getDb().insert(inquiryReplies).values({
      inquiryId: id,
      adminName: admin.name,
      adminEmail: admin.email,
      sentTo: inquiry.email,
      subject,
      body,
      status: "failed",
      errorMessage: error instanceof Error ? error.message : "Unknown email error",
    });

    throw error;
  }
}

async function getInquiryById(id: string) {
  const [row] = await getDb()
    .select()
    .from(inquiries)
    .where(eq(inquiries.id, id))
    .limit(1);

  if (!row) {
    throw new Error("문의 내역을 찾을 수 없습니다.");
  }

  return row;
}

async function listRepliesForInquiryIds(ids: string[]) {
  if (!ids.length) {
    return {} as Record<string, InquiryReply[]>;
  }

  const rows = await getDb()
    .select({
      id: inquiryReplies.id,
      inquiryId: inquiryReplies.inquiryId,
      adminName: inquiryReplies.adminName,
      adminEmail: inquiryReplies.adminEmail,
      sentTo: inquiryReplies.sentTo,
      subject: inquiryReplies.subject,
      body: inquiryReplies.body,
      status: inquiryReplies.status,
      errorMessage: inquiryReplies.errorMessage,
      createdAt: inquiryReplies.createdAt,
    })
    .from(inquiryReplies)
    .where(inArray(inquiryReplies.inquiryId, ids))
    .orderBy(desc(inquiryReplies.createdAt));

  return rows.reduce(
    (acc, row) => {
      acc[row.inquiryId] = [...(acc[row.inquiryId] ?? []), row];
      return acc;
    },
    {} as Record<string, InquiryReply[]>,
  );
}

async function listHistoryForInquiryEmails(emails: string[]) {
  const uniqueEmails = [...new Set(emails.filter(Boolean))];

  if (!uniqueEmails.length) {
    return {} as Record<string, InquiryHistoryItem[]>;
  }

  const rows = await getDb()
    .select({
      id: inquiries.id,
      email: inquiries.email,
      subject: inquiries.subject,
      interest: inquiries.interest,
      status: inquiries.status,
      createdAt: inquiries.createdAt,
    })
    .from(inquiries)
    .where(inArray(inquiries.email, uniqueEmails))
    .orderBy(desc(inquiries.createdAt));

  return rows.reduce(
    (acc, row) => {
      const current = acc[row.email] ?? [];

      if (current.length < 8) {
        current.push({
          id: row.id,
          subject: row.subject,
          interest: row.interest,
          status: row.status,
          createdAt: row.createdAt,
        });
      }

      acc[row.email] = current;
      return acc;
    },
    {} as Record<string, InquiryHistoryItem[]>,
  );
}

async function getInquiryCounts() {
  const rows = await getDb()
    .select({
      status: inquiries.status,
      count: sql<number>`count(*)::int`,
    })
    .from(inquiries)
    .groupBy(inquiries.status);

  const counts = {
    all: 0,
    unanswered: 0,
    new: 0,
    in_progress: 0,
    replied: 0,
    closed: 0,
    spam: 0,
  } satisfies InquiryListResult["counts"];

  for (const row of rows) {
    const count = Number(row.count ?? 0);
    counts[row.status] = count;
    counts.all += count;
    if (unansweredInquiryStatuses.includes(row.status)) {
      counts.unanswered += count;
    }
  }

  return counts;
}

function buildInquiryConditions(options: ListInquiryOptions) {
  const conditions = [sql`true`];
  const search = String(options.search ?? "").trim();
  const status = String(options.status ?? "all");

  if (search) {
    const keyword = `%${search}%`;
    conditions.push(sql`(
      ${inquiries.name} ilike ${keyword}
      or ${inquiries.email} ilike ${keyword}
      or ${inquiries.phone} ilike ${keyword}
      or ${inquiries.interest} ilike ${keyword}
      or ${inquiries.subject} ilike ${keyword}
      or ${inquiries.message} ilike ${keyword}
    )`);
  }

  if (status !== "all" && inquiryStatuses.includes(status as InquiryStatus)) {
    conditions.push(sql`${inquiries.status} = ${status}`);
  }

  if (options.unansweredOnly) {
    conditions.push(sql`${inquiries.status} in ('new', 'in_progress')`);
  }

  return conditions;
}

function hydrateInquiry(
  row: Omit<InquiryRecord, "replyCount" | "latestReplyAt" | "replies" | "customerHistory"> & {
    replyCount: number;
    latestReplyAt: string | null;
  },
  replies: InquiryReply[],
  customerHistory: InquiryHistoryItem[],
): InquiryRecord {
  return {
    ...row,
    replyCount: Number(row.replyCount ?? replies.length),
    latestReplyAt: row.latestReplyAt,
    replies,
    customerHistory,
  };
}

function normalizeInquiryStatus(value: unknown): InquiryStatus {
  return inquiryStatuses.includes(value as InquiryStatus) ? (value as InquiryStatus) : "new";
}

function filterFallback(options: ListInquiryOptions): InquiryListResult {
  const page = Math.max(1, Number(options.page ?? 1));
  const pageSize = Math.min(50, Math.max(5, Number(options.pageSize ?? 10)));
  const status = String(options.status ?? "all");
  const search = String(options.search ?? "").trim().toLowerCase();
  let items = [...inquiryFallbackRecords];

  if (search) {
    items = items.filter((item) =>
      [item.name, item.email, item.phone, item.interest, item.subject, item.message]
        .join(" ")
        .toLowerCase()
        .includes(search),
    );
  }

  if (status !== "all") {
    items = items.filter((item) => item.status === status);
  }

  if (options.unansweredOnly) {
    items = items.filter((item) => unansweredInquiryStatuses.includes(item.status));
  }

  return {
    source: "fallback",
    items: items.slice((page - 1) * pageSize, page * pageSize),
    total: items.length,
    page,
    pageSize,
    counts: {
      all: inquiryFallbackRecords.length,
      unanswered: inquiryFallbackRecords.filter((item) => unansweredInquiryStatuses.includes(item.status)).length,
      new: inquiryFallbackRecords.filter((item) => item.status === "new").length,
      in_progress: inquiryFallbackRecords.filter((item) => item.status === "in_progress").length,
      replied: inquiryFallbackRecords.filter((item) => item.status === "replied").length,
      closed: inquiryFallbackRecords.filter((item) => item.status === "closed").length,
      spam: inquiryFallbackRecords.filter((item) => item.status === "spam").length,
    },
  };
}

function assertDatabase() {
  if (!hasDatabaseConnection()) {
    throw new Error("DATABASE_URL is not connected. Connect bsclinic-db first.");
  }
}
