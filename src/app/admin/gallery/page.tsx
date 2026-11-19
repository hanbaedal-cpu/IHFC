"use client";

import { useEffect, useState } from "react";

type Item = {
  _id: string;
  title: string;
  imageUrl: string;
  description?: string;
  category?: string;
  active?: boolean;
};

const empty = {
  title: "",
  imageUrl: "",
  description: "",
  category: "시설",
  active: true,
};

export default function AdminGalleryPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/gallery");
    const data = await res.json();
    setItems(data.items || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/gallery", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingId ? { id: editingId, ...form } : form),
    });
    setForm(empty);
    setEditingId(null);
    load();
  }

  async function remove(id: string) {
    if (!confirm("삭제할까요?")) return;
    await fetch(`/api/gallery?id=${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1>갤러리 관리</h1>
      <form className="panel" onSubmit={save}>
        <div className="field">
          <label>제목</label>
          <input
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            required
          />
        </div>
        <div className="field">
          <label>이미지 URL</label>
          <input
            value={form.imageUrl}
            onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
            required
          />
        </div>
        <div className="field">
          <label>설명</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
        </div>
        <div className="field">
          <label>분류</label>
          <input
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          />
        </div>
        <button className="btn btn-primary" type="submit">
          {editingId ? "수정" : "등록"}
        </button>
      </form>
      <div className="facility-grid">
        {items.map((item) => (
          <article key={item._id} className="facility-card">
            <div
              className="thumb"
              style={{ backgroundImage: `url(${item.imageUrl})`, cursor: "default" }}
            >
              <span className="thumb-label">{item.category}</span>
            </div>
            <div className="body">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <div className="inline-actions">
                <button
                  className="btn btn-ghost"
                  type="button"
                  onClick={() => {
                    setEditingId(item._id);
                    setForm({
                      title: item.title,
                      imageUrl: item.imageUrl,
                      description: item.description || "",
                      category: item.category || "시설",
                      active: item.active ?? true,
                    });
                  }}
                >
                  수정
                </button>
                <button className="btn btn-ghost" type="button" onClick={() => remove(item._id)}>
                  삭제
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
