"use client";

import { FirebaseError } from "firebase/app";
import { ChevronDown, Loader2, LogIn, LogOut, Mail, ShieldCheck, UserRound, X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "@/components/auth-provider";
import type { Locale } from "@/i18n/config";

type AuthMode = "login" | "register";
const AUTH_LOG_PREFIX = "[BAKSAL_AUTH]";

type AuthCopy = {
  login: string;
  register: string;
  account: string;
  email: string;
  password: string;
  name: string;
  google: string;
  submitLogin: string;
  submitRegister: string;
  profile: string;
  appointments: string;
  logout: string;
  loading: string;
  helper: string;
};

const copyByLocale: Record<Locale, AuthCopy> = {
  ko: {
    login: "로그인",
    register: "회원가입",
    account: "계정",
    email: "이메일",
    password: "비밀번호",
    name: "이름",
    google: "Google로 계속하기",
    submitLogin: "로그인",
    submitRegister: "가입하기",
    profile: "프로필",
    appointments: "상담 내역",
    logout: "로그아웃",
    loading: "확인 중",
    helper: "회원 기능은 상담 신청과 시술 기록 확장을 위한 기반입니다.",
  },
  en: {
    login: "Login",
    register: "Sign up",
    account: "Account",
    email: "Email",
    password: "Password",
    name: "Name",
    google: "Continue with Google",
    submitLogin: "Login",
    submitRegister: "Create Account",
    profile: "Profile",
    appointments: "Consultations",
    logout: "Logout",
    loading: "Checking",
    helper: "Your account will support consultations and future care records.",
  },
  zh: {
    login: "登录",
    register: "注册",
    account: "账户",
    email: "邮箱",
    password: "密码",
    name: "姓名",
    google: "使用 Google 继续",
    submitLogin: "登录",
    submitRegister: "注册",
    profile: "个人资料",
    appointments: "咨询记录",
    logout: "退出登录",
    loading: "确认中",
    helper: "账户功能将用于咨询申请与后续护理记录扩展。",
  },
  ja: {
    login: "ログイン",
    register: "会員登録",
    account: "アカウント",
    email: "メール",
    password: "パスワード",
    name: "名前",
    google: "Googleで続ける",
    submitLogin: "ログイン",
    submitRegister: "登録する",
    profile: "プロフィール",
    appointments: "相談履歴",
    logout: "ログアウト",
    loading: "確認中",
    helper: "アカウント機能は相談申請と今後のケア記録の基盤になります。",
  },
};

export function AuthMenu({ locale }: { locale: Locale }) {
  const copy = copyByLocale[locale];
  const { user, loading, logout, redirectError, clearRedirectError } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeOnPointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setModalOpen(false);
      }
    };

    window.addEventListener("pointerdown", closeOnPointerDown);
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      window.removeEventListener("pointerdown", closeOnPointerDown);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const dialogOpen = modalOpen || Boolean(redirectError);


  if (loading) {
    return (
      <button className="button-outline h-10 px-3 text-[0.68rem]" disabled type="button">
        <Loader2 className="animate-spin" size={14} />
        <span className="hidden sm:inline">{copy.loading}</span>
      </button>
    );
  }

  if (!user) {
    return (
      <>
        <button
          className="button-outline h-10 px-3 text-[0.68rem]"
          onClick={() => {
            logAuthUi("header.loginButton.click", { locale, path: window.location.pathname });
            setModalOpen(true);
          }}
          type="button"
        >
          <LogIn size={15} />
          <span className="hidden sm:inline">{copy.login}</span>
        </button>
        {dialogOpen ? (
          <AuthDialog
            copy={copy}
            externalError={redirectError}
            onClearExternalError={clearRedirectError}
            onClose={() => {
              logAuthUi("dialog.close", { locale, path: window.location.pathname });
              clearRedirectError();
              setModalOpen(false);
            }}
          />
        ) : null}
      </>
    );
  }

  const displayName = user.displayName || user.email || copy.account;
  const initial = displayName.trim().charAt(0).toUpperCase() || "B";

  return (
    <div className="relative" ref={menuRef}>
      <button
        aria-expanded={menuOpen}
        aria-haspopup="menu"
        className="inline-flex h-10 items-center gap-2 rounded-full border border-white/10 bg-black/22 px-2.5 text-xs font-black text-white/84 backdrop-blur transition hover:border-[#dec47b]/60 hover:text-[#dec47b]"
        onClick={() => setMenuOpen((isOpen) => !isOpen)}
        type="button"
      >
        <span
          className="grid h-7 w-7 place-items-center rounded-full bg-[#d62f55] text-[0.72rem] text-white"
          style={user.photoURL ? { backgroundImage: `url(${user.photoURL})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
        >
          {user.photoURL ? null : initial}
        </span>
        <span className="hidden max-w-28 truncate sm:inline">{displayName}</span>
        <ChevronDown size={13} className={`transition ${menuOpen ? "rotate-180" : ""}`} />
      </button>

      <div
        className={`absolute right-0 top-full mt-3 w-64 rounded-lg border border-white/10 bg-[#0d0b0c]/96 p-2 text-sm shadow-[0_24px_80px_rgba(0,0,0,0.42)] backdrop-blur-xl transition duration-200 ${
          menuOpen ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
        }`}
        role="menu"
      >
        <div className="border-b border-white/10 px-3 py-3">
          <p className="truncate text-sm font-black text-white">{displayName}</p>
          <p className="mt-1 truncate text-xs text-white/52">{user.email}</p>
        </div>
        <button className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-white/72 transition hover:bg-white/8 hover:text-[#dec47b]" type="button">
          <UserRound size={15} />
          {copy.profile}
        </button>
        <button className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-white/72 transition hover:bg-white/8 hover:text-[#dec47b]" type="button">
          <ShieldCheck size={15} />
          {copy.appointments}
        </button>
        <button
          className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-[#ff8ba0] transition hover:bg-[#d62f55]/10 hover:text-white"
        onClick={async () => {
            logAuthUi("profileMenu.logout.click", { email: maskEmail(user.email ?? "") });
            setMenuOpen(false);
            await logout();
          }}
          type="button"
        >
          <LogOut size={15} />
          {copy.logout}
        </button>
      </div>
    </div>
  );
}

function AuthDialog({
  copy,
  externalError,
  onClearExternalError,
  onClose,
}: {
  copy: AuthCopy;
  externalError?: unknown;
  onClearExternalError?: () => void;
  onClose: () => void;
}) {
  const { loginWithEmail, loginWithGoogle, registerWithEmail } = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const activeError = error || (externalError ? getAuthErrorMessage(externalError) : "");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    logAuthUi("dialog.form.submit", {
      mode,
      email: maskEmail(email),
      hasDisplayName: Boolean(displayName.trim()),
      path: window.location.pathname,
    });

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      logAuthUi("dialog.form.validation.error", {
        reason: "missing-required-fields",
        hasEmail: Boolean(normalizedEmail),
        hasPassword: Boolean(password),
      });
      setError("이메일과 비밀번호를 입력해주세요.");
      setBusy(false);
      return;
    }

    if (password.length < 6) {
      logAuthUi("dialog.form.validation.error", {
        reason: "password-too-short",
        passwordLength: password.length,
      });
      setError("비밀번호는 6자 이상으로 입력해주세요.");
      setBusy(false);
      return;
    }

    try {
      if (mode === "login") {
        await loginWithEmail(normalizedEmail, password);
      } else {
        await registerWithEmail(normalizedEmail, password, displayName);
      }

      logAuthUi("dialog.form.success", { mode, email: maskEmail(normalizedEmail) });
      onClose();
    } catch (caught) {
      logAuthUi("dialog.form.error", {
        mode,
        email: maskEmail(normalizedEmail),
        error: getAuthErrorDebug(caught),
      });
      setError(getAuthErrorMessage(caught));
    } finally {
      logAuthUi("dialog.form.finally", { mode, email: maskEmail(normalizedEmail) });
      setBusy(false);
    }
  }

  async function handleGoogleLogin() {
    setBusy(true);
    setError("");
    onClearExternalError?.();
    logAuthUi("dialog.google.click", { path: window.location.pathname });

    try {
      await loginWithGoogle();
    } catch (caught) {
      logAuthUi("dialog.google.error", { error: getAuthErrorDebug(caught) });
      setError(getAuthErrorMessage(caught));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/68 px-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="glass-panel w-full max-w-md p-5 shadow-[0_30px_120px_rgba(0,0,0,0.55)] md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow text-[#dec47b]">{copy.account}</p>
            <h2 className="font-display mt-2 text-4xl leading-tight text-white">
              {mode === "login" ? copy.login : copy.register}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#d9d0c9]">{copy.helper}</p>
          </div>
          <button className="social-action-button" onClick={onClose} type="button" aria-label="Close">
            <X size={17} />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 rounded-md border border-white/10 bg-white/[0.03] p-1">
          {(["login", "register"] as const).map((item) => (
            <button
              className={`rounded px-3 py-2 text-xs font-black transition ${
                mode === item ? "bg-[#d62f55] text-white" : "text-white/58 hover:text-[#dec47b]"
              }`}
              key={item}
              onClick={() => {
                logAuthUi("dialog.mode.click", { nextMode: item, previousMode: mode });
                setMode(item);
                setError("");
                onClearExternalError?.();
              }}
              type="button"
            >
              {item === "login" ? copy.login : copy.register}
            </button>
          ))}
        </div>

        <button
          className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-md border border-white/12 bg-white/[0.04] text-sm font-black text-white transition hover:border-[#dec47b]/60 hover:text-[#dec47b]"
          disabled={busy}
          onClick={handleGoogleLogin}
          type="button"
        >
          {busy ? <Loader2 className="animate-spin" size={15} /> : <FcGoogle size={18} />}
          {copy.google}
        </button>

        <form className="mt-4 grid gap-3" noValidate onSubmit={handleSubmit}>
          {mode === "register" ? (
            <label className="grid gap-2 text-xs font-black uppercase text-white/72">
              {copy.name}
              <input
                className="h-11 rounded-md border border-white/10 bg-white/[0.06] px-3 text-sm font-medium normal-case text-white outline-none transition placeholder:text-white/30 focus:border-[#dec47b]/60"
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="BAKSAL"
                value={displayName}
              />
            </label>
          ) : null}
          <label className="grid gap-2 text-xs font-black uppercase text-white/72">
            {copy.email}
            <span className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#dec47b]" size={15} />
              <input
                autoComplete="email"
                className="h-11 w-full rounded-md border border-white/10 bg-white/[0.06] pl-9 pr-3 text-sm font-medium normal-case text-white outline-none transition placeholder:text-white/30 focus:border-[#dec47b]/60"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@example.com"
                required
                type="email"
                value={email}
              />
            </span>
          </label>
          <label className="grid gap-2 text-xs font-black uppercase text-white/72">
            {copy.password}
            <input
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              className="h-11 rounded-md border border-white/10 bg-white/[0.06] px-3 text-sm font-medium normal-case text-white outline-none transition placeholder:text-white/30 focus:border-[#dec47b]/60"
              minLength={6}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              required
              type="password"
              value={password}
            />
          </label>

          {activeError ? (
            <p className="rounded-md border border-[#d62f55]/35 bg-[#d62f55]/10 px-3 py-2 text-xs leading-5 text-[#ffb3c0]">
              {activeError}
            </p>
          ) : null}

          <button className="button-primary mt-2 w-full" disabled={busy} type="submit">
            {busy ? <Loader2 className="animate-spin" size={15} /> : null}
            {mode === "login" ? copy.submitLogin : copy.submitRegister}
          </button>
        </form>
      </div>
    </div>
  );
}

function logAuthUi(event: string, payload?: unknown) {
  console.info(AUTH_LOG_PREFIX, event, payload ?? "");

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

function maskEmail(email: string) {
  if (!email || !email.includes("@")) {
    return email || "(empty)";
  }

  const [name, domain] = email.trim().toLowerCase().split("@");
  const safeName = name.length <= 2 ? `${name[0] ?? ""}*` : `${name.slice(0, 2)}***${name.slice(-1)}`;

  return `${safeName}@${domain}`;
}

function getAuthErrorDebug(error: unknown) {
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

  return { message: String(error) };
}

function getAuthErrorMessage(error: unknown) {
  if (error instanceof FirebaseError) {
    if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password") {
      return "이메일 또는 비밀번호를 확인해주세요.";
    }

    if (error.code === "auth/email-already-in-use") {
      return "이미 가입된 이메일입니다.";
    }

    if (error.code === "auth/popup-closed-by-user") {
      return "로그인 팝업이 닫혔습니다.";
    }

    if (error.code === "auth/operation-not-allowed") {
      return "Firebase 콘솔에서 해당 로그인 제공자를 활성화해주세요.";
    }

    if (error.code === "auth/configuration-not-found") {
      return "Firebase Authentication 초기 설정을 먼저 활성화해주세요.";
    }
  }

  return "로그인 처리 중 문제가 발생했습니다.";
}
