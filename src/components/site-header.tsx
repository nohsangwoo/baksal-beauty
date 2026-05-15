"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import { Languages, Phone } from "lucide-react";
import {
  getOtherLocales,
  isLocale,
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

type ScrollRestoreSnapshot = {
  compact: boolean;
  restore: boolean;
  ratio?: number;
  y?: number;
};

const SCROLL_RESTORE_KEY = "baksal-beauty:locale-scroll";

export function SiteHeader({ t, locale }: SiteHeaderProps) {
  const [initialScrollSnapshot] = useState(getInitialScrollSnapshot);
  const [compact, setCompact] = useState(initialScrollSnapshot.compact);
  const [transitionsEnabled, setTransitionsEnabled] = useState(
    !initialScrollSnapshot.restore,
  );

  useLayoutEffect(() => {
    if (!initialScrollSnapshot.restore) {
      return;
    }

    window.sessionStorage.removeItem(SCROLL_RESTORE_KEY);

    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const targetY = Number.isFinite(initialScrollSnapshot.ratio)
      ? maxScroll * Number(initialScrollSnapshot.ratio)
      : Number(initialScrollSnapshot.y) || 0;

    window.scrollTo(0, targetY);
  }, [initialScrollSnapshot]);

  useEffect(() => {
    if (transitionsEnabled) {
      return;
    }

    const transitionFrame = window.requestAnimationFrame(() => {
      setTransitionsEnabled(true);
    });

    return () => window.cancelAnimationFrame(transitionFrame);
  }, [transitionsEnabled]);

  useEffect(() => {
    const handleScroll = () => {
      setCompact(window.scrollY > 48);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const shellTransitionClass = transitionsEnabled
    ? "transition-all duration-300 ease-out"
    : "transition-none";
  const headerTransitionClass = transitionsEnabled
    ? "transition-[top,background-color,box-shadow,backdrop-filter] duration-300 ease-out"
    : "transition-none";

  return (
    <header
      className={`fixed left-0 right-0 z-50 overflow-hidden ${headerTransitionClass} ${
        compact
          ? "top-0 bg-[#0d0b0c]/90 shadow-[0_18px_50px_rgba(0,0,0,0.34)] backdrop-blur-xl"
          : "top-8 bg-transparent shadow-none backdrop-blur-0"
      }`}
    >
      <div
        className={`section-shell flex items-center justify-between ${shellTransitionClass} ${
          compact ? "h-16" : "h-24"
        }`}
      >
        <a
          href={`/${locale}`}
          className="flex min-w-0 items-center gap-3"
          aria-label={t.common.brandHome}
        >
          <span
            className={`flower-mark shrink-0 text-[#dec47b] ${shellTransitionClass} ${
              compact ? "h-4" : "h-5"
            }`}
            aria-hidden="true"
          />
          <span
            className={`font-display truncate font-semibold ${shellTransitionClass} ${
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
  const pathname = usePathname();

  return (
    <div
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-2 text-[0.68rem] font-black uppercase text-white/78 backdrop-blur transition hover:border-[#dec47b]/50"
      aria-label={ariaLabel}
    >
      <Languages size={13} className="text-[#dec47b]" aria-hidden="true" />
      {getOtherLocales(locale).map((targetLocale) => (
        <Link
          key={targetLocale}
          className="transition hover:text-[#dec47b]"
          href={buildLocaleHref(pathname, targetLocale)}
          scroll={false}
          onClick={saveScrollPosition}
          aria-label={`${ariaLabel}: ${localeNames[targetLocale]}`}
        >
          {localeLabels[targetLocale]}
        </Link>
      ))}
    </div>
  );
}

function buildLocaleHref(pathname: string, targetLocale: Locale) {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length > 0 && isLocale(segments[0])) {
    segments[0] = targetLocale;
  } else {
    segments.unshift(targetLocale);
  }

  return `/${segments.join("/")}`;
}

function saveScrollPosition() {
  const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const ratio = window.scrollY / maxScroll;

  window.sessionStorage.setItem(
    SCROLL_RESTORE_KEY,
    JSON.stringify({
      ratio,
      y: window.scrollY,
    }),
  );
}

function getInitialScrollSnapshot(): ScrollRestoreSnapshot {
  if (typeof window === "undefined") {
    return {
      compact: false,
      restore: false,
    };
  }

  const rawPosition = window.sessionStorage.getItem(SCROLL_RESTORE_KEY);

  if (!rawPosition) {
    return {
      compact: window.scrollY > 48,
      restore: false,
    };
  }

  try {
    const { ratio, y } = JSON.parse(rawPosition) as { ratio?: number; y?: number };
    const savedY = Number(y) || 0;
    const savedRatio = Number(ratio);

    return {
      compact: savedY > 48 || savedRatio > 0.01,
      restore: true,
      ratio: savedRatio,
      y: savedY,
    };
  } catch {
    return {
      compact: window.scrollY > 48,
      restore: false,
    };
  }
}
