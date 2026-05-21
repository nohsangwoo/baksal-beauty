import { NextResponse } from "next/server";
import { requireAdminUserFromRequest } from "@/lib/auth-session";
import { listInquiries } from "@/lib/inquiry-repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await requireAdminUserFromRequest(request);

  if (auth.response) {
    return auth.response;
  }

  const url = new URL(request.url);

  return NextResponse.json(
    await listInquiries({
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 10),
      search: url.searchParams.get("search") ?? "",
      status: url.searchParams.get("status") ?? "all",
      unansweredOnly: url.searchParams.get("unansweredOnly") === "true",
    }),
  );
}
