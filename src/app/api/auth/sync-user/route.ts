import { NextResponse } from "next/server";
import { firebaseConfig } from "@/lib/firebase-config";
import { hasDatabaseConnection } from "@/lib/db";
import { upsertFirebaseUser } from "@/lib/user-repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const AUTH_API_LOG_PREFIX = "[BAKSAL_AUTH_API]";

type FirebaseLookupResponse = {
  users?: {
    localId?: string;
    email?: string;
    displayName?: string;
    photoUrl?: string;
    phoneNumber?: string;
    providerUserInfo?: { providerId?: string }[];
  }[];
  error?: {
    message?: string;
  };
};

export async function POST(request: Request) {
  try {
    logAuthApi("request.received");

    if (!hasDatabaseConnection()) {
      logAuthApi("database.missing");

      return NextResponse.json(
        { error: "DATABASE_URL is not connected." },
        { status: 503 },
      );
    }

    const { idToken } = await request.json().catch(() => ({ idToken: "" }));

    if (typeof idToken !== "string" || !idToken) {
      logAuthApi("request.missingToken");

      return NextResponse.json({ error: "Missing Firebase ID token." }, { status: 401 });
    }

    logAuthApi("firebase.lookup.start", { tokenLength: idToken.length });

    const lookupResponse = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseConfig.apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
        cache: "no-store",
      },
    );

    const lookup = (await lookupResponse.json().catch(() => ({}))) as FirebaseLookupResponse;
    const firebaseUser = lookup.users?.[0];

    logAuthApi("firebase.lookup.done", {
      status: lookupResponse.status,
      ok: lookupResponse.ok,
      uid: maskUid(firebaseUser?.localId ?? ""),
      email: maskEmail(firebaseUser?.email ?? ""),
      error: lookup.error?.message,
    });

    if (!lookupResponse.ok || !firebaseUser?.localId || !firebaseUser.email) {
      return NextResponse.json(
        { error: lookup.error?.message || "Invalid Firebase ID token." },
        { status: 401 },
      );
    }

    logAuthApi("user.upsert.start", {
      uid: maskUid(firebaseUser.localId),
      email: maskEmail(firebaseUser.email),
      provider: firebaseUser.providerUserInfo?.[0]?.providerId || "firebase",
    });

    const user = await upsertFirebaseUser({
      firebaseUid: firebaseUser.localId,
      email: firebaseUser.email,
      name: firebaseUser.displayName,
      phone: firebaseUser.phoneNumber,
      photoUrl: firebaseUser.photoUrl,
      authProvider: firebaseUser.providerUserInfo?.[0]?.providerId || "firebase",
    });

    logAuthApi("user.upsert.done", {
      id: maskUid(user.id),
      email: maskEmail(user.email),
      role: user.role,
      status: user.status,
    });

    return NextResponse.json({ user });
  } catch (error) {
    logAuthApi("request.error", error instanceof Error ? { name: error.name, message: error.message } : { message: String(error) });
    console.error("Failed to sync Firebase user.", error);

    return NextResponse.json(
      { error: "Failed to sync Firebase user." },
      { status: 500 },
    );
  }
}

function logAuthApi(event: string, payload?: unknown) {
  console.info(AUTH_API_LOG_PREFIX, event, payload ?? "");
}

function maskEmail(email: string) {
  if (!email || !email.includes("@")) {
    return email || "(empty)";
  }

  const [name, domain] = email.trim().toLowerCase().split("@");
  const safeName = name.length <= 2 ? `${name[0] ?? ""}*` : `${name.slice(0, 2)}***${name.slice(-1)}`;

  return `${safeName}@${domain}`;
}

function maskUid(uid: string) {
  if (!uid) {
    return "(empty)";
  }

  if (uid.length <= 8) {
    return `${uid.slice(0, 2)}***`;
  }

  return `${uid.slice(0, 4)}...${uid.slice(-4)}`;
}
