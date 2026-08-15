import { createClient } from "@/lib/supabase/server";
import { mockVariations } from "@/lib/mock-data";
import type { ProductVariation } from "@/lib/types";

export async function getVariationsByProduct(productId: string): Promise<ProductVariation[]> {
  const supabase = await createClient();
  if (!supabase) {
    return mockVariations
      .filter((v) => v.product_id === productId && v.is_active)
      .sort((a, b) => a.sort_order - b.sort_order);
  }
  const { data } = await supabase
    .from("product_variations")
    .select("*")
    .eq("product_id", productId)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  return (data as ProductVariation[]) ?? [];
}

export async function getVariationById(id: string): Promise<ProductVariation | null> {
  const supabase = await createClient();
  if (!supabase) return mockVariations.find((v) => v.id === id) ?? null;
  const { data } = await supabase.from("product_variations").select("*").eq("id", id).maybeSingle();
  return (data as ProductVariation) ?? null;
}
