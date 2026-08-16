import { createClient } from "@/lib/supabase/server";
import { logSupabaseError } from "@/lib/supabase/logError";
import { mockProviderCategoryPages, mockProviders, mockCategories } from "@/lib/mock-data";
import type { ProviderCategoryPage } from "@/lib/types";

function withRelations(page: ProviderCategoryPage): ProviderCategoryPage {
  return {
    ...page,
    provider: mockProviders.find((p) => p.id === page.provider_id),
    category: page.category_id ? mockCategories.find((c) => c.id === page.category_id) ?? null : null,
  };
}

export async function getProviderCategoryPages(): Promise<ProviderCategoryPage[]> {
  const supabase = await createClient();
  if (!supabase) {
    return mockProviderCategoryPages
      .filter((p) => p.is_active)
      .map(withRelations)
      .sort((a, b) => a.sort_order - b.sort_order);
  }

  const { data, error } = await supabase
    .from("provider_category_pages")
    .select("*, provider:providers(*), category:categories(*)")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  logSupabaseError("getProviderCategoryPages", error);
  return (data as ProviderCategoryPage[]) ?? [];
}

export async function getProviderCategoryPageBySlug(slug: string): Promise<ProviderCategoryPage | null> {
  const supabase = await createClient();
  if (!supabase) {
    const page = mockProviderCategoryPages.find((p) => p.slug === slug && p.is_active);
    return page ? withRelations(page) : null;
  }

  const { data, error } = await supabase
    .from("provider_category_pages")
    .select("*, provider:providers(*), category:categories(*)")
    .eq("slug", slug)
    .maybeSingle();
  logSupabaseError("getProviderCategoryPageBySlug", error);
  return (data as ProviderCategoryPage) ?? null;
}

export async function getProviderCategoryPagesByProvider(providerId: string): Promise<ProviderCategoryPage[]> {
  const supabase = await createClient();
  if (!supabase) {
    return mockProviderCategoryPages
      .filter((p) => p.provider_id === providerId && p.is_active)
      .map(withRelations);
  }
  const { data, error } = await supabase
    .from("provider_category_pages")
    .select("*, category:categories(*)")
    .eq("provider_id", providerId)
    .eq("is_active", true);
  logSupabaseError("getProviderCategoryPagesByProvider", error);
  return (data as ProviderCategoryPage[]) ?? [];
}
