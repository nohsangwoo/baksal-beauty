import { NextResponse } from "next/server";
import { isLocale } from "@/i18n/config";
import { listServices, normalizeServiceCategory } from "@/lib/service-repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const localeParam = searchParams.get("locale") ?? "ko";
  const locale = isLocale(localeParam) ? localeParam : "ko";
  const category = normalizeServiceCategory(searchParams.get("category"));
  const result = await listServices(locale, category);

  return NextResponse.json(result);
}
