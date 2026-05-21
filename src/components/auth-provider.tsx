"use client";

import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getRedirectResult,
  GoogleAuthProvider,
  onIdTokenChanged,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
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
  refreshSession: () => Promise<void>;
  logout: () => Promise<void>;
  redirectError: unknown | null;
  clearRedirectError: () => void;
};

type AuthNotice = {
  message: string;
  tone: "success" | "error" | "info";
};

const AuthContext = createContext<AuthContextValue | null>(null);
const AUTH_LOG_PREFIX = "[BAKSAL_AUTH]";

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
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function pushStateWithAuthDebug(...args) {
      logAuthDebug("history.pushState", { url: String(args[2] ?? ""), currentPath: window.location.pathname });
      return originalPushState.apply(this, args);
    };

    window.history.replaceState = function replaceStateWithAuthDebug(...args) {
      logAuthDebug("history.replaceState", { url: String(args[2] ?? ""), currentPath: window.location.pathname });
      return originalReplaceState.apply(this, args);
    };

    const logPopState = () => {
      logAuthDebug("window.popstate", { href: window.location.href });
    };
    const logPointerClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest("button,a") : null;

      if (!target) {
        return;
      }

      const text = target.textContent?.replace(/\s+/g, " ").trim().slice(0, 80) || "";
      const href = target instanceof HTMLAnchorElement ? target.href : "";
      const shouldLog =
        href.includes("/admin") ||
        text.includes("로그") ||
        text.includes("회원") ||
        text.includes("Google") ||
        target.closest('[role="dialog"]');

      if (shouldLog) {
        logAuthDebug("document.click", {
          tag: target.tagName.toLowerCase(),
          text,
          href,
          path: window.location.pathname,
        });
      }
    };

    window.addEventListener("popstate", logPopState);
    document.addEventListener("click", logPointerClick, true);

    return () => {
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      window.removeEventListener("popstate", logPopState);
      document.removeEventListener("click", logPointerClick, true);
    };
  }, []);

  useEffect(() => {
    const auth = getFirebaseAuth();
    logAuthDebug("AuthProvider.mount", {
      path: window.location.pathname,
      host: window.location.host,
    });

    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      logAuthDebug("onAuthStateChanged", describeFirebaseUser(nextUser));
      setUser(nextUser);
      setLoading(false);

      if (nextUser) {
        logAuthDebug("onAuthStateChanged.sync.start", describeFirebaseUser(nextUser));
        void syncNeonUser(nextUser)
          .then(() => syncAuthSession(nextUser))
          .catch((error) => logAuthDebug("onAuthStateChanged.session.error", describeAuthError(error)));
      }
    });

    logAuthDebug("getRedirectResult.start");
    void getRedirectResult(auth)
      .then(async (result) => {
        logAuthDebug("getRedirectResult.done", {
          hasResult: Boolean(result),
          user: describeFirebaseUser(result?.user ?? null),
        });

        if (result?.user) {
          await syncNeonUser(result.user, { throwOnError: true });
          await syncAuthSession(result.user);
          setAuthNotice({
            message: "Google 로그인과 회원 정보 저장이 완료되었습니다.",
            tone: "success",
          });
        }
      })
      .catch((error: unknown) => {
        logAuthDebug("getRedirectResult.error", describeAuthError(error));
        setRedirectError(error);
        setAuthNotice({
          message: getSyncErrorMessage(error),
          tone: "error",
        });
        setLoading(false);
      });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const auth = getFirebaseAuth();

    return onIdTokenChanged(auth, async (nextUser) => {
      logAuthDebug("onIdTokenChanged", describeFirebaseUser(nextUser));

      if (!nextUser) {
        await clearAuthSession();
        return;
      }

      try {
        await syncAuthSession(nextUser);
        logAuthDebug("authSession.set", describeFirebaseUser(nextUser));
      } catch (error) {
        await clearAuthSession();
        logAuthDebug("authSession.error", describeAuthError(error));
      }
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      async loginWithEmail(email, password) {
        let credential: UserCredential;
        const normalizedEmail = email.trim().toLowerCase();

        logAuthDebug("loginWithEmail.submit", {
          email: maskEmail(normalizedEmail),
          path: window.location.pathname,
        });

        try {
          logAuthDebug("loginWithEmail.firebase.signIn.start", { email: maskEmail(normalizedEmail) });
          credential = await signInWithEmailAndPassword(getFirebaseAuth(), normalizedEmail, password);
          logAuthDebug("loginWithEmail.firebase.signIn.success", describeFirebaseUser(credential.user));
        } catch (error) {
          logAuthDebug("loginWithEmail.firebase.signIn.error", describeAuthError(error));

          if (!isMissingEmailAccountError(error)) {
            throw error;
          }

          try {
            logAuthDebug("loginWithEmail.firebase.autoCreate.start", { email: maskEmail(normalizedEmail) });
            credential = await createUserWithEmailAndPassword(getFirebaseAuth(), normalizedEmail, password);
            logAuthDebug("loginWithEmail.firebase.autoCreate.success", describeFirebaseUser(credential.user));
          } catch (createError) {
            logAuthDebug("loginWithEmail.firebase.autoCreate.error", describeAuthError(createError));

            if (isEmailAlreadyInUseError(createError)) {
              throw error;
            }

            throw createError;
          }

          await syncNeonUserWithNotice(credential.user, setAuthNotice);
          await syncAuthSession(credential.user);
          setAuthNotice({
            message: "가입되지 않은 이메일이라 새 계정을 만들고 회원 정보 저장까지 완료했습니다.",
            tone: "success",
          });
          return;
        }

        await syncNeonUserWithNotice(credential.user, setAuthNotice);
        await syncAuthSession(credential.user);
        setAuthNotice({
          message: "로그인과 회원 정보 저장이 완료되었습니다.",
          tone: "success",
        });
      },
      async registerWithEmail(email, password, displayName) {
        let credential: UserCredential;
        const normalizedEmail = email.trim().toLowerCase();

        logAuthDebug("registerWithEmail.submit", {
          email: maskEmail(normalizedEmail),
          hasDisplayName: Boolean(displayName?.trim()),
          path: window.location.pathname,
        });

        try {
          logAuthDebug("registerWithEmail.firebase.create.start", { email: maskEmail(normalizedEmail) });
          credential = await createUserWithEmailAndPassword(getFirebaseAuth(), normalizedEmail, password);
          logAuthDebug("registerWithEmail.firebase.create.success", describeFirebaseUser(credential.user));
        } catch (error) {
          logAuthDebug("registerWithEmail.firebase.create.error", describeAuthError(error));

          if (!isEmailAlreadyInUseError(error)) {
            throw error;
          }

          logAuthDebug("registerWithEmail.firebase.emailExists.signIn.start", { email: maskEmail(normalizedEmail) });
          credential = await signInWithEmailAndPassword(getFirebaseAuth(), normalizedEmail, password);
          logAuthDebug("registerWithEmail.firebase.emailExists.signIn.success", describeFirebaseUser(credential.user));
          await syncNeonUserWithNotice(credential.user, setAuthNotice);
          await syncAuthSession(credential.user);
          setAuthNotice({
            message: "이미 가입된 이메일이라 기존 계정으로 로그인하고 회원 정보 저장까지 완료했습니다.",
            tone: "success",
          });
          return;
        }

        if (displayName?.trim()) {
          logAuthDebug("registerWithEmail.firebase.updateProfile.start", { email: maskEmail(normalizedEmail) });
          await updateProfile(credential.user, { displayName: displayName.trim() });
          logAuthDebug("registerWithEmail.firebase.updateProfile.success", describeFirebaseUser(credential.user));
          setUser(credential.user);
        }

        await syncNeonUserWithNotice(credential.user, setAuthNotice);
        await syncAuthSession(credential.user);
        setAuthNotice({
          message: "회원가입이 완료되었습니다. Firebase와 Neon DB에 회원 정보가 저장되었습니다.",
          tone: "success",
        });
      },
      async loginWithGoogle() {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });
        logAuthDebug("loginWithGoogle.popup.start", {
          path: window.location.pathname,
          host: window.location.host,
        });
        setAuthNotice({
          message: "Google 로그인 창을 여는 중입니다.",
          tone: "info",
        });

        try {
          const credential = await signInWithPopup(getFirebaseAuth(), provider);
          logAuthDebug("loginWithGoogle.popup.success", describeFirebaseUser(credential.user));
          await syncNeonUserWithNotice(credential.user, setAuthNotice);
          await syncAuthSession(credential.user);
          setAuthNotice({
            message: "Google 로그인과 회원 정보 저장이 완료되었습니다.",
            tone: "success",
          });
        } catch (error) {
          logAuthDebug("loginWithGoogle.popup.error", describeAuthError(error));

          if (!shouldFallbackToRedirect(error)) {
            throw error;
          }

          logAuthDebug("loginWithGoogle.redirect.fallback.start", {
            path: window.location.pathname,
            host: window.location.host,
            reason: describeAuthError(error),
          });
          setAuthNotice({
            message: "팝업이 차단되어 Google 로그인 화면으로 이동합니다.",
            tone: "info",
          });
          await signInWithRedirect(getFirebaseAuth(), provider);
        }
      },
      async refreshSession() {
        const currentUser = getFirebaseAuth().currentUser ?? user;

        if (!currentUser) {
          throw new Error("No signed-in Firebase user.");
        }

        logAuthDebug("refreshSession.start", describeFirebaseUser(currentUser));
        await syncNeonUser(currentUser, { throwOnError: true });
        await syncAuthSession(currentUser, { forceRefresh: true });
        logAuthDebug("refreshSession.done", describeFirebaseUser(currentUser));
      },
      async logout() {
        await clearAuthSession();
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
    logAuthDebug("syncNeonUser.idToken.start", describeFirebaseUser(user));
    const idToken = await user.getIdToken();
    logAuthDebug("syncNeonUser.fetch.start", describeFirebaseUser(user));
    const response = await fetch("/api/auth/sync-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });
    const body = await response.json().catch(() => ({}));

    logAuthDebug("syncNeonUser.fetch.done", {
      status: response.status,
      ok: response.ok,
      response: summarizeSyncResponse(body),
    });

    if (!response.ok) {
      throw new Error(getApiErrorMessage(body));
    }
  } catch (error) {
    logAuthDebug("syncNeonUser.error", describeAuthError(error));
    console.error("Failed to sync Firebase user to Neon.", error);

    if (options.throwOnError) {
      throw error;
    }
  }
}

