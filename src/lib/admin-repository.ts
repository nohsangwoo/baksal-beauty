import { desc, eq, sql } from "drizzle-orm";
import { adminUserSeeds, blogPostSeeds, inquirySeeds } from "@/data/admin-seed";
import { adminUsers, blogPosts, inquiries } from "@/db/schema";
import { getDb, hasDatabaseConnection } from "@/lib/db";

export type AdminResource = "users" | "blog" | "inquire";

export type AdminRecord = {
  id: string;
  title: string;
  subtitle: string;
  status: string;
  meta: string;
  imageUrl?: string;
  tags?: string[];
  createdAt?: string;
};

const userFallback: AdminRecord[] = adminUserSeeds.map((user) => ({
  id: user.email,
  title: user.name,
  subtitle: user.email,
  status: user.status,
  meta: user.role,
}));

const blogFallback: AdminRecord[] = blogPostSeeds.map((post) => ({
  id: post.slug,
  title: post.title,
  subtitle: post.excerpt,
  status: post.status,
  meta: post.category,
  imageUrl: post.imageUrl,
  tags: post.tags,
}));

const inquiryFallback: AdminRecord[] = inquirySeeds.map((inquiry) => ({
  id: inquiry.seedKey,
  title: inquiry.name,
  subtitle: inquiry.message,
  status: inquiry.status,
  meta: inquiry.interest,
  tags: [inquiry.preferredChannel],
}));

const fallbackByResource: Record<AdminResource, AdminRecord[]> = {
  users: userFallback,
  blog: blogFallback,
  inquire: inquiryFallback,
};

export function isAdminResource(value: string): value is AdminResource {
  return value === "users" || value === "blog" || value === "inquire";
}

export async function listAdminRecords(resource: AdminResource) {
  if (!hasDatabaseConnection()) {
    return {
      source: "fallback" as const,
      items: fallbackByResource[resource],
    };
  }

  try {
    if (resource === "users") {
      const rows = await getDb()
        .select({
          id: adminUsers.id,
          title: adminUsers.name,
          subtitle: adminUsers.email,
          status: adminUsers.status,
          meta: adminUsers.role,
          createdAt: adminUsers.createdAt,
        })
        .from(adminUsers)
        .orderBy(desc(adminUsers.createdAt));

      return {
        source: "database" as const,
        items: rows.map((row) => ({ ...row, tags: [] })),
      };
    }

    if (resource === "blog") {
      const rows = await getDb()
        .select({
          id: blogPosts.id,
          title: blogPosts.title,
          subtitle: blogPosts.excerpt,
          status: blogPosts.status,
          meta: blogPosts.category,
          imageUrl: blogPosts.imageUrl,
          tags: blogPosts.tags,
          createdAt: blogPosts.createdAt,
        })
        .from(blogPosts)
        .orderBy(desc(blogPosts.createdAt));

      return {
        source: "database" as const,
        items: rows,
      };
    }

    const rows = await getDb()
      .select({
        id: inquiries.id,
        title: inquiries.name,
        subtitle: inquiries.message,
        status: inquiries.status,
        meta: inquiries.interest,
        tags: sql<string[]>`ARRAY[${inquiries.preferredChannel}]::text[]`,
        createdAt: inquiries.createdAt,
      })
      .from(inquiries)
      .orderBy(desc(inquiries.createdAt));

    return {
      source: "database" as const,
      items: rows,
    };
  } catch (error) {
    console.error(`Failed to list ${resource}`, error);
    return {
      source: "fallback" as const,
      items: fallbackByResource[resource],
    };
  }
}

export async function createAdminRecord(resource: AdminResource, body: Record<string, unknown>) {
  assertDatabase();
  const db = getDb();

  if (resource === "users") {
    const [created] = await db
      .insert(adminUsers)
      .values({
        name: String(body.title ?? ""),
        email: String(body.subtitle ?? ""),
        role: String(body.meta ?? "Editor"),
        status: String(body.status ?? "active"),
      })
      .returning({ id: adminUsers.id });

    return created?.id;
  }

  if (resource === "blog") {
    const [created] = await db
      .insert(blogPosts)
      .values({
        title: String(body.title ?? ""),
        slug: String(body.slug ?? slugify(String(body.title ?? "blog-post"))),
        excerpt: String(body.subtitle ?? ""),
        category: String(body.meta ?? "Aesthetic Medicine"),
        status: String(body.status ?? "draft"),
        imageUrl: String(body.imageUrl ?? ""),
        tags: normalizeTags(body.tags),
      })
      .returning({ id: blogPosts.id });

    return created?.id;
  }

  const [created] = await db
    .insert(inquiries)
    .values({
      name: String(body.title ?? ""),
      phone: String(body.phone ?? ""),
      email: String(body.email ?? ""),
      interest: String(body.meta ?? ""),
      preferredChannel: normalizeTags(body.tags)[0] ?? "phone",
      message: String(body.subtitle ?? ""),
      status: String(body.status ?? "new"),
    })
    .returning({ id: inquiries.id });

  return created?.id;
}

export async function updateAdminRecord(
  resource: AdminResource,
  id: string,
  body: Record<string, unknown>,
) {
  assertDatabase();
  const db = getDb();

  if (resource === "users") {
    await db
      .update(adminUsers)
      .set({
        name: String(body.title ?? ""),
        email: String(body.subtitle ?? ""),
        role: String(body.meta ?? "Editor"),
        status: String(body.status ?? "active"),
        updatedAt: sql`now()`,
      })
      .where(eq(adminUsers.id, id));
    return;
  }

  if (resource === "blog") {
    await db
      .update(blogPosts)
      .set({
        title: String(body.title ?? ""),
        excerpt: String(body.subtitle ?? ""),
        category: String(body.meta ?? "Aesthetic Medicine"),
        status: String(body.status ?? "draft"),
        imageUrl: String(body.imageUrl ?? ""),
        tags: normalizeTags(body.tags),
        updatedAt: sql`now()`,
      })
      .where(eq(blogPosts.id, id));
    return;
  }

  await db
    .update(inquiries)
    .set({
      name: String(body.title ?? ""),
      message: String(body.subtitle ?? ""),
      interest: String(body.meta ?? ""),
      status: String(body.status ?? "new"),
      preferredChannel: normalizeTags(body.tags)[0] ?? "phone",
      updatedAt: sql`now()`,
    })
    .where(eq(inquiries.id, id));
}

export async function deleteAdminRecord(resource: AdminResource, id: string) {
  assertDatabase();
  const db = getDb();

  if (resource === "users") {
    await db.delete(adminUsers).where(eq(adminUsers.id, id));
    return;
  }

  if (resource === "blog") {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return;
  }

  await db.delete(inquiries).where(eq(inquiries.id, id));
}

function assertDatabase() {
  if (!hasDatabaseConnection()) {
    throw new Error("DATABASE_URL is not connected. Connect bsclinic-db first.");
  }
}

function normalizeTags(value: unknown) {
  if (Array.isArray(value)) {
    return value.map(String).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
