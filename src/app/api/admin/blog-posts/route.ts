import { NextResponse } from "next/server";
import { isLocale } from "@/i18n/config";
import {
  createBlogPost,
  listAdminBlogPosts,
} from "@/lib/blog-repository";
import { requireAdminUserFromRequest } from "@/lib/auth-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await requireAdminUserFromRequest(request);

  if (auth.response) {
    return auth.response;
  }

  const url = new URL(request.url);
  const locale = url.searchParams.get("locale") ?? "ko";

  if (!isLocale(locale)) {
    return NextResponse.json({ error: "Invalid locale." }, { status: 400 });
  }

  return NextResponse.json(await listAdminBlogPosts(locale));
}

export async function POST(request: Request) {
  const auth = await requireAdminUserFromRequest(request);

  if (auth.response) {
    return auth.response;
  }

  try {
    const id = await createBlogPost(await request.json());
    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create blog post." },
      { status: 400 },
    );
  }
}
