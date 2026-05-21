import Image from "next/image";
import Link from "next/link";
import { FloatingContactActions } from "@/components/contact-actions";
import { PageMotion } from "@/components/page-motion";
import { LanguageLinks, SiteHeader } from "@/components/site-header";
import type { Locale } from "@/i18n/config";
import type { HomeDictionary } from "@/i18n/dictionaries";

type PageShellProps = {
  locale: Locale;
  t: HomeDictionary;
  eyebrow: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  children: React.ReactNode;
};

const footerRoutes = ["about", "service", "blog", "inquire"];

export function PageShell({
  locale,
  t,
  eyebrow,
  title,
  description,
  image = "/images/clinic-interior.jpg",
  imageAlt = "BAKSAL BEAUTY clinic",
  children,
}: PageShellProps) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#1f1715] text-[#fff8ef]">
      <SiteHeader key={locale} t={t} locale={locale} />
      <PageMotion />
      <FloatingContactActions inquiryCopy={t.consultation} locale={locale} />
      <section
        data-reveal-section=""
        className="relative grid min-h-[62svh] items-center overflow-hidden border-b border-white/10 py-28 pt-36 md:min-h-[72svh] md:py-36 md:pt-40"
      >
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/62" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#170c10]/90 via-[#3b0719]/35 to-black/30" />
        <div className="section-shell relative z-10 max-w-5xl">
          <p className="eyebrow text-[#dec47b]">{eyebrow}</p>
          <h1 className="font-display mt-5 max-w-4xl text-6xl leading-none md:text-8xl">
            {title}
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-9 text-[#d9d0c9]">{description}</p>
        </div>
      </section>
      {children}
      <footer className="border-t border-white/10 bg-[#0d0b0c] py-12">
        <div className="section-shell flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
          <Link className="font-display text-3xl hover:text-[#dec47b]" href={`/${locale}`}>
            BAKSAL BEAUTY
          </Link>
          <nav className="flex flex-wrap justify-center gap-5 text-xs font-black uppercase text-white/72">
            <Link className="hover:text-[#dec47b]" href={`/${locale}`}>
              Home
            </Link>
            {t.nav.map((item, index) => (
              <Link
                key={item.label}
                className="hover:text-[#dec47b]"
                href={`/${locale}/${footerRoutes[index] ?? ""}`}
              >
                {item.label}
              </Link>
            ))}
            <Link className="hover:text-[#dec47b]" href={`/${locale}/company`}>
              Company
            </Link>
            <LanguageLinks locale={locale} ariaLabel={t.language.switchLabel} />
          </nav>
        </div>
      </footer>
    </main>
  );
}
