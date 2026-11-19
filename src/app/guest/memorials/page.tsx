"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { downloadElementAsPdf } from "@/lib/pdf";
import { formatKstDateTime } from "@/lib/time";

type Memorial = {
  id: string;
  authorName: string;
  authorRelation?: string;
  content: string;
  createdAt: string;
};

type RoomInfo = {
  roomName?: string;
  deceasedName?: string;
  hostName?: string;
};

export default function GuestMemorialsPage() {
  const [items, setItems] = useState<Memorial[]>([]);
  const [room, setRoom] = useState<RoomInfo>({});
  const [message, setMessage] = useState("");
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      const me = await fetch("/api/auth/me").then((r) => r.json());
      if (!me.authenticated || me.session.role !== "guest") return;
      const roomId = me.session.roomId;
      const [memorials, mine] = await Promise.all([
        fetch(`/api/memorials?roomId=${roomId}`).then((r) => r.json()),
        fetch("/api/rooms/mine").then((r) => r.json()),
      ]);
      setItems(memorials.items || []);
      if (mine.item) {
        setRoom({
          roomName: mine.item.roomName,
          deceasedName: mine.item.deceasedName,
          hostName: mine.item.hostName,
        });
      }
    }
    load();
  }, []);

  async function downloadPdf() {
    if (!printRef.current) return;
    setMessage("PDF 생성 중...");
    try {
      await downloadElementAsPdf(
        printRef.current,
        `추모글_${room.roomName || "빈소"}.pdf`
      );
      setMessage("PDF 다운로드가 완료되었습니다.");
    } catch {
      setMessage("PDF 생성에 실패했습니다. 브라우저 인쇄로 저장해 주세요.");
      window.print();
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/guest/login";
  }

  return (
    <main className="section">
      <div className="container">
        <div className="inline-actions" style={{ marginBottom: "1rem" }}>
          <Link href="/">홈</Link>
          <button className="btn btn-ghost" type="button" onClick={logout}>
            로그아웃
          </button>
          <button className="btn btn-primary" type="button" onClick={downloadPdf}>
            리스트·내용 PDF 다운로드
          </button>
          <button className="btn btn-ghost" type="button" onClick={() => window.print()}>
            인쇄
          </button>
        </div>
        {message && <div className="msg ok">{message}</div>}

        <div className="panel" ref={printRef} id="memorial-print">
          <div className="section-label">MEMORIAL BOOK</div>
          <h1 style={{ marginTop: 0, fontFamily: "var(--font-display), serif" }}>
            추모글 모음
          </h1>
          <p>
            {room.roomName} · 故 {room.deceasedName} · 상주 {room.hostName}
          </p>
          <p style={{ color: "var(--muted)" }}>총 {items.length}건</p>
          <div className="memorial-list">
            {items.length === 0 && <p>아직 등록된 추모글이 없습니다.</p>}
            {items.map((item, index) => (
              <article key={item.id}>
                <strong>
                  {index + 1}. {item.authorName}
                  {item.authorRelation ? ` (${item.authorRelation})` : ""}
                </strong>
                <div style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
                  {formatKstDateTime(item.createdAt)}
                </div>
                <p style={{ whiteSpace: "pre-wrap" }}>{item.content}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
