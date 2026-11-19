import Link from "next/link";

export function SiteFooter({
  siteName,
  address,
  phone,
}: {
  siteName: string;
  address: string;
  phone: string;
}) {
  const tel = phone.replace(/\D/g, "");
  return (
    <footer className="site-footer">
      <div className="container site-footer-inner">
        <div className="site-footer-copy">
          <strong>{siteName}</strong>
          <p>
            {address} · 대표전화 {phone}
          </p>
          <p className="site-footer-year">
            © {new Date().getFullYear()} KCOMWEL Incheon Hospital Funeral Center.
          </p>
        </div>
        <div className="site-footer-actions">
          <a href={`tel:${tel}`}>24시간 상담 {phone}</a>
          <Link href="/guest/login">유가족 추모글</Link>
        </div>
      </div>
    </footer>
  );
}
