import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, ClipboardList, GraduationCap, ShieldCheck } from "lucide-react";
import { PublicLayout } from "@/components/PublicLayout";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Pilot Training | ANVG", description: "Review the published training stages and recruitment flow for ANVG pilots." };
export const dynamic = "force-dynamic";

type TrainingStage = { id: string; stage_number: number; title: string; description: string; assessment_information: string };
type RecruitmentStep = { id: string; step_number: number; title: string; description: string };

export default async function TrainingPage() {
  const supabase = await createClient();
  let stages: TrainingStage[] = [];
  let recruitment: RecruitmentStep[] = [];
  let settings = { page_title: "Pilot Training & Evaluation", page_description: "A clear training pathway helps ANVG pilots build confidence, consistency and good virtual flight habits.", evaluation_heading: "Training stages", recruitment_heading: "Recruitment flow", cta_heading: "Ready to take off?", cta_description: "Start with the official ANVG pilot application and follow the published intake process.", cta_button_label: "Explore pilot application", cta_destination: "/apply" };
  if (supabase) {
    const [stageResult, recruitmentResult, settingsResult] = await Promise.all([
      supabase.from("training_stages").select("id,stage_number,title,description,assessment_information").eq("is_published", true).eq("is_active", true).order("display_order"),
      supabase.from("recruitment_steps").select("id,step_number,title,description").eq("is_published", true).eq("is_active", true).order("display_order"),
      supabase.from("training_page_settings").select("page_title,page_description,evaluation_heading,recruitment_heading,cta_heading,cta_description,cta_button_label,cta_destination").eq("id", true).maybeSingle(),
    ]);
    stages = (stageResult.data ?? []) as TrainingStage[];
    recruitment = (recruitmentResult.data ?? []) as RecruitmentStep[];
    if (settingsResult.data) settings = { ...settings, ...settingsResult.data };
  }
  const requestedPath = settings.cta_destination?.trim() ?? "";
  const ctaPath = requestedPath.startsWith("/") && !requestedPath.startsWith("//") && !requestedPath.includes("\\") ? requestedPath : "/apply";
  return (
    <PublicLayout currentPath="/training">
      <div className="page-container stage-page content-page">
        <header className="page-heading"><span className="eyebrow"><span className="eyebrow-line" /> ANVG / FLIGHT STANDARDS</span><h1>{settings.page_title}</h1><p>{settings.page_description}</p></header>
        <section className="training-principles-grid"><article className="training-principle glass-panel"><GraduationCap size={21}/><h3>Learn</h3><p>Build familiarity with the procedures and expectations published by the team.</p></article><article className="training-principle glass-panel"><ShieldCheck size={21}/><h3>Practise</h3><p>Develop consistent, considerate and safe virtual flight habits.</p></article><article className="training-principle glass-panel"><BookOpenCheck size={21}/><h3>Progress</h3><p>Follow the current training and evaluation guidance as it is published.</p></article></section>
        <section className="content-section"><div className="home-section-heading"><div><span className="eyebrow">FLIGHT STANDARDS</span><h2>{settings.evaluation_heading}</h2></div><span className="section-index">{String(stages.length).padStart(2, "0")} STAGES</span></div>{stages.length ? <div className="training-stage-list">{stages.map((stage) => <article className="training-stage glass-panel" key={stage.id}><span className="training-stage-number">{String(stage.stage_number).padStart(2, "0")}</span><div><h3>{stage.title}</h3><p>{stage.description}</p>{stage.assessment_information ? <div className="training-assessment"><ClipboardList size={15}/><span>{stage.assessment_information}</span></div> : null}</div></article>)}</div> : <div className="content-empty glass-panel"><BookOpenCheck size={22}/><h3>Training stages will be published here</h3><p>The ANVG team has not published its training-stage details yet. Please check back for the current guidance.</p></div>}</section>
        <section className="content-section"><div className="home-section-heading"><div><span className="eyebrow">FROM APPLICATION TO CREW</span><h2>{settings.recruitment_heading}</h2></div><span className="section-index">{String(recruitment.length).padStart(2, "0")} STEPS</span></div>{recruitment.length ? <div className="recruitment-flow">{recruitment.map((step) => <article className="recruitment-step glass-panel" key={step.id}><span>{String(step.step_number).padStart(2, "0")}</span><div><h3>{step.title}</h3><p>{step.description}</p></div></article>)}</div> : <div className="content-empty glass-panel"><ClipboardList size={22}/><h3>Recruitment flow will be announced</h3><p>Published recruitment steps will appear here when the ANVG team adds them.</p></div>}</section>
        <section className="training-cta glass-panel"><div><span className="eyebrow">YOUR NEXT WAYPOINT</span><h2>{settings.cta_heading}</h2><p>{settings.cta_description}</p></div><Link className="primary-button" href={ctaPath}>{settings.cta_button_label} <ArrowRight size={16}/></Link></section>
      </div>
    </PublicLayout>
  );
}
