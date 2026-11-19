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

const GUIDE_ICONS = ["☎", "🏥", "♥", "🚗", "⚱"];

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
        <section className="rd-section rd-guide">
          <div className="rd-guide-inner">
            <p className="rd-label">{t(locale, "guide.label")}</p>
            <h1 className="rd-title">{page.title || t(locale, "guide.title")}</h1>
            <p className="rd-lead">{page.body || t(locale, "guide.lead")}</p>
            <div className="rd-guide-steps">
              {guideSteps.map((step, index) => (
                <article key={step.title} className="rd-guide-step">
                  <div className="rd-guide-head">
                    <div className="rd-guide-icon" aria-hidden>
                      {GUIDE_ICONS[index] || "·"}
                    </div>
                    <div>
                      <p className="rd-guide-meta">{step.meta}</p>
                      <h2 style={{ margin: "0.25rem 0 0", fontSize: "1.05rem" }}>
                        {step.title}
                      </h2>
                    </div>
                  </div>
                  <ul>
                    {step.items.map((item) => (
                      <li key={item}>
                        <span className="dot" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
            <div className="rd-guide-cta">
              <div>
                <p>{t(locale, "guide.help")}</p>
                <strong>{t(locale, "guide.help2")}</strong>
              </div>
              <a href={`tel:${tel}`}>☎ {phone}</a>
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
