"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const groups = [
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

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => setRole(data?.session?.role || ""));
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="admin-nav">
      <div className="admin-brand">
        <strong>IHFC 관리</strong>
        <span>홈페이지 · 업무관리</span>
      </div>
      <nav>
        <Link href="/admin" className={pathname === "/admin" ? "active" : undefined}>
          대시보드
        </Link>
        {groups.map((group) => (
          <div key={group.title} className="admin-group">
            <div className="admin-group-title">{group.title}</div>
            {group.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={pathname.startsWith(link.href) ? "active" : undefined}
              >
                {link.label}
              </Link>
            ))}
          </div>
        ))}
        {role === "supervisor" && (
          <Link
            href="/admin/supervisor"
            className={pathname.startsWith("/admin/supervisor") ? "active" : undefined}
          >
            슈퍼바이저 통계
          </Link>
        )}
      </nav>
      <div className="admin-nav-foot">
        <Link href="/" target="_blank">
          사이트 보기
        </Link>
        <button type="button" onClick={logout}>
          로그아웃
        </button>
      </div>
    </aside>
  );
}
