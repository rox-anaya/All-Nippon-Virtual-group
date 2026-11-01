import { createClient } from "@/lib/supabase/server";

export type AdminCheck =
  | { ok: true; userId: string; email: string | null }
  | { ok: false; reason: "not-configured" | "not-authenticated" | "not-admin" };

/**
 * Server-side authorization check. The admin_users table is protected by RLS;
 * users cannot add themselves to it from the browser.
 */
export async function checkAdmin(): Promise<AdminCheck> {
  const supabase = await createClient();
  if (!supabase) return { ok: false, reason: "not-configured" };

  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) {
    return { ok: false, reason: "not-authenticated" };
  }

  const { data: adminRecord, error } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", authData.user.id)
    .maybeSingle();

  if (error || !adminRecord) return { ok: false, reason: "not-admin" };

  return {
    ok: true,
    userId: authData.user.id,
    email: authData.user.email ?? null,
  };
}
