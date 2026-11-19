"use client";

import { useState } from "react";

type Facility = {
  name: string;
  size: string;
  desc: string;
  image: string;
};

export function FacilityGallery({ facilities }: { facilities: Facility[] }) {
  const [active, setActive] = useState<Facility | null>(null);

  return (
    <>
      <p style={{ color: "var(--muted)", marginTop: "-0.5rem", marginBottom: "1.5rem" }}>
        이미지를 클릭하시면 크게 볼 수 있습니다.
      </p>
      <div className="facility-grid">
        {facilities.map((item) => (
          <article key={item.name} className="facility-card">
            <button
              type="button"
              className="thumb thumb-media"
              onClick={() => setActive(item)}
              aria-label={`${item.name} 이미지 크게 보기`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt={item.name} />
              <span className="thumb-label">{item.size}</span>
            </button>
            <div className="body">
              <h3>{item.name}</h3>
              <p>{item.desc}</p>
            </div>
          </article>
        ))}
      </div>

      {active && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={active.name}
          onClick={() => setActive(null)}
        >
          <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="lightbox-close"
              onClick={() => setActive(null)}
              aria-label="닫기"
            >
              ×
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={active.image} alt={active.name} />
            <div className="lightbox-caption">
              <strong>{active.name}</strong>
              <span>{active.size}</span>
              <p>{active.desc}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
