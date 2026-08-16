import { createClient } from "@/lib/supabase/server";
import { logSupabaseError } from "@/lib/supabase/logError";
import { mockProviders } from "@/lib/mock-data";
import type { Provider } from "@/lib/types";

export async function getProviders(options?: { activeOnly?: boolean }): Promise<Provider[]> {
  const activeOnly = options?.activeOnly ?? true;
  const supabase = await createClient();

  if (!supabase) {
    return mockProviders
      .filter((p) => !activeOnly || p.is_active)
      .sort((a, b) => a.sort_order - b.sort_order);
  }

  /* Supabase equivalent:
     select * from providers where is_active = true order by sort_order */
  let query = supabase.from("providers").select("*").order("sort_order", { ascending: true });
  if (activeOnly) query = query.eq("is_active", true);
  const { data, error } = await query;
  logSupabaseError("getProviders", error);
  // Temporary diagnostic (safe: count only, no row data).
  console.log(`[supabase] getProviders: rows=${data?.length ?? 0} activeOnly=${activeOnly}`);
  return (data as Provider[]) ?? [];
}

export async function getProviderBySlug(slug: string): Promise<Provider | null> {
  const supabase = await createClient();

  if (!supabase) {
    return mockProviders.find((p) => p.slug === slug) ?? null;
  }

  const { data, error } = await supabase.from("providers").select("*").eq("slug", slug).maybeSingle();
  logSupabaseError("getProviderBySlug", error);
  return (data as Provider) ?? null;
}

export async function getProviderById(id: string): Promise<Provider | null> {
  const supabase = await createClient();
  if (!supabase) return mockProviders.find((p) => p.id === id) ?? null;
  const { data, error } = await supabase.from("providers").select("*").eq("id", id).maybeSingle();
  logSupabaseError("getProviderById", error);
  return (data as Provider) ?? null;
}
