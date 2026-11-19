import { connectDB } from "@/lib/mongodb";
import { getSiteSettings } from "@/models/SiteSettings";
import { getPageContent } from "@/models/PageContent";
import { GUIDE_STEPS } from "@/lib/site-content";
import { PublicShell } from "@/components/home/PublicShell";
import { SiteFooter } from "@/components/home/SiteFooter";
import { getLocale } from "@/lib/i18n/locale";
import { t } from "@/lib/i18n/dictionaries";
import {
  localizeList,
  localizePageContent,
  localizeSettings,
} from "@/lib/i18n/content";

export const dynamic = "force-dynamic";

const GUIDE_ICONS = ["☎", "📄", "🏠", "🚗", "⚱"];

export default async function GuidePage() {
  await connectDB();
  const locale = await getLocale();
  const [settingsRaw, pageRaw] = await Promise.all([
    getSiteSettings(),
    getPageContent("guide"),
  ]);
  const [settings, page, guideSteps] = await Promise.all([
    localizeSettings(settingsRaw, locale),
    localizePageContent(pageRaw, locale),
    localizeList([...GUIDE_STEPS], ["meta", "title", "items"], locale),
  ]);
  const phone = settings.phone || "032-500-0444";
  const tel = phone.replace(/\D/g, "");

  return (
    <main>
      <PublicShell settings={settings} activePath="/guide" locale={locale}>
        <section className="page-section guide-page">
          <div className="container guide-inner">
            <div className="section-label">{t(locale, "guide.label")}</div>
            <h1 className="page-title">
              {page.title || t(locale, "guide.title")}
            </h1>
            <p className="page-lead">{page.body || t(locale, "guide.lead")}</p>

            <div className="guide-steps">
              {guideSteps.map((step, index) => (
                <article key={step.title} className="guide-step">
                  <div className="guide-step-icon" aria-hidden>
                    {GUIDE_ICONS[index] || "·"}
                  </div>
                  <div className="guide-step-body">
                    <div className="guide-step-meta">{step.meta}</div>
                    <h2>{step.title}</h2>
                    <ul>
                      {step.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>

            <div className="guide-cta">
              <div>
                <p>{t(locale, "guide.help")}</p>
                <strong>{t(locale, "guide.help2")}</strong>
              </div>
              <a className="btn btn-gold guide-cta-btn" href={`tel:${tel}`}>
                <span aria-hidden>☎</span>
                {phone}
              </a>
            </div>
          </div>
        </section>
        <SiteFooter
          siteName={settings.siteName}
          address={settings.address || ""}
          phone={settings.phone || phone}
          locale={locale}
        />
      </PublicShell>
    </main>
  );
}
