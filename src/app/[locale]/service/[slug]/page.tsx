import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Clock,
  HeartPulse,
  Hospital,
  Play,
  ShieldCheck,
  Syringe,
  Users,
} from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { ContactSection, NewsletterSection } from "@/components/shared-sections";
import {
  getServiceDetailContent,
  serviceDetailLabels,
} from "@/data/service-detail-defaults";
import {
  servicePageCopy,
  serviceSeeds,
  type ServiceDetailPanel,
  type ServiceItem,
  type ServiceRichDetailImage,
  type ServiceVideoPreview,
} from "@/data/service-content";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getRelatedServices, getServiceBySlug } from "@/lib/service-repository";

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
  const catalogCopy = servicePageCopy[locale];
  const labels = serviceDetailLabels[locale];
  const detail = getServiceDetailContent(service, locale);
  const relatedServices = await getRelatedServices(locale, service, 2);

  return (
    <PageShell
      locale={locale}
      t={t}
      eyebrow={catalogCopy.tabs[service.category]}
      title={service.title}
      description={service.summary}
      image={service.imageUrl}
      imageAlt={service.imageAlt}
    >
      <section id="service-summary" data-reveal-section="" className="bg-[#1f1715] py-16 md:py-24">
        <div className="section-shell">
          <Link
            href={`/${locale}/service`}
            className="inline-flex items-center gap-2 text-sm font-black text-white/62 transition hover:text-[#dec47b]"
          >
            <ArrowLeft size={16} />
            {labels.back}
          </Link>

          <div className="mt-9 grid gap-4 md:grid-cols-5">
            <InfoTile
              icon={<Clock size={18} />}
              label={labels.surgeryTime}
              value={detail.surgeryInfo.surgeryTime}
            />
            <InfoTile
              icon={<Syringe size={18} />}
              label={labels.anesthesia}
              value={detail.surgeryInfo.anesthesia}
            />
            <InfoTile
              icon={<Hospital size={18} />}
              label={labels.visits}
              value={detail.surgeryInfo.visits}
            />
            <InfoTile
              icon={<HeartPulse size={18} />}
              label={labels.aftercareStart}
              value={detail.surgeryInfo.aftercareStart}
            />
            <InfoTile
              icon={<CalendarDays size={18} />}
              label={labels.recoveryPeriod}
              value={detail.surgeryInfo.recoveryPeriod}
            />
          </div>

          <p className="mt-5 text-sm leading-7 text-[#b6aaa6]">{labels.surgeryInfoBody}</p>
        </div>
      </section>

      <section id="recommended-for" data-reveal-section="" className="border-y border-white/10 bg-[#241b18] py-20 md:py-28">
        <div className="section-shell grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div>
            <p className="eyebrow text-[#dec47b]">{labels.recommended}</p>
            <h2 className="font-display mt-4 text-5xl leading-tight md:text-6xl">
              {service.subtitle}
            </h2>
            <p className="mt-6 leading-8 text-[#d9d0c9]">{labels.recommendedBody}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link className="button-primary" href={`/${locale}/inquire?service=${service.slug}`}>
                {labels.inquire}
                <ArrowRight size={15} />
              </Link>
              <Link className="button-outline" href={`/${locale}/service`}>
                {labels.catalog}
              </Link>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {service.recommendedFor.map((item, index) => (
              <div
                key={item}
                className="glass-panel p-5"
                style={{ "--reveal-delay": `${index * 80}ms` } as CSSProperties}
              >
                <p className="font-display text-3xl text-[#dec47b]">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className="mt-4 text-sm font-bold leading-7 text-white/78">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="detail-panels" data-reveal-section="" className="bg-[#1f1715] py-20 md:py-28">
        <div className="section-shell">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow text-[#dec47b]">{labels.detailPanels}</p>
            <h2 className="font-display mt-4 text-5xl leading-tight md:text-6xl">
              {service.title}
            </h2>
            <p className="mt-6 leading-8 text-[#d9d0c9]">{labels.detailPanelsBody}</p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {detail.detailPanels.slice(0, 3).map((panel, index) => (
              <VerticalDetailPanel key={`${panel.title}-${index}`} panel={panel} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section id="before-after" data-reveal-section="" className="border-y border-white/10 bg-[#120d0e] py-20 md:py-28">
        <div className="section-shell grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="eyebrow text-[#dec47b]">{labels.beforeAfter}</p>
            <h2 className="font-display mt-4 text-5xl leading-tight md:text-6xl">
              {detail.beforeAfter.title}
            </h2>
            <p className="mt-6 leading-8 text-[#d9d0c9]">{detail.beforeAfter.body}</p>
          </div>

          <div data-magnetic="" data-magnetic-strength="4" className="relative overflow-hidden rounded-lg border border-white/10 bg-black">
            <div className="grid aspect-[4/3] grid-cols-2">
              <div className="relative min-h-full">
                <Image
                  src={detail.beforeAfter.beforeImageUrl}
                  alt={detail.beforeAfter.beforeAlt}
                  fill
                  sizes="(min-width: 1024px) 34vw, 50vw"
                  className="object-cover"
                />
                <span className="absolute left-4 top-4 rounded-full bg-black/55 px-3 py-1 text-xs font-black text-white backdrop-blur">
                  {labels.before}
                </span>
              </div>
              <div className="relative min-h-full border-l border-white/80">
                <Image
                  src={detail.beforeAfter.afterImageUrl}
                  alt={detail.beforeAfter.afterAlt}
                  fill
                  sizes="(min-width: 1024px) 34vw, 50vw"
                  className="object-cover"
                />
                <span className="absolute right-4 top-4 rounded-full bg-[#d62f55]/85 px-3 py-1 text-xs font-black text-white backdrop-blur">
                  {labels.after}
                </span>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/72 to-transparent p-5">
              <p className="text-xs font-bold leading-6 text-white/72">{detail.beforeAfter.body}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="rich-detail-images" data-reveal-section="" className="bg-[#1f1715] py-20 md:py-28">
        <div className="section-shell">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow text-[#dec47b]">{labels.richImages}</p>
            <h2 className="font-display mt-4 text-5xl leading-tight md:text-6xl">
              {labels.richImagesTitle(service.title)}
            </h2>
            <p className="mt-6 leading-8 text-[#d9d0c9]">{labels.richImagesBody}</p>
          </div>

          <div className="mx-auto mt-12 grid max-w-5xl gap-7">
            {detail.richDetailImages.map((image, index) => (
              <RichDetailImageBlock key={`${image.imageUrl}-${index}`} image={image} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section id="videos" data-reveal-section="" className="bg-[#241b18] py-20 md:py-28">
        <div className="section-shell">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="eyebrow text-[#dec47b]">{labels.videos}</p>
              <h2 className="font-display mt-4 text-5xl leading-tight md:text-6xl">
                {service.title} Preview
              </h2>
              <p className="mt-6 leading-8 text-[#d9d0c9]">{labels.videosBody}</p>
            </div>
            <span className="rounded-full border border-white/10 px-4 py-2 text-xs font-black text-white/58">
              {detail.youtubeVideos.length} videos
            </span>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {detail.youtubeVideos.map((video, index) => (
              <VideoPreviewCard key={`${video.title}-${index}`} video={video} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section id="related-services" data-reveal-section="" className="bg-[#1f1715] py-20 md:py-28">
        <div className="section-shell grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <article className="glass-panel p-7 md:p-9">
            <p className="eyebrow text-[#dec47b]">{labels.detailCta}</p>
            <h2 className="font-display mt-4 text-5xl leading-tight">{detail.detailCta.title}</h2>
            <p className="mt-6 leading-8 text-[#d9d0c9]">{detail.detailCta.body}</p>
            <div className="mt-8 grid gap-3">
              {service.highlights.map((item) => (
                <p key={item} className="flex items-center gap-3 text-sm font-bold text-white/78">
                  <ShieldCheck size={16} className="shrink-0 text-[#dec47b]" />
                  {item}
                </p>
              ))}
            </div>
            <Link className="button-primary mt-9" href={`/${locale}/inquire?service=${service.slug}`}>
              {labels.inquire}
              <ArrowRight size={15} />
            </Link>
          </article>

          <div>
            <p className="eyebrow text-[#dec47b]">{labels.related}</p>
            <h2 className="font-display mt-4 text-5xl leading-tight md:text-6xl">
              {labels.related}
            </h2>
            <p className="mt-6 leading-8 text-[#d9d0c9]">{labels.relatedBody}</p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {relatedServices.map((item) => (
                <RelatedServiceCard key={item.slug} item={item} locale={locale} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <ContactSection t={t} locale={locale} />
      <NewsletterSection t={t} locale={locale} />
    </PageShell>
  );
}

function InfoTile({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="glass-panel min-h-36 p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dec47b]/12 text-[#dec47b]">
        {icon}
      </div>
      <p className="mt-5 text-xs font-black uppercase text-white/48">{label}</p>
      <p className="mt-2 text-sm font-black leading-6 text-white">{value}</p>
    </div>
  );
}

function VerticalDetailPanel({ panel, index }: { panel: ServiceDetailPanel; index: number }) {
  return (
    <article
      data-magnetic=""
      data-magnetic-strength="3"
      className="overflow-hidden rounded-lg border border-[#1f1715]/10 bg-[#f5f1ea] text-[#151113] shadow-2xl shadow-black/25"
      style={{ "--reveal-delay": `${index * 90}ms` } as CSSProperties}
    >
      <div className="px-6 pt-8 text-center md:px-8">
        <p className="text-sm font-black tracking-[0.22em] text-[#3b0719]/72">
          BAKSAL BEAUTY DETAIL
        </p>
        <p className="font-display mt-2 text-6xl font-black text-[#0d0b0c]">{panel.eyebrow}</p>
        <h3 className="mt-5 text-3xl font-black leading-tight md:text-4xl">{panel.title}</h3>
        <div className="mx-auto mt-4 h-2 w-40 rounded-full bg-[#dec47b]" />
        <p className="mx-auto mt-5 max-w-sm text-sm font-bold leading-7 text-[#413936]">
          {panel.body}
        </p>
      </div>

      <div className="relative mx-5 mt-8 aspect-[3/4] overflow-hidden rounded-md border-4 border-[#dec47b] bg-white">
        <Image
          src={panel.imageUrl}
          alt={panel.imageAlt}
          fill
          sizes="(min-width: 1024px) 360px, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 bg-black/68 p-4">
          <div className="grid gap-2">
            {panel.points.slice(0, 3).map((point) => (
              <p key={point} className="flex items-start gap-2 text-xs font-bold leading-5 text-white">
                <Check size={13} className="mt-1 shrink-0 text-[#dec47b]" />
                {point}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 py-7 md:px-8">
        <p className="rounded-md bg-[#0d0b0c] px-4 py-3 text-center text-xs font-black uppercase tracking-[0.12em] text-white">
          Structure first. Natural refinement.
        </p>
      </div>
    </article>
  );
}

function RichDetailImageBlock({
  image,
  index,
}: {
  image: ServiceRichDetailImage;
  index: number;
}) {
  return (
    <figure
      data-magnetic=""
      data-magnetic-strength="2"
      className="overflow-hidden rounded-lg border border-white/10 bg-[#0d0b0c] shadow-2xl shadow-black/30"
      style={{ "--reveal-delay": `${index * 90}ms` } as CSSProperties}
    >
      <Image
        src={image.imageUrl}
        alt={image.imageAlt}
        width={1080}
        height={1640}
        sizes="(min-width: 1024px) 980px, 100vw"
        className="h-auto w-full object-contain"
      />
      <figcaption className="sr-only">{image.title}</figcaption>
    </figure>
  );
}

function VideoPreviewCard({
  video,
  index,
}: {
  video: ServiceVideoPreview;
  index: number;
}) {
  return (
    <article
      data-magnetic=""
      data-magnetic-strength="3"
      className="glass-panel overflow-hidden"
      style={{ "--reveal-delay": `${index * 90}ms` } as CSSProperties}
    >
      <div className="relative aspect-video bg-[#0d0b0c]">
        {video.thumbnailUrl ? (
          <Image
            src={video.thumbnailUrl}
            alt={video.title}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover opacity-80"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(214,47,85,0.3),transparent_35%),#0d0b0c]" />
        )}
        <div className="absolute inset-0 bg-black/32" />
        <div className="absolute inset-0 grid place-items-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#d62f55] text-white shadow-2xl">
            <Play fill="currentColor" size={24} />
          </span>
        </div>
      </div>
      <div className="p-5">
        <p className="eyebrow text-[#dec47b]">Preview {String(index + 1).padStart(2, "0")}</p>
        <h3 className="mt-3 text-xl font-black text-white">{video.title}</h3>
        <p className="mt-3 text-sm leading-7 text-[#d9d0c9]">{video.description}</p>
      </div>
    </article>
  );
}

function RelatedServiceCard({ item, locale }: { item: ServiceItem; locale: string }) {
  return (
    <Link
      href={`/${locale}/service/${item.slug}`}
      data-magnetic=""
      data-magnetic-strength="3"
      className="glass-panel group block overflow-hidden transition hover:border-[#dec47b]/35"
    >
      <div className="relative aspect-[4/3] bg-[#0d0b0c]">
        <Image
          src={item.imageUrl}
          alt={item.imageAlt}
          fill
          sizes="(min-width: 768px) 280px, 100vw"
          className="object-contain transition duration-500 group-hover:scale-[1.02]"
        />
      </div>
      <div className="p-5">
        <p className="flex items-center gap-2 text-xs font-black text-[#dec47b]">
          <Users size={14} />
          VECTOR MATCH
        </p>
        <h3 className="font-display mt-3 text-3xl leading-tight">{item.title}</h3>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#d9d0c9]">{item.summary}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase text-white">
          View details
          <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  );
}
