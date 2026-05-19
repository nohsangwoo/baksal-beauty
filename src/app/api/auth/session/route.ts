import { NextResponse } from "next/server";
import { AUTH_TOKEN_COOKIE } from "@/lib/auth-cookie";
import { getCurrentUserFromToken, verifyFirebaseToken } from "@/lib/auth-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SESSION_MAX_AGE = 55 * 60;

export async function POST(request: Request) {
  const idToken = getBearerToken(request);

  if (!idToken) {
    return NextResponse.json({ error: "Missing Firebase ID token." }, { status: 401 });
  }

  const firebaseUser = await verifyFirebaseToken(idToken);

  if (!firebaseUser?.localId || !firebaseUser.email) {
    return NextResponse.json({ error: "Invalid Firebase ID token." }, { status: 401 });
  }

  const appUser = await getCurrentUserFromToken(idToken);
  const response = NextResponse.json({
    user: appUser
      ? {
          id: appUser.id,
          email: appUser.email,
          role: appUser.role,
          status: appUser.status,
        }
      : {
          firebaseUid: firebaseUser.localId,
          email: firebaseUser.email,
        },
  });

  response.cookies.set(AUTH_TOKEN_COOKIE, idToken, {
    httpOnly: true,
    maxAge: SESSION_MAX_AGE,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });

  response.cookies.set(AUTH_TOKEN_COOKIE, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}

function getBearerToken(request: Request) {
  const authorization = request.headers.get("authorization") ?? "";

  if (!authorization.toLowerCase().startsWith("bearer ")) {
    return null;
  }

  return authorization.slice(7).trim();
}
