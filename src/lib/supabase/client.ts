import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./env";

/** Browser-side Supabase client. Returns null if no project is connected yet. */
export function createClient() {
  if (!isSupabaseConfigured()) return null;
  return createBrowserClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);
}
