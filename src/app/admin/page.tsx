import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import { Consultation } from "@/models/Consultation";
import { Room } from "@/models/Room";
import { Memorial } from "@/models/Memorial";
import { Popup } from "@/models/Popup";
import { ensureAdminSeed } from "@/lib/auth";

export const dynamic = "force-dynamic";

const SITEMAP = [
  {
    title: "홈페이지관리",
    links: [
      { href: "/admin/pages", label: "메뉴 페이지 편집" },
      { href: "/admin/settings", label: "메인/히어로 설정" },
    ],
  },
  {
    title: "상담관리",
    links: [
      { href: "/admin/consultations", label: "상담 신청 리스트" },
      { href: "/admin/sms", label: "문자 발송/답변" },
      { href: "/admin/consultations/status", label: "상담 현황" },
    ],
  },
  {
    title: "상주관리",
    links: [
      { href: "/admin/rooms", label: "상주/빈소 등록" },
      { href: "/admin/rooms/list", label: "상주 리스트" },
      { href: "/admin/memorials", label: "추모글" },
      { href: "/admin/thankyou", label: "답례글" },
    ],
  },
  {
    title: "기타관리",
    links: [
      { href: "/admin/gallery", label: "갤러리" },
      { href: "/admin/sns", label: "SNS 관리" },
      { href: "/admin/popups", label: "팝업관리" },
    ],
  },
];

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
      <h1 style={{ marginBottom: "0.4rem" }}>관리 사이트맵</h1>
      <p style={{ color: "var(--muted)", marginTop: 0 }}>
        로그인 후 바로 전체 메뉴 구조를 확인하세요. 신규 상담 {newConsultations}건 ·
        운영 빈소 {rooms} · 추모글 {memorials} · 활성 팝업 {popups}
      </p>

      <div className="sitemap-grid" style={{ marginTop: "1.5rem" }}>
        {SITEMAP.map((section) => (
          <article key={section.title} className="sitemap-group">
            <h2>{section.title}</h2>
            <ul>
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="panel" style={{ marginTop: "1.5rem" }}>
        <h3 style={{ marginTop: 0 }}>바로가기</h3>
        <div className="inline-actions">
          <Link className="btn btn-primary" href="/admin/consultations">
            상담 리스트
          </Link>
          <Link className="btn btn-ghost" href="/admin/rooms">
            상주/빈소
          </Link>
          <Link className="btn btn-ghost" href="/" target="_blank">
            사이트 보기
          </Link>
        </div>
      </div>
    </div>
  );
}
