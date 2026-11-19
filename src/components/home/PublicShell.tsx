import { SiteHeader } from "@/components/home/SiteHeader";
import { SnsBar } from "@/components/home/SnsBar";
import { SitePopup } from "@/components/home/SitePopup";
import { NAV_ITEMS } from "@/lib/site-content";
import { t } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/types";

type SettingsLike = {
  siteName: string;
  notice?: string;
  phone?: string;
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
  locale = "ko",
}: {
  settings: SettingsLike;
  activePath?: string;
  children: React.ReactNode;
  showNotice?: boolean;
  locale?: Locale;
}) {
  const navItems = NAV_ITEMS.map((item) => ({
    href: item.href,
    label: t(locale, `nav.${item.key}`),
  }));

  return (
    <>
      {showNotice && settings.notice ? (
        <div className="top-banner">{settings.notice}</div>
      ) : null}
      <SiteHeader
        siteName={settings.siteName}
        phone={settings.phone}
        activePath={activePath}
        locale={locale}
        navItems={navItems}
        labels={{
          sitemap: t(locale, "nav.sitemap"),
          admin: t(locale, "nav.admin"),
          guestLogin: t(locale, "nav.guestLogin"),
          memorialWrite: t(locale, "nav.memorialWrite"),
          adminLogin: t(locale, "nav.adminLogin"),
          consult24: t(locale, "nav.consult24"),
        }}
      />
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
