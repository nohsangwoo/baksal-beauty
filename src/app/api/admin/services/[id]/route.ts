import { NextResponse } from "next/server";
import { deleteService, updateService } from "@/lib/service-repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;

  try {
    await updateService(id, await request.json());
    return NextResponse.json({ id });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update service." },
      { status: 400 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  try {
    await deleteService(id);
    return NextResponse.json({ id });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete service." },
      { status: 400 },
    );
  }
}
