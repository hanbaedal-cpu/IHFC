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
  locale = "ko",
  labels,
}: {
  phone?: string;
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
    <div className="rd-consult">
      <p className="rd-label">24H CONSULTATION</p>
      <h2>{labels.title}</h2>
      <p>{labels.lead}</p>
      {message && (
        <div className={`msg ${message.type}`} style={{ marginTop: "0.8rem" }}>
          {message.text}
        </div>
      )}
      <form onSubmit={onSubmit}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={labels.name}
          required
          type="text"
        />
        <input
          value={phoneValue}
          onChange={(e) => setPhoneValue(e.target.value)}
          placeholder={labels.phone}
          required
          type="tel"
        />
        <label>
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            required
          />
          <span>{labels.agree}</span>
        </label>
        <button type="submit" disabled={loading}>
          {loading ? labels.submitting : `${labels.submit.replace("→", "").trim()} →`}
        </button>
        <p className="hint">
          {labels.emergency}{" "}
          <a href={`tel:${tel}`}>{phone}</a>
          {labels.callPlease}
        </p>
      </form>
      <span className="sr-only">{locale}</span>
    </div>
  );
}
