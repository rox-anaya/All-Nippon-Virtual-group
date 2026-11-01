import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Medal, Plane, Trophy, Users } from "lucide-react";
import { PublicLayout } from "@/components/PublicLayout";
import { createClient } from "@/lib/supabase/server";
import { safeExternalUrl } from "@/lib/urls";

export const metadata: Metadata = {
  title: "Our Pilots",
  description: "Meet the published pilots of All Nippon Virtual Group and explore the ANVG pilot leaderboard.",
};

type PilotProfile = {
  id: string;
  name: string;
  pilot_id: string;
  rank_name: string;
  flight_hours: number | string;
  profile_image_url: string | null;
  ifc_profile_url: string | null;
};

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part.charAt(0)).join("").toUpperCase();
}

function formatHours(value: number | string) {
  const hours = Number(value);
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 1 }).format(Number.isFinite(hours) ? hours : 0);
}

export default async function PilotsPage() {
  let pilots: PilotProfile[] = [];
  const supabase = await createClient();

  if (supabase) {
    const { data } = await supabase
      .from("pilot_profiles")
      .select("id, name, pilot_id, rank_name, flight_hours, profile_image_url, ifc_profile_url")
      .eq("is_published", true)
      .eq("is_active", true)
      .order("flight_hours", { ascending: false })
      .order("display_order", { ascending: true });

    pilots = (data ?? []) as PilotProfile[];
  }

  const totalLoggedHours = pilots.reduce((total, pilot) => {
    const hours = Number(pilot.flight_hours);
    return total + (Number.isFinite(hours) ? hours : 0);
  }, 0);
  const leaders = pilots.slice(0, 3);

  return (
    <PublicLayout currentPath="/pilots">
      <div className="community-page directory-page pilots-page">
        <section className="page-container community-hero">
          <div className="page-heading">
            <span className="eyebrow"><span className="eyebrow-line" /> THE PEOPLE IN OUR SKIES</span>
            <h1>Our <span>Pilots.</span></h1>
            <p>Meet the pilots who make All Nippon Virtual Group what it is. Every pilot contributes to our growing community and shared passion for flight.</p>
          </div>

          <div className="pilot-stats-grid">
            <div className="pilot-stat-card glass-panel"><Users size={19} /><strong>{pilots.length}</strong><span>Published pilots</span></div>
            <div className="pilot-stat-card glass-panel"><Plane size={19} /><strong>{formatHours(totalLoggedHours)}</strong><span>Logged hours in this roster</span></div>
            <div className="pilot-stat-card glass-panel"><Trophy size={19} /><strong>{pilots.length ? formatHours(Number(pilots[0].flight_hours)) : "—"}</strong><span>Top pilot hours</span></div>
          </div>
        </section>

        <section className="page-container community-section pilot-directory-content">
          {pilots.length === 0 ? (
            <div className="directory-empty glass-panel">
              <div className="directory-empty-icon"><Plane size={27} /></div>
              <span className="community-overline">PILOT ROSTER</span>
              <h2>Your seat in the roster is waiting.</h2>
              <p>Published ANVG pilot profiles and leaderboard entries will appear here as the roster is added. Ready to fly with the community?</p>
              <Link href="/apply" className="primary-button">Explore pilot intake <ArrowRight size={16} /></Link>
            </div>
          ) : (
            <>
              {leaders.length > 0 ? (
                <div className="pilot-leaders-panel">
                  <div className="home-section-heading"><div><span className="eyebrow">FLIGHT HOURS / LEADERBOARD</span><h2>Leading the way</h2></div><span className="section-index">TOP {leaders.length}</span></div>
                  <div className="pilot-leaders-grid">
                    {leaders.map((pilot, index) => {
                      const imageUrl = safeExternalUrl(pilot.profile_image_url);
                      const profileUrl = safeExternalUrl(pilot.ifc_profile_url);
                      return (
                        <article className={`pilot-leader-card glass-panel pilot-leader-${index + 1}`} key={pilot.id}>
                          <div className="pilot-leader-rank"><Medal size={17} /><span>0{index + 1}</span></div>
                          {imageUrl ? <img className="pilot-avatar-image" src={imageUrl} alt={`${pilot.name} profile`} loading="lazy" /> : <div className="pilot-avatar-fallback" aria-hidden="true">{initials(pilot.name) || "A"}</div>}
                          <h3>{pilot.name}</h3>
                          <span className="pilot-rank-label">{pilot.rank_name}</span>
                          <strong className="pilot-hours-value">{formatHours(pilot.flight_hours)} <small>HRS</small></strong>
                          <span className="pilot-id-label">PILOT ID / {pilot.pilot_id}</span>
                          {profileUrl ? <a className="pilot-profile-link" href={profileUrl} target="_blank" rel="noreferrer noopener">IFC profile <ArrowUpRight size={13} /></a> : null}
                        </article>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              <div className="pilot-roster-panel">
                <div className="home-section-heading"><div><span className="eyebrow">ANVG / CREW DIRECTORY</span><h2>All published pilots</h2></div><span className="section-index">{String(pilots.length).padStart(2, "0")} PILOTS</span></div>
                <div className="pilot-roster-list">
                  {pilots.map((pilot, index) => {
                    const imageUrl = safeExternalUrl(pilot.profile_image_url);
                    const profileUrl = safeExternalUrl(pilot.ifc_profile_url);
                    return (
                      <article className="pilot-roster-row glass-panel" key={pilot.id}>
                        <span className="pilot-roster-position">{String(index + 1).padStart(2, "0")}</span>
                        {imageUrl ? <img className="pilot-roster-avatar" src={imageUrl} alt="" loading="lazy" /> : <span className="pilot-roster-avatar pilot-roster-avatar-fallback">{initials(pilot.name) || "A"}</span>}
                        <div className="pilot-roster-identity"><strong>{pilot.name}</strong><span>{pilot.pilot_id}</span></div>
                        <span className="pilot-roster-rank">{pilot.rank_name}</span>
                        <strong className="pilot-roster-hours">{formatHours(pilot.flight_hours)} <small>hrs</small></strong>
                        {profileUrl ? <a className="pilot-roster-link" href={profileUrl} target="_blank" rel="noreferrer noopener" aria-label={`Open ${pilot.name}'s IFC profile`}><ArrowUpRight size={17} /></a> : <span className="pilot-roster-link-placeholder" />}
                      </article>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </PublicLayout>
  );
}
