import type { Metadata } from "next";
import { defaultLocale, locales, type Locale } from "@/i18n/config";

export const siteName = "BAKSAL BEAUTY";
export const defaultSiteUrl = "https://www.bsclinic.xyz";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : defaultSiteUrl)
).replace(/\/+$/, "");

export const localizedKeywords: Record<Locale, string[]> = {
  ko: [
    "성형외과",
    "미용성형",
    "눈성형 상담",
    "코성형 상담",
    "리프팅",
    "쁘띠 시술",
    "피부 회복 관리",
    "성형 상담",
    "비회원 상담",
    "BAKSAL BEAUTY",
  ],
  en: [
    "plastic surgery clinic",
    "aesthetic medicine",
    "eye surgery consultation",
    "rhinoplasty consultation",
    "facial lifting",
    "non surgical aesthetics",
    "post treatment care",
    "Korean aesthetic clinic",
    "BAKSAL BEAUTY",
  ],
  zh: [
    "整形外科",
    "韩国整形咨询",
    "眼部整形",
    "鼻整形",
    "面部提升",
    "微整形",
    "皮肤恢复护理",
    "美容医学",
    "BAKSAL BEAUTY",
  ],
  ja: [
    "美容外科",
    "韓国美容外科",
    "目元整形",
    "鼻整形",
    "リフトアップ",
    "プチ整形",
    "美容医療",
    "術後ケア",
    "BAKSAL BEAUTY",
  ],
};

export const companySeoKeywords = [
  "럿지",
  "주식회사 럿지",
  "LUDGI",
  "LUDGI Inc.",
  "병원 홈페이지",
  "성형외과 홈페이지",
  "병원 홈페이지 제작",
  "성형외과 홈페이지 제작",
  "홈페이지 제작",
  "아웃소싱",
  "의료기관 홈페이지 제작",
  "피부과 홈페이지 제작",
  "병원 웹사이트 제작",
  "성형외과 웹사이트 제작",
  "Next.js 홈페이지 제작",
  "SEO 홈페이지 제작",
  "문의 전환 홈페이지",
  "병원 마케팅 홈페이지",
  "의료 홈페이지 외주",
  "소프트웨어 개발 파트너",
];

export const globalKeywords = Array.from(
  new Set([...locales.flatMap((locale) => localizedKeywords[locale]), ...companySeoKeywords]),
);

export const localeHreflangs: Record<Locale, string> = {
  ko: "ko-KR",
  en: "en-US",
  zh: "zh-CN",
  ja: "ja-JP",
};

export const openGraphLocales: Record<Locale, string> = {
  ko: "ko_KR",
  en: "en_US",
  zh: "zh_CN",
  ja: "ja_JP",
};

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${normalizedPath}`;
}

export function localizedPath(locale: Locale, path = "") {
  const normalizedPath = path ? `/${path.replace(/^\/+/, "")}` : "";
  return `/${locale}${normalizedPath}`;
}

export function localizedAbsoluteUrl(locale: Locale, path = "") {
  return absoluteUrl(localizedPath(locale, path));
}

export function languageAlternates(path = "") {
  return {
    ...Object.fromEntries(locales.map((locale) => [localeHreflangs[locale], localizedPath(locale, path)])),
    "x-default": localizedPath(defaultLocale, path),
  } satisfies Record<string, string>;
}

export function absoluteLanguageAlternates(path = "") {
  return Object.fromEntries(
    Object.entries(languageAlternates(path)).map(([locale, href]) => [locale, absoluteUrl(href)]),
  ) satisfies Record<string, string>;
}

export function pageAlternates(locale: Locale, path = ""): Metadata["alternates"] {
  return {
    canonical: localizedPath(locale, path),
    languages: languageAlternates(path),
  };
}

export function pageOpenGraph({
  locale,
  path = "",
  title,
  description,
  image = "/opengraph-image",
}: {
  locale: Locale;
  path?: string;
  title: string;
  description: string;
  image?: string;
}): Metadata["openGraph"] {
  return {
    type: "website",
    siteName,
    locale: openGraphLocales[locale],
    alternateLocale: locales.filter((item) => item !== locale).map((item) => openGraphLocales[item]),
    title,
    description,
    url: localizedPath(locale, path),
    images: [
      {
        url: image,
        width: 1200,
        height: 630,
        alt: `${siteName} - ${title}`,
      },
    ],
  };
}

export function keywordsFor(locale: Locale, extra: string[] = []) {
  return Array.from(new Set([...localizedKeywords[locale], ...extra.filter(Boolean)]));
}
