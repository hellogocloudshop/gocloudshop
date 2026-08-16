import { createClient } from "@/lib/supabase/server";
import { logSupabaseError } from "@/lib/supabase/logError";
import { mockGuides, mockProviders } from "@/lib/mock-data";
import type { Guide, GuideType } from "@/lib/types";

export async function getGuides(options?: { guideType?: GuideType }): Promise<Guide[]> {
  const supabase = await createClient();
  if (!supabase) {
    return mockGuides
      .filter((g) => g.status === "published" && (!options?.guideType || g.guide_type === options.guideType))
      .sort((a, b) => new Date(b.published_at ?? b.created_at).getTime() - new Date(a.published_at ?? a.created_at).getTime());
  }
  let query = supabase.from("guides").select("*").eq("status", "published").order("published_at", { ascending: false });
  if (options?.guideType) query = query.eq("guide_type", options.guideType);
  const { data, error } = await query;
  logSupabaseError("getGuides", error);
  return (data as Guide[]) ?? [];
}

export async function getGuideBySlug(slug: string): Promise<Guide | null> {
  const supabase = await createClient();
  if (!supabase) return mockGuides.find((g) => g.slug === slug && g.status === "published") ?? null;
  const { data, error } = await supabase.from("guides").select("*").eq("slug", slug).maybeSingle();
  logSupabaseError("getGuideBySlug", error);
  return (data as Guide) ?? null;
}

// Stock Updates reuses the guides table/type/data-access layer (guide_type =
// "stock_update") rather than a second parallel content system — see
// supabase/migrations/0006_stock_updates.sql. Joins related_provider (the
// cards show a provider logo/name) since getGuides()'s plain select("*")
// doesn't populate relations.
export async function getStockUpdates(): Promise<Guide[]> {
  const supabase = await createClient();
  if (!supabase) {
    return mockGuides
      .filter((g) => g.status === "published" && g.guide_type === "stock_update")
      .map((g) => ({ ...g, related_provider: mockProviders.find((p) => p.id === g.related_provider_id) ?? null }))
      .sort((a, b) => new Date(b.published_at ?? b.created_at).getTime() - new Date(a.published_at ?? a.created_at).getTime());
  }
  const { data, error } = await supabase
    .from("guides")
    .select("*, related_provider:providers(*)")
    .eq("status", "published")
    .eq("guide_type", "stock_update")
    .order("published_at", { ascending: false });
  logSupabaseError("getStockUpdates", error);
  return (data as Guide[]) ?? [];
}
