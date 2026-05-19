import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const AUTH_CLIENT_LOG_PREFIX = "[BAKSAL_AUTH_CLIENT]";

type AuthDebugPayload = {
  event?: string;
  payload?: unknown;
  href?: string;
  path?: string;
  timestamp?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as AuthDebugPayload;

  console.info(AUTH_CLIENT_LOG_PREFIX, body.event ?? "unknown", {
    href: sanitizeUrl(body.href),
    path: body.path,
    timestamp: body.timestamp,
    payload: sanitizePayload(body.payload),
  });

  return NextResponse.json({ ok: true });
}

function sanitizePayload(payload: unknown): unknown {
  if (!payload || typeof payload !== "object") {
    return payload;
  }

  if (Array.isArray(payload)) {
    return payload.map(sanitizePayload);
  }

  return Object.fromEntries(
    Object.entries(payload as Record<string, unknown>).map(([key, value]) => {
      if (key.toLowerCase().includes("password") || key.toLowerCase().includes("token")) {
        return [key, "[redacted]"];
      }

      if (typeof value === "string" && value.includes("@")) {
        return [key, maskEmail(value)];
      }

      return [key, sanitizePayload(value)];
    }),
  );
}

function sanitizeUrl(url?: string) {
  if (!url) {
    return "";
  }

  try {
    const parsed = new URL(url);
    parsed.searchParams.forEach((_, key) => {
      if (key.toLowerCase().includes("token") || key.toLowerCase().includes("key")) {
        parsed.searchParams.set(key, "[redacted]");
      }
    });

    return parsed.toString();
  } catch {
    return url;
  }
}

function maskEmail(email: string) {
  const normalized = email.trim().toLowerCase();

  if (!normalized.includes("@")) {
    return normalized;
  }

  const [name, domain] = normalized.split("@");
  const safeName = name.length <= 2 ? `${name[0] ?? ""}*` : `${name.slice(0, 2)}***${name.slice(-1)}`;

  return `${safeName}@${domain}`;
}
