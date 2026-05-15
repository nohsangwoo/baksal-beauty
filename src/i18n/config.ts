export const locales = ["ko", "en", "zh", "ja"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ko";

export const localeLabels: Record<Locale, string> = {
  ko: "KR",
  en: "EN",
  zh: "CN",
  ja: "JP",
};

export const localeNames: Record<Locale, string> = {
  ko: "한국어",
  en: "English",
  zh: "中文",
  ja: "日本語",
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getOtherLocales(locale: Locale): Locale[] {
  return locales.filter((item) => item !== locale);
}
