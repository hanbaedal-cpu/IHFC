import { NextResponse } from "next/server";
import { LOCALE_COOKIE, LOCALES, type Locale } from "@/lib/i18n/types";

export async function POST(request: Request) {
  const body = await request.json();
  const locale = body.locale as Locale;
  if (!LOCALES.includes(locale)) {
    return NextResponse.json({ error: "invalid locale" }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true, locale });
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return response;
}
