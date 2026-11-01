import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { checkAdmin } from "@/lib/supabase/admin";
import { AdminSignOut } from "@/components/AdminSignOut";
import { ArrowUpRight, Database, Image, ShieldCheck } from "lucide-react";

export const metadata: Metadata = { title: "Admin Dashboard | ANVG", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const plannedModules = [
  ["Events & News", "Event schedules, Zulu departure times and announcements"],
  ["Fleet & Divisions", "Airline divisions, aircraft, images and colour identity"],
  ["Routes & Hubs", "Operating locations, routes, hub information and globe data"],
  ["People", "Staff, roles, pilots, roster order and leaderboard hours"],
  ["Ranks & Training", "Rank progression, evaluation stages and recruitment flows"],
  ["Codeshare & Change Log", "Partner airlines and public bulletins"],
  ["Applications & Voice", "Prerequisites, intake destination and page announcements"],
];

export default async function AdminDashboardPage() {
  const access = await checkAdmin();
  if (!access.ok && access.reason === "not-authenticated") redirect("/admin");

  if (!access.ok) {
    return (
      <main className="admin-screen">
        <div className="admin-login-card glass-panel">
          <span className="eyebrow">ANVG / ACCESS CONTROL</span>
          <h1>{access.reason === "not-configured" ? "Supabase not configured" : "Administrator access required"}</h1>
          <p className="admin-description">
            {access.reason === "not-configured"
              ? "Add the Supabase project URL and publishable key to the deployment environment, then redeploy."
              : "Your account is signed in but is not listed in the protected administrator allowlist. An existing administrator must provision access in Supabase."}
          </p>
          <Link href="/admin" className="primary-button">Return to sign in</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-dashboard-screen">
      <header className="admin-topbar">
        <Link href="/" className="admin-brand"><img src="https://res.cloudinary.com/dsfwafyc2/image/upload/v1792817398/file_0000000014488211bfa6f947add0e395_npjxai.png" alt="ANVG" /><span>ANVG <small>ADMIN CENTRE</small></span></Link>
        <div className="admin-topbar-right"><span className="admin-identity"><ShieldCheck size={15} /> {access.email ?? "Authorised administrator"}</span><AdminSignOut /></div>
      </header>
      <section className="admin-content page-container">
        <div className="admin-heading-row">
          <div><span className="eyebrow">CONTROL ROOM / OVERVIEW</span><h1>Admin Centre</h1><p>Shared administration foundation is active. Content modules will be connected in the staged page builds.</p></div>
          <span className="admin-active-chip"><span className="status-dot" /> AUTHENTICATED</span>
        </div>
        <div className="admin-overview-grid">
          <article className="admin-overview-card glass-panel"><Database size={19} /><span>Database</span><strong>Supabase</strong><small>RLS policies defined in SQL migration</small></article>
          <article className="admin-overview-card glass-panel"><Image size={19} /><span>Media storage</span><strong>site-media</strong><small>Public image delivery · admin-only writes</small></article>
          <article className="admin-overview-card glass-panel"><ShieldCheck size={19} /><span>Access</span><strong>Administrator allowlist</strong><small>No public admin-registration route</small></article>
        </div>
        <div className="admin-section-heading"><div><span className="eyebrow">CONTENT MANAGEMENT</span><h2>Management modules</h2></div><span className="admin-section-meta">Added in implementation stages</span></div>
        <div className="admin-module-grid">
          <Link className="admin-module-card glass-panel admin-module-ready" href="/admin/home">
            <span className="module-number">01</span>
            <div><h3>Home & Site Settings</h3><p>Hero image, logo, mission, CEO message, statistics and fleet showcase.</p></div>
            <span className="module-ready">AVAILABLE</span>
            <ArrowUpRight className="module-arrow" size={16} />
          </Link>
          {plannedModules.map(([title, description], index) => (
            <article className="admin-module-card glass-panel" key={title}>
              <span className="module-number">{String(index + 2).padStart(2, "0")}</span>
              <div><h3>{title}</h3><p>{description}</p></div>
              <span className="module-pending">COMING IN STAGES</span>
              <ArrowUpRight className="module-arrow" size={16} />
            </article>
          ))}
        </div>
        <p className="admin-build-note">This is the Stage 1 administration shell. It is not yet a claim that all content-management forms are implemented.</p>
      </section>
    </main>
  );
}
