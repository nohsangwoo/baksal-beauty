import { sql } from "drizzle-orm";
import { users } from "@/db/schema";
import { getDb } from "@/lib/db";

export type FirebaseUserProfile = {
  firebaseUid: string;
  email: string;
  name?: string;
  phone?: string;
  photoUrl?: string;
  authProvider?: string;
};

export async function upsertFirebaseUser(profile: FirebaseUserProfile) {
  const db = getDb();
  const normalizedEmail = profile.email.trim().toLowerCase();

  if (!profile.firebaseUid || !normalizedEmail) {
    throw new Error("Firebase user requires uid and email.");
  }

  const name = profile.name?.trim() || normalizedEmail.split("@")[0] || "BAKSAL User";
  const photoUrl = profile.photoUrl?.trim() ?? "";

  const [user] = await db
    .insert(users)
    .values({
      firebaseUid: profile.firebaseUid,
      name,
      email: normalizedEmail,
      phone: profile.phone?.trim() ?? "",
      photoUrl,
      role: "Patient",
      status: "active",
      authProvider: profile.authProvider || "firebase",
      lastLoginAt: sql`now()`,
    })
    .onConflictDoUpdate({
      target: users.email,
      set: {
        firebaseUid: profile.firebaseUid,
        name: sql`COALESCE(NULLIF(EXCLUDED.name, ''), ${users.name})`,
        phone: sql`COALESCE(NULLIF(EXCLUDED.phone, ''), ${users.phone})`,
        photoUrl: sql`COALESCE(NULLIF(EXCLUDED.photo_url, ''), ${users.photoUrl})`,
        authProvider: profile.authProvider || "firebase",
        lastLoginAt: sql`now()`,
        updatedAt: sql`now()`,
      },
    })
    .returning({
      id: users.id,
      email: users.email,
      role: users.role,
      status: users.status,
    });

  return user;
}
