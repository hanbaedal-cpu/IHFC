import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import { Consultation } from "@/models/Consultation";
import { Room } from "@/models/Room";
import { Memorial } from "@/models/Memorial";
import { Popup } from "@/models/Popup";
import { ensureAdminSeed } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await ensureAdminSeed();
  await connectDB();
  const [newConsultations, rooms, memorials, popups] = await Promise.all([
    Consultation.countDocuments({ status: "new" }),
    Room.countDocuments({ status: { $in: ["preparing", "active"] } }),
    Memorial.countDocuments(),
    Popup.countDocuments({ active: true }),
  ]);

  return (
    <div>
      <h1>업무 대시보드</h1>
      <p style={{ color: "var(--muted)" }}>
        홈페이지관리 · 상담관리 · 상주관리 · 기타관리를 한곳에서 운영합니다.
      </p>
      <div className="panel-grid">
        <div className="panel">
          <strong>신규 상담</strong>
          <div style={{ fontSize: "2rem" }}>{newConsultations}</div>
          <Link href="/admin/consultations">상담 리스트 →</Link>
        </div>
        <div className="panel">
          <strong>운영 빈소</strong>
          <div style={{ fontSize: "2rem" }}>{rooms}</div>
          <Link href="/admin/rooms">상주/빈소 →</Link>
        </div>
        <div className="panel">
          <strong>추모글 / 활성 팝업</strong>
          <div style={{ fontSize: "2rem" }}>
            {memorials} / {popups}
          </div>
          <Link href="/admin/popups">팝업 관리 →</Link>
        </div>
      </div>
      <div className="panel">
        <h3 style={{ marginTop: 0 }}>바로가기</h3>
        <div className="inline-actions">
          <Link className="btn btn-primary" href="/admin/pages">
            메뉴 페이지 편집
          </Link>
          <Link className="btn btn-ghost" href="/admin/sms">
            문자 발송
          </Link>
          <Link className="btn btn-ghost" href="/admin/sns">
            SNS 관리
          </Link>
          <Link className="btn btn-ghost" href="/admin/gallery">
            갤러리
          </Link>
        </div>
      </div>
    </div>
  );
}
