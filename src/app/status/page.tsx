import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import { getSiteSettings } from "@/models/SiteSettings";
import { getPageContent } from "@/models/PageContent";
import { Room } from "@/models/Room";
import { maskName } from "@/lib/utils";
import { formatKstDate, formatKstMonthDayTime } from "@/lib/time";
import { PublicShell } from "@/components/home/PublicShell";
import { SiteFooter } from "@/components/home/SiteFooter";
import { getLocale } from "@/lib/i18n/locale";
import { t } from "@/lib/i18n/dictionaries";
import {
  localizePageContent,
  localizePlain,
  localizeSettings,
} from "@/lib/i18n/content";

export const dynamic = "force-dynamic";

export default async function StatusPage() {
  await connectDB();
  const locale = await getLocale();
  const [settingsRaw, pageRaw, rooms] = await Promise.all([
    getSiteSettings(),
    getPageContent("status"),
    Room.find({ status: { $in: ["preparing", "active"] } }).sort({ startAt: 1 }).lean(),
  ]);
  const [settings, page] = await Promise.all([
    localizeSettings(settingsRaw, locale),
    localizePageContent(pageRaw, locale),
  ]);
  const burialPlaces = await Promise.all(
    rooms.map((room) => localizePlain(room.burialPlace || "", locale))
  );

  return (
    <main>
      <PublicShell settings={settings} activePath="/status" locale={locale}>
        <section className="section" style={{ background: "#fff" }}>
          <div className="container">
            <div className="section-label">{t(locale, "status.label")}</div>
            <h1
              style={{
                fontFamily: "var(--font-display), serif",
                color: "var(--green-900)",
              }}
            >
              {page.title || t(locale, "status.title")}
            </h1>
            <p className="section-lead">
              {formatKstDate(new Date())} {t(locale, "status.asOf")}
              {page.body ? ` · ${page.body}` : ""}
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
            <Link className="btn btn-ghost" href="/rooms" style={{ marginTop: "1rem" }}>
              {t(locale, "status.viewAll")}
            </Link>
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
