"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { providerCategoryPageSchema } from "@/lib/validations/admin";
import { formToObject, type ActionResult } from "./form-utils";

export async function createProviderCategoryPage(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return { success: false, error: "Supabase is not connected." };

  const parsed = providerCategoryPageSchema.safeParse(formToObject(formData, ["is_active"]));
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const { error } = await supabase.from("provider_category_pages").insert(parsed.data);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/provider-pages");
  revalidatePath("/", "layout");
  redirect("/admin/provider-pages");
}

export async function updateProviderCategoryPage(id: string, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return { success: false, error: "Supabase is not connected." };

  const parsed = providerCategoryPageSchema.safeParse(formToObject(formData, ["is_active"]));
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const { error } = await supabase.from("provider_category_pages").update(parsed.data).eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/provider-pages");
  revalidatePath("/", "layout");
  return { success: true };
}

export async function deleteProviderCategoryPage(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return { success: false, error: "Supabase is not connected." };

  const { error } = await supabase.from("provider_category_pages").delete().eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/provider-pages");
  return { success: true };
}
