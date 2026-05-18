"use client";

import {
  createUserWithEmailAndPassword,
  getRedirectResult,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithRedirect,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getFirebaseAuth } from "@/lib/firebase-client";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string, displayName?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  redirectError: unknown | null;
  clearRedirectError: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [redirectError, setRedirectError] = useState<unknown | null>(null);

  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);

      if (nextUser) {
        void syncNeonUser(nextUser);
      }
    });

    void getRedirectResult(auth).catch((error: unknown) => {
      setRedirectError(error);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      async loginWithEmail(email, password) {
        await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
      },
      async registerWithEmail(email, password, displayName) {
        const credential = await createUserWithEmailAndPassword(getFirebaseAuth(), email, password);

        if (displayName?.trim()) {
          await updateProfile(credential.user, { displayName: displayName.trim() });
          setUser(credential.user);
        }

        await syncNeonUser(credential.user);
      },
      async loginWithGoogle() {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });
        await signInWithRedirect(getFirebaseAuth(), provider);
      },
      async logout() {
        await signOut(getFirebaseAuth());
      },
      redirectError,
      clearRedirectError() {
        setRedirectError(null);
      },
    }),
    [loading, redirectError, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}

async function syncNeonUser(user: User) {
  try {
    const idToken = await user.getIdToken();
    const response = await fetch("/api/auth/sync-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.error || "Failed to sync Firebase user.");
    }
  } catch (error) {
    console.error("Failed to sync Firebase user to Neon.", error);
  }
}
