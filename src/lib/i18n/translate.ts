import { createHash } from "crypto";
import { connectDB } from "@/lib/mongodb";
import { TranslationCache } from "@/models/TranslationCache";
import type { Locale } from "./types";

function hashSource(source: string) {
  return createHash("sha1").update(source).digest("hex");
}

async function fetchMyMemory(text: string, locale: "en" | "zh") {
  const langpair = locale === "en" ? "ko|en" : "ko|zh-CN";
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langpair}`;
  const res = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok) return text;
  const data = await res.json();
  return (data?.responseData?.translatedText as string) || text;
}

export async function translateText(text: string, locale: Locale) {
  const source = (text || "").trim();
  if (!source || locale === "ko") return source;

  try {
    await connectDB();
    const sourceHash = hashSource(source);
    const cached = await TranslationCache.findOne({ sourceHash, locale });
    if (cached?.translated) return cached.translated;

    const translated = await fetchMyMemory(source, locale);
    await TranslationCache.findOneAndUpdate(
      { sourceHash, locale },
      { source, translated },
      { upsert: true, new: true }
    );
    return translated;
  } catch (error) {
    console.error("translate failed", error);
    return source;
  }
}

export async function translateMany(values: string[], locale: Locale) {
  return Promise.all(values.map((value) => translateText(value, locale)));
}
