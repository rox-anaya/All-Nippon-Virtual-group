"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LockKeyhole, ShieldCheck } from "lucide-react";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setBusy(true);
    try {
      const supabase = createClient();
      if (!supabase) {
        setMessage("Supabase is not configured yet. Add the project URL and publishable key to Vercel environment variables.");
        return;
      }
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) {
        setMessage(error.message);
        return;
      }
      router.replace("/admin/dashboard");
      router.refresh();
    } catch {
      setMessage("Sign-in could not be completed. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <label htmlFor="admin-email">Administrator email</label>
      <input
        id="admin-email"
        name="email"
        type="email"
        autoComplete="username"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="name@example.com"
        required
      />
      <label htmlFor="admin-password">Password</label>
      <input
        id="admin-password"
        name="password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Enter your password"
        required
      />
      {message ? <p className="form-message" role="alert">{message}</p> : null}
      <button className="primary-button form-submit" type="submit" disabled={busy}>
        <LockKeyhole size={16} /> {busy ? "Signing in…" : "Secure sign in"}
      </button>
      <div className="form-footnote">
        <ShieldCheck size={15} /> Administrator access only. Public registration is not available.
      </div>
      <Link className="form-secondary-link" href="/admin/forgot-password">Forgot password?</Link>
    </form>
  );
}
