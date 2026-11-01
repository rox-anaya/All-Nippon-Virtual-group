import type { Metadata } from "next";
import { ArrowUpRight, RadioTower } from "lucide-react";
import { PublicLayout } from "@/components/PublicLayout";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Codeshare Alliances | ANVG" };
export const dynamic = "force-dynamic";
type Partner = { id: string; airline_name: string; logo_url: string | null; description: string; aircraft_information: string };
export default async function CodesharePage() {
  const supabase = await createClient();
  let partners: Partner[] = [];
  if (supabase) {
    const { data } = await supabase.from("codeshare_partners").select("id,airline_name,logo_url,description,aircraft_information").eq("is_published", true).eq("is_active", true).order("display_order");
    if (data) partners = data as Partner[];
  }
  return <PublicLayout currentPath="/codeshare"><div className="page-container stage-page content-page"><div className="page-heading"><span className="eyebrow"><span className="eyebrow-line"/> ANVG / PARTNER NETWORK</span><h1>Stronger skies, shared.</h1><p>Our codeshare programme connects the ANVG community with partner virtual airlines, creating more opportunities to fly together across the Waypoints network.</p></div>
    <div className="content-feature-strip glass-panel"><RadioTower size={24}/><div><strong>Connected by community</strong><span>Partner routes and aircraft information are displayed when confirmed and published.</span></div><span className="content-feature-count">{partners.length} PARTNERS</span></div>
    {partners.length ? <div className="partner-grid">{partners.map((partner) => <article className="partner-card glass-panel" key={partner.id}>{partner.logo_url ? <img src={partner.logo_url} alt={`${partner.airline_name} logo`}/> : <div className="partner-mark"><RadioTower size={27}/></div>}<div><span className="eyebrow">OFFICIAL CODESHARE PARTNER</span><h2>{partner.airline_name}</h2><p>{partner.description}</p>{partner.aircraft_information && <small>{partner.aircraft_information}</small>}</div><ArrowUpRight size={17}/></article>)}</div> : <div className="content-empty glass-panel"><RadioTower size={23}/><h3>Partner announcements are on the way</h3><p>Confirmed codeshare airlines will be introduced here with their branding, details and shared operating information.</p></div>}
  </div></PublicLayout>;
}
