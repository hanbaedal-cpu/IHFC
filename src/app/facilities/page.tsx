import { connectDB } from "@/lib/mongodb";
import { getSiteSettings } from "@/models/SiteSettings";
import { getPageContent } from "@/models/PageContent";
import { FACILITIES } from "@/lib/site-content";
import { PublicShell } from "@/components/home/PublicShell";
import { SiteFooter } from "@/components/home/SiteFooter";
import { FacilityGallery } from "@/components/home/FacilityGallery";
import { getLocale } from "@/lib/i18n/locale";
import { t } from "@/lib/i18n/dictionaries";
import {
  localizeList,
  localizePageContent,
  localizeSettings,
} from "@/lib/i18n/content";

export const dynamic = "force-dynamic";

export default async function FacilitiesPage() {
  await connectDB();
  const locale = await getLocale();
  const [settingsRaw, pageRaw] = await Promise.all([
    getSiteSettings(),
    getPageContent("facilities"),
  ]);
  const [settings, page, facilities] = await Promise.all([
    localizeSettings(settingsRaw, locale),
    localizePageContent(pageRaw, locale),
    localizeList([...FACILITIES], ["name", "size", "desc"], locale),
  ]);

  return (
    <main>
      <PublicShell settings={settings} activePath="/facilities" locale={locale}>
        <section className="section" style={{ background: "#fff" }}>
          <div className="container">
            <div className="section-label">{t(locale, "facilities.label")}</div>
            <h1
              style={{
                fontFamily: "var(--font-display), serif",
                color: "var(--green-900)",
                marginTop: 0,
              }}
            >
              {page.title || t(locale, "facilities.title")}
            </h1>
            <p className="section-lead">
              {page.body || t(locale, "facilities.lead")}
            </p>
            <p style={{ color: "var(--muted)", fontSize: "0.92rem" }}>
              {t(locale, "facilities.click")}
            </p>
            <FacilityGallery facilities={facilities} />
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
