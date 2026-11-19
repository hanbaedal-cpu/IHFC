import { connectDB } from "@/lib/mongodb";
import { getSiteSettings } from "@/models/SiteSettings";
import { getPageContent } from "@/models/PageContent";
import { PublicShell } from "@/components/home/PublicShell";
import { SiteFooter } from "@/components/home/SiteFooter";
import { CopyAddressButton } from "@/components/home/CopyAddressButton";
import { getLocale } from "@/lib/i18n/locale";
import { t } from "@/lib/i18n/dictionaries";
import { localizePageContent, localizeSettings } from "@/lib/i18n/content";

export const dynamic = "force-dynamic";

const TRANSPORT = [
  {
    key: "subway",
    icon: "지하철",
    titleKey: "location.subway.use",
    lines: ["location.subway.l1", "location.subway.l2"],
  },
  {
    key: "bus",
    icon: "버스",
    titleKey: "location.bus.use",
    lines: ["location.bus.l1", "location.bus.l2", "location.bus.l3"],
  },
  {
    key: "car",
    icon: "자가용",
    titleKey: "location.car.use",
    lines: ["location.car.l1", "location.car.l2"],
  },
  {
    key: "parking",
    icon: "P",
    titleKey: "location.parking.use",
    lines: ["location.parking.l1", "location.parking.l2"],
  },
] as const;

export default async function LocationPage() {
  await connectDB();
  const locale = await getLocale();
  const [settingsRaw, pageRaw] = await Promise.all([
    getSiteSettings(),
    getPageContent("location"),
  ]);
  const [settings, page] = await Promise.all([
    localizeSettings(settingsRaw, locale),
    localizePageContent(pageRaw, locale),
  ]);

  const phone = settings.phone || "032-500-0444";
  const hospitalPhone = settings.hospitalPhone || "032-500-0114";
  const tel = phone.replace(/\D/g, "");
  const address =
    settings.address ||
    "인천광역시 부평구 무네미로 446 근로복지공단 인천병원 (구산동 47-3)";
  const mapQuery = encodeURIComponent("근로복지공단 인천병원 장례식장");
  const googleEmbed = `https://www.google.com/maps?q=${mapQuery}&hl=${locale}&z=16&output=embed`;
  const googleMap = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
  const lead =
    page.body ||
    t(locale, "location.lead");

  return (
    <main>
      <PublicShell settings={settings} activePath="/location" locale={locale}>
        <section className="page-section location-page">
          <div className="container">
            <div className="page-head page-head-split">
              <div>
                <div className="section-label">{t(locale, "location.label")}</div>
                <h1 className="page-title">
                  {page.title || t(locale, "location.title")}
                </h1>
                <p className="page-lead">{lead}</p>
              </div>
              <a className="btn btn-primary page-head-cta" href={`tel:${tel}`}>
                {t(locale, "nav.consult24")} {phone}
              </a>
            </div>

            <div className="location-map-row">
              <div className="address-card">
                <div className="address-card-label">ADDRESS</div>
                <h2>{settings.siteName}</h2>
                <p className="address-lines">{address}</p>
                <p className="address-zip">
                  {t(locale, "location.zip")} 21417
                </p>
                <p className="address-phones">
                  {t(locale, "location.hallPhone")} {phone}
                  <br />
                  {t(locale, "location.hospitalPhone")} {hospitalPhone}
                </p>
                <div className="address-actions">
                  <CopyAddressButton
                    address={address}
                    label={t(locale, "location.copy")}
                    doneLabel={t(locale, "location.copied")}
                  />
                  <a className="btn-addr-call" href={`tel:${tel}`}>
                    <span aria-hidden>☎</span>
                    {t(locale, "location.call")}
                  </a>
                </div>
              </div>

              <div className="location-map-panel">
                <a
                  className="map-open-btn"
                  href={googleMap}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t(locale, "location.openMap")}
                </a>
                <iframe
                  title={t(locale, "location.title")}
                  src={googleEmbed}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="transport-grid">
              {TRANSPORT.map((item) => (
                <article key={item.key} className="transport-card">
                  <div className="transport-icon" aria-hidden>
                    {item.icon}
                  </div>
                  <h3>{t(locale, item.titleKey)}</h3>
                  <ul>
                    {item.lines.map((line) => (
                      <li key={line}>{t(locale, line)}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

            <p className="location-note">{t(locale, "location.note")}</p>
          </div>
        </section>

        <SiteFooter
          siteName={settings.siteName}
          address={settings.address || address}
          phone={settings.phone || phone}
          locale={locale}
        />
      </PublicShell>
    </main>
  );
}
