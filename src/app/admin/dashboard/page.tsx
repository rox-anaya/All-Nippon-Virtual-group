import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { checkAdmin } from "@/lib/supabase/admin";
import { AdminSignOut } from "@/components/AdminSignOut";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Activity, ArrowUpRight, Database, Image, ShieldCheck, Sparkles } from "lucide-react";

export const metadata: Metadata = { title: "Admin Dashboard | ANVG", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const access = await checkAdmin();
  if (!access.ok && access.reason === "not-authenticated") redirect("/admin");
  if (!access.ok) return <main className="admin-screen"><div className="admin-login-card glass-panel"><span className="eyebrow">ANVG / ACCESS CONTROL</span><h1>{access.reason === "not-configured" ? "Supabase not configured" : "Administrator access required"}</h1><p className="admin-description">{access.reason === "not-configured" ? "Add the Supabase project URL and publishable key to the deployment environment, then redeploy." : "Your account is signed in but is not listed in the protected administrator allowlist. An existing administrator must provision access in Supabase."}</p><Link href="/admin" className="primary-button">Return to sign in</Link></div></main>;

  return <main className="anvg-admin-app">
    <AdminSidebar />
    <section className="anvg-admin-main">
      <header className="anvg-admin-topbar"><div><span className="anvg-admin-breadcrumb">ANVG <span>/</span> CONTROL ROOM</span><strong>Administration</strong></div><div className="anvg-admin-top-actions"><span className="anvg-admin-user"><ShieldCheck size={15}/>{access.email ?? "Authorised administrator"}</span><AdminSignOut /></div></header>
      <div className="anvg-admin-page">
        <div className="anvg-admin-welcome"><div><span className="eyebrow">OPERATIONS MANAGEMENT</span><h1>Dashboard</h1><p>Your central workspace for managing the All Nippon Virtual Group website.</p></div><span className="anvg-admin-live"><i/> SYSTEM SECURE</span></div>
        <div className="anvg-admin-stat-grid">
          <article className="anvg-admin-stat-card"><span><Database size={17}/> DATABASE</span><strong>Supabase</strong><small>Connected through protected server access</small></article>
          <article className="anvg-admin-stat-card"><span><Image size={17}/> MEDIA STORAGE</span><strong>site-media</strong><small>Public delivery · administrator-only writes</small></article>
          <article className="anvg-admin-stat-card"><span><ShieldCheck size={17}/> ACCESS CONTROL</span><strong>Authorised</strong><small>Administrator allowlist verified</small></article>
        </div>
        <div className="anvg-admin-section-title"><div><span className="eyebrow">QUICK ACCESS</span><h2>Website management</h2></div><span>MODULES ARE BEING ADDED IN STAGES</span></div>
        <Link href="/admin/home" className="anvg-admin-feature-card"><div className="anvg-admin-feature-icon"><Sparkles size={21}/></div><div><span>AVAILABLE NOW</span><h3>Home & Branding</h3><p>Manage homepage content, hero imagery, logo, statistics, showcase images and footer links.</p></div><ArrowUpRight size={19}/></Link>
        <div className="anvg-admin-next-stage"><div className="anvg-admin-next-icon"><Activity size={18}/></div><div><strong>Next development stage</strong><p>Airline divisions, fleet and hub management will be added as separate modules with dedicated forms and validation.</p></div></div>
        <p className="anvg-admin-security-foot">Changes are protected by Supabase Row Level Security. No public administrator registration is available.</p>
      </div>
    </section>
  </main>;
}
