"use client";

import { useEffect, useState } from "react";

type Item = {
  _id: string;
  title: string;
  body?: string;
  imageUrl?: string;
  linkUrl?: string;
  active?: boolean;
};

const empty = { title: "", body: "", imageUrl: "", linkUrl: "", active: true };

export default function AdminPopupsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function load() {
    const res = await fetch("/api/popups");
    const data = await res.json();
    setItems(data.items || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/popups", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingId ? { id: editingId, ...form } : form),
    });
    setMessage(res.ok ? "저장되었습니다." : "저장 실패");
    setForm(empty);
    setEditingId(null);
    load();
  }

  async function remove(id: string) {
    if (!confirm("삭제할까요?")) return;
    await fetch(`/api/popups?id=${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1>팝업관리</h1>
      <form className="panel" onSubmit={save}>
        {message && <div className="msg ok">{message}</div>}
        <div className="field">
          <label>제목</label>
          <input
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            required
          />
        </div>
        <div className="field">
          <label>내용</label>
          <textarea
            rows={4}
            value={form.body}
            onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
          />
        </div>
        <div className="field">
          <label>이미지 URL</label>
          <input
            value={form.imageUrl}
            onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
          />
        </div>
        <div className="field">
          <label>링크 URL</label>
          <input
            value={form.linkUrl}
            onChange={(e) => setForm((f) => ({ ...f, linkUrl: e.target.value }))}
          />
        </div>
        <label className="agree-row">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
          />
          활성
        </label>
        <div className="inline-actions" style={{ marginTop: "1rem" }}>
          <button className="btn btn-primary" type="submit">
            {editingId ? "수정" : "등록"}
          </button>
          {editingId && (
            <button
              className="btn btn-ghost"
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(empty);
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
              <th>제목</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td>{item.title}</td>
                <td>{item.active ? "활성" : "비활성"}</td>
                <td>
                  <div className="inline-actions">
                    <button
                      className="btn btn-ghost"
                      type="button"
                      onClick={() => {
                        setEditingId(item._id);
                        setForm({
                          title: item.title,
                          body: item.body || "",
                          imageUrl: item.imageUrl || "",
                          linkUrl: item.linkUrl || "",
                          active: item.active ?? true,
                        });
                      }}
                    >
                      수정
                    </button>
                    <button
                      className="btn btn-ghost"
                      type="button"
                      onClick={() => remove(item._id)}
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
