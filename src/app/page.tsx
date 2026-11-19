import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import { getSiteSettings } from "@/models/SiteSettings";
import { Room } from "@/models/Room";
import { maskName } from "@/lib/utils";
import { formatKstDate, formatKstMonthDayTime } from "@/lib/time";
import {
  ABOUT_IMAGE,
  FACILITIES,
  GUIDE_STEPS,
  HERO_IMAGE,
} from "@/lib/site-content";
import { PublicShell } from "@/components/home/PublicShell";
import { ConsultationForm } from "@/components/home/ConsultationForm";
import { FacilityGallery } from "@/components/home/FacilityGallery";
import { SiteFooter } from "@/components/home/SiteFooter";
import { CopyAddressButton } from "@/components/home/CopyAddressButton";
import { getLocale } from "@/lib/i18n/locale";
import { t } from "@/lib/i18n/dictionaries";
import {
  localizeList,
  localizePlain,
  localizeSettings,
} from "@/lib/i18n/content";
import loc from "./location/location.module.css";

export const dynamic = "force-dynamic";

const GUIDE_ICONS = ["☎", "🏥", "♥", "🚗", "⚱"];

export default async function HomePage() {
  await connectDB();
  const locale = await getLocale();
  const settingsRaw = await getSiteSettings();
  const settings = await localizeSettings(settingsRaw, locale);
  const rooms = await Room.find({ status: { $in: ["preparing", "active"] } })
    .sort({ startAt: 1 })
    .lean();

  const [facilities, guideSteps] = await Promise.all([
    localizeList([...FACILITIES], ["name", "size", "desc"], locale),
    localizeList([...GUIDE_STEPS], ["meta", "title", "items"], locale),
  ]);

  const burialPlaces = await Promise.all(
    rooms.map((room) => localizePlain(room.burialPlace || "", locale))
  );

  const phone = settings.phone || "032-500-0444";
  const hospitalPhone = settings.hospitalPhone || "032-500-0114";
  const tel = phone.replace(/\D/g, "");
  const address =
    settings.address ||
    "인천광역시 부평구 무네미로 446 근로복지공단 인천병원 (구산동 47-3)";
  const mapQuery = encodeURIComponent("근로복지공단 인천병원");
  const googleEmbed = `https://www.google.com/maps?q=${mapQuery}&output=embed`;
  const googleMap = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  const transport = [
    {
      key: "subway",
      title: t(locale, "location.subway.use"),
      lines: [t(locale, "location.subway.l1"), t(locale, "location.subway.l2")],
      icon: "지하철",
    },
    {
      key: "bus",
      title: t(locale, "location.bus.use"),
      lines: [
        t(locale, "location.bus.l1"),
        t(locale, "location.bus.l2"),
        t(locale, "location.bus.l3"),
      ],
      icon: "버스",
    },
    {
      key: "car",
      title: t(locale, "location.car.use"),
      lines: [t(locale, "location.car.l1"), t(locale, "location.car.l2")],
      icon: "자가용",
    },
    {
      key: "parking",
      title: t(locale, "location.parking.use"),
      lines: [t(locale, "location.parking.l1"), t(locale, "location.parking.l2")],
      icon: "P",
    },
  ];

  return (
    <main id="top">
      <PublicShell settings={settings} locale={locale}>
        <section className="rd-hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="rd-hero-img"
            src={HERO_IMAGE}
            alt="흰 국화 - 근로복지공단 인천병원 장례식장"
          />
          <div className="rd-hero-mask" />
          <div className="rd-hero-inner">
            <div className="rd-hero-copy">
              <p className="rd-eyebrow">
                {settings.heroEyebrow || "마지막 순간까지 정성을 다합니다"}
              </p>
              <h1 className="rd-hero-title">
                <strong>깊은 슬픔 곁에</strong>
                <br />
                <span>따뜻한 위로가 </span>
                <strong>되겠습니다</strong>
              </h1>
              <p className="rd-hero-text">
                {settings.heroSubtitle ||
                  "유가족의 마음을 먼저 헤아리며, 장례의 모든 절차를 품격 있고 정성스럽게 함께하겠습니다."}
              </p>
              <div className="rd-hero-cta">
                <Link className="rd-btn-primary" href="/status">
                  {t(locale, "hero.statusCta")}
                </Link>
                <a className="rd-btn-ghost" href={`tel:${tel}`}>
                  ☎ {phone}
                </a>
              </div>
              <div className="rd-hero-points">
                <span>⏱ {t(locale, "hero.point1").replace(/^⏱\s*/, "")}</span>
                <span>🚗 {t(locale, "hero.point2").replace(/^🚗\s*/, "")}</span>
                <span>♥ {t(locale, "hero.point3").replace(/^♥\s*/, "")}</span>
              </div>
            </div>
            <ConsultationForm
              phone={phone}
              locale={locale}
              labels={{
                title: t(locale, "consult.title"),
                lead: t(locale, "consult.lead"),
                name: t(locale, "consult.name"),
                phone: t(locale, "consult.phone"),
                agree: t(locale, "consult.agree"),
                submit: t(locale, "consult.submit"),
                submitting: t(locale, "consult.submitting"),
                emergency: t(locale, "consult.emergency"),
                callPlease: t(locale, "consult.callPlease"),
                success: t(locale, "consult.success"),
              }}
            />
          </div>
        </section>

        <section id="about" className="rd-section rd-about">
          <div className="rd-wrap rd-about-grid">
            <div className="rd-about-photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={ABOUT_IMAGE} alt="근로복지공단 인천병원 장례식장 전경" />
            </div>
            <div>
              <p className="rd-label">{t(locale, "about.label")}</p>
              <h2 className="rd-title">
                {settings.aboutTitle ||
                  "공공의료기관의 신뢰로 정직하고 투명하게 모십니다"}
              </h2>
              <p className="rd-lead">
                {settings.aboutBody ||
                  "근로복지공단 인천병원 장례식장은 합리적인 요금과 투명한 운영을 원칙으로 합니다. 유가족께서 오직 고인을 추모하는 일에만 마음을 쓰실 수 있도록 모든 절차를 세심하게 돕겠습니다."}
              </p>
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

        <section id="facilities" className="rd-section rd-facilities">
          <div className="rd-wrap">
            <p className="rd-label">{t(locale, "facilities.label")}</p>
            <h2 className="rd-title">{t(locale, "facilities.title")}</h2>
            <p className="rd-lead" style={{ marginInline: "auto", maxWidth: "40rem" }}>
              {t(locale, "facilities.lead")}
            </p>
            <p style={{ marginTop: "0.5rem", color: "var(--rd-text-muted)", fontSize: "0.86rem" }}>
              {t(locale, "facilities.click")}
            </p>
            <FacilityGallery facilities={facilities} />
          </div>
        </section>

        <section id="guide" className="rd-section rd-guide">
          <div className="rd-guide-inner">
            <p className="rd-label">{t(locale, "guide.label")}</p>
            <h2 className="rd-title">{t(locale, "guide.title")}</h2>
            <p className="rd-lead">{t(locale, "guide.lead")}</p>
            <div className="rd-guide-steps">
              {guideSteps.map((step, index) => (
                <article key={step.title} className="rd-guide-step">
                  <div className="rd-guide-head">
                    <div className="rd-guide-icon" aria-hidden>
                      {GUIDE_ICONS[index] || "·"}
                    </div>
                    <div>
                      <p className="rd-guide-meta">{step.meta}</p>
                      <h3>{step.title}</h3>
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

        <section id="status" className="rd-section rd-status">
          <div className="rd-status-inner">
            <div className="rd-status-head">
              <div>
                <p className="rd-label">{t(locale, "status.label")}</p>
                <h2 className="rd-title">{t(locale, "status.title")}</h2>
              </div>
              <p className="rd-status-date">
                {formatKstDate(new Date())} {t(locale, "status.asOf")}
              </p>
            </div>
            <div className="rd-table-wrap">
              <table className="rd-table">
                <thead>
                  <tr>
                    <th>{t(locale, "status.col.room")}</th>
                    <th>{t(locale, "status.col.deceased")}</th>
                    <th>{t(locale, "status.col.host")}</th>
                    <th>{t(locale, "status.col.farewell")}</th>
                    <th>{t(locale, "status.col.place")}</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.length === 0 && (
                    <tr>
                      <td colSpan={5}>{t(locale, "status.empty")}</td>
                    </tr>
                  )}
                  {rooms.map((room, index) => (
                    <tr key={String(room._id)}>
                      <td className="room">{room.roomName}</td>
                      <td>
                        {t(locale, "deceased.prefix")} {maskName(room.deceasedName)}
                      </td>
                      <td>
                        {t(locale, "host.prefix")} {maskName(room.hostName)}
                      </td>
                      <td>
                        {room.farewellAt ? formatKstMonthDayTime(room.farewellAt) : "-"}
                      </td>
                      <td>{burialPlaces[index] || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="rd-status-note">ⓘ {t(locale, "status.note")}</p>
          </div>
        </section>

        <section id="location" className={loc.page}>
          <div className={loc.wrap}>
            <div className={loc.head}>
              <div>
                <p className={loc.label}>{t(locale, "location.label")}</p>
                <h2 className={loc.title}>{t(locale, "location.title")}</h2>
                <p className={loc.lead}>{t(locale, "location.lead")}</p>
              </div>
              <a className={loc.consult} href={`tel:${tel}`}>
                ☎ {t(locale, "nav.consult24")} {phone}
              </a>
            </div>

            <div className={loc.main}>
              <div className={loc.address}>
                <div>
                  <p className={loc.addressLabel}>ADDRESS</p>
                  <h3 className={loc.addressTitle}>{settings.siteName}</h3>
                  <div className={loc.rows}>
                    <div className={loc.row}>
                      <span className={loc.rowIcon}>📍</span>
                      <p className={loc.rowText}>
                        인천광역시 부평구 무네미로 446
                        <br />
                        근로복지공단 인천병원 (구산동 47-3)
                        <span className={loc.rowMuted}>
                          {t(locale, "location.zip")} 21417
                        </span>
                      </p>
                    </div>
                    <div className={loc.row}>
                      <span className={loc.rowIcon}>☎</span>
                      <p className={loc.rowText}>
                        {t(locale, "location.hallPhone")} {phone}
                        <span className={loc.rowMuted}>
                          {t(locale, "location.hospitalPhone")} {hospitalPhone}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className={loc.actions}>
                  <CopyAddressButton
                    address={address}
                    label={t(locale, "location.copy")}
                    doneLabel={t(locale, "location.copied")}
                    className={loc.copyBtn}
                  />
                  <a className={loc.callBtn} href={`tel:${tel}`}>
                    ☎ {t(locale, "location.call")}
                  </a>
                </div>
              </div>
              <div className={loc.map}>
                <a
                  className={loc.mapOpen}
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

            <div className={loc.transport}>
              {transport.map((item) => (
                <article key={item.key} className={loc.card}>
                  <div className={loc.cardIcon}>{item.icon}</div>
                  <h3 className={loc.cardTitle}>{item.title}</h3>
                  <ul className={loc.cardList}>
                    {item.lines.map((line) => (
                      <li key={line}>
                        <span className={loc.dot} />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

            <div className={loc.foot}>
              <p className={loc.note}>
                <span aria-hidden>ⓘ</span>
                {t(locale, "location.note")}
              </p>
              <a href={`tel:${tel}`} className={loc.inquiry}>
                → {t(locale, "location.inquiry")}
              </a>
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
