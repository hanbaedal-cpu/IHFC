"use client";

import { useState } from "react";

export function ConsultationForm({
  phone = "032-500-0444",
  variant = "hero",
}: {
  phone?: string;
  variant?: "hero" | "section";
}) {
  const [name, setName] = useState("");
  const [phoneValue, setPhoneValue] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const tel = phone.replace(/\D/g, "");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone: phoneValue, privacyAgreed: agreed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "신청에 실패했습니다.");
      setMessage({
        type: "ok",
        text: "상담 신청이 접수되었습니다. 전문 장례지도사가 연락드리겠습니다.",
      });
      setName("");
      setPhoneValue("");
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
    <form className={`consult-card consult-${variant}`} onSubmit={onSubmit}>
      <div className="section-label">24H CONSULTATION</div>
      <h2 style={{ marginTop: 0, fontSize: "1.45rem" }}>빠른 상담 신청</h2>
      <p className="consult-lead">
        남겨주신 연락처로 전문 장례지도사가 안내해 드립니다.
      </p>
      {message && <div className={`msg ${message.type}`}>{message.text}</div>}
      <div className="consult-fields">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름"
          required
        />
        <input
          value={phoneValue}
          onChange={(e) => setPhoneValue(e.target.value)}
          placeholder="연락처 010-0000-0000"
          required
        />
      </div>
      <label className="agree-row">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          required
        />
        <span>상담을 위한 개인정보 수집 및 이용에 동의합니다.</span>
      </label>
      <button className="btn btn-primary consult-submit" type="submit" disabled={loading}>
        {loading ? "접수 중..." : "상담 신청하기 →"}
      </button>
      <p className="consult-emergency">
        긴급한 경우{" "}
        <a href={`tel:${tel}`}>{phone}</a>
        로 전화해 주세요.
      </p>
    </form>
  );
}
