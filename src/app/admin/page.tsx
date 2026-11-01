import type { Metadata } from "next";
import Link from "next/link";
import { AdminLoginForm } from "@/components/AdminLoginForm";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = { title: "Administrator Sign In | ANVG", robots: { index: false, follow: false } };

export default function AdminLoginPage() {
  return (
    <main className="admin-screen">
      <div className="admin-login-card glass-panel">
        <Link href="/" className="admin-back-link">← Return to ANVG</Link>
        <div className="admin-mark"><ShieldCheck size={25} /></div>
        <span className="eyebrow">ANVG / SECURE ACCESS</span>
        <h1>Administration</h1>
        <p className="admin-description">Sign in with an authorised administrator account to manage the community website.</p>
        <AdminLoginForm />
        <p className="admin-security-note">Protected by Supabase Authentication and database access policies.</p>
      </div>
    </main>
  );
}
