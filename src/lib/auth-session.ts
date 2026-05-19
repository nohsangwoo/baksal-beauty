import { cookies } from "next/headers";
import { and, eq, or, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { users } from "@/db/schema";
import { AUTH_TOKEN_COOKIE } from "@/lib/auth-cookie";
import { getDb, hasDatabaseConnection } from "@/lib/db";
import { firebaseConfig } from "@/lib/firebase-config";
import { canAccessAdmin, canManageUsers } from "@/lib/rbac";

export type CurrentAppUser = {
  id: string;
  firebaseUid: string | null;
  name: string;
  email: string;
  phone: string;
  photoUrl: string;
  role: string;
  status: string;
  authProvider: string;
};

type FirebaseLookupResponse = {
  users?: {
    localId?: string;
    email?: string;
  }[];
  error?: {
    message?: string;
  };
};

type RequireAdminOptions = {
  ownerOnly?: boolean;
};

export async function getCurrentUserFromCookies() {
  const cookieStore = await cookies();
  const idToken = cookieStore.get(AUTH_TOKEN_COOKIE)?.value;

  return getCurrentUserFromToken(idToken);
}

export async function getCurrentUserFromRequest(request: Request) {
  return getCurrentUserFromToken(getTokenFromRequest(request));
}

export async function verifyFirebaseToken(idToken: string) {
  return lookupFirebaseUser(idToken);
}

export async function requireAdminUserFromRequest(
  request: Request,
  options: RequireAdminOptions = {},
) {
  const user = await getCurrentUserFromRequest(request);

  if (!user) {
    return {
      response: NextResponse.json({ error: "Authentication required." }, { status: 401 }),
      user: null,
    };
  }

  if (!canAccessAdmin(user)) {
    return {
      response: NextResponse.json({ error: "Admin permission required." }, { status: 403 }),
      user: null,
    };
  }

  if (options.ownerOnly && !canManageUsers(user)) {
    return {
      response: NextResponse.json({ error: "Owner permission required." }, { status: 403 }),
      user: null,
    };
  }

  return {
    response: null,
    user,
  };
}

export async function getCurrentUserFromToken(idToken?: string | null) {
  if (!idToken || !hasDatabaseConnection()) {
    return null;
  }

  const firebaseUser = await lookupFirebaseUser(idToken);

  if (!firebaseUser?.localId || !firebaseUser.email) {
    return null;
  }

  const rows = await getDb()
    .select({
      id: users.id,
      firebaseUid: users.firebaseUid,
      name: users.name,
      email: users.email,
      phone: users.phone,
      photoUrl: users.photoUrl,
      role: users.role,
      status: users.status,
      authProvider: users.authProvider,
    })
    .from(users)
    .where(
      or(
        eq(users.firebaseUid, firebaseUser.localId),
        eq(users.email, firebaseUser.email.trim().toLowerCase()),
      ),
    )
    .limit(1);

  return rows[0] ?? null;
}

async function lookupFirebaseUser(idToken: string) {
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseConfig.apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
      cache: "no-store",
    },
  );
  const lookup = (await response.json().catch(() => ({}))) as FirebaseLookupResponse;

  if (!response.ok) {
    return null;
  }

  return lookup.users?.[0] ?? null;
}

function getTokenFromRequest(request: Request) {
  const authorization = request.headers.get("authorization") ?? "";

  if (authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.slice(7).trim();
  }

  return getCookieValue(request.headers.get("cookie") ?? "", AUTH_TOKEN_COOKIE);
}

function getCookieValue(cookieHeader: string, name: string) {
  const rawValue = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .map((part) => {
      const separatorIndex = part.indexOf("=");

      return separatorIndex === -1
        ? [part, ""]
        : [part.slice(0, separatorIndex), part.slice(separatorIndex + 1)];
    })
    .find(([key]) => key === name)?.[1];

  return rawValue ? decodeURIComponent(rawValue) : undefined;
}

export async function countOtherActiveOwners(userId: string) {
  const [row] = await getDb()
    .select({ count: sql<number>`count(*)::int` })
    .from(users)
    .where(and(eq(users.role, "Owner"), eq(users.status, "active"), sql`${users.id} <> ${userId}`));

  return Number(row?.count ?? 0);
}
