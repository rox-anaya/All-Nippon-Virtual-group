import type { Metadata } from "next";
import { Plane, Package } from "lucide-react";
import { PublicLayout } from "@/components/PublicLayout";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Fleet & Divisions | ANVG" };
export const dynamic = "force-dynamic";

type Division = { id: string; name: string; category: string; description: string; logo_url: string | null; brand_color: string };
type Aircraft = { id: string; division_id: string; name: string; model: string; description: string; image_url: string | null; category: string };

const fallbackDivisions: Division[] = [
  { id: "ana", name: "ANA", category: "Full-service airline", description: "All Nippon Airways connects Japan with domestic and international destinations.", logo_url: null, brand_color: "#70b8ef" },
  { id: "nca", name: "NCA", category: "Cargo airline", description: "Nippon Cargo Airlines represents dedicated freight operations across the virtual network.", logo_url: null, brand_color: "#d5b36b" },
  { id: "peach", name: "Peach Aviation", category: "Low-cost airline", description: "Peach Aviation focuses on affordable regional and domestic flying.", logo_url: null, brand_color: "#e58ab4" },
  { id: "jal", name: "Japan Airlines", category: "Full-service airline", description: "Japan Airlines connects Japan with destinations around the world.", logo_url: null, brand_color: "#e26d76" },
];

export default async function FleetPage() {
  const supabase = await createClient();
  let divisions: Division[] = fallbackDivisions;
  let aircraft: Aircraft[] = [];
  if (supabase) {
    const [divisionResult, aircraftResult] = await Promise.all([
      supabase.from("airline_divisions").select("id,name,category,description,logo_url,brand_color").eq("is_published", true).eq("is_active", true).order("display_order"),
      supabase.from("aircraft").select("id,division_id,name,model,description,image_url,category").eq("is_published", true).eq("is_active", true).order("display_order"),
    ]);
    if (divisionResult.data?.length) divisions = divisionResult.data as Division[];
    if (aircraftResult.data) aircraft = aircraftResult.data as Aircraft[];
  }
  return <PublicLayout currentPath="/fleet"><div className="page-container stage-page content-page"><div className="page-heading"><span className="eyebrow"><span className="eyebrow-line"/> ANVG / FLEET DIRECTORY</span><h1>The wings behind our network.</h1><p>Explore the aircraft assigned to each operating division. Fleet entries and images are managed through the ANVG administration system.</p></div>
    <div className="content-feature-strip glass-panel"><Plane size={23}/><div><strong>Four operating divisions</strong><span>Passenger services, regional connections and dedicated cargo operations.</span></div><span className="content-feature-count">{aircraft.length} AIRCRAFT</span></div>
    <div className="division-stack">{divisions.map((division) => { const items = aircraft.filter((item) => item.division_id === division.id); return <section className="division-section" key={division.id}><div className="division-heading"><span className="division-accent" style={{ background: division.brand_color }}/><div><span className="eyebrow">{division.category || "OPERATING DIVISION"}</span><h2>{division.name}</h2><p>{division.description}</p></div></div>{items.length ? <div className="fleet-grid">{items.map((item) => <article className="fleet-card glass-panel" key={item.id}>{item.image_url ? <img src={item.image_url} alt={item.name}/> : <div className="fleet-image-placeholder"><Plane size={34}/><span>ANVG FLEET</span></div>}<div className="fleet-card-copy"><span className="eyebrow">{item.category}</span><h3>{item.name}</h3><small>{item.model}</small><p>{item.description}</p></div></article>)}</div> : <div className="content-empty glass-panel"><Package size={20}/><p>Aircraft assigned to {division.name} will appear here once published by the ANVG team.</p></div>}</section>; })}</div>
  </div></PublicLayout>;
}
