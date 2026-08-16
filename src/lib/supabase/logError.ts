import "server-only";
import type { PostgrestError } from "@supabase/supabase-js";

/**
 * Logs a Supabase read failure safely — server-side only (console.error
 * lands in Vercel's function logs, never the browser), and only ever the
 * Postgres error code + message, never row data or credentials.
 *
 * Every read in src/lib/data/*.ts passes its query's `error` here instead
 * of silently discarding it. Before this, a real failure (RLS denial,
 * missing table/column, connection problem) and a genuinely empty table
 * were indistinguishable — both rendered as the same "no results yet"
 * empty state with zero trace in logs. This doesn't change what a visitor
 * sees (empty state stays generic and safe either way), it just makes the
 * actual cause diagnosable from server logs.
 */
export function logSupabaseError(context: string, error: PostgrestError | null): void {
  if (!error) return;
  console.error(`[supabase] ${context} failed:`, `code=${error.code}`, error.message);
}
