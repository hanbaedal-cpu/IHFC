import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import { getSiteSettings } from "@/models/SiteSettings";
import { getPageContent } from "@/models/PageContent";
import { Room } from "@/models/Room";
import { maskName } from "@/lib/utils";
import { formatKstDate, formatKstMonthDayTime } from "@/lib/time";
import { PublicShell } from "@/components/home/PublicShell";
import { SiteFooter } from "@/components/home/SiteFooter";

export const dynamic = "force-dynamic";

export default async function StatusPage() {
  await connectDB();
  const [settings, page, rooms] = await Promise.all([
    getSiteSettings(),
    getPageContent("status"),
    Room.find({ status: { $in: ["preparing", "active"] } }).sort({ startAt: 1 }).lean(),
  ]);

  return (
    <main>
      <PublicShell settings={settings} activePath="/status">
        <section className="section" style={{ background: "#fff" }}>
          <div className="container">
            <div className="section-label">MEMORIAL STATUS</div>
            <h1 style={{ fontFamily: "var(--font-display), serif", color: "var(--green-900)" }}>
              {page.title}
            </h1>
            <p className="section-lead">
              {formatKstDate(new Date())} 기준 (한국시간)
              {page.body ? ` · ${page.body}` : ""}
            </p>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>빈소</th>
                    <th>고인</th>
                    <th>상주</th>
                    <th>발인일시</th>
                    <th>장지</th>
                    <th>추모글</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.length === 0 && (
                    <tr>
                      <td colSpan={6}>현재 안내 중인 빈소가 없습니다.</td>
                    </tr>
                  )}
                  {rooms.map((room) => (
                    <tr key={String(room._id)}>
                      <td>{room.roomName}</td>
                      <td>故 {maskName(room.deceasedName)}</td>
                      <td>상주 {maskName(room.hostName)}</td>
                      <td>
                        {room.farewellAt ? formatKstMonthDayTime(room.farewellAt) : "-"}
                      </td>
                      <td>{room.burialPlace || "-"}</td>
                      <td>
                        {room.allowPublicMemorial ? (
                          <Link href={`/rooms/${String(room._id)}/memorial`}>남기기</Link>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Link className="btn btn-ghost" href="/rooms" style={{ marginTop: "1rem" }}>
              전체 빈소·추모글 보기
            </Link>
          </div>
        </section>
        <SiteFooter
          siteName={settings.siteName}
          address={settings.address}
          phone={settings.phone}
        />
      </PublicShell>
    </main>
  );
}
