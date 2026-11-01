import Link from "next/link";
import { ArrowRight, ArrowUpRight, Compass, MapPinned, Plane, RadioTower, Users } from "lucide-react";
import { PublicLayout } from "@/components/PublicLayout";
import { HomeCarousel, type ShowcaseSlide } from "@/components/HomeCarousel";
import { siteConfig } from "@/lib/site";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Metric = { id: string; metric_key: string; label: string; value: string; display_order: number };
type HomeSettings = {
  site_name?: string;
  tagline?: string;
  home_hero_label?: string;
  home_hero_image_url?: string;
  home_hero_alt_text?: string;
  mission_text?: string;
  ceo_message?: string;
  ceo_name?: string;
  ceo_role?: string;
};

const defaultMetrics: Metric[] = [
  { id: "flight-hours", metric_key: "flight_hours", label: "Flight Hours Flown", value: "0", display_order: 1 },
  { id: "pireps", metric_key: "total_pireps", label: "Total PIREPs", value: "0", display_order: 2 },
  { id: "hubs", metric_key: "hubs", label: "Hubs", value: "4", display_order: 3 },
  { id: "families", metric_key: "aircraft_family", label: "Aircraft Family", value: "0", display_order: 4 },
  { id: "destinations", metric_key: "destinations", label: "Destinations", value: "0", display_order: 5 },
];

const defaultSlides: ShowcaseSlide[] = [
  { id: "fleet-01", title: "ANVG Fleet 01", image_url: "https://res.cloudinary.com/dsfwafyc2/image/upload/v1790574373/InfiniteFlight_2026-09-27-13-11-43_c2obn9.webp", alt_text: "ANVG aircraft showcase one" },
  { id: "fleet-02", title: "ANVG Fleet 02", image_url: "https://res.cloudinary.com/dsfwafyc2/image/upload/v1790574372/InfiniteFlight_2026-09-27-13-11-46_tbcdxz.webp", alt_text: "ANVG aircraft showcase two" },
  { id: "fleet-03", title: "ANVG Fleet 03", image_url: "https://res.cloudinary.com/dsfwafyc2/image/upload/v1790574372/InfiniteFlight_2026-09-27-13-11-15_cmvok8.webp", alt_text: "ANVG aircraft showcase three" },
  { id: "fleet-04", title: "ANVG Fleet 04", image_url: "https://res.cloudinary.com/dsfwafyc2/image/upload/v1790574372/InfiniteFlight_2026-09-27-13-11-38_fj7ej7.webp", alt_text: "ANVG aircraft showcase four" },
  { id: "fleet-05", title: "ANVG Fleet 05", image_url: "https://res.cloudinary.com/dsfwafyc2/image/upload/v1790574372/InfiniteFlight_2026-09-27-13-11-19_oor104.webp", alt_text: "ANVG aircraft showcase five" },
];

