import { NextResponse } from "next/server";
import { createInquiry } from "@/lib/inquiry-repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const id = await createInquiry(await request.json());
    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "문의 접수에 실패했습니다." },
      { status: 400 },
    );
  }
}
