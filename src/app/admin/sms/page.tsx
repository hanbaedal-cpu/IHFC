"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { formatPhone } from "@/lib/utils";

type Consultation = {
  _id: string;
  name: string;
  phone: string;
  status: string;
};

function SmsInner() {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<Consultation[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [text, setText] = useState(
    "[근로복지공단 인천병원 장례식장] 상담 신청을 접수했습니다. 문의 032-500-0444"
  );
  const [result, setResult] = useState("");
  const [logs, setLogs] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/consultations").then((r) => r.json()),
      fetch("/api/sms").then((r) => r.json()),
    ]).then(([consultations, sms]) => {
      setItems(consultations.items || []);
      setLogs(sms.items || []);
      const preset = searchParams.get("ids");
      if (preset) setSelected(preset.split(",").filter(Boolean));
    });
  }, [searchParams]);

  async function send(mode: "selected" | "allNew") {
    setLoading(true);
    setResult("");
    const res = await fetch("/api/sms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        mode === "allNew"
          ? { text, sendAllNew: true }
          : { text, consultationIds: selected }
      ),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setResult(data.error || "발송 실패");
      return;
    }
    setResult(
      `${data.result.mockMode ? "[모의발송] " : ""}${data.result.successCount}/${data.result.total}건 처리 · ${data.result.providerMessage}`
    );
    const sms = await fetch("/api/sms").then((r) => r.json());
    setLogs(sms.items || []);
  }

  return (
    <div>
      <h1>문자 메시지 발송</h1>
      <p style={{ color: "var(--muted)" }}>
        개인/단체 발송을 지원합니다. Solapi 키가 없으면 모의 발송으로 기록됩니다.
      </p>
      <div className="panel">
        <div className="field">
          <label>메시지 내용</label>
          <textarea rows={4} value={text} onChange={(e) => setText(e.target.value)} />
        </div>
        <div className="inline-actions">
          <button
            className="btn btn-primary"
            type="button"
            disabled={loading || !selected.length}
            onClick={() => send("selected")}
          >
            선택 건 발송
          </button>
          <button
            className="btn btn-ghost"
            type="button"
            disabled={loading}
            onClick={() => send("allNew")}
          >
            신규 상담 전체 발송
          </button>
        </div>
        {result && <div className="msg ok">{result}</div>}
      </div>

      <div className="table-wrap" style={{ marginBottom: "1rem" }}>
        <table>
          <thead>
            <tr>
              <th>선택</th>
              <th>이름</th>
              <th>연락처</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selected.includes(item._id)}
                    onChange={() =>
                      setSelected((prev) =>
                        prev.includes(item._id)
                          ? prev.filter((id) => id !== item._id)
                          : [...prev, item._id]
                      )
                    }
                  />
                </td>
                <td>{item.name}</td>
                <td>{formatPhone(item.phone)}</td>
                <td>
                  <span className={`badge ${item.status}`}>{item.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="panel">
        <h3 style={{ marginTop: 0 }}>발송 기록</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>일시</th>
                <th>건수</th>
                <th>상태</th>
                <th>내용</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={String(log._id)}>
                  <td>{new Date(String(log.createdAt)).toLocaleString("ko-KR")}</td>
                  <td>
                    {String(log.successCount)}/
                    {Array.isArray(log.recipients) ? log.recipients.length : 0}
                  </td>
                  <td>{String(log.status)}</td>
                  <td style={{ whiteSpace: "normal", maxWidth: 360 }}>{String(log.text)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function SmsPage() {
  return (
    <Suspense>
      <SmsInner />
    </Suspense>
  );
}
