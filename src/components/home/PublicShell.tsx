import { SiteHeader } from "@/components/home/SiteHeader";
import { SnsBar } from "@/components/home/SnsBar";
import { SitePopup } from "@/components/home/SitePopup";

type SettingsLike = {
  siteName: string;
  notice?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  naverBlogUrl?: string;
};

export function PublicShell({
  settings,
  activePath = "",
  children,
  showNotice = true,
}: {
  settings: SettingsLike;
  activePath?: string;
  children: React.ReactNode;
  showNotice?: boolean;
}) {
  return (
    <>
      {showNotice && settings.notice ? (
        <div className="top-banner">{settings.notice}</div>
      ) : null}
      <SiteHeader siteName={settings.siteName} activePath={activePath} />
      {children}
      <SnsBar
        facebookUrl={settings.facebookUrl}
        instagramUrl={settings.instagramUrl}
        youtubeUrl={settings.youtubeUrl}
        naverBlogUrl={settings.naverBlogUrl}
      />
      <SitePopup />
    </>
  );
}
