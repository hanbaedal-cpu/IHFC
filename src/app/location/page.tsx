import Link from "next/link";
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

function TrainIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden>
      <path
        fill="currentColor"
        d="M12 2c-4 0-7 1.2-7 4.5V14c0 1.7 1.1 3.1 2.7 3.7L6 21h2.2l1.3-2h5l1.3 2H18l-1.7-3.3c1.6-.6 2.7-2 2.7-3.7V6.5C19 3.2 16 2 12 2zm-3.5 14a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6zm7 0a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6zM7 12V7h10v5H7z"
      />
    </svg>
  );
}

function BusIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden>
      <path
        fill="currentColor"
        d="M4 5c0-2 3.6-3 8-3s8 1 8 3v10a2 2 0 0 1-2 2l1 2h-2l-1-2H8l-1 2H5l1-2a2 2 0 0 1-2-2V5zm3 11.2a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4zm10 0a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4zM6 11h12V6.2c-.8-.4-2.8-.7-6-.7s-5.2.3-6 .7V11z"
      />
    </svg>
  );
}

function CarIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden>
      <path
        fill="currentColor"
        d="M5.5 16.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm13 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM5 11l1.7-4.3A2 2 0 0 1 8.6 5.5h6.8a2 2 0 0 1 1.9 1.2L19 11h1a1 1 0 0 1 1 1v3.5a1 1 0 0 1-1 1h-1.1a2.5 2.5 0 0 1-4.8 0H9.9a2.5 2.5 0 0 1-4.8 0H4a1 1 0 0 1-1-1V12a1 1 0 0 1 1-1h1zm2.1 0h9.8l-1.2-3H8.3L7.1 11z"
      />
    </svg>
  );
}

function ParkingIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden>
      <path
        fill="currentColor"
        d="M7 3h7.2A5.3 5.3 0 0 1 19.5 8.3 5.3 5.3 0 0 1 14.2 13.6H11V21H7V3zm4 7.2h3c1.5 0 2.5-.9 2.5-2.3S15.5 5.6 14 5.6h-3v4.6z"
      />
    </svg>
  );
}

const TRANSPORT = [
  {
    key: "subway",
    titleKey: "location.subway.use",
    lines: ["location.subway.l1", "location.subway.l2"],
    Icon: TrainIcon,
  },
  {
    key: "bus",
    titleKey: "location.bus.use",
    lines: ["location.bus.l1", "location.bus.l2", "location.bus.l3"],
    Icon: BusIcon,
  },
  {
    key: "car",
    titleKey: "location.car.use",
    lines: ["location.car.l1", "location.car.l2"],
    Icon: CarIcon,
  },
  {
    key: "parking",
    titleKey: "location.parking.use",
    lines: ["location.parking.l1", "location.parking.l2"],
    Icon: ParkingIcon,
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
  const lead = page.body || t(locale, "location.lead");

  return (
    <main>
      <PublicShell settings={settings} activePath="/location" locale={locale}>
        <section className="location-page">
          <div className="container">
            <div className="location-head">
              <div className="location-head-copy">
                <div className="section-label">{t(locale, "location.label")}</div>
                <h1>{page.title || t(locale, "location.title")}</h1>
                <p>{lead}</p>
              </div>
              <a className="location-consult" href={`tel:${tel}`}>
                <span aria-hidden>☎</span>
                {t(locale, "nav.consult24")} {phone}
              </a>
            </div>

            <div className="location-main">
              <div className="address-card">
                <div className="address-card-label">ADDRESS</div>
                <h2>{settings.siteName}</h2>
                <div className="address-row">
                  <span className="address-ico" aria-hidden>
                    📍
                  </span>
                  <div>
                    <p>{address}</p>
                    <p>
                      {t(locale, "location.zip")} 21417
                    </p>
                  </div>
                </div>
                <div className="address-row">
                  <span className="address-ico" aria-hidden>
                    ☎
                  </span>
                  <div>
                    <p>
                      {t(locale, "location.hallPhone")} {phone}
                    </p>
                    <p>
                      {t(locale, "location.hospitalPhone")} {hospitalPhone}
                    </p>
                  </div>
                </div>
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
                  <div className="transport-icon">
                    <item.Icon />
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

            <div className="location-foot">
              <p className="location-note">
                <span aria-hidden>ⓘ</span>
                {t(locale, "location.note")}
              </p>
              <Link href="/#top" className="location-inquiry">
                {t(locale, "location.inquiry")} →
              </Link>
            </div>
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
