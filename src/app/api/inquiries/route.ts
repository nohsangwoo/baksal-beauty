import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { createInquiry } from "@/lib/inquiry-repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const maxAttachmentCount = 5;
const maxAttachmentSize = 12 * 1024 * 1024;
const maxTotalAttachmentSize = 36 * 1024 * 1024;
const maxRequestSize = 42 * 1024 * 1024;
const allowedAttachmentTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "application/pdf",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]);
const allowedAttachmentExtensions = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".avif",
  ".pdf",
  ".txt",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
]);
const turnstileVerifyUrl = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

type ParsedInquiryPayload = Record<string, unknown> & {
  attachmentFiles?: File[];
  turnstileToken?: string;
};

export async function POST(request: Request) {
  try {
    const contentLength = Number(request.headers.get("content-length") ?? 0);

    if (contentLength > maxRequestSize) {
      throw new Error("요청 용량이 너무 큽니다. 첨부파일을 줄여 다시 시도해주세요.");
    }

    const contentType = request.headers.get("content-type") ?? "";
    const payload: ParsedInquiryPayload = contentType.includes("multipart/form-data")
      ? await parseMultipartInquiry(request)
      : await request.json();
    const attachmentFiles = Array.isArray(payload.attachmentFiles) ? payload.attachmentFiles : [];
    const turnstileToken = getTurnstileToken(payload);

    await verifyTurnstileToken(turnstileToken, request);

    const attachments = attachmentFiles.length ? await uploadInquiryAttachments(attachmentFiles) : [];
    delete payload.attachmentFiles;
    delete payload.turnstileToken;
    delete payload["cf-turnstile-response"];

    const id = await createInquiry({ ...payload, attachments });

    return NextResponse.json(
      { id },
      {
        status: 201,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "문의 접수에 실패했습니다." },
      { status: 400 },
    );
  }
}

async function parseMultipartInquiry(request: Request) {
  const formData = await request.formData();
  const files = formData
    .getAll("attachments")
    .filter((value): value is File => value instanceof File && value.size > 0);

  return {
    name: readFormValue(formData, "name"),
    phone: readFormValue(formData, "phone"),
    email: readFormValue(formData, "email"),
    interest: readFormValue(formData, "interest"),
    preferredChannel: readFormValue(formData, "preferredChannel"),
    subject: readFormValue(formData, "subject"),
    message: readFormValue(formData, "message"),
    locale: readFormValue(formData, "locale"),
    privacyAccepted: readFormValue(formData, "privacyAccepted") === "true",
    sourcePath: readFormValue(formData, "sourcePath"),
    turnstileToken: readFormValue(formData, "cf-turnstile-response") || readFormValue(formData, "turnstileToken"),
    attachmentFiles: files,
  };
}

function readFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

async function uploadInquiryAttachments(files: File[]) {
  if (!files.length) {
    return [];
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("첨부파일 저장소가 연결되지 않았습니다. Vercel Blob 설정을 확인해주세요.");
  }

  if (files.length > maxAttachmentCount) {
    throw new Error(`첨부파일은 최대 ${maxAttachmentCount}개까지 업로드할 수 있습니다.`);
  }

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  if (totalSize > maxTotalAttachmentSize) {
    throw new Error("첨부파일 전체 용량이 너무 큽니다.");
  }

  for (const file of files) {
    if (file.size > maxAttachmentSize) {
      throw new Error(`${file.name} 파일 용량이 너무 큽니다. 파일당 최대 12MB까지 가능합니다.`);
    }

    if (!isAllowedAttachment(file)) {
      throw new Error(`${file.name} 파일 형식은 업로드할 수 없습니다.`);
    }
  }

  return Promise.all(
    files.map(async (file) => {
      const safeName = file.name.replace(/[^\w.-]+/g, "-") || "attachment";
      const blob = await put(`inquiries/${Date.now()}-${safeName}`, file, {
        access: "public",
        addRandomSuffix: true,
      });

      return {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        url: blob.url,
        pathname: blob.pathname,
      };
    }),
  );
}

async function verifyTurnstileToken(token: string, request: Request) {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    throw new Error("보안 검증 설정이 누락되었습니다. TURNSTILE_SECRET_KEY를 확인해주세요.");
  }

  if (!token) {
    throw new Error("보안 확인을 완료해주세요.");
  }

  const body = new FormData();
  body.append("secret", secret);
  body.append("response", token);

  const remoteIp = getClientIp(request);

  if (remoteIp) {
    body.append("remoteip", remoteIp);
  }

  body.append("idempotency_key", crypto.randomUUID());

  const response = await fetch(turnstileVerifyUrl, {
    method: "POST",
    body,
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    throw new Error("보안 검증 서버와 통신하지 못했습니다. 잠시 후 다시 시도해주세요.");
  }

  const result = (await response.json()) as {
    success?: boolean;
    action?: string;
    "error-codes"?: string[];
  };

  if (!result.success || result.action !== "inquiry") {
    console.warn("Turnstile verification failed", {
      action: result.action,
      errorCodes: result["error-codes"],
    });
    throw new Error("보안 검증에 실패했습니다. 새로고침 후 다시 시도해주세요.");
  }
}

function getTurnstileToken(payload: ParsedInquiryPayload) {
  return String(payload.turnstileToken ?? payload["cf-turnstile-response"] ?? "").trim();
}

function getClientIp(request: Request) {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    ""
  );
}

function isAllowedAttachment(file: File) {
  if (allowedAttachmentTypes.has(file.type)) {
    return true;
  }

  const lowerName = file.name.toLowerCase();
  return [...allowedAttachmentExtensions].some((extension) => lowerName.endsWith(extension));
}
