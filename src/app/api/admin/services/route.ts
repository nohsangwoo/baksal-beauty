import { NextResponse } from "next/server";
import { isLocale } from "@/i18n/config";
import { createService, getAdminServices } from "@/lib/service-repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const localeParam = searchParams.get("locale") ?? "ko";
  const locale = isLocale(localeParam) ? localeParam : "ko";
  const result = await getAdminServices(locale);

  return NextResponse.json(result);
}

export async function POST(request: Request) {
  try {
    const id = await createService(await request.json());
    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create service." },
      { status: 400 },
    );
  }
}
