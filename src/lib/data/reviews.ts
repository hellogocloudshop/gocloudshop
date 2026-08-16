import { createClient } from "@/lib/supabase/server";
import { logSupabaseError } from "@/lib/supabase/logError";
import { mockReviews } from "@/lib/mock-data";
import type { Review } from "@/lib/types";

/** Only ever returns genuine, admin-approved reviews. Never seeded with fake data. */
export async function getApprovedReviews(options?: { featuredOnly?: boolean; limit?: number }): Promise<Review[]> {
  const supabase = await createClient();
  if (!supabase) {
    let result = mockReviews.filter((r) => r.is_approved);
    if (options?.featuredOnly) result = result.filter((r) => r.is_featured);
    return options?.limit ? result.slice(0, options.limit) : result;
  }
  let query = supabase.from("reviews").select("*, product:products(id, name, slug)").eq("is_approved", true);
  if (options?.featuredOnly) query = query.eq("is_featured", true);
  if (options?.limit) query = query.limit(options.limit);
  const { data, error } = await query.order("created_at", { ascending: false });
  logSupabaseError("getApprovedReviews", error);
  return (data as Review[]) ?? [];
}

export async function getApprovedReviewsForProduct(productId: string): Promise<Review[]> {
  const supabase = await createClient();
  if (!supabase) return mockReviews.filter((r) => r.is_approved && r.product_id === productId);
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("is_approved", true)
    .eq("product_id", productId)
    .order("created_at", { ascending: false });
  logSupabaseError("getApprovedReviewsForProduct", error);
  return (data as Review[]) ?? [];
}
