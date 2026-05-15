import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Languages,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { BeforeAfterSlider, TreatmentPillars } from "@/components/home-interactions";
import {
  getAlternateLocale,
  isLocale,
  localeLabels,
  locales,
  type Locale,
} from "@/i18n/config";
import { getDictionary, type HomeDictionary } from "@/i18n/dictionaries";

type LocalePageProps = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    return {};
  }

  const t = getDictionary(rawLocale);

  return {
    title: t.metadata.title,
    description: t.metadata.description,
    alternates: {
      canonical: `/${rawLocale}`,
      languages: Object.fromEntries(locales.map((locale) => [locale, `/${locale}`])),
    },
  };
}

export default async function LocalizedHome({ params }: LocalePageProps) {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  const t = getDictionary(rawLocale);

  return (
    <main className="min-h-screen overflow-hidden bg-[#1f1715] text-[#fff8ef]">
      <HeroSection t={t} locale={rawLocale} />
      <PhilosophySection t={t} />
      <ServicesSection t={t} />
      <PopularTreatmentsSection t={t} />
      <ComparisonSection t={t} />
      <InquiryBand t={t} />
      <DoctorsSection t={t} />
      <ReviewsSection t={t} />
      <GuideSection t={t} />
      <ConsultationSection t={t} />
      <ShopSection t={t} />
      <BlogSection t={t} />
      <NewsletterSection t={t} />
      <Footer t={t} locale={rawLocale} />
    </main>
  );
}

