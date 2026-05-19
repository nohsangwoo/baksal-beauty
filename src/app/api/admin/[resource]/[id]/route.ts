import { NextResponse } from "next/server";
import {
  deleteAdminRecord,
  isAdminResource,
  updateAdminRecord,
} from "@/lib/admin-repository";
import { requireAdminUserFromRequest } from "@/lib/auth-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ resource: string; id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const { resource, id } = await context.params;

  if (!isAdminResource(resource)) {
    return NextResponse.json({ error: "Unknown admin resource." }, { status: 404 });
  }

  const auth = await requireAdminUserFromRequest(request, { ownerOnly: resource === "users" });

  if (auth.response) {
    return auth.response;
  }

  try {
    await updateAdminRecord(resource, id, await request.json());
    return NextResponse.json({ id });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update record." },
      { status: 400 },
    );
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const { resource, id } = await context.params;

  if (!isAdminResource(resource)) {
    return NextResponse.json({ error: "Unknown admin resource." }, { status: 404 });
  }

  const auth = await requireAdminUserFromRequest(request, { ownerOnly: resource === "users" });

  if (auth.response) {
    return auth.response;
  }

  try {
    await deleteAdminRecord(resource, id);
    return NextResponse.json({ id });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete record." },
      { status: 400 },
    );
  }
}
