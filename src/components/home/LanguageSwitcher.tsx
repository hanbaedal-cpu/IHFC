"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { LOCALE_META, type Locale } from "@/lib/i18n/types";

const FLAG_SRC: Record<Locale, string> = {
  ko: "https://flagcdn.com/w40/kr.png",
  en: "https://flagcdn.com/w40/us.png",
  zh: "https://flagcdn.com/w40/cn.png",
};

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  async function setLocale(next: Locale) {
    if (next === locale || pending) return;
    await fetch("/api/locale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale: next }),
    });
    startTransition(() => router.refresh());
  }

  return (
    <div className="lang-switcher" aria-label="Language">
      {(Object.keys(LOCALE_META) as Locale[]).map((code) => {
        const meta = LOCALE_META[code];
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            title={meta.label}
            className={`lang-btn${active ? " active" : ""}`}
            aria-pressed={active}
            disabled={pending}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={FLAG_SRC[code]} alt="" width={22} height={15} />
            <span className="lang-code">{meta.short}</span>
          </button>
        );
      })}
    </div>
  );
}
