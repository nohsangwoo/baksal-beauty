import { NextResponse } from "next/server";
import { firebaseConfig } from "@/lib/firebase-config";
import { hasDatabaseConnection } from "@/lib/db";
import { upsertFirebaseUser } from "@/lib/user-repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
  if (!hasDatabaseConnection()) {
    return NextResponse.json(
      { error: "DATABASE_URL is not connected." },
      { status: 503 },
    );
  }

  const { idToken } = await request.json().catch(() => ({ idToken: "" }));

  if (typeof idToken !== "string" || !idToken) {
    return NextResponse.json({ error: "Missing Firebase ID token." }, { status: 401 });
  }

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

  if (!lookupResponse.ok || !firebaseUser?.localId || !firebaseUser.email) {
    return NextResponse.json(
      { error: lookup.error?.message || "Invalid Firebase ID token." },
      { status: 401 },
    );
  }

  const user = await upsertFirebaseUser({
    firebaseUid: firebaseUser.localId,
    email: firebaseUser.email,
    name: firebaseUser.displayName,
    phone: firebaseUser.phoneNumber,
    photoUrl: firebaseUser.photoUrl,
    authProvider: firebaseUser.providerUserInfo?.[0]?.providerId || "firebase",
  });

  return NextResponse.json({ user });
}
