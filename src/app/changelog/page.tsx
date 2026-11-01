import type { Metadata } from "next";
import { GitCommitHorizontal, History } from "lucide-react";
import { PublicLayout } from "@/components/PublicLayout";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Change Log | ANVG", description: "Follow published website and community platform updates from All Nippon Virtual Group." };
export const dynamic = "force-dynamic";

type ChangeEntry = { id: string; heading: string; description: string; published_at: string };
const dateLabel = (value: string) => new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(value));

export default async function ChangelogPage() {
  const supabase = await createClient();
  let entries: ChangeEntry[] = [];
  if (supabase) {
    const { data } = await supabase.from("change_log_entries").select("id,heading,description,published_at").eq("is_published", true).eq("is_active", true).order("published_at", { ascending: false }).order("display_order");
    entries = (data ?? []) as ChangeEntry[];
  }
  return (
    <PublicLayout currentPath="/changelog">
      <div className="page-container stage-page content-page">
        <header className="page-heading"><span className="eyebrow"><span className="eyebrow-line" /> ANVG / DEVELOPMENT LOG</span><h1>Every update, <span className="changelog-title-accent">recorded.</span></h1><p>Follow published changes to the ANVG website, community experience and operational information.</p></header>
        <section className="content-section changelog-section"><div className="home-section-heading"><div><span className="eyebrow">LATEST RELEASE NOTES</span><h2>Update history</h2></div><span className="section-index">{String(entries.length).padStart(2, "0")} UPDATES</span></div>
          {entries.length ? <div className="changelog-list">{entries.map((entry, index) => <article className="changelog-entry glass-panel" key={entry.id}><div className="changelog-entry-marker"><GitCommitHorizontal size={18}/><span/></div><div className="changelog-entry-content"><div className="changelog-entry-meta"><span>{dateLabel(entry.published_at)}</span><span>UPDATE {String(entries.length - index).padStart(2, "0")}</span></div><h3>{entry.heading}</h3><p>{entry.description}</p></div></article>)}</div> : <div className="content-empty glass-panel"><History size={23}/><h3>No updates published yet</h3><p>When the ANVG team publishes a website or community update, it will be recorded here.</p></div>}
        </section>
      </div>
    </PublicLayout>
  );
}
