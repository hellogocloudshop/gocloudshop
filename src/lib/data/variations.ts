import { createClient } from "@/lib/supabase/server";
import { logSupabaseError } from "@/lib/supabase/logError";
import { mockVariations } from "@/lib/mock-data";
import type { ProductVariation } from "@/lib/types";

export async function getVariationsByProduct(productId: string): Promise<ProductVariation[]> {
  const supabase = await createClient();
  if (!supabase) {
    return mockVariations
      .filter((v) => v.product_id === productId && v.is_active)
      .sort((a, b) => a.sort_order - b.sort_order);
  }
  const { data, error } = await supabase
    .from("product_variations")
    .select("*")
    .eq("product_id", productId)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  logSupabaseError("getVariationsByProduct", error);
  return (data as ProductVariation[]) ?? [];
}

export async function getVariationById(id: string): Promise<ProductVariation | null> {
  const supabase = await createClient();
  if (!supabase) return mockVariations.find((v) => v.id === id) ?? null;
  const { data, error } = await supabase.from("product_variations").select("*").eq("id", id).maybeSingle();
  logSupabaseError("getVariationById", error);
  return (data as ProductVariation) ?? null;
}
