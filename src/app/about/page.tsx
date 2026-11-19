import { connectDB } from "@/lib/mongodb";
import { getSiteSettings } from "@/models/SiteSettings";
import { getPageContent } from "@/models/PageContent";
import { ABOUT_IMAGE_LOCAL } from "@/lib/site-content";
import { PublicShell } from "@/components/home/PublicShell";
import { SiteFooter } from "@/components/home/SiteFooter";
import { getLocale } from "@/lib/i18n/locale";
import { t } from "@/lib/i18n/dictionaries";
import { localizePageContent, localizeSettings } from "@/lib/i18n/content";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  await connectDB();
  const locale = await getLocale();
  const [settingsRaw, pageRaw] = await Promise.all([
    getSiteSettings(),
    getPageContent("about"),
  ]);
  const [settings, page] = await Promise.all([
    localizeSettings(settingsRaw, locale),
    localizePageContent(pageRaw, locale),
  ]);

  const title =
    page.title ||
    settings.aboutTitle ||
    "공공의료기관의 신뢰로 정직하고 투명하게 모십니다";
  const body =
    page.body ||
    settings.aboutBody ||
    "근로복지공단 인천병원 장례식장은 합리적인 요금과 투명한 운영을 원칙으로 합니다. 유가족께서 오직 고인을 추모하는 일에만 마음을 쓰실 수 있도록 모든 절차를 세심하게 돕겠습니다.";

  return (
    <main>
      <PublicShell settings={settings} activePath="/about" locale={locale}>
        <section className="rd-section rd-about">
          <div className="rd-wrap rd-about-grid">
            <div className="rd-about-photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={ABOUT_IMAGE_LOCAL} alt={settings.siteName} />
            </div>
            <div>
              <p className="rd-label">{t(locale, "about.label")}</p>
              <h1 className="rd-title">{title}</h1>
              <p className="rd-lead">{body}</p>
              <div className="rd-about-stats">
                <div className="rd-about-stat">
                  <strong>24h</strong>
                  <span>{t(locale, "about.stat1")}</span>
                </div>
                <div className="rd-about-stat">
                  <strong>4</strong>
                  <span>{t(locale, "about.stat2")}</span>
                </div>
                <div className="rd-about-stat">
                  <strong>100%</strong>
                  <span>{t(locale, "about.stat3")}</span>
                </div>
              </div>
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
