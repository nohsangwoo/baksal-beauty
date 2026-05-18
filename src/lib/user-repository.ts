import { eq, or, sql } from "drizzle-orm";
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

  const [existing] = await db
    .select({
      id: users.id,
      name: users.name,
      role: users.role,
      status: users.status,
    })
    .from(users)
    .where(or(eq(users.firebaseUid, profile.firebaseUid), eq(users.email, normalizedEmail)))
    .limit(1);

  const name = profile.name?.trim() || existing?.name || normalizedEmail.split("@")[0] || "BAKSAL User";
  const photoUrl = profile.photoUrl?.trim() ?? "";

  if (existing?.id) {
    const [updated] = await db
      .update(users)
      .set({
        firebaseUid: profile.firebaseUid,
        name,
        email: normalizedEmail,
        phone: profile.phone?.trim() ?? "",
        photoUrl,
        authProvider: profile.authProvider || "firebase",
        lastLoginAt: sql`now()`,
        updatedAt: sql`now()`,
      })
      .where(eq(users.id, existing.id))
      .returning({
        id: users.id,
        email: users.email,
        role: users.role,
        status: users.status,
      });

    return updated;
  }

  const [created] = await db
    .insert(users)
    .values({
      firebaseUid: profile.firebaseUid,
      name,
      email: normalizedEmail,
      phone: profile.phone?.trim() ?? "",
      photoUrl,
      role: "patient",
      status: "active",
      authProvider: profile.authProvider || "firebase",
      lastLoginAt: sql`now()`,
    })
    .returning({
      id: users.id,
      email: users.email,
      role: users.role,
      status: users.status,
    });

  return created;
}
