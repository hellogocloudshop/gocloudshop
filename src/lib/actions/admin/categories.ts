"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { categorySchema } from "@/lib/validations/admin";
import { formToObject, type ActionResult } from "./form-utils";

export async function createCategory(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return { success: false, error: "Supabase is not connected." };

  const parsed = categorySchema.safeParse(formToObject(formData, ["is_active"]));
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const { error } = await supabase.from("categories").insert(parsed.data);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/categories");
  revalidatePath("/", "layout");
  redirect("/admin/categories");
}

export async function updateCategory(id: string, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return { success: false, error: "Supabase is not connected." };

  const parsed = categorySchema.safeParse(formToObject(formData, ["is_active"]));
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const { error } = await supabase.from("categories").update(parsed.data).eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/categories");
  revalidatePath("/", "layout");
  return { success: true };
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return { success: false, error: "Supabase is not connected." };

  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/categories");
  return { success: true };
}

export async function reorderCategories(orderedIds: string[]): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return { success: false, error: "Supabase is not connected." };

  const updates = orderedIds.map((id, index) => supabase.from("categories").update({ sort_order: index }).eq("id", id));
  const results = await Promise.all(updates);
  const failed = results.find((r) => r.error);
  if (failed?.error) return { success: false, error: failed.error.message };

  revalidatePath("/admin/categories");
  revalidatePath("/", "layout");
  return { success: true };
}