function HeroSection({ t, locale }: { t: HomeDictionary; locale: Locale }) {
  return (
    <section className="relative min-h-[86svh] overflow-hidden border-b border-white/10">
      <Image
        src="/images/hero.png"
        alt={t.hero.imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/58 via-[#3b0719]/20 to-black/20" />

      <div className="relative z-10 border-b border-white/10 bg-[#e7d1c7]/90 py-2 text-center text-[0.72rem] font-bold text-[#211515]">
        {t.hero.announcement}
      </div>

      <header className="relative z-10 section-shell flex h-24 items-center justify-between">
        <a href={`/${locale}`} className="flex items-center gap-3" aria-label={t.common.brandHome}>
          <span className="flower-mark text-[#dec47b]" aria-hidden="true" />
          <span className="font-display text-3xl font-semibold">BAKSAL BEAUTY</span>
        </a>
        <nav className="hidden items-center gap-8 text-xs font-black uppercase text-white/84 md:flex">
          {t.nav.map((item) => (
            <a key={item.label} className="transition hover:text-[#dec47b]" href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <LanguageLink locale={locale} label={t.language.switchLabel} />
          <a className="button-outline header-consult" href="#consult">
            <Phone size={15} />
            {t.common.phoneCta}
          </a>
        </div>
      </header>

      <div className="relative z-10 section-shell grid min-h-[calc(86svh-8rem)] items-center py-14">
        <div className="max-w-3xl">
          <p className="eyebrow text-[#dec47b]">{t.hero.eyebrow}</p>
          <h1 className="font-display mt-5 text-6xl leading-none text-white md:text-8xl">
            {t.hero.titleTop}
            <span className="block text-[#dec47b]">{t.hero.titleBottom}</span>
          </h1>
          <p className="font-display mt-7 max-w-2xl text-3xl leading-tight text-white md:text-5xl">
            {t.hero.line}
          </p>
          <p className="mt-8 max-w-xl leading-8 text-white/78">{t.hero.body}</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a className="button-primary" href="#consult">
              {t.common.consultCta}
              <ArrowRight size={16} />
            </a>
            <a className="button-outline" href="#services">
              {t.common.servicesCta}
            </a>
          </div>
        </div>
      </div>

      <div className="relative z-10 border-t border-white/10 bg-black/30 py-4 backdrop-blur">
        <div className="section-shell grid gap-3 text-center text-[0.7rem] font-bold uppercase text-white/72 sm:grid-cols-2 lg:grid-cols-4">
          {t.trustSignals.map((signal) => (
            <div key={signal} className="flex items-center justify-center gap-3">
              <span className="flower-mark text-[#dec47b]" aria-hidden="true" />
              {signal}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PhilosophySection({ t }: { t: HomeDictionary }) {
  return (
    <section id="about" className="py-24 md:py-32">
      <div className="section-shell grid items-center gap-14 lg:grid-cols-[0.95fr_1fr]">
        <div className="relative mx-auto w-full max-w-[560px]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-white/10">
            <Image
              src="/images/philosophy-portrait.jpg"
              alt={t.philosophy.imageAlt}
              fill
              sizes="(min-width: 1024px) 44vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-8 right-6 h-40 w-52 overflow-hidden rounded-lg border border-white/20 shadow-2xl md:h-56 md:w-72">
            <Image
              src="/images/clinic-interior.jpg"
              alt={t.philosophy.interiorAlt}
              fill
              sizes="280px"
              className="object-cover"
            />
          </div>
        </div>

        <div className="pt-8 lg:pt-0">
          <p className="eyebrow text-[#d9c1ad]">{t.philosophy.eyebrow}</p>
          <h2 className="font-display heading-balance mt-5 max-w-3xl text-5xl leading-tight md:text-7xl">
            <span className="gold-text">{t.philosophy.titleA}</span> {t.philosophy.titleB}
            <span className="block">{t.philosophy.titleC}</span>
          </h2>
          <p className="mt-8 max-w-2xl text-lg leading-9 text-[#d9d0c9]">
            {t.philosophy.body}
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {t.philosophy.metrics.map((item) => (
              <div key={item.value} className="border-t border-white/15 pt-4">
                <p className="font-display text-3xl text-white">{item.value}</p>
                <p className="mt-2 text-sm text-[#b6aaa6]">{item.label}</p>
              </div>
            ))}
          </div>
          <a className="button-primary mt-10" href="#doctors">
            {t.philosophy.cta}
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}

function ServicesSection({ t }: { t: HomeDictionary }) {
  return (
    <section id="services" className="border-y border-white/10 bg-[#241b18] py-24 md:py-32">
      <div className="section-shell">
        <div className="mx-auto mb-14 max-w-4xl text-center">
          <p className="eyebrow text-[#d9c1ad]">{t.services.eyebrow}</p>
          <h2 className="font-display mt-4 text-5xl md:text-7xl">
            {t.services.titleA} <span className="gold-text">{t.services.titleB}</span>{" "}
            {t.services.titleC}
          </h2>
        </div>
        <TreatmentPillars pillars={t.services.pillars} ctaLabel={t.services.pillarCta} />
      </div>
    </section>
  );
}

function PopularTreatmentsSection({ t }: { t: HomeDictionary }) {
  const duplicatedTreatments = [...t.popular.treatments, ...t.popular.treatments];

  return (
    <section className="py-24 md:py-32">
      <div className="mb-12 text-center">
        <p className="eyebrow text-[#d9c1ad]">{t.popular.eyebrow}</p>
        <h2 className="font-display mt-4 text-5xl md:text-7xl">
          {t.popular.titleA} <span className="gold-text">{t.popular.titleB}</span>{" "}
          {t.popular.titleC}
        </h2>
      </div>
      <div className="treatment-marquee">
        <div className="treatment-track">
          {duplicatedTreatments.map((treatment, index) => (
            <article
              key={`${treatment.title}-${index}`}
              className="group relative h-[520px] w-[300px] shrink-0 overflow-hidden rounded-lg border border-white/10 md:w-[360px]"
            >
              <Image
                src={treatment.image}
                alt={treatment.title}
                fill
                sizes="360px"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/18 to-black/24" />
              <div className="absolute inset-x-0 top-0 p-7">
                <p className="eyebrow text-white/78">{treatment.category}</p>
                <h3 className="font-display mt-3 text-3xl text-white">{treatment.title}</h3>
              </div>
              <a className="button-outline absolute bottom-7 left-7" href="#consult">
                {t.common.viewDetails}
              </a>
            </article>
          ))}
        </div>
      </div>
      <div className="mt-12 text-center">
        <a className="button-primary" href="#consult">
          {t.popular.allCta}
          <ArrowRight size={16} />
        </a>
      </div>
    </section>
  );
}

function ComparisonSection({ t }: { t: HomeDictionary }) {
  return (
    <section id="compare" className="border-y border-white/10 bg-[#160d12] py-24 md:py-32">
      <div className="section-shell grid items-center gap-14 lg:grid-cols-[0.9fr_1fr]">
        <div>
          <p className="eyebrow text-[#d9c1ad]">{t.comparison.eyebrow}</p>
          <h2 className="font-display heading-balance mt-5 text-5xl leading-tight md:text-7xl">
            {t.comparison.titleA}
            <span className="block gold-text">{t.comparison.titleB}</span>
          </h2>
          <p className="mt-8 max-w-xl leading-8 text-[#d9d0c9]">{t.comparison.body}</p>
          <div className="mt-10 grid gap-6 sm:grid-cols-4">
            {t.comparison.stats.map((item) => (
              <div key={item.label} className="border-t border-white/15 pt-4">
                <p className="font-display text-4xl text-white">{item.value}</p>
                <p className="mt-1 text-sm uppercase text-[#b6aaa6]">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
        <BeforeAfterSlider
          beforeLabel={t.comparison.beforeLabel}
          afterLabel={t.comparison.afterLabel}
          rangeLabel={t.comparison.rangeLabel}
          beforeAlt={t.comparison.beforeAlt}
          afterAlt={t.comparison.afterAlt}
        />
      </div>
    </section>
  );
}

function InquiryBand({ t }: { t: HomeDictionary }) {
  return (
    <section className="relative overflow-hidden py-20">
      <div className="absolute inset-0">
        <Image
          src="/images/consultation-face.jpg"
          alt={t.inquiry.imageAlt}
          fill
          sizes="100vw"
          className="object-cover opacity-[0.34]"
        />
        <div className="absolute inset-0 bg-[#170c10]/78" />
      </div>
      <div className="section-shell relative z-10 grid items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p className="eyebrow text-[#dec47b]">{t.inquiry.eyebrow}</p>
          <h2 className="font-display mt-4 text-5xl leading-tight md:text-7xl">
            {t.inquiry.titleA}
            <span className="block">{t.inquiry.titleB}</span>
          </h2>
        </div>
        <div className="glass-panel p-6 md:p-8">
          <p className="leading-8 text-[#d9d0c9]">{t.inquiry.body}</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a className="button-primary" href="#consult">
              {t.inquiry.primaryCta}
              <MessageCircle size={16} />
            </a>
            <a className="button-outline" href="#guide">
              {t.inquiry.secondaryCta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function DoctorsSection({ t }: { t: HomeDictionary }) {
  return (
    <section id="doctors" className="bg-[#241b18] py-24 md:py-32">
      <div className="section-shell">
        <div className="mx-auto max-w-4xl text-center">
          <p className="eyebrow text-[#d9c1ad]">{t.doctors.eyebrow}</p>
          <h2 className="font-display mt-4 text-5xl md:text-7xl">
            {t.doctors.titleA} <span className="gold-text">{t.doctors.titleB}</span>{" "}
            {t.doctors.titleC}
          </h2>
          <p className="mt-6 text-lg italic text-[#d9d0c9]">{t.doctors.intro}</p>
        </div>
        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {t.doctors.list.map((doctor) => (
            <article key={doctor.name} className="glass-panel p-6 md:p-8">
              <p className="font-display text-3xl text-white">{doctor.name}</p>
              <p className="mt-2 text-sm font-bold text-[#e38aa0]">{doctor.role}</p>
              <div className="mx-auto my-10 aspect-square w-52 overflow-hidden rounded-full border border-white/10 bg-white/5">
                <Image
                  src={doctor.image}
                  alt={doctor.name}
                  width={420}
                  height={420}
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="min-h-14 leading-7 text-[#d9d0c9]">{doctor.summary}</p>
              <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
                <a className="text-xs font-black uppercase transition hover:text-[#dec47b]" href="#consult">
                  {t.common.profileCta}
                </a>
                <ShieldCheck className="text-[#dec47b]" size={22} />
              </div>
            </article>
          ))}
        </div>
        <div className="mt-12 text-center">
          <a className="button-primary" href="#consult">
            {t.doctors.cta}
          </a>
        </div>
      </div>
    </section>
  );
}

function ReviewsSection({ t }: { t: HomeDictionary }) {
  return (
    <section className="py-24 md:py-32">
      <div className="section-shell">
        <div className="mx-auto max-w-4xl text-center">
          <p className="eyebrow text-[#d9c1ad]">{t.reviews.eyebrow}</p>
          <h2 className="font-display mt-4 text-5xl md:text-7xl">
            {t.reviews.titleA} <span className="gold-text">{t.reviews.titleB}</span>
          </h2>
          <p className="mt-5 text-[#b6aaa6]">{t.reviews.intro}</p>
        </div>
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {t.reviews.list.map((review) => (
            <article key={review.name} className="border-t border-white/15 pt-8 text-center">
              <div className="mb-6 flex justify-center gap-1 text-[#e38aa0]">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} size={18} fill="currentColor" />
                ))}
              </div>
              <p className="mx-auto max-w-md leading-8 text-white/84">“{review.quote}”</p>
              <p className="font-display mt-6 text-2xl text-[#d9c1ad]">{review.name}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function GuideSection({ t }: { t: HomeDictionary }) {
  return (
    <section id="guide" className="bg-[#241b18] py-24 md:py-32">
      <div className="section-shell">
        <div className="mx-auto max-w-4xl text-center">
          <p className="eyebrow text-[#d9c1ad]">{t.guide.eyebrow}</p>
          <h2 className="font-display mt-4 text-5xl md:text-7xl">
            {t.guide.titleA} <span className="gold-text">{t.guide.titleB}</span>{" "}
            {t.guide.titleC}
          </h2>
          <p className="mt-6 leading-8 text-[#d9d0c9]">{t.guide.body}</p>
        </div>
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {t.guide.cards.map((card) => (
            <article key={card.title} className="glass-panel overflow-hidden">
              <div className="relative h-72">
                <Image src={card.image} alt={card.title} fill sizes="380px" className="object-cover" />
              </div>
              <div className="p-7">
                <h3 className="font-display text-3xl">{card.title}</h3>
                <div className="mt-6 space-y-4">
                  {card.items.map((item) => (
                    <div key={item} className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
                      <span className="flex items-center gap-3">
                        <Check size={16} className="text-[#dec47b]" />
                        {item}
                      </span>
                      <span className="text-xs font-bold text-[#d9c1ad]">
                        {t.common.guidedAfterConsultation}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-7 text-[#b6aaa6]">
          {t.guide.notice}
        </p>
      </div>
    </section>
  );
}

function ConsultationSection({ t }: { t: HomeDictionary }) {
  return (
    <section id="consult" className="grid bg-[#130f10] lg:grid-cols-2">
      <div className="relative min-h-[520px]">
        <Image
          src="/images/consultation-face.jpg"
          alt={t.consultation.imageAlt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#130f10]/35" />
      </div>
      <div className="flex items-center px-6 py-16 md:px-12 lg:px-20">
        <div className="w-full max-w-2xl">
          <p className="eyebrow text-[#dec47b]">{t.consultation.eyebrow}</p>
          <h2 className="font-display mt-4 text-5xl leading-tight md:text-6xl">
            {t.consultation.title}
          </h2>
          <p className="mt-5 leading-8 text-[#d9d0c9]">{t.consultation.body}</p>
          <form className="mt-10 grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-xs font-black uppercase">
                {t.consultation.fields.name}
                <input className="form-field" name="name" placeholder={t.consultation.placeholders.name} />
              </label>
              <label className="grid gap-2 text-xs font-black uppercase">
                {t.consultation.fields.phone}
                <input className="form-field" name="phone" placeholder={t.consultation.placeholders.phone} />
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-xs font-black uppercase">
                {t.consultation.fields.interest}
                <select className="form-field" name="service" defaultValue="">
                  <option value="" disabled>
                    {t.consultation.placeholders.service}
                  </option>
                  {t.consultation.services.map((service) => (
                    <option key={service}>{service}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-xs font-black uppercase">
                {t.consultation.fields.channel}
                <select className="form-field" name="channel" defaultValue="">
                  <option value="" disabled>
                    {t.consultation.placeholders.channel}
                  </option>
                  {t.consultation.channels.map((channel) => (
                    <option key={channel}>{channel}</option>
                  ))}
                </select>
              </label>
            </div>
            <label className="grid gap-2 text-xs font-black uppercase">
              {t.consultation.fields.message}
              <textarea
                className="form-field min-h-32 resize-none"
                name="message"
                placeholder={t.consultation.placeholders.message}
              />
            </label>
            <button className="button-primary mt-2 w-full" type="button">
              {t.consultation.submit}
              <CalendarDays size={16} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function ShopSection({ t }: { t: HomeDictionary }) {
  return (
    <section id="shop" className="bg-[#241b18] py-24 md:py-32">
      <div className="section-shell">
        <div className="mx-auto max-w-4xl text-center">
          <p className="eyebrow text-[#d9c1ad]">{t.shop.eyebrow}</p>
          <h2 className="font-display mt-4 text-5xl md:text-7xl">
            {t.shop.titleA} <span className="gold-text">{t.shop.titleB}</span> {t.shop.titleC}
          </h2>
          <p className="mt-6 text-lg italic text-[#d9d0c9]">{t.shop.intro}</p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {t.shop.products.map((product, index) => (
            <article key={product.name} className="group">
              <div className="relative aspect-square overflow-hidden rounded-lg border border-white/10 bg-white">
                <Image
                  src="/images/shop-products.jpg"
                  alt={product.name}
                  fill
                  sizes="280px"
                  className="object-cover transition duration-500 group-hover:scale-105"
                  style={{
                    objectPosition: `${18 + index * 20}% center`,
                  }}
                />
              </div>
              <h3 className="font-display mt-5 text-2xl">{product.name}</h3>
              <p className="mt-3 min-h-16 text-sm leading-7 text-[#d9d0c9]">{product.description}</p>
              <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-5">
                <a className="text-xs font-black uppercase hover:text-[#dec47b]" href="#consult">
                  {t.common.inquire}
                </a>
                <Sparkles size={18} className="text-[#e38aa0]" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogSection({ t }: { t: HomeDictionary }) {
  return (
    <section id="blog" className="py-24 md:py-32">
      <div className="section-shell">
        <div className="mx-auto max-w-4xl text-center">
          <p className="eyebrow text-[#d9c1ad]">{t.blog.eyebrow}</p>
          <h2 className="font-display mt-4 text-5xl md:text-7xl">
            {t.blog.titleA} <span className="block">{t.blog.titleB}</span>
          </h2>
        </div>
        <div className="mt-14 grid gap-7 lg:grid-cols-3">
          {t.blog.posts.map((post) => (
            <article key={post.title} className="group">
              <div className="relative aspect-[1.45] overflow-hidden rounded-lg border border-white/10">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <p className="eyebrow mt-6 text-[#e38aa0]">{post.category}</p>
              <h3 className="font-display mt-4 min-h-24 text-3xl leading-snug">{post.title}</h3>
              <a className="mt-6 inline-flex items-center gap-2 border-t border-white/10 pt-5 text-xs font-black uppercase hover:text-[#dec47b]" href="#blog">
                {t.common.readMore}
                <ArrowRight size={14} />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function NewsletterSection({ t }: { t: HomeDictionary }) {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <Image
        src="/images/newsletter.jpg"
        alt={t.newsletter.imageAlt}
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/55" />
      <div className="section-shell relative z-10 text-center">
        <span className="flower-mark mx-auto text-[#dec47b]" aria-hidden="true" />
        <h2 className="font-display mx-auto mt-7 max-w-4xl text-5xl leading-tight md:text-7xl">
          {t.newsletter.title}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl leading-8 text-[#d9d0c9]">{t.newsletter.body}</p>
        <form className="mx-auto mt-9 flex max-w-xl flex-col gap-3 sm:flex-row">
          <input className="form-field flex-1" name="email" placeholder={t.newsletter.placeholder} />
          <button className="button-primary sm:w-44" type="button">
            {t.newsletter.submit}
          </button>
        </form>
      </div>
    </section>
  );
}

function Footer({ t, locale }: { t: HomeDictionary; locale: Locale }) {
  return (
    <footer className="border-t border-white/10 bg-[#0d0b0c] py-16">
      <div className="section-shell">
        <nav className="mb-14 flex flex-wrap justify-center gap-8 text-xs font-black uppercase text-white/72">
          {t.nav.map((item) => (
            <a key={item.label} className="hover:text-[#dec47b]" href={item.href}>
              {item.label}
            </a>
          ))}
          <LanguageLink locale={locale} label={t.language.switchLabel} />
        </nav>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.1fr_0.8fr]">
          <div>
            <h3 className="font-display text-3xl">{t.footer.officeTitle}</h3>
            <p className="mt-6 leading-8 text-[#d9d0c9]">{t.footer.officeBody}</p>
            <div className="mt-6 flex items-start gap-3 text-sm text-[#b6aaa6]">
              <MapPin size={17} className="mt-1 text-[#dec47b]" />
              <span>{t.footer.officeNote}</span>
            </div>
          </div>
          <div className="text-center">
            <span className="flower-mark mx-auto text-[#dec47b]" aria-hidden="true" />
            <p className="font-display mt-5 text-5xl">BAKSAL BEAUTY</p>
            <p className="eyebrow mt-4 text-[#dec47b]">{t.footer.centerLabel}</p>
            <div className="mx-auto mt-8 max-w-xl border-t border-white/10 pt-8 text-sm leading-8 text-[#b6aaa6]">
              <p className="font-bold text-white">{t.footer.companyName}</p>
              <p>{t.footer.partnerLabel}</p>
              <p>{t.footer.registration}</p>
              <p>{t.footer.address}</p>
            </div>
          </div>
          <div>
            <h3 className="font-display text-3xl">{t.footer.contactsTitle}</h3>
            <div className="mt-6 space-y-4 text-sm font-bold">
              <a className="flex items-center gap-3 hover:text-[#dec47b]" href="tel:01030069310">
                <Phone size={17} />
                010 · 3006 · 9310
              </a>
              <a className="flex items-center gap-3 hover:text-[#dec47b]" href="mailto:milli@molluhub.com">
                <Mail size={17} />
                milli@molluhub.com
              </a>
            </div>
          </div>
        </div>
        <div className="mt-14 border-t border-white/10 pt-8 text-center text-xs text-[#b6aaa6]">
          {t.footer.copyright}
        </div>
      </div>
    </footer>
  );
}

function LanguageLink({ locale, label }: { locale: Locale; label: string }) {
  const alternateLocale = getAlternateLocale(locale);

  return (
    <a
      className="inline-flex items-center gap-2 text-xs font-black uppercase text-white/78 transition hover:text-[#dec47b]"
      href={`/${alternateLocale}`}
      aria-label={`Switch language to ${label}`}
    >
      <Languages size={14} />
      {localeLabels[alternateLocale]}
    </a>
  );
}
