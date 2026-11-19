import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import { getSiteSettings } from "@/models/SiteSettings";
import { Room } from "@/models/Room";
import { maskName } from "@/lib/utils";
import { formatKstDate, formatKstMonthDayTime } from "@/lib/time";
import { FACILITIES, GUIDE_STEPS } from "@/lib/site-content";
import { PublicShell } from "@/components/home/PublicShell";
import { ConsultationForm } from "@/components/home/ConsultationForm";
import { FacilityGallery } from "@/components/home/FacilityGallery";
import { SiteFooter } from "@/components/home/SiteFooter";
import { getLocale } from "@/lib/i18n/locale";
import { t } from "@/lib/i18n/dictionaries";
import {
  localizeList,
  localizePlain,
  localizeSettings,
} from "@/lib/i18n/content";

export const dynamic = "force-dynamic";

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
  const tel = phone.replace(/\D/g, "");

  return (
    <main id="top">
      <PublicShell settings={settings} locale={locale}>
        <section className="hero">
          <div className="container hero-layout">
            <div className="hero-copy-block">
              <div className="eyebrow">{settings.heroEyebrow}</div>
              <h1>{settings.heroTitle}</h1>
              <p className="hero-copy">{settings.heroSubtitle}</p>
              <div className="hero-cta">
                <Link className="btn btn-primary" href="/status">
                  {t(locale, "hero.statusCta")}
                </Link>
                <a className="btn btn-ghost" href={`tel:${tel}`}>
                  {phone}
                </a>
              </div>
              <div className="hero-points">
                <span>{t(locale, "hero.point1")}</span>
                <span>{t(locale, "hero.point2")}</span>
                <span>{t(locale, "hero.point3")}</span>
              </div>
            </div>
            <ConsultationForm
              phone={phone}
              variant="hero"
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

        <section className="section" id="about">
          <div className="container" style={{ textAlign: "center", maxWidth: 900 }}>
            <div className="section-label">{t(locale, "about.label")}</div>
            <h2>{settings.aboutTitle}</h2>
            <p className="section-lead" style={{ marginInline: "auto" }}>
              {settings.aboutBody}
            </p>
            <div className="stats" style={{ textAlign: "left" }}>
              <div className="stat">
                <strong>24h</strong>
                <span>{t(locale, "about.stat1")}</span>
              </div>
              <div className="stat">
                <strong>4</strong>
                <span>{t(locale, "about.stat2")}</span>
              </div>
              <div className="stat">
                <strong>100%</strong>
                <span>{t(locale, "about.stat3")}</span>
              </div>
            </div>
            <Link className="btn btn-ghost" href="/about" style={{ marginTop: "1.2rem" }}>
              {t(locale, "about.link")}
            </Link>
          </div>
        </section>

        <section className="section" id="facilities" style={{ background: "#fff" }}>
          <div className="container">
            <div className="section-label">{t(locale, "facilities.label")}</div>
            <h2>{t(locale, "facilities.title")}</h2>
            <p className="section-lead">{t(locale, "facilities.lead")}</p>
            <FacilityGallery facilities={facilities} />
          </div>
        </section>

        <section className="section" id="guide">
          <div className="container">
            <div className="section-label">{t(locale, "guide.label")}</div>
            <h2>{t(locale, "guide.title")}</h2>
            <p className="section-lead">{t(locale, "guide.lead")}</p>
            <div className="steps">
              {guideSteps.map((step) => (
                <article key={step.title} className="step-card">
                  <div className="meta">{step.meta}</div>
                  <h3 style={{ margin: 0 }}>{step.title}</h3>
                  <ul>
                    {step.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
            <div className="panel" style={{ marginTop: "1.5rem", textAlign: "center" }}>
              <p style={{ marginTop: 0 }}>{t(locale, "guide.help")}</p>
              <h3 style={{ marginTop: 0 }}>{t(locale, "guide.help2")}</h3>
              <a className="btn btn-primary" href={`tel:${tel}`}>
                {phone}
              </a>
            </div>
          </div>
        </section>

        <section className="section" id="status" style={{ background: "#fff" }}>
          <div className="container">
            <div className="section-label">{t(locale, "status.label")}</div>
            <h2>{t(locale, "status.title")}</h2>
            <p className="section-lead">
              {formatKstDate(new Date())} {t(locale, "status.asOf")}
            </p>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>{t(locale, "status.col.room")}</th>
                    <th>{t(locale, "status.col.deceased")}</th>
                    <th>{t(locale, "status.col.host")}</th>
                    <th>{t(locale, "status.col.farewell")}</th>
                    <th>{t(locale, "status.col.place")}</th>
                    <th>{t(locale, "status.col.memorial")}</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.length === 0 && (
                    <tr>
                      <td colSpan={6}>{t(locale, "status.empty")}</td>
                    </tr>
                  )}
                  {rooms.map((room, index) => (
                    <tr key={String(room._id)}>
                      <td>{room.roomName}</td>
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
                      <td>
                        {room.allowPublicMemorial ? (
                          <Link href={`/rooms/${String(room._id)}/memorial`}>
                            {t(locale, "status.write")}
                          </Link>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
              {t(locale, "status.note")}
            </p>
            <Link className="btn btn-ghost" href="/status">
              {t(locale, "status.viewAll")}
            </Link>
          </div>
        </section>

        <section className="section" id="location">
          <div className="container">
            <div className="section-label">{t(locale, "location.label")}</div>
            <h2>{t(locale, "location.title")}</h2>
            <p className="section-lead">
              <strong>{t(locale, "location.addressPrefix")}</strong> : {settings.address}
            </p>
            <div className="directions-actions" style={{ marginBottom: "1.2rem" }}>
              <Link className="btn btn-primary" href="/location">
                {t(locale, "location.map")}
              </Link>
              <a className="btn btn-ghost" href={`tel:${tel}`}>
                {t(locale, "location.call")}
              </a>
            </div>
            <div className="directions-transport home-transport">
              <article className="directions-block">
                <h2>{t(locale, "location.subway")}</h2>
                <p>{t(locale, "location.subway.body")}</p>
              </article>
              <article className="directions-block">
                <h2>{t(locale, "location.bus")}</h2>
                <p>{t(locale, "location.bus.body")}</p>
              </article>
              <article className="directions-block">
                <h2>{t(locale, "location.parking")}</h2>
                <p>{t(locale, "location.parking.body")}</p>
              </article>
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
