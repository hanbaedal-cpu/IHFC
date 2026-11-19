import type { Locale } from "./types";
import { translateMany, translateText } from "./translate";

type SettingsLike = {
  siteName: string;
  notice?: string;
  address?: string;
  heroEyebrow?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  aboutTitle?: string;
  aboutBody?: string;
  [key: string]: unknown;
};

export async function localizePlain(text: string | undefined | null, locale: Locale) {
  if (!text) return "";
  return translateText(text, locale);
}

export async function localizeSettings<T extends SettingsLike>(settings: T, locale: Locale) {
  if (locale === "ko") return settings;

  const keys = [
    "siteName",
    "notice",
    "address",
    "heroEyebrow",
    "heroTitle",
    "heroSubtitle",
    "aboutTitle",
    "aboutBody",
  ] as const;

  const sources = keys.map((key) => String(settings[key] || ""));
  const translated = await translateMany(sources, locale);
  const next = { ...settings };
  keys.forEach((key, index) => {
    if (sources[index]) {
      (next as Record<string, unknown>)[key] = translated[index];
    }
  });
  return next;
}

export async function localizePageContent(
  page: { title?: string; body?: string },
  locale: Locale
) {
  if (locale === "ko") return page;
  const [title, body] = await translateMany(
    [page.title || "", page.body || ""],
    locale
  );
  return { ...page, title, body };
}

export async function localizeList<T extends Record<string, unknown>>(
  items: T[],
  fields: (keyof T)[],
  locale: Locale
) {
  if (locale === "ko") return items;
  return Promise.all(
    items.map(async (item) => {
      const next = { ...item };
      for (const field of fields) {
        const value = item[field];
        if (typeof value === "string" && value) {
          (next as Record<string, unknown>)[field as string] = await translateText(
            value,
            locale
          );
        }
        if (Array.isArray(value) && value.every((v) => typeof v === "string")) {
          (next as Record<string, unknown>)[field as string] = await translateMany(
            value as string[],
            locale
          );
        }
      }
      return next;
    })
  );
}
