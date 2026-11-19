"use client";

import { useEffect, useState } from "react";

type Settings = {
  siteName: string;
  phone: string;
  hospitalPhone: string;
  address: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  notice: string;
  aboutTitle: string;
  aboutBody: string;
};

const empty: Settings = {
  siteName: "",
  phone: "",
  hospitalPhone: "",
  address: "",
  heroEyebrow: "",
  heroTitle: "",
  heroSubtitle: "",
  notice: "",
  aboutTitle: "",
  aboutBody: "",
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>(empty);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => setSettings({ ...empty, ...data.settings }));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setLoading(false);
    setMessage(res.ok ? "저장되었습니다." : "저장에 실패했습니다.");
  }

  function field(key: keyof Settings, label: string, multiline = false) {
    const common = {
      value: settings[key],
      onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => setSettings((s) => ({ ...s, [key]: e.target.value })),
    };
    return (
      <div className="field" key={key}>
        <label>{label}</label>
        {multiline ? <textarea rows={4} {...common} /> : <input {...common} />}
      </div>
    );
  }

  return (
    <div>
      <h1>홈페이지 관리</h1>
      <form className="panel" onSubmit={save}>
        {message && <div className="msg ok">{message}</div>}
        {field("siteName", "사이트명")}
        {field("notice", "상단 안내 문구")}
        {field("heroEyebrow", "히어로 서브문구")}
        {field("heroTitle", "히어로 제목")}
        {field("heroSubtitle", "히어로 설명", true)}
        {field("aboutTitle", "소개 제목")}
        {field("aboutBody", "소개 본문", true)}
        {field("phone", "장례식장 전화")}
        {field("hospitalPhone", "병원 전화")}
        {field("address", "주소", true)}
        <button className="btn btn-primary" disabled={loading}>
          {loading ? "저장 중..." : "저장"}
        </button>
      </form>
    </div>
  );
}
