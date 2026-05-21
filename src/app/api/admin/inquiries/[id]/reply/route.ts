import { NextResponse } from "next/server";
import { requireAdminUserFromRequest } from "@/lib/auth-session";
import { replyToInquiry } from "@/lib/inquiry-repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const auth = await requireAdminUserFromRequest(request);

  if (auth.response) {
    return auth.response;
  }

  if (!auth.user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const result = await replyToInquiry(id, await request.json(), auth.user);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "답변 메일 발송에 실패했습니다." },
      { status: 400 },
    );
  }
}
