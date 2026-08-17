import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "./env";
import { fetchWithTimeout } from "./fetchWithTimeout";

/**
 * Privileged service-role client for server-only admin operations (e.g.
 * inviting/managing staff users). Never import this from client code, and
 * never expose SUPABASE_SERVICE_ROLE_KEY with a NEXT_PUBLIC_ prefix.
 */
export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !serviceRoleKey) return null;

  return createSupabaseClient(SUPABASE_URL, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { fetch: fetchWithTimeout("admin-client") },
  });
}
