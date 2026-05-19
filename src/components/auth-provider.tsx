"use client";

import { FirebaseError } from "firebase/app";
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
  type UserCredential,
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

type AuthNotice = {
  message: string;
  tone: "success" | "error" | "info";
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [redirectError, setRedirectError] = useState<unknown | null>(null);
  const [authNotice, setAuthNotice] = useState<AuthNotice | null>(null);

  useEffect(() => {
    const extensionNoise =
      "A listener indicated an asynchronous response by returning true, but the message channel closed before a response was received";

    const ignoreKnownExtensionNoise = (event: PromiseRejectionEvent) => {
      const message = event.reason instanceof Error ? event.reason.message : String(event.reason ?? "");

      if (message.includes(extensionNoise)) {
        event.preventDefault();
      }
    };

    window.addEventListener("unhandledrejection", ignoreKnownExtensionNoise);

    return () => {
      window.removeEventListener("unhandledrejection", ignoreKnownExtensionNoise);
    };
  }, []);

  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);

      if (nextUser) {
        void syncNeonUser(nextUser);
      }
    });

    void getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          await syncNeonUser(result.user, { throwOnError: true });
          setAuthNotice({
            message: "Google 로그인과 회원 정보 저장이 완료되었습니다.",
            tone: "success",
          });
        }
      })
      .catch((error: unknown) => {
        setRedirectError(error);
        setAuthNotice({
          message: getSyncErrorMessage(error),
          tone: "error",
        });
        setLoading(false);
      });

    return unsubscribe;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      async loginWithEmail(email, password) {
        let credential: UserCredential;

        try {
          credential = await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
        } catch (error) {
          if (!isMissingEmailAccountError(error)) {
            throw error;
          }

          try {
            credential = await createUserWithEmailAndPassword(getFirebaseAuth(), email, password);
          } catch (createError) {
            if (isEmailAlreadyInUseError(createError)) {
              throw error;
            }

            throw createError;
          }

          await syncNeonUserWithNotice(credential.user, setAuthNotice);
          setAuthNotice({
            message: "가입되지 않은 이메일이라 새 계정을 만들고 회원 정보 저장까지 완료했습니다.",
            tone: "success",
          });
          return;
        }

        await syncNeonUserWithNotice(credential.user, setAuthNotice);
        setAuthNotice({
          message: "로그인과 회원 정보 저장이 완료되었습니다.",
          tone: "success",
        });
      },
      async registerWithEmail(email, password, displayName) {
        const credential = await createUserWithEmailAndPassword(getFirebaseAuth(), email, password);

        if (displayName?.trim()) {
          await updateProfile(credential.user, { displayName: displayName.trim() });
          setUser(credential.user);
        }

        await syncNeonUserWithNotice(credential.user, setAuthNotice);
        setAuthNotice({
          message: "회원가입이 완료되었습니다. Firebase와 Neon DB에 회원 정보가 저장되었습니다.",
          tone: "success",
        });
      },
      async loginWithGoogle() {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });
        setAuthNotice({
          message: "Google 로그인 화면으로 이동합니다.",
          tone: "info",
        });
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

  return (
    <AuthContext.Provider value={value}>
      {children}
      {authNotice ? (
        <div
          className={`fixed bottom-6 left-4 z-[120] flex max-w-sm items-start gap-3 rounded-lg border px-4 py-3 text-sm shadow-[0_20px_80px_rgba(0,0,0,0.38)] backdrop-blur md:left-6 ${
            authNotice.tone === "error"
              ? "border-[#d62f55]/45 bg-[#2a0b13]/95 text-[#ffb8c4]"
              : authNotice.tone === "success"
                ? "border-[#dec47b]/35 bg-[#12100d]/95 text-[#fff8ef]"
                : "border-white/12 bg-[#0d0b0c]/95 text-[#d9d0c9]"
          }`}
          role={authNotice.tone === "error" ? "alert" : "status"}
        >
          <span className="leading-6">{authNotice.message}</span>
          <button
            aria-label="알림 닫기"
            className="ml-auto text-lg leading-none text-white/54 transition hover:text-white"
            onClick={() => setAuthNotice(null)}
            type="button"
          >
            ×
          </button>
        </div>
      ) : null}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}

async function syncNeonUser(user: User, options: { throwOnError?: boolean } = {}) {
  try {
    const idToken = await user.getIdToken();
    const response = await fetch("/api/auth/sync-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(getApiErrorMessage(body));
    }
  } catch (error) {
    console.error("Failed to sync Firebase user to Neon.", error);

    if (options.throwOnError) {
      throw error;
    }
  }
}

function isMissingEmailAccountError(error: unknown) {
  return (
    error instanceof FirebaseError &&
    (error.code === "auth/user-not-found" || error.code === "auth/invalid-credential")
  );
}

function isEmailAlreadyInUseError(error: unknown) {
  return error instanceof FirebaseError && error.code === "auth/email-already-in-use";
}

function getApiErrorMessage(body: unknown) {
  if (body && typeof body === "object" && "error" in body && typeof body.error === "string") {
    return body.error;
  }

  return "Failed to sync Firebase user.";
}

function getSyncErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "로그인 처리 중 문제가 발생했습니다.";
}

async function syncNeonUserWithNotice(
  user: User,
  setAuthNotice: (notice: AuthNotice) => void,
) {
  try {
    await syncNeonUser(user, { throwOnError: true });
  } catch (error) {
    setAuthNotice({
      message: `Firebase 인증은 완료됐지만 Neon DB 저장에 실패했습니다. ${getSyncErrorMessage(error)}`,
      tone: "error",
    });
    throw error;
  }
}
