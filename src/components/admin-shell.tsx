"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Inbox, LayoutDashboard, Scissors, Users } from "lucide-react";
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
    <section data-reveal-section="" className="bg-[#1f1715] py-16 md:py-24">
      <div className="section-shell">
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="glass-panel h-fit p-4">
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
  reason = "관리자 권한이 필요합니다.",
}: {
  locale?: Locale;
  reason?: string;
}) {
  return (
    <section data-reveal-section="" className="bg-[#1f1715] py-16 md:py-24">
      <div className="section-shell">
        <div className="glass-panel p-7 md:p-9">
          <p className="eyebrow text-[#dec47b]">Access Restricted</p>
          <h2 className="font-display mt-4 text-5xl">Admin access only</h2>
          <p className="mt-5 max-w-2xl leading-8 text-[#d9d0c9]">{reason}</p>
          <Link className="button-primary mt-7 inline-flex" href={`/${locale}`}>
            Back to site
          </Link>
        </div>
      </div>
    </section>
  );
}
