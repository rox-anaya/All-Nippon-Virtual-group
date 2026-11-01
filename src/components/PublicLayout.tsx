import type { ReactNode } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import { siteConfig } from "@/lib/site";
import { safeExternalUrl } from "@/lib/urls";

export type GlobalSiteSettings = {
  site_name: string;
  brand_logo_url: string;
  footer_waypoints_url: string;
  footer_instagram_url: string | null;
  footer_youtube_url: string | null;
  footer_vk_url: string | null;
  footer_disclaimer: string;
  footer_regional_credit: string;
  menu_powered_by: string;
  menu_developer_name: string;
  menu_button_label: string;
  menu_button_url: string | null;
};

const defaultGlobalSettings: GlobalSiteSettings = {
  site_name: siteConfig.name,
  brand_logo_url: siteConfig.logoUrl,
  footer_waypoints_url: siteConfig.footer.waypointsUrl,
  footer_instagram_url: siteConfig.footer.instagramUrl || null,
  footer_youtube_url: siteConfig.footer.youtubeUrl,
  footer_vk_url: siteConfig.footer.vkUrl || null,
  footer_disclaimer: siteConfig.footer.disclaimer,
  footer_regional_credit: siteConfig.footer.regionalCredit,
  menu_powered_by: siteConfig.menuCredit.poweredBy,
  menu_developer_name: siteConfig.menuCredit.developer,
  menu_button_label: siteConfig.menuCredit.buttonLabel,
  menu_button_url: siteConfig.menuCredit.buttonUrl || null,
};

export async function PublicLayout({
  children,
  currentPath,
}: {
  children: ReactNode;
  currentPath: string;
}) {
  let settings = defaultGlobalSettings;
  const supabase = await createClient();
  if (supabase) {
    const { data } = await supabase
      .from("site_settings")
      .select("site_name, brand_logo_url, footer_waypoints_url, footer_instagram_url, footer_youtube_url, footer_vk_url, footer_disclaimer, footer_regional_credit, menu_powered_by, menu_developer_name, menu_button_label, menu_button_url")
      .eq("id", true)
      .maybeSingle();
    if (data) settings = { ...defaultGlobalSettings, ...data } as GlobalSiteSettings;
  }

  const menuCredit = {
    poweredBy: settings.menu_powered_by,
    developer: settings.menu_developer_name,
    buttonLabel: settings.menu_button_label,
    buttonUrl: safeExternalUrl(settings.menu_button_url),
  };

  return (
    <>
      <Navigation logoUrl={settings.brand_logo_url} brandName={settings.site_name} menuCredit={menuCredit} />
      <main className="public-main">{children}</main>
      <Footer currentPath={currentPath} logoUrl={settings.brand_logo_url} settings={settings} />
    </>
  );
}
