import Link from "next/link";
import { t } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/types";

export function SiteFooter({
  siteName,
  address,
  phone,
  locale = "ko",
}: {
  siteName: string;
  address: string;
  phone: string;
  locale?: Locale;
}) {
  const tel = phone.replace(/\D/g, "");
  return (
    <footer className="site-footer">
      <div className="container site-footer-inner">
        <div className="site-footer-copy">
          <strong>{siteName}</strong>
          <p>
            {address} · {phone}
          </p>
          <p className="site-footer-year">
            © {new Date().getFullYear()} KCOMWEL Incheon Hospital Funeral Center.
          </p>
        </div>
        <div className="site-footer-actions">
          <a href={`tel:${tel}`}>
            {t(locale, "footer.consult")} {phone}
          </a>
          <Link href="/guest/login">{t(locale, "footer.memorial")}</Link>
          <Link href="/sitemap">{t(locale, "nav.sitemap")}</Link>
        </div>
      </div>
    </footer>
  );
}
