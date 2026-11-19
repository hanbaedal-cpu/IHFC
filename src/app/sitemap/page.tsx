import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import { getSiteSettings } from "@/models/SiteSettings";
import { PublicShell } from "@/components/home/PublicShell";
import { SiteFooter } from "@/components/home/SiteFooter";
import { getLocale } from "@/lib/i18n/locale";
import { t } from "@/lib/i18n/dictionaries";
import { localizeSettings } from "@/lib/i18n/content";
import { NAV_ITEMS } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function SitemapPage() {
  await connectDB();
  const locale = await getLocale();
  const settings = await localizeSettings(await getSiteSettings(), locale);

  const sections = [
    {
      title: t(locale, "sitemap.section.main"),
      links: [{ href: "/", label: t(locale, "sitemap.home") }],
    },
    {
      title: t(locale, "sitemap.section.menus"),
      links: [
        ...NAV_ITEMS.map((item) => ({
          href: item.href,
          label: t(locale, `nav.${item.key}`),
        })),
        { href: "/sitemap", label: t(locale, "nav.sitemap") },
      ],
    },
    {
      title: t(locale, "sitemap.section.service"),
      links: [
        { href: "/rooms", label: t(locale, "nav.memorialWrite") },
        { href: "/guest/login", label: t(locale, "nav.guestLogin") },
        { href: "/#top", label: t(locale, "nav.consult24") },
      ],
    },
    {
      title: t(locale, "sitemap.section.admin"),
      links: [{ href: "/admin/login", label: t(locale, "nav.adminLogin") }],
    },
  ];

  return (
    <main>
      <PublicShell settings={settings} activePath="/sitemap" locale={locale}>
        <section className="section sitemap-section">
          <div className="container">
            <div className="section-label">SITEMAP</div>
            <h1
              style={{
                fontFamily: "var(--font-display), serif",
                color: "var(--green-900)",
              }}
            >
              {t(locale, "sitemap.title")}
            </h1>
            <p className="section-lead">{t(locale, "sitemap.home")}</p>

            <div className="sitemap-grid">
              {sections.map((section) => (
                <article key={section.title} className="sitemap-group">
                  <h2>{section.title}</h2>
                  <ul>
                    {section.links.map((link) => (
                      <li key={link.href + link.label}>
                        <Link href={link.href}>{link.label}</Link>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>
        <SiteFooter
          siteName={settings.siteName}
          address={settings.address || ""}
          phone={settings.phone || "032-500-0444"}
          locale={locale}
        />
      </PublicShell>
    </main>
  );
}
