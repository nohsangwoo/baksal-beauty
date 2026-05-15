"use client";

import { useEffect, useState } from "react";
import { Languages, Phone } from "lucide-react";
import {
  getOtherLocales,
  localeLabels,
  localeNames,
  type Locale,
} from "@/i18n/config";
import type { HomeDictionary } from "@/i18n/dictionaries";

type SiteHeaderProps = {
  t: HomeDictionary;
  locale: Locale;
};

type LanguageLinksProps = {
  locale: Locale;
  ariaLabel: string;
};

export function SiteHeader({ t, locale }: SiteHeaderProps) {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setCompact(window.scrollY > 48);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
        compact
          ? "top-0 border-b border-white/10 bg-[#0d0b0c]/88 shadow-2xl shadow-black/30 backdrop-blur-xl"
          : "top-8 bg-transparent"
      }`}
    >
      <div
        className={`section-shell flex items-center justify-between transition-all duration-300 ${
          compact ? "h-16" : "h-24"
        }`}
      >
        <a
          href={`/${locale}`}
          className="flex min-w-0 items-center gap-3"
          aria-label={t.common.brandHome}
        >
          <span
            className={`flower-mark shrink-0 text-[#dec47b] transition-all duration-300 ${
              compact ? "h-4" : "h-5"
            }`}
            aria-hidden="true"
          />
          <span
            className={`font-display truncate font-semibold transition-all duration-300 ${
              compact ? "text-xl md:text-2xl" : "text-2xl md:text-3xl"
            }`}
          >
            BAKSAL BEAUTY
          </span>
        </a>

        <nav className="hidden items-center gap-7 text-xs font-black uppercase text-white/84 lg:flex">
          {t.nav.map((item) => (
            <a key={item.label} className="transition hover:text-[#dec47b]" href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageLinks locale={locale} ariaLabel={t.language.switchLabel} />
          <a className="button-outline header-consult" href="#consult">
            <Phone size={15} />
            {t.common.phoneCta}
          </a>
        </div>
      </div>
    </header>
  );
}

export function LanguageLinks({ locale, ariaLabel }: LanguageLinksProps) {
  return (
    <div
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-2 text-[0.68rem] font-black uppercase text-white/78 backdrop-blur transition hover:border-[#dec47b]/50"
      aria-label={ariaLabel}
    >
      <Languages size={13} className="text-[#dec47b]" aria-hidden="true" />
      {getOtherLocales(locale).map((targetLocale) => (
        <a
          key={targetLocale}
          className="transition hover:text-[#dec47b]"
          href={`/${targetLocale}`}
          aria-label={`${ariaLabel}: ${localeNames[targetLocale]}`}
        >
          {localeLabels[targetLocale]}
        </a>
      ))}
    </div>
  );
}
