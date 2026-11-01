import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { checkAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { AdminSignOut } from "@/components/AdminSignOut";
import { HomeContentAdmin } from "@/components/HomeContentAdmin";
import { siteConfig } from "@/lib/site";
import type { ShowcaseSlide } from "@/components/HomeCarousel";

export const metadata: Metadata = { title: "Home Management | ANVG", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

type Metric = { id: string; metric_key: string; label: string; value: string; display_order: number };

const defaults = {
  site_name: siteConfig.name,
  tagline: siteConfig.tagline,
  home_hero_label: "ANVG • Waypoints Community Airline",
  home_hero_image_url: siteConfig.home.heroImageUrl,
  brand_logo_url: siteConfig.logoUrl,
  home_hero_alt_text: siteConfig.home.heroAltText,
  mission_text: siteConfig.home.mission,
  ceo_message: siteConfig.home.ceoMessage,
  ceo_name: siteConfig.home.ceoName,
  ceo_role: siteConfig.home.ceoRole,
  footer_waypoints_url: siteConfig.footer.waypointsUrl,
  footer_instagram_url: siteConfig.footer.instagramUrl,
  footer_youtube_url: siteConfig.footer.youtubeUrl,
  footer_vk_url: siteConfig.footer.vkUrl,
  footer_disclaimer: siteConfig.footer.disclaimer,
  footer_regional_credit: siteConfig.footer.regionalCredit,
  menu_powered_by: siteConfig.menuCredit.poweredBy,
  menu_developer_name: siteConfig.menuCredit.developer,
  menu_button_label: siteConfig.menuCredit.buttonLabel,
  menu_button_url: siteConfig.menuCredit.buttonUrl,
};

export default async function HomeManagementPage() {
  const access = await checkAdmin();
  if (!access.ok && access.reason === "not-authenticated") redirect("/admin");
  if (!access.ok) {
    return <main className="admin-screen"><div className="admin-login-card glass-panel"><h1>Admin access unavailable</h1><p className="admin-description">{access.reason === "not-configured" ? "Configure Supabase before using Home management." : "This account is not authorised to manage ANVG content."}</p><Link href="/admin" className="primary-button">Return to admin sign in</Link></div></main>;
  }

  const supabase = await createClient();
  if (!supabase) redirect("/admin");

  const [settingsResult, metricsResult, showcaseResult] = await Promise.all([
    supabase.from("site_settings").select("site_name, tagline, home_hero_label, home_hero_image_url, brand_logo_url, home_hero_alt_text, mission_text, ceo_message, ceo_name, ceo_role, footer_waypoints_url, footer_instagram_url, footer_youtube_url, footer_vk_url, footer_disclaimer, footer_regional_credit, menu_powered_by, menu_developer_name, menu_button_label, menu_button_url").eq("id", true).maybeSingle(),
    supabase.from("home_statistics").select("id, metric_key, label, value, display_order").order("display_order", { ascending: true }),
    supabase.from("home_showcase").select("id, title, image_url, alt_text, object_position, display_order").order("display_order", { ascending: true }),
  ]);
  
const settingsRow = (settingsResult.data ?? {}) as Partial<
  Record<keyof typeof defaults, string | null>
>;

const initialSettings: typeof defaults = Object.fromEntries(
  Object.keys(defaults).map((key) => [
    key,
    settingsRow[key as keyof typeof defaults] ??
      defaults[key as keyof typeof defaults],
  ])
) as typeof defaults;

  return (
    <main className="admin-dashboard-screen">
      <header className="admin-topbar">
        <Link href="/" className="admin-brand"><img src={initialSettings.brand_logo_url} alt="ANVG" /><span>ANVG <small>ADMIN CENTRE</small></span></Link>
        <div className="admin-topbar-right"><span className="admin-identity">{access.email ?? "Authorised administrator"}</span><AdminSignOut /></div>
      </header>
      <section className="admin-content page-container">
        <HomeContentAdmin initialSettings={initialSettings} initialMetrics={initialMetrics} initialSlides={initialSlides} />
      </section>
    </main>
  );
}
