"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n/types";

type Labels = {
  title: string;
  lead: string;
  name: string;
  phone: string;
  agree: string;
  submit: string;
  submitting: string;
  emergency: string;
  callPlease: string;
  success: string;
};

export function ConsultationForm({
  phone = "032-500-0444",
  variant = "hero",
  locale = "ko",
  labels,
}: {
  phone?: string;
  variant?: "hero" | "section";
  locale?: Locale;
  labels: Labels;
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
      setMessage({ type: "ok", text: labels.success });
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
      <h2 style={{ marginTop: 0, fontSize: "1.45rem" }}>{labels.title}</h2>
      <p className="consult-lead">{labels.lead}</p>
      {message && <div className={`msg ${message.type}`}>{message.text}</div>}
      <div className="consult-fields">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={labels.name}
          required
        />
        <input
          value={phoneValue}
          onChange={(e) => setPhoneValue(e.target.value)}
          placeholder={labels.phone}
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
        <span>{labels.agree}</span>
      </label>
      <button className="btn btn-primary consult-submit" type="submit" disabled={loading}>
        {loading ? labels.submitting : labels.submit}
      </button>
      <p className="consult-emergency">
        {labels.emergency} <a href={`tel:${tel}`}>{phone}</a>
        {labels.callPlease}
      </p>
      <span className="sr-only">{locale}</span>
    </form>
  );
}
