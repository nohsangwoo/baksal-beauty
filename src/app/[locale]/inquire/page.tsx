import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SocialChannelButtons } from "@/components/contact-actions";
import { PageShell } from "@/components/page-shell";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { keywordsFor, pageAlternates, pageOpenGraph } from "@/lib/seo";
import { InquireForm } from "./inquire-form";

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
    title: `${t.nav[3]?.label ?? "Inquire"} | BAKSAL BEAUTY`,
    description: t.consultation.body,
    keywords: keywordsFor(locale, ["홈페이지 제작 문의", "병원 홈페이지 제작 문의", "website production inquiry", "clinic website inquiry"]),
    alternates: pageAlternates(locale, "inquire"),
    openGraph: pageOpenGraph({
      locale,
      path: "inquire",
      title: `${t.nav[3]?.label ?? "Inquire"} | BAKSAL BEAUTY`,
      description: t.consultation.body,
      image: "/images/consultation-face.jpg",
    }),
  };
}

export default async function InquirePage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const t = getDictionary(locale);

  return (
    <PageShell
      locale={locale}
      t={t}
      eyebrow={t.consultation.eyebrow}
      title={t.consultation.title}
      description={t.consultation.body}
      image="/images/consultation-face.jpg"
      imageAlt={t.consultation.imageAlt}
    >
      <section data-reveal-section="" className="bg-[#241b18] py-24 md:py-32">
        <div className="section-shell grid gap-8 lg:grid-cols-[1fr_0.7fr]">
          <InquireForm locale={locale} copy={t.consultation} />

          <aside className="glass-panel p-6 md:p-8">
            <p className="eyebrow text-[#dec47b]">Direct channels</p>
            <h2 className="font-display mt-4 text-4xl">Talk to LUDGI</h2>
            <p className="mt-5 leading-8 text-[#d9d0c9]">{t.inquiry.body}</p>
            <div className="mt-8">
              <SocialChannelButtons />
            </div>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}
