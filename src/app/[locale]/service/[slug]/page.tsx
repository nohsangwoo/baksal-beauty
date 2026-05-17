import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Clock, Sparkles } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { servicePageCopy, serviceSeeds } from "@/data/service-content";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getServiceBySlug } from "@/lib/service-repository";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    serviceSeeds.map((service) => ({
      locale,
      slug: service.slug,
    })),
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const service = await getServiceBySlug(locale, slug);

  if (!service) {
    return {};
  }

  return {
    title: `${service.title} | BAKSAL BEAUTY`,
    description: service.summary,
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const service = await getServiceBySlug(locale, slug);

  if (!service) {
    notFound();
  }

  const t = getDictionary(locale);
  const copy = servicePageCopy[locale];

  return (
    <PageShell
      locale={locale}
      t={t}
      eyebrow={copy.tabs[service.category]}
      title={service.title}
      description={service.summary}
      image={service.imageUrl}
      imageAlt={service.imageAlt}
    >
      <section data-reveal-section="" className="bg-[#1f1715] py-20 md:py-28">
        <div className="section-shell">
          <Link
            href={`/${locale}/service`}
            className="inline-flex items-center gap-2 text-sm font-black text-white/62 transition hover:text-[#dec47b]"
          >
            <ArrowLeft size={16} />
            {copy.catalogTitle}
          </Link>

          <div className="mt-10 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div data-magnetic="" data-magnetic-strength="4" className="relative overflow-hidden rounded-lg border border-white/10 bg-[#0d0b0c]">
              <div className="relative aspect-[4/3]">
                <Image
                  src={service.imageUrl}
                  alt={service.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 44vw, 100vw"
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            <article className="glass-panel p-6 md:p-8">
              <div className="flex flex-wrap gap-2">
                {service.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs font-black text-[#dec47b]"
                  >
                    {copy.tabs[tag]}
                  </span>
                ))}
              </div>
              <p className="mt-7 text-lg leading-9 text-[#d9d0c9]">{service.description}</p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {service.highlights.map((highlight) => (
                  <p key={highlight} className="flex items-center gap-3 text-sm font-bold text-white/82">
                    <Check size={15} className="shrink-0 text-[#dec47b]" />
                    {highlight}
                  </p>
                ))}
              </div>

              <div className="mt-8 grid gap-4 border-y border-white/10 py-6 md:grid-cols-2">
                <DetailMetric icon={<Sparkles size={17} />} label={copy.details.recovery} value={service.recovery} />
                <DetailMetric icon={<Clock size={17} />} label={copy.details.duration} value={service.duration} />
              </div>

              <div className="mt-7">
                <p className="eyebrow text-[#dec47b]">{copy.details.recommended}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {service.recommendedFor.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm font-bold text-white/72"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-7 rounded-md border border-[#dec47b]/20 bg-[#dec47b]/[0.055] p-4 text-sm leading-7 text-[#d9d0c9]">
                <span className="font-black text-[#dec47b]">{copy.details.price}</span>
                <br />
                {service.priceNote}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link className="button-primary" href={`/${locale}/inquire?service=${service.slug}`}>
                  {copy.details.inquiry}
                  <ArrowRight size={15} />
                </Link>
                <Link className="button-outline" href={`/${locale}/service`}>
                  {copy.catalogTitle}
                </Link>
              </div>
            </article>
          </div>

          <section className="mt-14 rounded-lg border border-white/10 bg-[#120d0e] p-6 md:p-8">
            <p className="eyebrow text-[#dec47b]">{copy.details.process}</p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {service.process.map((step, index) => (
                <div key={step} className="rounded-md border border-white/10 bg-white/[0.03] p-5">
                  <p className="font-display text-3xl text-[#dec47b]">{String(index + 1).padStart(2, "0")}</p>
                  <p className="mt-4 text-sm font-bold leading-7 text-white/78">{step}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </PageShell>
  );
}

function DetailMetric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="flex items-center gap-2 text-xs font-black uppercase text-[#dec47b]">
        {icon}
        {label}
      </p>
      <p className="mt-3 text-sm leading-7 text-white/72">{value}</p>
    </div>
  );
}
