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
      <div className="rd-fac-grid">
        {facilities.map((item) => (
          <article key={item.name} className="rd-fac-card">
            <button
              type="button"
              className="rd-fac-media"
              aria-label={`${item.name} 이미지 크게 보기`}
              onClick={() => setActive(item)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt={item.name} />
            </button>
            <div className="rd-fac-body">
              <p className="size">{item.size}</p>
              <h3>{item.name}</h3>
              <p>{item.desc}</p>
            </div>
          </article>
        ))}
      </div>

      {active && (
        <div className="rd-lightbox" role="dialog" aria-modal="true">
          <button type="button" aria-label="닫기" onClick={() => setActive(null)}>
            ×
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={active.image} alt={active.name} />
        </div>
      )}
    </>
  );
}
