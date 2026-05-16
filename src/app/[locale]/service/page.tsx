import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
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
    title: `${t.nav[1]?.label ?? "Service"} | BAKSAL BEAUTY`,
    description: `${t.services.titleA} ${t.services.titleB} ${t.services.titleC}`,
  };
}

export default async function ServicePage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const t = getDictionary(locale);

  return (
    <PageShell
      locale={locale}
      t={t}
      eyebrow={t.services.eyebrow}
      title={`${t.services.titleA} ${t.services.titleB} ${t.services.titleC}`}
      description={t.guide.body}
      image="/images/pillar-facial.jpg"
      imageAlt={t.services.pillars[0]?.title ?? "BAKSAL BEAUTY service"}
    >
      <section data-reveal-section="" className="bg-[#241b18] py-24 md:py-32">
        <div className="section-shell grid gap-7 lg:grid-cols-3">
          {t.services.pillars.map((pillar) => (
            <article key={pillar.id} data-magnetic="" data-magnetic-strength="5" className="glass-panel overflow-hidden">
              <div className="relative h-72">
                <Image src={pillar.image} alt={pillar.title} fill sizes="380px" className="object-cover" />
              </div>
              <div className="p-7">
                <p className="eyebrow text-[#dec47b]">{pillar.eyebrow}</p>
                <h2 className="font-display mt-4 text-4xl">{pillar.title}</h2>
                <p className="mt-5 leading-8 text-[#d9d0c9]">{pillar.description}</p>
                <div className="mt-7 grid gap-3">
                  {pillar.items.map((item) => (
                    <p key={item} className="flex items-center gap-3 text-sm text-white/84">
                      <Check size={16} className="text-[#dec47b]" />
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
