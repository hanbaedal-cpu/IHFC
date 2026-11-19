import Image from "next/image";
import { connectDB } from "@/lib/mongodb";
import { getSiteSettings } from "@/models/SiteSettings";
import { getPageContent } from "@/models/PageContent";
import { ABOUT_IMAGE } from "@/lib/site-content";
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
        <section className="page-section about-page">
          <div className="container">
            <div className="about-grid">
              <div className="about-photo">
                <Image
                  src={ABOUT_IMAGE}
                  alt={settings.siteName}
                  width={1000}
                  height={880}
                  priority
                />
              </div>
              <div className="about-copy">
                <div className="section-label">{t(locale, "about.label")}</div>
                <h1 className="about-title">{title}</h1>
                <p className="about-body">{body}</p>
                <div className="about-stats">
                  <div className="about-stat">
                    <strong>24h</strong>
                    <span>{t(locale, "about.stat1")}</span>
                  </div>
                  <div className="about-stat">
                    <strong>4</strong>
                    <span>{t(locale, "about.stat2")}</span>
                  </div>
                  <div className="about-stat">
                    <strong>100%</strong>
                    <span>{t(locale, "about.stat3")}</span>
                  </div>
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
