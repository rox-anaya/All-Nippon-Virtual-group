import type { Metadata } from "next";
import Link from "next/link";
import { PasswordRecoveryForm } from "@/components/PasswordRecoveryForm";
export const metadata: Metadata = { title: "Password Recovery | ANVG", robots: { index: false, follow: false } };
export default function ForgotPasswordPage() {
  return <main className="admin-screen"><div className="admin-login-card glass-panel"><Link href="/admin" className="admin-back-link">← Back to sign in</Link><span className="eyebrow">ACCOUNT RECOVERY</span><h1>Reset password</h1><p className="admin-description">Request a secure password recovery email for your administrator account.</p><PasswordRecoveryForm /></div></main>;
}
