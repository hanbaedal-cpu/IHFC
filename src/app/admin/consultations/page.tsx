"use client";

import { useEffect, useMemo, useState } from "react";
import { formatPhone } from "@/lib/utils";
import { formatKstDateTime } from "@/lib/time";

type Item = {
  _id: string;
  name: string;
  phone: string;
  status: "new" | "contacted" | "closed";
  adminNote?: string;
  createdAt: string;
};

export default function ConsultationsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  async function load() {
    const res = await fetch("/api/consultations");
    const data = await res.json();
    setItems(data.items || []);
  }

  useEffect(() => {
    load();
  }, []);

  const allIds = useMemo(() => items.map((i) => i._id), [items]);

  async function updateStatus(id: string, status: Item["status"]) {
    await fetch("/api/consultations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    load();
  }

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function goSms() {
    const ids = selected.join(",");
    window.location.href = `/admin/sms?ids=${ids}`;
  }

  return (
    <div>
      <h1>상담 신청 리스트</h1>
      <div className="panel inline-actions">
        <button
          className="btn btn-ghost"
          type="button"
          onClick={() => setSelected(allIds)}
        >
          전체 선택
        </button>
        <button className="btn btn-ghost" type="button" onClick={() => setSelected([])}>
          선택 해제
        </button>
        <button
          className="btn btn-primary"
          type="button"
          disabled={!selected.length}
          onClick={goSms}
        >
          선택 건 문자 발송 ({selected.length})
        </button>
      </div>
      {message && <div className="msg ok">{message}</div>}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>선택</th>
              <th>이름</th>
              <th>연락처</th>
              <th>상태</th>
              <th>신청일시</th>
              <th>처리</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selected.includes(item._id)}
                    onChange={() => toggle(item._id)}
                  />
                </td>
                <td>{item.name}</td>
                <td>{formatPhone(item.phone)}</td>
                <td>
                  <span className={`badge ${item.status}`}>{item.status}</span>
                </td>
                <td>{formatKstDateTime(item.createdAt)}</td>
                <td>
                  <div className="inline-actions">
                    <button
                      className="btn btn-ghost"
                      type="button"
                      onClick={() => updateStatus(item._id, "contacted")}
                    >
                      연락완료
                    </button>
                    <button
                      className="btn btn-ghost"
                      type="button"
                      onClick={() => {
                        updateStatus(item._id, "closed");
                        setMessage("상담을 종료 처리했습니다.");
                      }}
                    >
                      종료
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
