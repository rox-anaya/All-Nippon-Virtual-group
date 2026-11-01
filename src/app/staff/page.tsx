import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Shield, Users } from "lucide-react";
import { PublicLayout } from "@/components/PublicLayout";
import { createClient } from "@/lib/supabase/server";
import { safeExternalUrl } from "@/lib/urls";

export const metadata: Metadata = {
  title: "Leadership & Staff",
  description: "Meet the team supporting All Nippon Virtual Group operations and community life.",
};

type StaffRole = {
  id: string;
  role_name: string;
  hierarchy_priority: number;
  display_order: number;
};

type StaffMember = {
  id: string;
  name: string;
  role_id: string | null;
  description: string;
  profile_image_url: string | null;
  button_label: string | null;
  button_url: string | null;
  button_visible: boolean;
  display_order: number;
};

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part.charAt(0)).join("").toUpperCase();
}

export default async function StaffPage() {
  let roles: StaffRole[] = [];
  let members: StaffMember[] = [];
  const supabase = await createClient();

  if (supabase) {
    const [roleResult, memberResult] = await Promise.all([
      supabase
        .from("staff_roles")
        .select("id, role_name, hierarchy_priority, display_order")
        .eq("is_published", true)
        .eq("is_active", true)
        .order("hierarchy_priority", { ascending: true })
        .order("display_order", { ascending: true }),
      supabase
        .from("staff_members")
        .select("id, name, role_id, description, profile_image_url, button_label, button_url, button_visible, display_order")
        .eq("is_published", true)
        .eq("is_active", true)
        .order("display_order", { ascending: true }),
    ]);

    roles = (roleResult.data ?? []) as StaffRole[];
    members = (memberResult.data ?? []) as StaffMember[];
  }

  const groupedMembers = roles
    .map((role) => ({ role, members: members.filter((member) => member.role_id === role.id) }))
    .filter((group) => group.members.length > 0);
  const groupedIds = new Set(groupedMembers.flatMap((group) => group.members.map((member) => member.id)));
  const unassignedMembers = members.filter((member) => !groupedIds.has(member.id));

  return (
    <PublicLayout currentPath="/staff">
      <div className="community-page directory-page staff-page">
        <section className="page-container community-hero">
          <div className="page-heading">
            <span className="eyebrow"><span className="eyebrow-line" /> THE PEOPLE BEHIND ANVG</span>
            <h1>Leadership <span>&amp; Staff.</span></h1>
            <p>The people supporting our operations, flight standards, and community experience.</p>
          </div>

          <div className="directory-summary glass-panel">
            <div className="directory-summary-icon"><Users size={21} /></div>
            <div><strong>{members.length}</strong><span>Published team members</span></div>
            <div className="directory-summary-divider" />
            <div><strong>{groupedMembers.length + (unassignedMembers.length ? 1 : 0)}</strong><span>Active team sections</span></div>
            <span className="directory-summary-note">ANVG / TEAM DIRECTORY</span>
          </div>
        </section>

        <section className="page-container community-section directory-content">
          {members.length === 0 ? (
            <div className="directory-empty glass-panel">
              <div className="directory-empty-icon"><Shield size={27} /></div>
              <span className="community-overline">TEAM ROSTER</span>
              <h2>The team directory is taking shape.</h2>
              <p>Staff profiles will appear here as the ANVG team roster is published. Check back as our community grows.</p>
              <Link href="/about" className="text-link">Discover ANVG <ArrowUpRight size={15} /></Link>
            </div>
          ) : (
            <>
              {groupedMembers.map(({ role, members: roleMembers }, index) => (
                <section className="staff-role-section" key={role.id}>
                  <div className="home-section-heading">
                    <div><span className="eyebrow">TEAM / {String(index + 1).padStart(2, "0")}</span><h2>{role.role_name}</h2></div>
                    <span className="section-index">{String(roleMembers.length).padStart(2, "0")} MEMBERS</span>
                  </div>
                  <div className="staff-grid">
                    {roleMembers.map((member) => {
                      const imageUrl = safeExternalUrl(member.profile_image_url);
                      const profileUrl = member.button_visible ? safeExternalUrl(member.button_url) : "";
                      return (
                        <article className="staff-card glass-panel" key={member.id}>
                          <div className="staff-card-topline"><span className="staff-role-label">{role.role_name}</span><span className="staff-card-mark">ANVG</span></div>
                          {imageUrl ? (
                            <img className="staff-avatar-image" src={imageUrl} alt={`${member.name} profile`} loading="lazy" />
                          ) : (
                            <div className="staff-avatar-fallback" aria-hidden="true">{initials(member.name) || "A"}</div>
                          )}
                          <h3>{member.name}</h3>
                          {member.description ? <p>{member.description}</p> : <p className="staff-no-description">Supporting the ANVG community.</p>}
                          {profileUrl ? <a className="staff-profile-link" href={profileUrl} target="_blank" rel="noreferrer noopener">{member.button_label?.trim() || "View profile"}<ArrowUpRight size={14} /></a> : null}
                        </article>
                      );
                    })}
                  </div>
                </section>
              ))}

              {unassignedMembers.length > 0 ? (
                <section className="staff-role-section">
                  <div className="home-section-heading"><div><span className="eyebrow">TEAM / GENERAL</span><h2>Community Team</h2></div></div>
                  <div className="staff-grid">
                    {unassignedMembers.map((member) => {
                      const imageUrl = safeExternalUrl(member.profile_image_url);
                      const profileUrl = member.button_visible ? safeExternalUrl(member.button_url) : "";
                      return (
                        <article className="staff-card glass-panel" key={member.id}>
                          <div className="staff-card-topline"><span className="staff-role-label">ANVG TEAM</span><span className="staff-card-mark">ANVG</span></div>
                          {imageUrl ? <img className="staff-avatar-image" src={imageUrl} alt={`${member.name} profile`} loading="lazy" /> : <div className="staff-avatar-fallback" aria-hidden="true">{initials(member.name) || "A"}</div>}
                          <h3>{member.name}</h3>
                          {member.description ? <p>{member.description}</p> : <p className="staff-no-description">Supporting the ANVG community.</p>}
                          {profileUrl ? <a className="staff-profile-link" href={profileUrl} target="_blank" rel="noreferrer noopener">{member.button_label?.trim() || "View profile"}<ArrowUpRight size={14} /></a> : null}
                        </article>
                      );
                    })}
                  </div>
                </section>
              ) : null}
            </>
          )}
        </section>
      </div>
    </PublicLayout>
  );
}
