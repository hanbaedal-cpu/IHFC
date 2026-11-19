export type Locale = "ko" | "en" | "zh";

export const LOCALES: Locale[] = ["ko", "en", "zh"];

export const LOCALE_META: Record<
  Locale,
  { label: string; flag: string; short: string }
> = {
  ko: { label: "한국어", flag: "🇰🇷", short: "KR" },
  en: { label: "English", flag: "🇺🇸", short: "US" },
  zh: { label: "中文", flag: "🇨🇳", short: "CN" },
};

export const LOCALE_COOKIE = "ihfc_locale";
