import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import { Consultation } from "@/models/Consultation";
import { Room } from "@/models/Room";
import { Memorial } from "@/models/Memorial";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await connectDB();
  const [consultations, rooms, memorials, newConsultations] = await Promise.all([
    Consultation.countDocuments(),
    Room.countDocuments({ status: { $in: ["preparing", "active"] } }),
    Memorial.countDocuments(),
    Consultation.countDocuments({ status: "new" }),
  ]);

  return (
    <div>
      <h1>홈페이지 관리</h1>
      <p style={{ color: "var(--muted)", marginTop: "-0.4rem" }}>
        상담·문자·빈소일정·추모글을 한곳에서 관리합니다.
      </p>
      <div className="panel-grid">
        <div className="panel">
          <strong>신규 상담</strong>
          <div style={{ fontSize: "2rem", fontFamily: "var(--font-display), serif" }}>
            {newConsultations}
          </div>
          <Link href="/admin/consultations">상담 리스트 →</Link>
        </div>
        <div className="panel">
          <strong>운영 중 빈소</strong>
          <div style={{ fontSize: "2rem", fontFamily: "var(--font-display), serif" }}>
            {rooms}
          </div>
          <Link href="/admin/rooms">빈소·일정 →</Link>
        </div>
        <div className="panel">
          <strong>추모글</strong>
          <div style={{ fontSize: "2rem", fontFamily: "var(--font-display), serif" }}>
            {memorials}
          </div>
          <Link href="/admin/memorials">추모글 관리 →</Link>
        </div>
      </div>
      <div className="panel">
        <h3 style={{ marginTop: 0 }}>빠른 메뉴</h3>
        <div className="inline-actions">
          <Link className="btn btn-primary" href="/admin/settings">
            홈페이지 문구 수정
          </Link>
          <Link className="btn btn-ghost" href="/admin/sms">
            문자 발송
          </Link>
          <Link className="btn btn-ghost" href="/admin/rooms">
            빈소 등록
          </Link>
        </div>
        <p style={{ color: "var(--muted)", marginBottom: 0 }}>
          전체 상담 누적 {consultations}건
        </p>
      </div>
    </div>
  );
}
