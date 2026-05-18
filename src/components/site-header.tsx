"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChevronDown, Languages } from "lucide-react";
import { AuthMenu } from "@/components/auth-menu";
import { ANNOUNCEMENT_VISIBILITY_EVENT } from "@/components/home-announcement";
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
  hasAnnouncementOffset?: boolean;
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
const pageRouteSegments = ["about", "service", "blog", "inquire"] as const;

export function SiteHeader({ t, locale, hasAnnouncementOffset = false }: SiteHeaderProps) {
  const [compact, setCompact] = useState(false);
  const [transitionsEnabled, setTransitionsEnabled] = useState(false);
  const [homeMenuOpen, setHomeMenuOpen] = useState(false);
  const [announcementVisible, setAnnouncementVisible] = useState(hasAnnouncementOffset);
  const homeMenuRef = useRef<HTMLDivElement>(null);
  const homeMenuCloseTimerRef = useRef<number | null>(null);
  const transitionFrameRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    const initialScrollSnapshot = getInitialScrollSnapshot();
    let shouldCompact = window.scrollY > 48;

    if (initialScrollSnapshot.restore) {
      window.sessionStorage.removeItem(SCROLL_RESTORE_KEY);

      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const targetY = Number.isFinite(initialScrollSnapshot.ratio)
        ? maxScroll * Number(initialScrollSnapshot.ratio)
        : Number(initialScrollSnapshot.y) || 0;

      window.scrollTo(0, targetY);
      shouldCompact = targetY > 48;
    }

    const compactFrame = window.requestAnimationFrame(() => {
      setCompact(shouldCompact);
    });
    const firstFrame = window.requestAnimationFrame(() => {
      const secondFrame = window.requestAnimationFrame(() => {
        setTransitionsEnabled(true);
      });

      transitionFrameRef.current = secondFrame;
    });

    return () => {
      window.cancelAnimationFrame(compactFrame);
      window.cancelAnimationFrame(firstFrame);

      if (transitionFrameRef.current) {
        window.cancelAnimationFrame(transitionFrameRef.current);
        transitionFrameRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setCompact(window.scrollY > 48);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!hasAnnouncementOffset) {
      return;
    }

    const handleAnnouncementVisibility = (event: Event) => {
      const { visible } = (event as CustomEvent<{ visible?: boolean }>).detail ?? {};
      setAnnouncementVisible(Boolean(visible));
    };

    window.addEventListener(ANNOUNCEMENT_VISIBILITY_EVENT, handleAnnouncementVisibility);

    return () => {
      window.removeEventListener(ANNOUNCEMENT_VISIBILITY_EVENT, handleAnnouncementVisibility);
    };
  }, [hasAnnouncementOffset]);

  useEffect(() => {
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!homeMenuRef.current?.contains(event.target as Node)) {
        setHomeMenuOpen(false);
      }
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setHomeMenuOpen(false);
      }
    };

    window.addEventListener("pointerdown", closeOnOutsideClick);
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      window.removeEventListener("pointerdown", closeOnOutsideClick);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const shellTransitionClass = transitionsEnabled
    ? "transition-all duration-300 ease-out"
    : "transition-none";
  const headerTransitionClass = transitionsEnabled
    ? "transition-[top,background-color,box-shadow,backdrop-filter] duration-300 ease-out"
    : "transition-none";
  const homeSectionLinks = [
    { label: "Hero", href: `/${locale}` },
    { label: t.philosophy.eyebrow, href: `/${locale}#about` },
    { label: t.services.eyebrow, href: `/${locale}#services` },
    { label: t.popular.eyebrow, href: `/${locale}#popular` },
    { label: t.comparison.eyebrow, href: `/${locale}#compare` },
    { label: t.doctors.eyebrow, href: `/${locale}#doctors` },
    { label: t.guide.eyebrow, href: `/${locale}#guide` },
    { label: t.consultation.eyebrow, href: `/${locale}#consult` },
    { label: t.shop.eyebrow, href: `/${locale}#shop` },
    { label: t.blog.eyebrow, href: `/${locale}#blog` },
    { label: "Contact", href: `/${locale}#contact` },
  ];
  const openHomeMenu = () => {
    if (homeMenuCloseTimerRef.current) {
      window.clearTimeout(homeMenuCloseTimerRef.current);
      homeMenuCloseTimerRef.current = null;
    }

    setHomeMenuOpen(true);
  };
  const closeHomeMenuSoon = () => {
    if (homeMenuCloseTimerRef.current) {
      window.clearTimeout(homeMenuCloseTimerRef.current);
    }

    homeMenuCloseTimerRef.current = window.setTimeout(() => {
      setHomeMenuOpen(false);
      homeMenuCloseTimerRef.current = null;
    }, 120);
  };
  const shouldOffsetForAnnouncement = hasAnnouncementOffset && announcementVisible && !compact;

  return (
    <header
      className={`fixed left-0 right-0 z-50 overflow-visible ${headerTransitionClass} ${
        compact
          ? "top-0 bg-[#0d0b0c]/90 shadow-[0_18px_50px_rgba(0,0,0,0.34)] backdrop-blur-xl"
          : `${shouldOffsetForAnnouncement ? "top-8" : "top-0"} bg-transparent shadow-none backdrop-blur-0`
      }`}
    >
      <div
        className={`section-shell flex items-center justify-between ${shellTransitionClass} ${
          compact ? "h-16" : "h-24"
        }`}
      >
        <Link
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
        </Link>

        <nav className="hidden items-center gap-7 text-xs font-black uppercase text-white/84 lg:flex">
          <div
            ref={homeMenuRef}
            className="relative"
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                setHomeMenuOpen(false);
              }
            }}
            onMouseEnter={openHomeMenu}
            onMouseLeave={closeHomeMenuSoon}
          >
            <button
              aria-expanded={homeMenuOpen}
              aria-haspopup="menu"
              className="inline-flex items-center gap-1.5 transition hover:text-[#dec47b]"
              onClick={() => setHomeMenuOpen((isOpen) => !isOpen)}
              onFocus={openHomeMenu}
              type="button"
            >
              Home
              <ChevronDown
                size={13}
                className={`transition ${homeMenuOpen ? "rotate-180" : ""}`}
              />
            </button>
            <div
              className={`absolute left-1/2 top-full mt-3 w-64 -translate-x-1/2 rounded-lg border border-white/10 bg-[#0d0b0c]/95 p-2 shadow-[0_24px_80px_rgba(0,0,0,0.42)] backdrop-blur-xl transition duration-200 ${
                homeMenuOpen
                  ? "pointer-events-auto translate-y-0 opacity-100"
                  : "pointer-events-none translate-y-2 opacity-0"
              }`}
              role="menu"
            >
              {homeSectionLinks.map((item) => (
                <Link
                  key={item.href}
                  className="block rounded-md px-3 py-2.5 text-[0.68rem] text-white/72 transition hover:bg-white/8 hover:text-[#dec47b]"
                  href={item.href}
                  onClick={() => setHomeMenuOpen(false)}
                  role="menuitem"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {t.nav.map((item, index) => (
            <Link
              key={item.label}
              className="transition hover:text-[#dec47b]"
              href={`/${locale}/${pageRouteSegments[index] ?? ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageLinks locale={locale} ariaLabel={t.language.switchLabel} />
          <AuthMenu locale={locale} />
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
