"use client";

type Props = {
  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  naverBlogUrl?: string;
};

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="#1877F2" />
      <path
        fill="#fff"
        d="M13.5 8.5h1.7V6.1c-.3 0-.9-.1-1.7-.1-1.7 0-2.9 1.1-2.9 3V11H8.5v2.6h2.1V20h2.7v-6.4h2.2l.4-2.6h-2.6V9.3c0-.7.2-1.2 1.2-1.2z"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <radialGradient id="ig" cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="5%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <rect width="24" height="24" rx="6" fill="url(#ig)" />
      <path
        fill="none"
        stroke="#fff"
        strokeWidth="1.7"
        d="M12 16.2a4.2 4.2 0 1 0 0-8.4 4.2 4.2 0 0 0 0 8.4z"
      />
      <circle cx="17.2" cy="6.8" r="1.1" fill="#fff" />
      <rect
        x="5.4"
        y="5.4"
        width="13.2"
        height="13.2"
        rx="3.6"
        fill="none"
        stroke="#fff"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect width="24" height="24" rx="6" fill="#FF0000" />
      <path fill="#fff" d="M10 8.5v7l6-3.5-6-3.5z" />
    </svg>
  );
}

function NaverIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect width="24" height="24" rx="6" fill="#03C75A" />
      <path
        fill="#fff"
        d="M7.2 6.5h3.1l3.4 5.1V6.5h3.1v11h-3.1l-3.4-5.1v5.1H7.2v-11z"
      />
    </svg>
  );
}

const items = [
  { key: "facebookUrl", label: "Facebook", Icon: FacebookIcon, brand: "facebook" },
  { key: "instagramUrl", label: "Instagram", Icon: InstagramIcon, brand: "instagram" },
  { key: "youtubeUrl", label: "YouTube", Icon: YoutubeIcon, brand: "youtube" },
  { key: "naverBlogUrl", label: "Naver Blog", Icon: NaverIcon, brand: "naver" },
] as const;

export function SnsBar(props: Props) {
  return (
    <aside className="sns-bar" aria-label="SNS">
      {items.map((item) => {
        const href = props[item.key]?.trim();
        const Icon = item.Icon;
        if (!href) {
          return (
            <span
              key={item.key}
              className={`sns-btn sns-${item.brand} muted`}
              title={`${item.label} (미등록)`}
            >
              <Icon />
            </span>
          );
        }
        return (
          <a
            key={item.key}
            className={`sns-btn sns-${item.brand}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            title={item.label}
            aria-label={item.label}
          >
            <Icon />
          </a>
        );
      })}
    </aside>
  );
}
