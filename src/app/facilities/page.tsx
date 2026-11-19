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
        <section className="rd-section rd-facilities">
          <div className="rd-wrap">
            <p className="rd-label">{t(locale, "facilities.label")}</p>
            <h1 className="rd-title">
              {page.title || t(locale, "facilities.title")}
            </h1>
            <p className="rd-lead" style={{ marginInline: "auto", maxWidth: "40rem" }}>
              {page.body || t(locale, "facilities.lead")}
            </p>
            <p style={{ marginTop: "0.5rem", color: "var(--rd-text-muted)", fontSize: "0.86rem" }}>
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
