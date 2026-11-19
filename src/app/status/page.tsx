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
        <section className="rd-section rd-status">
          <div className="rd-status-inner">
            <div className="rd-status-head">
              <div>
                <p className="rd-label">{t(locale, "status.label")}</p>
                <h1 className="rd-title">
                  {page.title || t(locale, "status.title")}
                </h1>
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
            <p className="rd-status-note">
              ⓘ {page.body || t(locale, "status.note")}
            </p>
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
