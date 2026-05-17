import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminConsole } from "@/components/admin-console";
import { PageShell } from "@/components/page-shell";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: "Admin | BAKSAL BEAUTY",
  description: "BAKSAL BEAUTY content management console.",
};

export default async function AdminPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const t = getDictionary(locale);

  return (
    <PageShell
      locale={locale}
      t={t}
      eyebrow="Admin"
      title="Content Operations"
      description="서비스, 블로그, 문의, 유저/RBAC 관리를 위한 관리자 페이지입니다."
      image="/images/clinic-interior.jpg"
      imageAlt="BAKSAL BEAUTY admin console"
    >
      <AdminConsole locale={locale} />
    </PageShell>
  );
}
