import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { ServiceBrowser } from "@/components/service-browser";
import { servicePageCopy } from "@/data/service-content";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { keywordsFor, pageAlternates, pageOpenGraph } from "@/lib/seo";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const copy = servicePageCopy[locale];

  return {
    title: `${copy.eyebrow} | BAKSAL BEAUTY`,
    description: copy.description,
    keywords: keywordsFor(locale, Object.values(copy.tabs)),
    alternates: pageAlternates(locale, "service"),
    openGraph: pageOpenGraph({
      locale,
      path: "service",
      title: `${copy.eyebrow} | BAKSAL BEAUTY`,
      description: copy.description,
      image: "/images/service-lifting.jpg",
    }),
  };
}

export default async function ServicePage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const t = getDictionary(locale);
  const copy = servicePageCopy[locale];

  return (
    <PageShell
      locale={locale}
      t={t}
      eyebrow={copy.eyebrow}
      title={copy.title}
      description={copy.description}
      image="/images/service-lifting.jpg"
      imageAlt={copy.title}
    >
      <ServiceBrowser locale={locale} copy={copy} />
    </PageShell>
  );
}
