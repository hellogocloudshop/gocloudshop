import { createClient } from "@/lib/supabase/server";
import { mockUseCases } from "@/lib/mock-data";
import type { UseCase } from "@/lib/types";

export async function getUseCases(): Promise<UseCase[]> {
  const supabase = await createClient();
  if (!supabase) {
    return mockUseCases.filter((u) => u.is_active).sort((a, b) => a.sort_order - b.sort_order);
  }
  const { data } = await supabase
    .from("use_cases")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  return (data as UseCase[]) ?? [];
}

export async function getUseCaseBySlug(slug: string): Promise<UseCase | null> {
  const supabase = await createClient();
  if (!supabase) return mockUseCases.find((u) => u.slug === slug && u.is_active) ?? null;
  const { data } = await supabase.from("use_cases").select("*").eq("slug", slug).maybeSingle();
  return (data as UseCase) ?? null;
}
