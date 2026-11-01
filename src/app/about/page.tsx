import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass, Globe2, PlaneTakeoff, ShieldCheck } from "lucide-react";
import { PublicLayout } from "@/components/PublicLayout";
import { createClient } from "@/lib/supabase/server";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About ANVG",
  description:
    "Discover All Nippon Virtual Group, an independent, Japan-inspired virtual aviation community operating on Waypoints.",
};

const defaultAbout =
  "All Nippon Virtual Group is an independent virtual aviation community inspired by the spirit of Japanese aviation. We bring virtual pilots together to explore a connected network, share memorable flights, and grow through a common passion for aviation.";

const principles = [
  {
    icon: PlaneTakeoff,
    number: "01",
    title: "Fly with purpose",
    description:
      "Every flight is an opportunity to build experience, discover a new destination, and contribute to our shared operations.",
  },
  {
    icon: Globe2,
    number: "02",
    title: "Stay connected",
    description:
      "Our community brings pilots together across routes and time zones, with Waypoints supporting our flight operations and activity.",
  },
  {
    icon: ShieldCheck,
    number: "03",
    title: "Grow together",
    description:
      "We value preparation, respect, consistency, and a welcoming environment where every pilot can keep improving.",
  },
];

export default async function AboutPage() {
  let aboutDescription = defaultAbout;
  let mission = siteConfig.home.mission;
  let subtitle = "The Spirit of Japanese Aviation • Official Community Airline on Waypoints";

  const supabase = await createClient();
  if (supabase) {
    const { data } = await supabase
      .from("site_settings")
      .select("about_description, mission_text, site_subtitle")
      .eq("id", true)
      .maybeSingle();

    if (data) {
      aboutDescription = data.about_description?.trim() || defaultAbout;
      mission = data.mission_text?.trim() || mission;
      subtitle = data.site_subtitle?.trim() || subtitle;
    }
  }

  return (
    <PublicLayout currentPath="/about">
      <div className="community-page about-page">
        <section className="page-container community-hero">
          <div className="page-heading">
            <span className="eyebrow"><span className="eyebrow-line" /> THE STORY OF ANVG</span>
            <h1>Discover <span>ANVG.</span></h1>
            <p>{subtitle}</p>
          </div>

          <div className="about-intro-card glass-panel">
            <div className="about-intro-copy">
              <span className="community-overline">INDEPENDENT VIRTUAL AVIATION COMMUNITY</span>
              <h2>One community.<br /><span>Countless horizons.</span></h2>
              <p>{aboutDescription}</p>
              <div className="community-hero-actions">
                <Link href="/apply" className="primary-button">Join ANVG <ArrowRight size={16} /></Link>
                <Link href="/pilots" className="secondary-button">Meet our pilots</Link>
              </div>
            </div>
            <div className="about-emblem" aria-hidden="true">
              <span className="about-orbit about-orbit-one" />
              <span className="about-orbit about-orbit-two" />
              <div className="about-emblem-core"><Compass size={54} strokeWidth={1.1} /><span>ANVG</span></div>
              <span className="about-emblem-caption">FLY BEYOND BORDERS</span>
            </div>
          </div>
        </section>

        <section className="page-container community-section about-principles-section">
          <div className="home-section-heading">
            <div><span className="eyebrow">WHAT DEFINES US</span><h2>More than the flight</h2></div>
            <span className="section-index">01 / OUR PRINCIPLES</span>
          </div>
          <div className="about-principles-grid">
            {principles.map((item) => {
              const Icon = item.icon;
              return (
                <article className="about-principle-card glass-panel" key={item.number}>
                  <div className="about-principle-top"><span>{item.number}</span><Icon size={21} strokeWidth={1.6} /></div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="page-container community-section about-mission-card glass-panel">
          <div>
            <span className="eyebrow">OUR PURPOSE</span>
            <h2>Our mission</h2>
          </div>
          <p>{mission}</p>
          <span className="about-mission-mark" aria-hidden="true">ANVG</span>
        </section>

        <section className="page-container about-disclaimer">
          <span className="about-disclaimer-line" />
          <p>All Nippon Virtual Group is an independent virtual community and is not affiliated with All Nippon Airways (ANA) or ANA Holdings.</p>
        </section>
      </div>
    </PublicLayout>
  );
}
