import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

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

  const t = getDictionary(locale);

  return {
    title: `${t.nav[0]?.label ?? "About Us"} | BAKSAL BEAUTY`,
    description: t.philosophy.body,
  };
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const t = getDictionary(locale);

  return (
    <PageShell
      locale={locale}
      t={t}
      eyebrow={t.philosophy.eyebrow}
      title={`${t.philosophy.titleA} ${t.philosophy.titleB}`}
      description={t.philosophy.body}
      image="/images/philosophy-portrait.jpg"
      imageAlt={t.philosophy.imageAlt}
    >
      <section data-reveal-section="" className="py-24 md:py-32">
        <div className="section-shell grid gap-6 md:grid-cols-3">
          {t.philosophy.metrics.map((metric) => (
            <article key={metric.label} className="glass-panel p-7">
              <p className="font-display text-4xl text-[#dec47b]">{metric.value}</p>
              <p className="mt-4 leading-8 text-[#d9d0c9]">{metric.label}</p>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
