import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminDenied, AdminShell } from "@/components/admin-shell";
import { PageMotion } from "@/components/page-motion";
import { SiteHeader } from "@/components/site-header";
import { canAccessAdmin, canManageUsers } from "@/lib/rbac";
import { getCurrentUserFromCookies } from "@/lib/auth-session";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: "Admin | BAKSAL BEAUTY",
  description: "BAKSAL BEAUTY content management console.",
};

export default async function AdminLayout({ children, params }: LayoutProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const t = getDictionary(locale);
  const currentUser = await getCurrentUserFromCookies();
  const allowed = canAccessAdmin(currentUser);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#1f1715] text-[#fff8ef]">
      <SiteHeader key={locale} t={t} locale={locale} />
      <PageMotion />
      <div className="pt-24 md:pt-28">
        {allowed && currentUser ? (
          <AdminShell
            locale={locale}
            canManageUsers={canManageUsers(currentUser)}
            currentUser={{
              name: currentUser.name,
              email: currentUser.email,
              role: currentUser.role,
            }}
          >
            {children}
          </AdminShell>
        ) : (
          <AdminDenied
            locale={locale}
            reason="Firebase 로그인 후 Neon public.users에서 활성 관리자 권한이 확인된 사용자만 접근할 수 있습니다."
          />
        )}
      </div>
    </main>
  );
}
