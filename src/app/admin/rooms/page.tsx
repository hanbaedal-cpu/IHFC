"use client";

import { useEffect, useState } from "react";
import { CalendarBoard, type CalendarRoom } from "@/components/CalendarBoard";

type Room = CalendarRoom & {
  roomCode: string;
  hostName: string;
  burialPlace?: string;
  farewellAt?: string;
  publicNote?: string;
  guestUsername?: string;
  guestPasswordPlain?: string;
  allowPublicMemorial?: boolean;
};

const emptyForm = {
  roomCode: "특1호실",
  roomName: "특1호실",
  deceasedName: "",
  hostName: "",
  burialPlace: "",
  startAt: "",
  endAt: "",
  farewellAt: "",
  status: "preparing",
  publicNote: "",
  allowPublicMemorial: true,
};

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function load() {
    const res = await fetch("/api/rooms?calendar=1");
    const data = await res.json();
    setRooms(data.items || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    const res = await fetch("/api/rooms", {
      method: editingId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingId ? { id: editingId, ...form } : form),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || "저장 실패");
      return;
    }
    setMessage(
      editingId
        ? "빈소가 수정되었습니다."
        : `빈소 등록 완료 · 유가족 ID ${data.item.guestUsername} / PW ${data.item.guestPasswordPlain}`
    );
    setForm(emptyForm);
    setEditingId(null);
    load();
  }

  function edit(room: Room) {
    setEditingId(room.id);
    setForm({
      roomCode: room.roomCode,
      roomName: room.roomName,
      deceasedName: room.deceasedName,
      hostName: room.hostName,
      burialPlace: room.burialPlace || "",
      startAt: room.startAt ? room.startAt.slice(0, 16) : "",
      endAt: room.endAt ? room.endAt.slice(0, 16) : "",
      farewellAt: room.farewellAt ? room.farewellAt.slice(0, 16) : "",
      status: room.status,
      publicNote: room.publicNote || "",
      allowPublicMemorial: room.allowPublicMemorial ?? true,
    });
  }

  async function regenerate(id: string) {
    const res = await fetch("/api/rooms", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, regenerateGuest: true }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage(`계정 재발급 · ID ${data.item.guestUsername} / PW ${data.item.guestPasswordPlain}`);
      load();
    }
  }

  async function remove(id: string) {
    if (!confirm("이 빈소를 삭제할까요?")) return;
    await fetch(`/api/rooms?id=${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1>빈소 등록 · 일정표</h1>
      <p style={{ color: "var(--muted)" }}>
        달력에서 빈소 일정을 한눈에 확인하고, 등록 시 유가족 전용 아이디가 자동 발급됩니다.
      </p>

      <div className="panel">
        <CalendarBoard rooms={rooms} onSelect={(room) => edit(room as Room)} />
      </div>

      <form className="panel" onSubmit={save}>
        <h3 style={{ marginTop: 0 }}>{editingId ? "빈소 수정" : "빈소 등록"}</h3>
        {message && <div className="msg ok">{message}</div>}
        <div className="panel-grid">
          {(
            [
              ["roomCode", "빈소 코드"],
              ["roomName", "빈소명"],
              ["deceasedName", "고인명"],
              ["hostName", "상주명"],
              ["burialPlace", "장지"],
            ] as const
          ).map(([key, label]) => (
            <div className="field" key={key}>
              <label>{label}</label>
              <input
                value={form[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                required={key !== "burialPlace"}
              />
            </div>
          ))}
          <div className="field">
            <label>시작</label>
            <input
              type="datetime-local"
              value={form.startAt}
              onChange={(e) => setForm((f) => ({ ...f, startAt: e.target.value }))}
              required
            />
          </div>
          <div className="field">
            <label>종료</label>
            <input
              type="datetime-local"
              value={form.endAt}
              onChange={(e) => setForm((f) => ({ ...f, endAt: e.target.value }))}
              required
            />
          </div>
          <div className="field">
            <label>발인</label>
            <input
              type="datetime-local"
              value={form.farewellAt}
              onChange={(e) => setForm((f) => ({ ...f, farewellAt: e.target.value }))}
            />
          </div>
          <div className="field">
            <label>상태</label>
            <select
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
            >
              <option value="preparing">준비중</option>
              <option value="active">진행중</option>
              <option value="closed">종료</option>
            </select>
          </div>
        </div>
        <div className="field">
          <label>공개 메모</label>
          <input
            value={form.publicNote}
            onChange={(e) => setForm((f) => ({ ...f, publicNote: e.target.value }))}
          />
        </div>
        <label className="agree-row" style={{ marginBottom: "1rem" }}>
          <input
            type="checkbox"
            checked={form.allowPublicMemorial}
            onChange={(e) =>
              setForm((f) => ({ ...f, allowPublicMemorial: e.target.checked }))
            }
          />
          <span>방문 추모글 작성 허용</span>
        </label>
        <div className="inline-actions">
          <button className="btn btn-primary" type="submit">
            {editingId ? "수정 저장" : "등록"}
          </button>
          {editingId && (
            <button
              className="btn btn-ghost"
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
            >
              취소
            </button>
          )}
        </div>
      </form>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>빈소</th>
              <th>고인/상주</th>
              <th>일정</th>
              <th>유가족 계정</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id}>
                <td>
                  {room.roomName}
                  <div>
                    <span className={`badge ${room.status}`}>{room.status}</span>
                  </div>
                </td>
                <td>
                  {room.deceasedName}
                  <br />
                  {room.hostName}
                </td>
                <td>
                  {new Date(room.startAt).toLocaleString("ko-KR")}
                  <br />~ {new Date(room.endAt).toLocaleString("ko-KR")}
                </td>
                <td>
                  {room.guestUsername}
                  <br />
                  {room.guestPasswordPlain}
                </td>
                <td>
                  <div className="inline-actions">
                    <button className="btn btn-ghost" type="button" onClick={() => edit(room)}>
                      수정
                    </button>
                    <button
                      className="btn btn-ghost"
                      type="button"
                      onClick={() => regenerate(room.id)}
                    >
                      계정재발급
                    </button>
                    <button
                      className="btn btn-ghost"
                      type="button"
                      onClick={() => remove(room.id)}
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
