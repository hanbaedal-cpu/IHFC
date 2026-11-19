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
import styles from "./location.module.css";

export const dynamic = "force-dynamic";

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
      <path
        fill="currentColor"
        d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.2 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1l-2.2 2.2z"
      />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
      <path
        fill="currentColor"
        d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"
      />
    </svg>
  );
}

function ServiceIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
      <path
        fill="currentColor"
        d="M20 15.5c-1.2 0-2.4-.2-3.6-.6-.4-.1-.8 0-1.1.3l-2.2 2.2a15.1 15.1 0 0 1-6.6-6.6l2.2-2.2c.3-.3.4-.7.3-1.1-.4-1.2-.6-2.4-.6-3.6 0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1C3 13.4 10.6 21 20 21c.6 0 1-.4 1-1v-3.5c0-.6-.4-1-1-1z"
      />
    </svg>
  );
}

function TrainIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
      <path
        fill="currentColor"
        d="M12 2c-4 0-7 1.2-7 4.5V14c0 1.7 1.1 3.1 2.7 3.7L6 21h2.2l1.3-2h5l1.3 2H18l-1.7-3.3c1.6-.6 2.7-2 2.7-3.7V6.5C19 3.2 16 2 12 2zm-3.5 14a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6zm7 0a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6zM7 12V7h10v5H7z"
      />
    </svg>
  );
}

function BusIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
      <path
        fill="currentColor"
        d="M4 5c0-2 3.6-3 8-3s8 1 8 3v10a2 2 0 0 1-2 2l1 2h-2l-1-2H8l-1 2H5l1-2a2 2 0 0 1-2-2V5zm3 11.2a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4zm10 0a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4zM6 11h12V6.2c-.8-.4-2.8-.7-6-.7s-5.2.3-6 .7V11z"
      />
    </svg>
  );
}

function CarIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
      <path
        fill="currentColor"
        d="M5.5 16.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm13 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM5 11l1.7-4.3A2 2 0 0 1 8.6 5.5h6.8a2 2 0 0 1 1.9 1.2L19 11h1a1 1 0 0 1 1 1v3.5a1 1 0 0 1-1 1h-1.1a2.5 2.5 0 0 1-4.8 0H9.9a2.5 2.5 0 0 1-4.8 0H4a1 1 0 0 1-1-1V12a1 1 0 0 1 1-1h1zm2.1 0h9.8l-1.2-3H8.3L7.1 11z"
      />
    </svg>
  );
}

function ParkingIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
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
  const addressLine1 = "인천광역시 부평구 무네미로 446";
  const addressLine2 = "근로복지공단 인천병원 (구산동 47-3)";
  const fullAddress =
    settings.address || `${addressLine1} ${addressLine2}`;
  const mapQuery = encodeURIComponent("근로복지공단 인천병원");
  const googleEmbed = `https://www.google.com/maps?q=${mapQuery}&output=embed`;
  const googleMap = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
  const lead = page.body || t(locale, "location.lead");

  return (
    <main>
      <PublicShell settings={settings} activePath="/location" locale={locale}>
        <section className={styles.page}>
          <div className={styles.wrap}>
            <div className={styles.head}>
              <div>
                <p className={styles.label}>{t(locale, "location.label")}</p>
                <h1 className={styles.title}>
                  {page.title || t(locale, "location.title")}
                </h1>
                <p className={styles.lead}>{lead}</p>
              </div>
              <a className={styles.consult} href={`tel:${tel}`}>
                <PhoneIcon />
                {t(locale, "nav.consult24")} {phone}
              </a>
            </div>

            <div className={styles.main}>
              <div className={styles.address}>
                <div>
                  <p className={styles.addressLabel}>ADDRESS</p>
                  <h2 className={styles.addressTitle}>{settings.siteName}</h2>
                  <div className={styles.rows}>
                    <div className={styles.row}>
                      <span className={styles.rowIcon}>
                        <PinIcon />
                      </span>
                      <p className={styles.rowText}>
                        {addressLine1}
                        <br />
                        {addressLine2}
                        <span className={styles.rowMuted}>
                          {t(locale, "location.zip")} 21417
                        </span>
                      </p>
                    </div>
                    <div className={styles.row}>
                      <span className={styles.rowIcon}>
                        <ServiceIcon />
                      </span>
                      <p className={styles.rowText}>
                        {t(locale, "location.hallPhone")} {phone}
                        <span className={styles.rowMuted}>
                          {t(locale, "location.hospitalPhone")} {hospitalPhone}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className={styles.actions}>
                  <CopyAddressButton
                    address={fullAddress}
                    label={t(locale, "location.copy")}
                    doneLabel={t(locale, "location.copied")}
                    className={styles.copyBtn}
                  />
                  <a className={styles.callBtn} href={`tel:${tel}`}>
                    <PhoneIcon />
                    {t(locale, "location.call")}
                  </a>
                </div>
              </div>

              <div className={styles.map}>
                <a
                  className={styles.mapOpen}
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

            <div className={styles.transport}>
              {TRANSPORT.map((item) => (
                <article key={item.key} className={styles.card}>
                  <div className={styles.cardIcon}>
                    <item.Icon />
                  </div>
                  <h3 className={styles.cardTitle}>{t(locale, item.titleKey)}</h3>
                  <ul className={styles.cardList}>
                    {item.lines.map((line) => (
                      <li key={line}>
                        <span className={styles.dot} />
                        <span>{t(locale, line)}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

            <div className={styles.foot}>
              <p className={styles.note}>
                <span aria-hidden>ⓘ</span>
                {t(locale, "location.note")}
              </p>
              <Link href={`tel:${tel}`} className={styles.inquiry}>
                → {t(locale, "location.inquiry")}
              </Link>
            </div>
          </div>
        </section>

        <SiteFooter
          siteName={settings.siteName}
          address={settings.address || fullAddress}
          phone={settings.phone || phone}
          locale={locale}
        />
      </PublicShell>
    </main>
  );
}
