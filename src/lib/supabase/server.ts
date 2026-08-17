import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./env";
import { fetchWithTimeout } from "./fetchWithTimeout";

/**
 * Server-side Supabase client for Server Components / Server Actions / Route Handlers.
 * Returns null if no project is connected yet — callers fall back to the bundled
 * reference catalog in src/lib/mock-data.ts.
 */
export async function createClient() {
  if (!isSupabaseConfigured()) {
    // Temporary diagnostic (safe: no secret values, only presence/absence)
    // — if this line appears in production logs, NEXT_PUBLIC_SUPABASE_URL
    // and/or NEXT_PUBLIC_SUPABASE_ANON_KEY are not actually present in the
    // running build, and every catalog page is silently using the bundled
    // mock-data fallback instead of Supabase.
    console.error(
      "[supabase] createClient(): NOT configured — falling back to mock catalog.",
      `NEXT_PUBLIC_SUPABASE_URL=${process.env.NEXT_PUBLIC_SUPABASE_URL ? "set" : "MISSING"}`,
      `NEXT_PUBLIC_SUPABASE_ANON_KEY=${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "set" : "MISSING"}`
    );
    return null;
  }

  // Temporary diagnostic (safe: hostname only, derived from the already-
  // public NEXT_PUBLIC_SUPABASE_URL — never the anon key) — confirms which
  // Supabase project this specific request actually targets at runtime.
  try {
    console.log(`[supabase] createClient(): targeting host=${new URL(SUPABASE_URL!).host}`);
  } catch {
    console.error("[supabase] createClient(): NEXT_PUBLIC_SUPABASE_URL is set but is not a valid URL.");
  }

  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a Server Component render — safe to ignore because
          // middleware refreshes the session on every request.
        }
      },
    },
    global: { fetch: fetchWithTimeout("anon-client") },
  });
}
