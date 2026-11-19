"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function MemorialWritePage() {
  const params = useParams<{ id: string }>();
  const roomId = params.id;
  const [roomName, setRoomName] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorRelation, setAuthorRelation] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/rooms?public=1")
      .then((r) => r.json())
      .then((data) => {
        const room = (data.items || []).find(
          (item: { id: string }) => item.id === roomId
        );
        if (room) setRoomName(`${room.roomName} · ${room.deceasedNameMasked}`);
      });
  }, [roomId]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const res = await fetch("/api/memorials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId, authorName, authorRelation, content }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setMessage({ type: "err", text: data.error || "저장 실패" });
      return;
    }
    setMessage({ type: "ok", text: "추모글이 등록되었습니다. 고인의 평안을 빕니다." });
    setAuthorName("");
    setAuthorRelation("");
    setContent("");
  }

  return (
    <main className="section">
      <div className="container" style={{ maxWidth: 720 }}>
        <Link href="/rooms">← 빈소 리스트</Link>
        <h1 style={{ fontFamily: "var(--font-display), serif", color: "var(--green-900)" }}>
          추모글 남기기
        </h1>
        <p className="section-lead">{roomName || "빈소 정보를 불러오는 중..."}</p>
        <form className="panel" onSubmit={onSubmit}>
          {message && <div className={`msg ${message.type}`}>{message.text}</div>}
          <div className="field">
            <label>성함</label>
            <input value={authorName} onChange={(e) => setAuthorName(e.target.value)} required />
          </div>
          <div className="field">
            <label>관계 (선택)</label>
            <input
              value={authorRelation}
              onChange={(e) => setAuthorRelation(e.target.value)}
              placeholder="예: 친구, 동료"
            />
          </div>
          <div className="field">
            <label>추모글</label>
            <textarea
              rows={7}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              maxLength={2000}
            />
          </div>
          <button className="btn btn-primary" disabled={loading}>
            {loading ? "등록 중..." : "등록하기"}
          </button>
        </form>
      </div>
    </main>
  );
}
