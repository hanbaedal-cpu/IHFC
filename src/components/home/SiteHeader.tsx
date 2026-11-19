"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LanguageSwitcher } from "@/components/home/LanguageSwitcher";
import type { Locale } from "@/lib/i18n/types";

type NavItem = { href: string; label: string };

export function SiteHeader({
  siteName,
  phone = "032-500-0444",
  activePath = "",
  locale = "ko",
  navItems,
  labels,
  notice,
}: {
  siteName: string;
  phone?: string;
  activePath?: string;
  locale?: Locale;
  navItems: NavItem[];
  labels: {
    sitemap: string;
    admin: string;
    guestLogin: string;
    memorialWrite: string;
    adminLogin: string;
    consult24: string;
  };
  notice?: string;
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
    <header className="rd-header-wrap">
      <div className="rd-utility">
        <div className="rd-utility-inner">
          <LanguageSwitcher locale={locale} />
          <div className="rd-utility-links">
            <Link href="/sitemap">{labels.sitemap}</Link>
            <Link href="/guest/login">{labels.guestLogin}</Link>
            {staff ? (
              <Link href="/admin">{labels.admin}</Link>
            ) : (
              <Link href="/admin/login">{labels.adminLogin}</Link>
            )}
          </div>
        </div>
      </div>

      <div className="rd-banner">
        {notice ||
          "근로복지공단 인천병원 장례식장은 24시간 상담 및 고인 이송을 지원합니다."}
      </div>

      <div className="rd-header">
        <div className="rd-nav">
          <Link href="/" className="rd-brand">
            <span className="rd-brand-mark" aria-hidden>
              ❧
            </span>
            <span>
              <small>KCOMWEL INCHEON HOSPITAL FUNERAL CENTER</small>
              <strong>{siteName}</strong>
            </span>
          </Link>

          <nav className="rd-links">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={activePath === item.href ? "active" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <a className="rd-header-cta" href={`tel:${tel}`}>
              ☎ {labels.consult24}
            </a>
            <button
              className="rd-menu-btn"
              type="button"
              aria-label="메뉴"
              onClick={() => setOpen((v) => !v)}
            >
              ☰
            </button>
          </div>
        </div>

        {open && (
          <div className="rd-mobile">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
            <Link href="/sitemap" onClick={() => setOpen(false)}>
              {labels.sitemap}
            </Link>
            <Link href="/guest/login" onClick={() => setOpen(false)}>
              {labels.guestLogin}
            </Link>
            <Link href="/rooms" onClick={() => setOpen(false)}>
              {labels.memorialWrite}
            </Link>
            {staff ? (
              <Link href="/admin" onClick={() => setOpen(false)}>
                {labels.admin}
              </Link>
            ) : (
              <Link href="/admin/login" onClick={() => setOpen(false)}>
                {labels.adminLogin}
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
