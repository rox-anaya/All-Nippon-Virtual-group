import Link from "next/link";
import { Activity, CalendarDays, ChevronRight, ClipboardList, Home, Image, LayoutDashboard, MapPinned, Plane, Settings2, ShieldCheck, Users, Building2 } from "lucide-react";

const sections = [
  { label: "OVERVIEW", items: [{ label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard, active: true }] },
  { label: "WEBSITE CONTENT", items: [{ label: "Home & Branding", href: "/admin/home", icon: Home, active: false }] },
];
const planned = [
  { label: "Airlines & Divisions", icon: Building2 },
  { label: "Fleet Management", icon: Plane },
  { label: "Hubs & Locations", icon: MapPinned },
  { label: "Staff & Pilots", icon: Users },
  { label: "Events & News", icon: CalendarDays },
  { label: "Applications", icon: ClipboardList },
  { label: "Media Library", icon: Image },
  { label: "Site Settings", icon: Settings2 },
];

export function AdminSidebar() {
  return <aside className="anvg-admin-sidebar">
    <Link href="/admin/dashboard" className="anvg-admin-sidebar-brand">
      <span className="anvg-admin-mark">A</span><span><strong>ANVG</strong><small>ADMIN CENTRE</small></span>
    </Link>
    <div className="anvg-admin-sidebar-status"><span /> CONTROL SYSTEM ONLINE</div>
    {sections.map((section) => <section className="anvg-admin-nav-group" key={section.label}>
      <p>{section.label}</p>
      {section.items.map((item) => <Link key={item.href} href={item.href} className={`anvg-admin-nav-link${item.active ? " is-active" : ""}`}><item.icon size={17}/><span>{item.label}</span><ChevronRight size={14}/></Link>)}
    </section>)}
    <section className="anvg-admin-nav-group">
      <p>MANAGEMENT MODULES</p>
      {planned.map((item) => <div className="anvg-admin-nav-link is-planned" key={item.label} title="Scheduled for the next development stage"><item.icon size={17}/><span>{item.label}</span><span className="anvg-admin-soon">SOON</span></div>)}
    </section>
    <div className="anvg-admin-sidebar-foot"><ShieldCheck size={16}/><span>Protected administrator access</span></div>
  </aside>;
}
