"use client";

import { useState } from "react";

export function ConsultationForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, privacyAgreed: agreed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "신청에 실패했습니다.");
      setMessage({
        type: "ok",
        text: "상담 신청이 접수되었습니다. 전문 장례지도사가 연락드리겠습니다.",
      });
      setName("");
      setPhone("");
      setAgreed(false);
    } catch (error) {
      setMessage({
        type: "err",
        text: error instanceof Error ? error.message : "신청에 실패했습니다.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="consult-card container" onSubmit={onSubmit}>
      <div className="section-label">24H CONSULTATION</div>
      <h2 style={{ marginTop: 0 }}>빠른 상담 신청</h2>
      <p className="section-lead" style={{ marginBottom: "1rem" }}>
        남겨주신 연락처로 전문 장례지도사가 안내해 드립니다.
      </p>
      {message && <div className={`msg ${message.type}`}>{message.text}</div>}
      <div className="consult-grid">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름"
          required
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="연락처 010-0000-0000"
          required
        />
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "접수 중..." : "상담 신청하기"}
        </button>
      </div>
      <label className="agree-row" style={{ marginTop: "0.9rem" }}>
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          required
        />
        <span>상담을 위한 개인정보 수집 및 이용에 동의합니다.</span>
      </label>
      <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: 0 }}>
        긴급한 경우{" "}
        <a href="tel:0325000444" style={{ color: "var(--green-800)", fontWeight: 700 }}>
          032-500-0444
        </a>
        로 전화해 주세요.
      </p>
    </form>
  );
}
