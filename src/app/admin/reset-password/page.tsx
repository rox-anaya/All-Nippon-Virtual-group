import type { Metadata } from "next";
import Link from "next/link";
import { ResetPasswordForm } from "@/components/PasswordRecoveryForm";
export const metadata: Metadata = { title: "Set New Password | ANVG", robots: { index: false, follow: false } };
export default function ResetPasswordPage() {
  return <main className="admin-screen"><div className="admin-login-card glass-panel"><Link href="/admin" className="admin-back-link">← Back to sign in</Link><span className="eyebrow">ACCOUNT RECOVERY</span><h1>Choose a new password</h1><p className="admin-description">Use the secure link sent to your administrator email, then set a new password.</p><ResetPasswordForm /></div></main>;
}
