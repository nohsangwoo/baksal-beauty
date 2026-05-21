import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageMotion } from "@/components/page-motion";
import { SiteHeader } from "@/components/site-header";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { TestAdminDemo } from "./test-admin-demo";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: "Demo Admin | BAKSAL BEAUTY",
  description: "Front-end only demo admin console for LUDGI website production inquiries.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function TestAdminPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const t = getDictionary(locale);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#1f1715] text-[#fff8ef]">
      <SiteHeader key={locale} t={t} locale={locale} />
      <PageMotion />
      <div className="pt-24 md:pt-28">
        <TestAdminDemo />
      </div>
    </main>
  );
}
