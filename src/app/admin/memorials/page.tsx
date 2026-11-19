"use client";

import { useEffect, useState } from "react";

type Room = { id: string; roomName: string; deceasedName: string };
type Memorial = {
  id: string;
  roomId: string;
  authorName: string;
  authorRelation?: string;
  content: string;
  approved: boolean;
  createdAt: string;
};

export default function AdminMemorialsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomId, setRoomId] = useState("");
  const [items, setItems] = useState<Memorial[]>([]);

  useEffect(() => {
    fetch("/api/rooms")
      .then((r) => r.json())
      .then((data) => {
        setRooms(data.items || []);
        if (data.items?.[0]) setRoomId(data.items[0].id);
      });
  }, []);

  useEffect(() => {
    if (!roomId) return;
    fetch(`/api/memorials?roomId=${roomId}`)
      .then((r) => r.json())
      .then((data) => setItems(data.items || []));
  }, [roomId]);

  async function remove(id: string) {
    if (!confirm("추모글을 삭제할까요?")) return;
    await fetch(`/api/memorials?id=${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <div>
      <h1>추모글 관리</h1>
      <div className="panel">
        <div className="field">
          <label>빈소 선택</label>
          <select value={roomId} onChange={(e) => setRoomId(e.target.value)}>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.roomName} · {room.deceasedName}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="panel memorial-list">
        {items.length === 0 && <p>등록된 추모글이 없습니다.</p>}
        {items.map((item) => (
          <article key={item.id}>
            <strong>
              {item.authorName}
              {item.authorRelation ? ` (${item.authorRelation})` : ""}
            </strong>
            <div style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
              {new Date(item.createdAt).toLocaleString("ko-KR")}
            </div>
            <p style={{ whiteSpace: "pre-wrap" }}>{item.content}</p>
            <button className="btn btn-ghost" type="button" onClick={() => remove(item.id)}>
              삭제
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
