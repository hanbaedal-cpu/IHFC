"use client";

type Props = {
  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  naverBlogUrl?: string;
};

const items = [
  { key: "facebookUrl", label: "Facebook", short: "f" },
  { key: "instagramUrl", label: "Instagram", short: "in" },
  { key: "youtubeUrl", label: "YouTube", short: "yt" },
  { key: "naverBlogUrl", label: "Naver Blog", short: "N" },
] as const;

export function SnsBar(props: Props) {
  const links = items
    .map((item) => ({
      ...item,
      href: props[item.key]?.trim() || "",
    }))
    .filter((item) => item.href);

  if (!links.length) {
    return (
      <aside className="sns-bar" aria-label="SNS">
        {items.map((item) => (
          <span key={item.key} className="sns-btn muted" title={`${item.label} (미등록)`}>
            {item.short}
          </span>
        ))}
      </aside>
    );
  }

  return (
    <aside className="sns-bar" aria-label="SNS">
      {items.map((item) => {
        const href = props[item.key]?.trim();
        if (!href) {
          return (
            <span key={item.key} className="sns-btn muted" title={`${item.label} (미등록)`}>
              {item.short}
            </span>
          );
        }
        return (
          <a
            key={item.key}
            className="sns-btn"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            title={item.label}
            aria-label={item.label}
          >
            {item.short}
          </a>
        );
      })}
    </aside>
  );
}
