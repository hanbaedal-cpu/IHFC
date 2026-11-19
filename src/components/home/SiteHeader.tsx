"use client";

import Link from "next/link";
import { useState } from "react";

export function SiteHeader({ siteName }: { siteName: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <Link href="/#top" className="brand">
          <span className="brand-mark">福</span>
          <span>{siteName}</span>
        </Link>
        <nav className="nav-links">
          <a href="#about">장례식장 안내</a>
          <a href="#facilities">시설안내</a>
          <a href="#guide">이용안내</a>
          <a href="#rooms">빈소현황</a>
          <a href="#location">오시는 길</a>
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
            style={{ display: "inline-flex" }}
          >
            메뉴
          </button>
        </div>
      </div>
      {open && (
        <div className="container" style={{ paddingBottom: "1rem" }}>
          <div style={{ display: "grid", gap: "0.6rem" }}>
            <a href="#about" onClick={() => setOpen(false)}>
              장례식장 안내
            </a>
            <a href="#facilities" onClick={() => setOpen(false)}>
              시설안내
            </a>
            <a href="#guide" onClick={() => setOpen(false)}>
              이용안내
            </a>
            <a href="#rooms" onClick={() => setOpen(false)}>
              빈소현황
            </a>
            <a href="#location" onClick={() => setOpen(false)}>
              오시는 길
            </a>
            <Link href="/rooms" onClick={() => setOpen(false)}>
              추모글 남기기
            </Link>
            <Link href="/admin/login" onClick={() => setOpen(false)}>
              관리자
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
