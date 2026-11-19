"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, type: "admin" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "로그인 실패");
      router.push(searchParams.get("next") || "/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "로그인 실패");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="login-card" onSubmit={onSubmit}>
      <h1 style={{ marginTop: 0, fontFamily: "var(--font-display), serif" }}>관리자 로그인</h1>
      <p style={{ color: "var(--muted)" }}>홈페이지 관리 메뉴에 접근합니다.</p>
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
  );
}

export default function AdminLoginPage() {
  return (
    <div className="login-page" style={{ gridColumn: "1 / -1" }}>
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
