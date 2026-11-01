"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function AdminSignOut() {
  const router = useRouter();
  async function handleSignOut() {
    const supabase = createClient();
    if (supabase) await supabase.auth.signOut();
    router.replace("/admin");
    router.refresh();
  }
  return <button type="button" className="quiet-button" onClick={handleSignOut}><LogOut size={16} /> Sign out</button>;
}
