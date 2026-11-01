import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ClipboardCheck, ExternalLink, FileCheck2, PlaneTakeoff } from "lucide-react";
import { PublicLayout } from "@/components/PublicLayout";
import { createClient } from "@/lib/supabase/server";
import { safeExternalUrl } from "@/lib/urls";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pilot Applications | ANVG",
  description: "Review the ANVG pilot intake information and begin your application through Waypoints.",
};
export const dynamic = "force-dynamic";

type Prerequisite = { id: string; item_number: number; heading: string; description: string };
type ApplicationStep = { id: string; step_number: number; heading: string; description: string };

export default async function ApplyPage() {
  const supabase = await createClient();
  let prerequisites: Prerequisite[] = [];
  let steps: ApplicationStep[] = [];
  let settings = {
    page_title: "Join Our Flight Deck",
    page_description: "Ready to fly with All Nippon Virtual Group? Review the published intake information, then continue to our official application route.",
    waypoints_heading: "Apply through Waypoints",
    waypoints_description: "ANVG uses the Waypoints platform for its virtual airline community and pilot intake.",
    intake_small_heading: "PILOT INTAKE",
    intake_main_heading: "Your next flight starts here.",
    intake_description: "Use the official application destination below to begin the current ANVG pilot intake process.",
    divider_text: "CONTINUE TO OFFICIAL APPLICATION",
    button_label: "Start application",
    destination_url: "https://waypoint-live.app/va/all-nippon-virtual-airways/apply",
  };

  if (supabase) {
    const [prerequisiteResult, stepResult, settingsResult] = await Promise.all([
      supabase.from("application_prerequisites").select("id,item_number,heading,description").eq("is_published", true).eq("is_active", true).order("display_order"),
      supabase.from("application_steps").select("id,step_number,heading,description").eq("is_published", true).eq("is_active", true).order("display_order"),
      supabase.from("application_page_settings").select("page_title,page_description,waypoints_heading,waypoints_description,intake_small_heading,intake_main_heading,intake_description,divider_text,button_label,destination_url").eq("id", true).maybeSingle(),
    ]);
    prerequisites = (prerequisiteResult.data ?? []) as Prerequisite[];
    steps = (stepResult.data ?? []) as ApplicationStep[];
    if (settingsResult.data) settings = { ...settings, ...settingsResult.data };
  }

  const applicationUrl = safeExternalUrl(settings.destination_url) || safeExternalUrl(siteConfig.footer.waypointsUrl);

  return (
    <PublicLayout currentPath="/apply">
      <div className="page-container stage-page content-page">
        <header className="page-heading">
          <span className="eyebrow"><span className="eyebrow-line" /> ANVG / PILOT INTAKE</span>
          <h1>{settings.page_title}</h1>
          <p>{settings.page_description}</p>
        </header>

        <section className="application-intro-grid">
          <article className="application-platform-card glass-panel">
            <div className="content-icon"><PlaneTakeoff size={22} /></div>
            <span className="eyebrow">WAYPOINTS COMMUNITY</span>
            <h2>{settings.waypoints_heading}</h2>
            <p>{settings.waypoints_description}</p>
            <Link href="/about" className="text-link">Discover ANVG <ArrowRight size={15} /></Link>
          </article>
          <article className="application-cta-card glass-panel">
            <span className="eyebrow">{settings.intake_small_heading}</span>
            <h2>{settings.intake_main_heading}</h2>
            <p>{settings.intake_description}</p>
            <span className="application-divider-label">{settings.divider_text}</span>
            {applicationUrl ? <a className="primary-button" href={applicationUrl} target="_blank" rel="noreferrer noopener">{settings.button_label} <ExternalLink size={15} /></a> : <span className="application-link-unavailable">Application link is not available yet.</span>}
          </article>
        </section>

        {prerequisites.length > 0 ? <section className="content-section">
          <div className="home-section-heading"><div><span className="eyebrow">BEFORE YOU APPLY</span><h2>Application prerequisites</h2></div><span className="section-index">{String(prerequisites.length).padStart(2, "0")} ITEMS</span></div>
          <div className="application-requirements-grid">{prerequisites.map((item) => <article className="application-requirement glass-panel" key={item.id}><span className="application-number">{String(item.item_number).padStart(2, "0")}</span><div><h3>{item.heading}</h3><p>{item.description}</p></div></article>)}</div>
        </section> : null}

        {steps.length > 0 ? <section className="content-section">
          <div className="home-section-heading"><div><span className="eyebrow">THE INTAKE JOURNEY</span><h2>What happens next</h2></div><span className="section-index">{String(steps.length).padStart(2, "0")} STEPS</span></div>
          <div className="application-steps-list">{steps.map((step) => <article className="application-step glass-panel" key={step.id}><span className="application-number">{String(step.step_number).padStart(2, "0")}</span><div><h3>{step.heading}</h3><p>{step.description}</p></div><ClipboardCheck size={19} /></article>)}</div>
        </section> : null}

        <p className="application-footnote">Application availability and intake decisions are managed through the official ANVG / Waypoints process.</p>
      </div>
    </PublicLayout>
  );
}
