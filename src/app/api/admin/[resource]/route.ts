import { NextResponse } from "next/server";
import {
  createAdminRecord,
  isAdminResource,
  listAdminRecords,
} from "@/lib/admin-repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ resource: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { resource } = await context.params;

  if (!isAdminResource(resource)) {
    return NextResponse.json({ error: "Unknown admin resource." }, { status: 404 });
  }

  return NextResponse.json(await listAdminRecords(resource));
}

export async function POST(request: Request, context: RouteContext) {
  const { resource } = await context.params;

  if (!isAdminResource(resource)) {
    return NextResponse.json({ error: "Unknown admin resource." }, { status: 404 });
  }

  try {
    const id = await createAdminRecord(resource, await request.json());
    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create record." },
      { status: 400 },
    );
  }
}