export default async function HomePage() {
  const supabase = await createClient();
  let settings: HomeSettings = {};
  let metrics = defaultMetrics;
  let slides = defaultSlides;

  if (supabase) {
    const [settingsResult, metricsResult, showcaseResult] = await Promise.all([
      supabase.from("site_settings").select("site_name, tagline, home_hero_label, home_hero_image_url, home_hero_alt_text, mission_text, ceo_message, ceo_name, ceo_role").eq("id", true).maybeSingle(),
      supabase.from("home_statistics").select("id, metric_key, label, value, display_order").eq("is_published", true).eq("is_active", true).order("display_order", { ascending: true }),
      supabase.from("home_showcase").select("id, title, image_url, alt_text, object_position, display_order").eq("is_published", true).eq("is_active", true).order("display_order", { ascending: true }),
    ]);
    if (settingsResult.data) settings = settingsResult.data as HomeSettings;
    if (metricsResult.data?.length) metrics = metricsResult.data as Metric[];
    if (showcaseResult.data?.length) slides = showcaseResult.data as ShowcaseSlide[];
  }

  const siteName = settings.site_name || siteConfig.name;
  const tagline = settings.tagline || siteConfig.tagline;
  const heroLabel = settings.home_hero_label || "ANVG • Waypoints Community Airline";
  const heroImage = settings.home_hero_image_url || siteConfig.home.heroImageUrl;
  const heroAlt = settings.home_hero_alt_text || siteConfig.home.heroAltText;
  const mission = settings.mission_text || siteConfig.home.mission;
  const ceoMessage = settings.ceo_message || siteConfig.home.ceoMessage;
  const ceoName = settings.ceo_name || siteConfig.home.ceoName;
  const ceoRole = settings.ceo_role || siteConfig.home.ceoRole;

  return (
    <PublicLayout currentPath="/">
      <div className="home-page">
        <section className="home-hero page-container">
          <div className="hero-copy">
            <span className="hero-label"><span className="hero-label-mark" /> {heroLabel}</span>
            <h1>{siteName}</h1>
            <p className="hero-tagline">{tagline}</p>
            <div className="hero-actions">
              <Link href="/events" className="primary-button">Events <ArrowRight size={16} /></Link>
              <Link href="/about" className="secondary-button">Learn More</Link>
              <Link href="/fleet" className="secondary-button">Join Fleet</Link>
            </div>
          </div>
          <div className="hero-image-wrap">
            <img src={heroImage} alt={heroAlt} className="hero-aircraft-image" />
            <div className="hero-image-caption"><span>ANVG / VIRTUAL OPERATIONS</span><span>01 — FLIGHT DECK</span></div>
          </div>
          <div className="hero-bottom-rule"><span /> <span>JAPAN INSPIRED · WORLD CONNECTED</span></div>
        </section>

        <section className="page-container stats-section" aria-label="ANVG statistics">
          <div className="stats-panel glass-panel">
            {metrics.slice(0, 5).map((metric) => (
              <div className="stat-item" key={metric.id || metric.metric_key}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="page-container home-operations-section">
          <div className="home-section-heading"><div><span className="eyebrow">ANVG / FLIGHT OPERATIONS</span><h2>Operations Center</h2></div><span className="section-index">01 / OPERATIONS</span></div>
          <div className="operations-card glass-panel">
            <div className="operations-copy"><span className="operations-overline">COMMUNITY FLIGHT DECK</span><h3>Where every route<br />connects a story.</h3><p>Explore our pilots, network and airline partnerships across the Waypoints community.</p></div>
            <div className="operations-actions">
              <Link href="/pilots" className="operation-button"><Users size={17} /><span>Pilots</span><ArrowUpRight size={15} /></Link>
              <Link href="/routes" className="operation-button"><MapPinned size={17} /><span>Routes</span><ArrowUpRight size={15} /></Link>
              <Link href="/codeshare" className="operation-button"><RadioTower size={17} /><span>Codeshare</span><ArrowUpRight size={15} /></Link>
            </div>
            <div className="operations-footer">Operations and flight logging powered by Waypoints <span className="operations-separator">|</span> Last updated: Oct 2026</div>
          </div>
        </section>

        <section className="page-container live-map-section">
          <div className="home-section-heading"><div><span className="eyebrow">NETWORK ACTIVITY</span><h2>Live Map</h2></div><span className="live-online"><span className="status-dot" /> Online</span></div>
          <div className="live-map-card glass-panel">
            <div className="map-card-topline"><span>GLOBAL FLIGHT TRACKING</span><span>WAYPOINTS / LIVE</span></div>
            <iframe
              src="https://waypoint-live.app/embed/va/all-nippon-virtual-airways"
              width="100%"
              height="420"
              style={{ border: 0, borderRadius: 12 }}
              title="Live flights"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
            <p className="map-fallback-note">Map loading is provided by Waypoints. If the embedded map is unavailable, open the <a href="https://waypoint-live.app/va/all-nippon-virtual-airways/apply" target="_blank" rel="noreferrer noopener">Waypoints portal <ArrowUpRight size={12} /></a>.</p>
          </div>
        </section>

        <section className="page-container mission-showcase-grid">
          <article className="mission-card glass-panel">
            <span className="eyebrow">OUR PURPOSE</span>
            <h2>Our Mission</h2>
            <p>{mission}</p>
            <div className="mission-signature"><span /> ANVG / EST. 2026</div>
          </article>
          <article className="showcase-card glass-panel">
            <div className="home-section-heading showcase-heading"><div><span className="eyebrow">AIRCRAFT COLLECTION</span><h2>Fleet Showcase</h2></div><Link href="/fleet" className="small-text-link">View Fleet <ArrowUpRight size={14} /></Link></div>
            <HomeCarousel slides={slides} />
          </article>
        </section>

        <section className="page-container ceo-join-grid">
          <article className="ceo-message-card glass-panel">
            <span className="eyebrow">A MESSAGE FROM LEADERSHIP</span>
            <div className="quote-mark">“</div>
            <p>{ceoMessage}</p>
            <div className="ceo-signoff"><strong>— {ceoName}</strong><span>{ceoRole}</span></div>
          </article>
          <article className="join-card glass-panel">
            <span className="eyebrow">YOUR NEXT DESTINATION</span>
            <div className="join-card-icon"><Plane size={21} /></div>
            <h2>Ready to join?</h2>
            <p>Experience virtual flight operations with our community. Become part of our growing virtual family today.</p>
            <Link href="/apply" className="primary-button">Submit Application <ArrowRight size={16} /></Link>
          </article>
        </section>
      </div>
    </PublicLayout>
  );
}
