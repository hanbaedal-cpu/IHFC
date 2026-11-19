"use client";

import { useEffect, useState } from "react";

type Form = {
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  naverBlogUrl: string;
};

export default function AdminSnsPage() {
  const [form, setForm] = useState<Form>({
    facebookUrl: "",
    instagramUrl: "",
    youtubeUrl: "",
    naverBlogUrl: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) =>
        setForm({
          facebookUrl: data.settings?.facebookUrl || "",
          instagramUrl: data.settings?.instagramUrl || "",
          youtubeUrl: data.settings?.youtubeUrl || "",
          naverBlogUrl: data.settings?.naverBlogUrl || "",
        })
      );
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setMessage(res.ok ? "SNS URL이 저장되었습니다." : "저장 실패");
  }

  return (
    <div>
      <h1>SNS 관리</h1>
      <p style={{ color: "var(--muted)" }}>
        우측 고정 SNS 아이콘에 연결할 URL을 등록합니다. (Create/Update)
      </p>
      <form className="panel" onSubmit={save}>
        {message && <div className="msg ok">{message}</div>}
        {(
          [
            ["facebookUrl", "Facebook URL"],
            ["instagramUrl", "Instagram URL"],
            ["youtubeUrl", "YouTube URL"],
            ["naverBlogUrl", "네이버 블로그 URL"],
          ] as const
        ).map(([key, label]) => (
          <div className="field" key={key}>
            <label>{label}</label>
            <input
              value={form[key]}
              onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
              placeholder="https://"
            />
          </div>
        ))}
        <button className="btn btn-primary" type="submit">
          저장
        </button>
      </form>
    </div>
  );
}
