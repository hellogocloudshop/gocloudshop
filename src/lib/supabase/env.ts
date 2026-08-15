export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Whether a real Supabase project is wired up. When false (no project connected
 * yet), the data layer in src/lib/data falls back to the bundled reference
 * catalog (src/lib/mock-data.ts) so the site remains fully browsable while the
 * project is being set up.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}
