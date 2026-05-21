import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { createInquiry } from "@/lib/inquiry-repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const maxAttachmentCount = 5;
const maxAttachmentSize = 12 * 1024 * 1024;
const maxTotalAttachmentSize = 36 * 1024 * 1024;
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

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    const payload = contentType.includes("multipart/form-data")
      ? await parseMultipartInquiry(request)
      : await request.json();
    const id = await createInquiry(payload);

    return NextResponse.json({ id }, { status: 201 });
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
    attachments: await uploadInquiryAttachments(files),
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

function isAllowedAttachment(file: File) {
  if (allowedAttachmentTypes.has(file.type)) {
    return true;
  }

  const lowerName = file.name.toLowerCase();
  return [...allowedAttachmentExtensions].some((extension) => lowerName.endsWith(extension));
}
