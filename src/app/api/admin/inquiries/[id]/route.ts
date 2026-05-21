import { NextResponse } from "next/server";
import { requireAdminUserFromRequest } from "@/lib/auth-session";
import { updateInquiry } from "@/lib/inquiry-repository";

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
    await updateInquiry(id, await request.json());
    return NextResponse.json({ id });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "문의 상태 변경에 실패했습니다." },
      { status: 400 },
    );
  }
}
