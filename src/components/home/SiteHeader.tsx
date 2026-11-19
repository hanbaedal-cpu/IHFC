"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { NAV_ITEMS } from "@/lib/site-content";

export function SiteHeader({
  siteName,
  activePath = "",
}: {
  siteName: string;
  activePath?: string;
}) {
  const [open, setOpen] = useState(false);
  const [staff, setStaff] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        const role = data?.session?.role;
        setStaff(role === "admin" || role === "staff" || role === "supervisor");
      })
      .catch(() => setStaff(false));
  }, []);

  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <Link href="/" className="brand">
          <span className="brand-mark">福</span>
          <span>{siteName}</span>
        </Link>
        <nav className="nav-links">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={activePath === item.href ? "active" : undefined}
            >
              {item.label}
            </Link>
          ))}
          {staff && (
            <Link href="/admin" className="nav-admin">
              홈페이지관리
            </Link>
          )}
        </nav>
        <div className="nav-actions">
          <Link className="btn btn-ghost" href="/guest/login">
            유가족 로그인
          </Link>
          <button
            className="btn btn-ghost"
            type="button"
            aria-label="메뉴"
            onClick={() => setOpen((v) => !v)}
          >
            메뉴
          </button>
        </div>
      </div>
      {open && (
        <div className="container" style={{ paddingBottom: "1rem" }}>
          <div style={{ display: "grid", gap: "0.6rem" }}>
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
            <Link href="/rooms" onClick={() => setOpen(false)}>
              추모글 남기기
            </Link>
            {staff ? (
              <Link href="/admin" onClick={() => setOpen(false)}>
                홈페이지관리
              </Link>
            ) : (
              <Link href="/admin/login" onClick={() => setOpen(false)}>
                관리자 로그인
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
