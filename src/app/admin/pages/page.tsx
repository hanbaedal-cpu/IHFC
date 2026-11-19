"use client";

import { useEffect, useState } from "react";

const keys = [
  { key: "about", label: "장례식장 안내" },
  { key: "facilities", label: "시설안내" },
  { key: "guide", label: "이용안내" },
  { key: "status", label: "빈소현황" },
  { key: "location", label: "오시는 길" },
] as const;

type PageItem = {
  key: string;
  title: string;
  subtitle?: string;
  body?: string;
};

export default function AdminPagesPage() {
  const [selected, setSelected] = useState<(typeof keys)[number]["key"]>("about");
  const [form, setForm] = useState({ title: "", subtitle: "", body: "" });
  const [message, setMessage] = useState("");

  async function load(key: string) {
    const res = await fetch(`/api/pages?key=${key}`);
    const data = await res.json();
    const item: PageItem = data.item;
    setForm({
      title: item?.title || "",
      subtitle: item?.subtitle || "",
      body: item?.body || "",
    });
  }

  useEffect(() => {
    load(selected);
  }, [selected]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/pages", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: selected, ...form }),
    });
    setMessage(res.ok ? "저장되었습니다." : "저장 실패");
  }

  async function resetPage() {
    if (!confirm("이 페이지 내용을 기본값으로 초기화할까요?")) return;
    await fetch(`/api/pages?key=${selected}`, { method: "DELETE" });
    await load(selected);
    setMessage("기본값으로 초기화되었습니다.");
  }

  return (
    <div>
      <h1>홈페이지 메뉴 페이지 편집</h1>
      <p style={{ color: "var(--muted)" }}>5개 메뉴 페이지를 수정/편집합니다. (CRUD)</p>
      <div className="inline-actions" style={{ marginBottom: "1rem" }}>
        {keys.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`btn ${selected === item.key ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setSelected(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <form className="panel" onSubmit={save}>
        {message && <div className="msg ok">{message}</div>}
        <div className="field">
          <label>제목</label>
          <input
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            required
          />
        </div>
        <div className="field">
          <label>부제</label>
          <input
            value={form.subtitle}
            onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
          />
        </div>
        <div className="field">
          <label>본문</label>
          <textarea
            rows={8}
            value={form.body}
            onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
          />
        </div>
        <div className="inline-actions">
          <button className="btn btn-primary" type="submit">
            저장 (Update)
          </button>
          <button className="btn btn-ghost" type="button" onClick={resetPage}>
            삭제 후 기본값 복구 (Delete)
          </button>
          <a className="btn btn-ghost" href={`/${selected}`} target="_blank" rel="noreferrer">
            페이지 보기
          </a>
        </div>
      </form>
    </div>
  );
}
