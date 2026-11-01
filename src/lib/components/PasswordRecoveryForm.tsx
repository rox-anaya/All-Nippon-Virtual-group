"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

export function PasswordRecoveryForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const supabase = createClient();
      if (!supabase) {
        setMessage("Supabase is not configured yet.");
        return;
      }
      const redirectTo = `${window.location.origin}/admin/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });
      if (error) setMessage(error.message);
      else setMessage("Password recovery email requested. Check your inbox and follow the secure link.");
    } catch {
      setMessage("The recovery request could not be completed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <label htmlFor="recovery-email">Administrator email</label>
      <input id="recovery-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
      {message ? <p className="form-message" role="status">{message}</p> : null}
      <button className="primary-button form-submit" type="submit" disabled={busy}>{busy ? "Sending…" : "Send recovery email"}</button>
      <Link className="form-secondary-link" href="/admin">Back to sign in</Link>
    </form>
  );
}

export function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const supabase = createClient();
      if (!supabase) {
        setMessage("Supabase is not configured yet.");
        return;
      }
      const { error } = await supabase.auth.updateUser({ password });
      if (error) setMessage(error.message);
      else setMessage("Password updated. Return to the admin sign-in page.");
    } catch {
      setMessage("The password could not be updated. Open the latest recovery link and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <label htmlFor="new-password">New password</label>
      <input id="new-password" type="password" minLength={10} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
      <p className="input-hint">Use at least 10 characters.</p>
      {message ? <p className="form-message" role="status">{message}</p> : null}
      <button className="primary-button form-submit" type="submit" disabled={busy}>{busy ? "Updating…" : "Update password"}</button>
      <Link className="form-secondary-link" href="/admin">Back to sign in</Link>
    </form>
  );
}
