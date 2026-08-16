import { createClient } from "@/lib/supabase/server";
import { logSupabaseError } from "@/lib/supabase/logError";
import { mockCategories } from "@/lib/mock-data";
import type { Category } from "@/lib/types";

export async function getCategories(options?: { activeOnly?: boolean }): Promise<Category[]> {
  const activeOnly = options?.activeOnly ?? true;
  const supabase = await createClient();

  if (!supabase) {
    return mockCategories
      .filter((c) => !activeOnly || c.is_active)
      .sort((a, b) => a.sort_order - b.sort_order);
  }

  let query = supabase.from("categories").select("*").order("sort_order", { ascending: true });
  if (activeOnly) query = query.eq("is_active", true);
  const { data, error } = await query;
  logSupabaseError("getCategories", error);
  return (data as Category[]) ?? [];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = await createClient();
  if (!supabase) return mockCategories.find((c) => c.slug === slug) ?? null;
  const { data, error } = await supabase.from("categories").select("*").eq("slug", slug).maybeSingle();
  logSupabaseError("getCategoryBySlug", error);
  return (data as Category) ?? null;
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const supabase = await createClient();
  if (!supabase) return mockCategories.find((c) => c.id === id) ?? null;
  const { data, error } = await supabase.from("categories").select("*").eq("id", id).maybeSingle();
  logSupabaseError("getCategoryById", error);
  return (data as Category) ?? null;
}
