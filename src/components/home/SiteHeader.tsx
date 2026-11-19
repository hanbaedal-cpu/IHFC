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
      <div className="header-utility">
        <div className="container header-utility-inner">
          <LanguageSwitcher locale={locale} />
          <div className="header-utility-links">
            <Link href="/sitemap">{labels.sitemap}</Link>
            <Link href="/guest/login">{labels.guestLogin}</Link>
            {staff ? (
              <Link href="/admin">{labels.admin}</Link>
            ) : (
              <Link href="/admin/login">{labels.adminLogin}</Link>
            )}
            <a href={`tel:${tel}`} className="header-utility-phone">
              {labels.consult24} {phone}
            </a>
          </div>
        </div>
      </div>

      <div className="container site-header-inner">
        <Link href="/" className="brand">
          <span className="brand-mark">福</span>
          <span className="brand-text">
            <small>KCOMWEL INCHEON HOSPITAL FUNERAL CENTER</small>
            <strong>{siteName}</strong>
          </span>
        </Link>

        <nav className="nav-links">
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

        <div className="nav-actions">
          <a className="btn btn-gold header-consult" href={`tel:${tel}`}>
            {labels.consult24}
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
          <div className="mobile-lang">
            <LanguageSwitcher locale={locale} />
          </div>
        </div>
      )}
    </header>
  );
}
