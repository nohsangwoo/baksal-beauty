import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { BriefcaseBusiness, FileText, GraduationCap, Video } from "lucide-react";
import { DoctorProfileCards } from "@/components/doctor-profile-modal";
import { PageShell } from "@/components/page-shell";
import { ContactSection, NewsletterSection } from "@/components/shared-sections";
import { getDoctorTeam } from "@/data/doctor-profiles";
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

  const team = getDoctorTeam(locale);

  return {
    title: team.metadataTitle,
    description: team.metadataDescription,
    keywords: keywordsFor(locale, ["의료진", "대표원장", "doctor profile", "medical team"]),
    alternates: pageAlternates(locale, "about"),
    openGraph: pageOpenGraph({
      locale,
      path: "about",
      title: team.metadataTitle,
      description: team.metadataDescription,
      image: "/images/clinic-interior.jpg",
    }),
  };
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const t = getDictionary(locale);
  const team = getDoctorTeam(locale);

  return (
    <PageShell
      locale={locale}
      t={t}
      eyebrow={team.heroEyebrow}
      title={team.heroTitle}
      description={team.heroDescription}
      image="/images/clinic-interior.jpg"
      imageAlt="BAKSAL BEAUTY clinic interior"
    >
      <section
        data-reveal-section=""
        id="medical-team"
        className="scroll-mt-24 bg-[#1f1715] py-24 md:py-32"
      >
        <div className="section-shell">
          <div className="mx-auto max-w-4xl text-center">
            <p className="eyebrow text-[#dec47b]">{team.teamEyebrow}</p>
            <h2 className="font-display mt-4 text-5xl leading-tight md:text-7xl">
              {team.teamTitle}
            </h2>
            <p className="mx-auto mt-6 max-w-2xl leading-8 text-[#d9d0c9]">
              {team.teamDescription}
            </p>
          </div>

          <article className="mt-16 grid min-h-[70svh] items-center gap-10 rounded-lg border border-white/10 bg-[#120d0e] p-5 md:p-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div
              data-magnetic=""
              data-magnetic-strength="5"
              className="relative min-h-[520px] overflow-hidden rounded-lg border border-white/10"
            >
              <Image
                src={team.representative.image}
                alt={team.representative.name}
                fill
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-7">
                <p className="eyebrow text-[#dec47b]">{team.representativeBadge}</p>
                <h3 className="font-display mt-3 text-4xl text-white">
                  {team.representative.name}
                </h3>
                <p className="mt-2 text-sm font-bold text-[#e38aa0]">
                  {team.representative.role}
                </p>
              </div>
            </div>

            <div>
              <p className="eyebrow text-[#dec47b]">{team.representativeBadge}</p>
              <h3 className="font-display mt-4 text-5xl leading-tight text-white md:text-6xl">
                {team.representative.name}
              </h3>
              <p className="mt-6 max-w-3xl text-lg leading-9 text-[#d9d0c9]">
                {team.representative.summary}
              </p>
              <div className="mt-10 grid gap-5 md:grid-cols-2">
                <ProfileList
                  icon={<GraduationCap size={18} />}
                  title={team.labels.education}
                  items={team.representative.education}
                />
                <ProfileList
                  icon={<BriefcaseBusiness size={18} />}
                  title={team.labels.career}
                  items={team.representative.career}
                />
                <ProfileList
                  icon={<FileText size={18} />}
                  title={team.labels.publications}
                  items={team.representative.publications}
                />
                <ProfileList
                  icon={<Video size={18} />}
                  title={team.labels.liveSurgery}
                  items={team.representative.liveSurgery}
                />
              </div>
            </div>
          </article>
        </div>
      </section>

      <section data-reveal-section="" className="border-y border-white/10 bg-[#241b18] py-24 md:py-32">
        <div className="section-shell">
          <div className="max-w-3xl">
            <p className="eyebrow text-[#dec47b]">{team.teamEyebrow}</p>
            <h2 className="font-display mt-4 text-5xl leading-tight md:text-7xl">
              {team.otherDoctorsTitle}
            </h2>
            <p className="mt-6 leading-8 text-[#d9d0c9]">{team.otherDoctorsDescription}</p>
          </div>
          <DoctorProfileCards doctors={team.otherDoctors} labels={team.labels} />
        </div>
      </section>

      <ContactSection t={t} locale={locale} />
      <NewsletterSection t={t} />
    </PageShell>
  );
}

function ProfileList({
  icon,
  title,
  items,
}: {
  icon: ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
      <h4 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.14em] text-[#dec47b]">
        {icon}
        {title}
      </h4>
      <ul className="mt-5 space-y-3 text-sm leading-7 text-[#d9d0c9]">
        {items.map((item) => (
          <li key={item} className="border-t border-white/10 pt-3 first:border-t-0 first:pt-0">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
