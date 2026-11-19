"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function GuestLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, type: "guest" }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "로그인 실패");
      return;
    }
    router.push("/guest/memorials");
    router.refresh();
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={onSubmit}>
        <h1 style={{ marginTop: 0, fontFamily: "var(--font-display), serif" }}>
          유가족 로그인
        </h1>
        <p style={{ color: "var(--muted)" }}>
          빈소 등록 시 발급된 아이디로 추모글을 확인하고 PDF로 저장할 수 있습니다.
        </p>
        {error && <div className="msg err">{error}</div>}
        <div className="field">
          <label>아이디</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="field">
          <label>비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
          {loading ? "확인 중..." : "로그인"}
        </button>
      </form>
    </div>
  );
}
