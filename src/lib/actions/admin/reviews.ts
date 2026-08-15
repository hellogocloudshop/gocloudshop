"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { reviewSchema } from "@/lib/validations/admin";
import { formToObject, type ActionResult } from "./form-utils";

export async function createReview(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return { success: false, error: "Supabase is not connected." };

  const parsed = reviewSchema.safeParse(formToObject(formData, ["is_approved", "is_featured"]));
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const { error } = await supabase.from("reviews").insert(parsed.data);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/reviews");
  revalidatePath("/", "layout");
  redirect("/admin/reviews");
}

export async function updateReview(id: string, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return { success: false, error: "Supabase is not connected." };

  const parsed = reviewSchema.safeParse(formToObject(formData, ["is_approved", "is_featured"]));
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const { error } = await supabase.from("reviews").update(parsed.data).eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/reviews");
  revalidatePath("/", "layout");
  return { success: true };
}

export async function deleteReview(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return { success: false, error: "Supabase is not connected." };

  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/reviews");
  revalidatePath("/", "layout");
  return { success: true };
}
