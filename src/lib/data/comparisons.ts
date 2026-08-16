import { createClient } from "@/lib/supabase/server";
import { logSupabaseError } from "@/lib/supabase/logError";
import { mockComparisons, mockProviders } from "@/lib/mock-data";
import type { Comparison } from "@/lib/types";

function withProviders(comparison: Comparison): Comparison {
  return {
    ...comparison,
    providers: comparison.provider_ids
      .map((id) => mockProviders.find((p) => p.id === id))
      .filter((p): p is NonNullable<typeof p> => Boolean(p)),
  };
}

export async function getComparisons(): Promise<Comparison[]> {
  const supabase = await createClient();
  if (!supabase) {
    return mockComparisons
      .filter((c) => c.is_active)
      .map(withProviders)
      .sort((a, b) => a.sort_order - b.sort_order);
  }
  const { data, error } = await supabase
    .from("comparisons")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  logSupabaseError("getComparisons", error);
  return (data as Comparison[]) ?? [];
}

export async function getComparisonBySlug(slug: string): Promise<Comparison | null> {
  const supabase = await createClient();
  if (!supabase) {
    const comparison = mockComparisons.find((c) => c.slug === slug && c.is_active);
    return comparison ? withProviders(comparison) : null;
  }
  const { data, error } = await supabase.from("comparisons").select("*").eq("slug", slug).maybeSingle();
  logSupabaseError("getComparisonBySlug", error);
  return (data as Comparison) ?? null;
}
