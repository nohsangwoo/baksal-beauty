import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedContentTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "video/mp4",
  "video/webm",
  "application/pdf",
];

export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const response = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        const payload = safeParsePayload(clientPayload);

        return {
          allowedContentTypes,
          addRandomSuffix: true,
          maximumSizeInBytes: 80 * 1024 * 1024,
          tokenPayload: JSON.stringify({
            scope: payload.scope ?? "admin-upload",
            createdAt: new Date().toISOString(),
          }),
        };
      },
      onUploadCompleted: async ({ blob }) => {
        console.log("Admin blob upload completed", blob.url);
      },
    });

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to prepare upload." },
      { status: 400 },
    );
  }
}

function safeParsePayload(payload: string | null) {
  if (!payload) {
    return {} as { scope?: string };
  }

  try {
    return JSON.parse(payload) as { scope?: string };
  } catch {
    return {} as { scope?: string };
  }
}
