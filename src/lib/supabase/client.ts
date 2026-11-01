"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabasePublicEnv } from "./env";

let browserClient: SupabaseClient | null = null;

export function createClient(): SupabaseClient | null {
  if (browserClient) return browserClient;

  const env = getSupabasePublicEnv();
  if (!env) return null;

  browserClient = createBrowserClient(env.url, env.key);
  return browserClient;
}
