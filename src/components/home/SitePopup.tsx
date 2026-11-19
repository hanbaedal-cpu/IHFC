"use client";

import { useEffect, useState } from "react";
import { todayKstKey } from "@/lib/time";

type PopupItem = {
  _id: string;
  title: string;
  body?: string;
  imageUrl?: string;
  linkUrl?: string;
};

export function SitePopup() {
  const [items, setItems] = useState<PopupItem[]>([]);
  const [hidden, setHidden] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch("/api/popups?active=1")
      .then((r) => r.json())
      .then((data) => {
        const list: PopupItem[] = data.items || [];
        const today = todayKstKey();
        const nextHidden: Record<string, boolean> = {};
        for (const item of list) {
          if (localStorage.getItem(`popup-hide-${item._id}`) === today) {
            nextHidden[item._id] = true;
          }
        }
        setHidden(nextHidden);
        setItems(list);
      })
      .catch(() => undefined);
  }, []);

  const visible = items.filter((item) => !hidden[item._id]);
  if (!visible.length) return null;
  const current = visible[0];

  function closeToday() {
    const today = todayKstKey();
    localStorage.setItem(`popup-hide-${current._id}`, today);
    setHidden((h) => ({ ...h, [current._id]: true }));
  }

  return (
    <div className="popup-overlay" role="dialog" aria-modal="true">
      <div className="popup-card">
        <h3>{current.title}</h3>
        {current.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={current.imageUrl} alt={current.title} />
        )}
        {current.body && <p style={{ whiteSpace: "pre-wrap" }}>{current.body}</p>}
        <div className="inline-actions">
          {current.linkUrl && (
            <a className="btn btn-primary" href={current.linkUrl} target="_blank" rel="noreferrer">
              자세히 보기
            </a>
          )}
          <button className="btn btn-ghost" type="button" onClick={closeToday}>
            오늘 하루 보지 않기
          </button>
          <button
            className="btn btn-ghost"
            type="button"
            onClick={() => setHidden((h) => ({ ...h, [current._id]: true }))}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
