"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { comparisonSchema } from "@/lib/validations/admin";
import { formToObject, type ActionResult } from "./form-utils";

export async function createComparison(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return { success: false, error: "Supabase is not connected." };

  const parsed = comparisonSchema.safeParse(formToObject(formData, ["is_active"]));
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const { error } = await supabase.from("comparisons").insert(parsed.data);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/comparisons");
  revalidatePath("/choose");
  redirect("/admin/comparisons");
}

export async function updateComparison(id: string, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return { success: false, error: "Supabase is not connected." };

  const parsed = comparisonSchema.safeParse(formToObject(formData, ["is_active"]));
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const { error } = await supabase.from("comparisons").update(parsed.data).eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/comparisons");
  revalidatePath("/choose");
  return { success: true };
}

export async function deleteComparison(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return { success: false, error: "Supabase is not connected." };

  const { error } = await supabase.from("comparisons").delete().eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/comparisons");
  revalidatePath("/choose");
  return { success: true };
}
