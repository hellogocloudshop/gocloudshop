import { createClient } from "@/lib/supabase/server";
import { logSupabaseError } from "@/lib/supabase/logError";
import { mockUseCases } from "@/lib/mock-data";
import type { UseCase } from "@/lib/types";

export async function getUseCases(): Promise<UseCase[]> {
  const supabase = await createClient();
  if (!supabase) {
    return mockUseCases.filter((u) => u.is_active).sort((a, b) => a.sort_order - b.sort_order);
  }
  const { data, error } = await supabase
    .from("use_cases")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  logSupabaseError("getUseCases", error);
  return (data as UseCase[]) ?? [];
}

export async function getUseCaseBySlug(slug: string): Promise<UseCase | null> {
  const supabase = await createClient();
  if (!supabase) return mockUseCases.find((u) => u.slug === slug && u.is_active) ?? null;
  const { data, error } = await supabase.from("use_cases").select("*").eq("slug", slug).maybeSingle();
  logSupabaseError("getUseCaseBySlug", error);
  return (data as UseCase) ?? null;
}
