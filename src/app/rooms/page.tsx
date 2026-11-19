import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import { Room } from "@/models/Room";
import { maskName } from "@/lib/utils";
import { formatKstMonthDayTime } from "@/lib/time";

export const dynamic = "force-dynamic";

export default async function RoomsPage() {
  await connectDB();
  const rooms = await Room.find({ status: { $in: ["preparing", "active"] } })
    .sort({ startAt: 1 })
    .lean();

  return (
    <main className="section">
      <div className="container">
        <Link href="/">← 홈으로</Link>
        <div className="section-label" style={{ marginTop: "1rem" }}>
          ROOMS
        </div>
        <h1 style={{ fontFamily: "var(--font-display), serif", color: "var(--green-900)" }}>
          빈소 리스트 · 추모글
        </h1>
        <p className="section-lead">
          방문객은 해당 빈소에 추모글을 남길 수 있습니다. 유가족은 발급받은 아이디로 로그인해 모은
          글을 확인하고 PDF로 저장할 수 있습니다.
        </p>
        <div className="facility-grid">
          {rooms.map((room) => (
            <article key={String(room._id)} className="facility-card">
              <div className="thumb">{room.roomName}</div>
              <div className="body">
                <h3>故 {maskName(room.deceasedName)}</h3>
                <p>
                  상주 {maskName(room.hostName)}
                  <br />
                  발인{" "}
                  {room.farewellAt ? formatKstMonthDayTime(room.farewellAt) : "-"}
                </p>
                <div className="inline-actions" style={{ marginTop: "0.8rem" }}>
                  {room.allowPublicMemorial && (
                    <Link
                      className="btn btn-primary"
                      href={`/rooms/${String(room._id)}/memorial`}
                    >
                      추모글 남기기
                    </Link>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
        {!rooms.length && <div className="panel">현재 공개 중인 빈소가 없습니다.</div>}
        <div style={{ marginTop: "1.5rem" }}>
          <Link className="btn btn-ghost" href="/guest/login">
            유가족 로그인
          </Link>
        </div>
      </div>
    </main>
  );
}
