import type { Metadata } from "next";
import { Award, BadgeCheck, Medal, Shield, Star, Trophy } from "lucide-react";
import { PublicLayout } from "@/components/PublicLayout";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Pilot Ranks | ANVG", description: "Explore the published pilot rank structure at All Nippon Virtual Group." };
export const dynamic = "force-dynamic";

type Rank = { id: string; rank_name: string; description: string; insignia_url: string | null; minimum_hours: number | string; maximum_hours: number | string | null; rank_category: string };
const formatHours = (value: number | string | null) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 1 }).format(Number(value ?? 0));

export default async function RanksPage() {
  const supabase = await createClient();
  let ranks: Rank[] = [];
  if (supabase) {
    const { data } = await supabase.from("pilot_ranks").select("id,rank_name,description,insignia_url,minimum_hours,maximum_hours,rank_category").eq("is_published", true).eq("is_active", true).order("display_order").order("minimum_hours");
    ranks = (data ?? []) as Rank[];
  }
  return (
    <PublicLayout currentPath="/ranks">
      <div className="page-container stage-page content-page">
        <header className="page-heading"><span className="eyebrow"><span className="eyebrow-line" /> ANVG / PILOT DEVELOPMENT</span><h1>Earn every <span className="rank-title-accent">stripe.</span></h1><p>Our published rank structure recognises pilot development and participation across the ANVG community. Rank requirements shown here are maintained by the ANVG team.</p></header>
        <section className="rank-overview-strip">
          <div className="rank-overview-card glass-panel"><Trophy size={20}/><strong>{ranks.length.toString().padStart(2, "0")}</strong><span>Published ranks</span></div>
          <div className="rank-overview-card glass-panel"><Medal size={20}/><strong>{ranks.filter((rank) => rank.rank_category === "standard").length.toString().padStart(2, "0")}</strong><span>Standard ranks</span></div>
          <div className="rank-overview-card glass-panel"><Star size={20}/><strong>{ranks.filter((rank) => rank.rank_category === "elite").length.toString().padStart(2, "0")}</strong><span>Elite ranks</span></div>
        </section>
        <section className="content-section">
          <div className="home-section-heading"><div><span className="eyebrow">THE RANK LADDER</span><h2>Published pilot ranks</h2></div><span className="section-index">{String(ranks.length).padStart(2, "0")} / RANKS</span></div>
          {ranks.length ? <div className="rank-grid">{ranks.map((rank, index) => <article className={`rank-card glass-panel ${rank.rank_category === "elite" ? "rank-card-elite" : ""}`} key={rank.id}><div className="rank-card-top"><span className="rank-card-index">{String(index + 1).padStart(2, "0")}</span><span className="rank-category-label">{rank.rank_category === "elite" ? "ELITE" : "STANDARD"}</span></div>{rank.insignia_url ? <img className="rank-insignia" src={rank.insignia_url} alt={`${rank.rank_name} insignia`} loading="lazy"/> : <div className="rank-insignia-fallback">{rank.rank_category === "elite" ? <Award size={27}/> : <Shield size={27}/>}</div>}<h3>{rank.rank_name}</h3><p>{rank.description || "Rank information will be updated by the ANVG team."}</p><div className="rank-hours-range"><span>FLIGHT HOURS</span><strong>{formatHours(rank.minimum_hours)}{rank.maximum_hours !== null ? ` – ${formatHours(rank.maximum_hours)}` : "+"} <small>HRS</small></strong></div></article>)}</div> : <div className="content-empty glass-panel"><BadgeCheck size={23}/><h3>Rank structure is being prepared</h3><p>Published rank names, insignia and flight-hour requirements will appear here once they are added by the ANVG team.</p></div>}
        </section>
        <p className="rank-note">Displayed thresholds are informational. The current published ANVG rank records are the source of truth for progression.</p>
      </div>
    </PublicLayout>
  );
}
