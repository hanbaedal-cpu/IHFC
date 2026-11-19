"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { NAV_ITEMS } from "@/lib/site-content";

export function SiteHeader({
  siteName,
  phone = "032-500-0444",
  activePath = "",
}: {
  siteName: string;
  phone?: string;
  activePath?: string;
}) {
  const [open, setOpen] = useState(false);
  const [staff, setStaff] = useState(false);
  const tel = phone.replace(/\D/g, "");

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
          <span className="brand-text">
            <small>KCOMWEL INCHEON HOSPITAL FUNERAL CENTER</small>
            <strong>{siteName}</strong>
          </span>
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
          <a className="btn btn-gold header-consult" href={`tel:${tel}`}>
            24시간 상담
          </a>
          <button
            className="btn btn-ghost menu-toggle"
            type="button"
            aria-label="메뉴"
            onClick={() => setOpen((v) => !v)}
          >
            메뉴
          </button>
        </div>
      </div>
      {open && (
        <div className="container mobile-menu">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          <Link href="/guest/login" onClick={() => setOpen(false)}>
            유가족 로그인
          </Link>
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
      )}
    </header>
  );
}
