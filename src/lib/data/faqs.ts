import { createClient } from "@/lib/supabase/server";
import { mockFaqs } from "@/lib/mock-data";
import type { Faq } from "@/lib/types";

export async function getGlobalFaqs(): Promise<Faq[]> {
  const supabase = await createClient();
  if (!supabase) {
    return mockFaqs
      .filter((f) => f.is_active && !f.product_id && !f.provider_id)
      .sort((a, b) => a.sort_order - b.sort_order);
  }
  const { data } = await supabase
    .from("faqs")
    .select("*")
    .eq("is_active", true)
    .is("product_id", null)
    .is("provider_id", null)
    .order("sort_order", { ascending: true });
  return (data as Faq[]) ?? [];
}

export async function getFaqsByProduct(productId: string): Promise<Faq[]> {
  const supabase = await createClient();
  if (!supabase) {
    return mockFaqs.filter((f) => f.is_active && f.product_id === productId).sort((a, b) => a.sort_order - b.sort_order);
  }
  const { data } = await supabase
    .from("faqs")
    .select("*")
    .eq("is_active", true)
    .eq("product_id", productId)
    .order("sort_order", { ascending: true });
  return (data as Faq[]) ?? [];
}

export async function getFaqsByProvider(providerId: string): Promise<Faq[]> {
  const supabase = await createClient();
  if (!supabase) {
    return mockFaqs.filter((f) => f.is_active && f.provider_id === providerId).sort((a, b) => a.sort_order - b.sort_order);
  }
  const { data } = await supabase
    .from("faqs")
    .select("*")
    .eq("is_active", true)
    .eq("provider_id", providerId)
    .order("sort_order", { ascending: true });
  return (data as Faq[]) ?? [];
}