function logAuthDebug(event: string, payload?: unknown) {
  if (typeof window === "undefined") {
    return;
  }

  console.info(AUTH_LOG_PREFIX, event, payload ?? "");
  sendAuthDebugLog(event, payload);
}

function sendAuthDebugLog(event: string, payload?: unknown) {
  const body = JSON.stringify({
    event,
    payload,
    href: window.location.href,
    path: window.location.pathname,
    timestamp: new Date().toISOString(),
  });

  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/auth/debug-log", new Blob([body], { type: "application/json" }));
    return;
  }

  void fetch("/api/auth/debug-log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
}

async function syncAuthSession(user: User, options: { forceRefresh?: boolean } = {}) {
  const idToken = await user.getIdToken(options.forceRefresh ?? false);
  const response = await fetch("/api/auth/session", {
    method: "POST",
    headers: { Authorization: `Bearer ${idToken}` },
  });
  const body = await response.json().catch(() => ({}));

  logAuthDebug("syncAuthSession.done", {
    status: response.status,
    ok: response.ok,
    response: summarizeSyncResponse(body),
  });

  if (!response.ok) {
    throw new Error(getApiErrorMessage(body));
  }
}

async function clearAuthSession() {
  await fetch("/api/auth/session", {
    method: "DELETE",
  }).catch((error) => {
    logAuthDebug("clearAuthSession.error", describeAuthError(error));
  });
}

