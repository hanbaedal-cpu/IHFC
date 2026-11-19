"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/admin", label: "대시보드" },
  { href: "/admin/settings", label: "홈페이지 관리" },
  { href: "/admin/consultations", label: "상담 신청" },
  { href: "/admin/sms", label: "문자 발송" },
  { href: "/admin/rooms", label: "빈소·일정" },
  { href: "/admin/memorials", label: "추모글" },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="admin-nav">
      <div className="admin-brand">
        <strong>IHFC 관리</strong>
        <span>홈페이지 관리 메뉴</span>
      </div>
      <nav>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={pathname === link.href ? "active" : undefined}
          >
            {link.label}
          </Link>
        ))}
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
