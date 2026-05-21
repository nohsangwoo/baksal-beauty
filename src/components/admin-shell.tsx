"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FileText, Inbox, LayoutDashboard, Loader2, Scissors, ShieldAlert, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import type { Locale } from "@/i18n/config";

type AdminShellProps = {
  locale: Locale;
  canManageUsers: boolean;
  currentUser: {
    name: string;
    email: string;
    role: string;
  };
  children: React.ReactNode;
};

const baseLinks = [
  { id: "dashboard", label: "Dashboard", href: "", icon: LayoutDashboard },
  { id: "services", label: "SERVICE", href: "/services", icon: Scissors },
  { id: "blog", label: "BLOG", href: "/blog", icon: FileText },
  { id: "inquire", label: "INQUIRE", href: "/inquire", icon: Inbox },
];

const userLink = { id: "users", label: "User Management", href: "/users", icon: Users };

export function AdminShell({ locale, canManageUsers, currentUser, children }: AdminShellProps) {
  const pathname = usePathname();
  const links = canManageUsers ? [baseLinks[0], userLink, ...baseLinks.slice(1)] : baseLinks;

  return (
    <section data-reveal-section="" className="min-h-[calc(100svh-6rem)] bg-[#1f1715] px-3 py-4 sm:px-4 lg:px-5">
      <div className="w-full">
        <div className="grid gap-4 xl:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="glass-panel h-fit p-4 xl:sticky xl:top-28">
            <div className="border-b border-white/10 p-3">
              <p className="eyebrow text-[#dec47b]">Admin Console</p>
              <h2 className="font-display mt-3 text-3xl">BAKSAL Ops</h2>
              <p className="mt-3 truncate text-sm font-black text-white">{currentUser.name || currentUser.email}</p>
              <p className="mt-1 text-xs text-[#dec47b]">{currentUser.role}</p>
            </div>
            <nav className="mt-4 grid gap-2">
              {links.map(({ href, label, icon: Icon }) => {
                const target = `/${locale}/admin${href}`;
                const isActive = pathname === target;

                return (
                  <Link
                    key={target}
                    className={`flex items-center gap-3 rounded-md px-4 py-3 text-left text-sm font-black transition ${
                      isActive
                        ? "bg-[#d62f55] text-white"
                        : "text-white/68 hover:bg-white/[0.06] hover:text-[#dec47b]"
                    }`}
                    href={target}
                  >
                    <Icon size={17} />
                    {label}
                  </Link>
                );
              })}
            </nav>
          </aside>

          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </section>
  );
}

export function AdminDenied({
  locale = "ko",
  reason = "Admin permission is required.",
}: {
  locale?: Locale;
  reason?: string;
}) {
  const router = useRouter();
  const { loading, refreshSession, user } = useAuth();
  const [blockedUid, setBlockedUid] = useState<string | null>(null);
  const [retryError, setRetryError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (loading || !user) {
      return () => {
        cancelled = true;
      };
    }

    const retryKey = `baksal-admin-session-retry:${window.location.pathname}:${user.uid}`;
    const lastRetry = Number(window.sessionStorage.getItem(retryKey) ?? 0);
    const retriedRecently = Number.isFinite(lastRetry) && Date.now() - lastRetry < 5000;

    if (retriedRecently) {
      queueMicrotask(() => {
        if (!cancelled) {
          setBlockedUid(user.uid);
        }
      });
      return () => {
        cancelled = true;
      };
    }

    window.sessionStorage.setItem(retryKey, String(Date.now()));

    void refreshSession()
      .then(() => {
        if (cancelled) {
          return;
        }

        router.refresh();
      })
      .catch((error: unknown) => {
        if (cancelled) {
          return;
        }

        setRetryError(error instanceof Error ? error.message : String(error));
        setBlockedUid(user.uid);
      });

    return () => {
      cancelled = true;
    };
  }, [loading, refreshSession, router, user]);

  const isChecking = loading || Boolean(user && blockedUid !== user.uid);

  if (isChecking) {
    return (
      <section data-reveal-section="" className="min-h-[calc(100svh-6rem)] bg-[#1f1715] px-3 py-4 sm:px-4 lg:px-5">
        <div className="w-full">
          <div className="glass-panel p-7 md:p-9">
            <p className="eyebrow text-[#dec47b]">Checking Access</p>
            <h2 className="font-display mt-4 text-5xl">관리자 권한 확인 중</h2>
            <p className="mt-5 max-w-2xl leading-8 text-[#d9d0c9]">
              로그인 세션을 다시 확인하고 있습니다. Firebase 로그인은 유지된 상태라면 관리자 화면으로 곧
              이어집니다.
            </p>
            <div className="mt-7 inline-flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-[#dec47b]">
              <Loader2 className="animate-spin" size={17} />
              Verifying session
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section data-reveal-section="" className="min-h-[calc(100svh-6rem)] bg-[#1f1715] px-3 py-4 sm:px-4 lg:px-5">
      <div className="w-full">
        <div className="glass-panel p-7 md:p-9">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d62f55]/35 bg-[#d62f55]/10 text-[#ff8fa7]">
            <ShieldAlert size={20} />
          </div>
          <p className="eyebrow mt-5 text-[#dec47b]">Access Restricted</p>
          <h2 className="font-display mt-4 text-5xl">Admin access only</h2>
          <p className="mt-5 max-w-2xl leading-8 text-[#d9d0c9]">{reason}</p>
          {retryError ? <p className="mt-3 max-w-2xl text-sm text-[#ff9aad]">Session check: {retryError}</p> : null}
          <Link className="button-primary mt-7 inline-flex" href={`/${locale}`}>
            Back to site
          </Link>
        </div>
      </div>
    </section>
  );
}