function describeFirebaseUser(user: User | null) {
  if (!user) {
    return { signedIn: false };
  }

  return {
    signedIn: true,
    uid: maskUid(user.uid),
    email: maskEmail(user.email ?? ""),
    providerId: user.providerData[0]?.providerId ?? "unknown",
    emailVerified: user.emailVerified,
  };
}

function describeAuthError(error: unknown) {
  if (error instanceof FirebaseError) {
    return {
      code: error.code,
      message: error.message,
    };
  }

  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
    };
  }

  return {
    message: String(error),
  };
}

function summarizeSyncResponse(body: unknown) {
  if (!body || typeof body !== "object") {
    return body;
  }

  if ("user" in body && body.user && typeof body.user === "object") {
    const user = body.user as { email?: string; role?: string; status?: string; id?: string };

    return {
      user: {
        id: user.id ? maskUid(user.id) : undefined,
        email: maskEmail(user.email ?? ""),
        role: user.role,
        status: user.status,
      },
    };
  }

  if ("error" in body) {
    return body;
  }

  return body;
}

function maskEmail(email: string) {
  if (!email || !email.includes("@")) {
    return email || "(empty)";
  }

  const [name, domain] = email.split("@");
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

function isMissingEmailAccountError(error: unknown) {
  return (
    error instanceof FirebaseError &&
    (error.code === "auth/user-not-found" || error.code === "auth/invalid-credential")
  );
}

function isEmailAlreadyInUseError(error: unknown) {
  return error instanceof FirebaseError && error.code === "auth/email-already-in-use";
}

function shouldFallbackToRedirect(error: unknown) {
  return (
    error instanceof FirebaseError &&
    (error.code === "auth/popup-blocked" || error.code === "auth/cancelled-popup-request")
  );
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
