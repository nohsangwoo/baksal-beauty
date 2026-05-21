import { NextResponse } from "next/server";
import {
  deleteBlogPost,
  updateBlogPost,
} from "@/lib/blog-repository";
import { requireAdminUserFromRequest } from "@/lib/auth-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireAdminUserFromRequest(request);

  if (auth.response) {
    return auth.response;
  }

  const { id } = await context.params;

  try {
    await updateBlogPost(id, await request.json());
    return NextResponse.json({ id });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update blog post." },
      { status: 400 },
    );
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const auth = await requireAdminUserFromRequest(request);

  if (auth.response) {
    return auth.response;
  }

  const { id } = await context.params;

  try {
    await deleteBlogPost(id);
    return NextResponse.json({ id });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete blog post." },
      { status: 400 },
    );
  }
}
