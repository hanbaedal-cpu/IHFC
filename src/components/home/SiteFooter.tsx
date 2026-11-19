import type { Locale } from "@/lib/i18n/types";

export function SiteFooter({
  siteName,
  address,
  phone,
}: {
  siteName: string;
  address: string;
  phone: string;
  locale?: Locale;
}) {
  return (
    <footer className="rd-footer">
      <div className="rd-footer-inner">
        <div>
          <strong>{siteName}</strong>
          <p>
            {address} · 대표전화 {phone}
          </p>
        </div>
        <p>© {new Date().getFullYear()} KCOMWEL Incheon Hospital Funeral Center.</p>
      </div>
    </footer>
  );
}
