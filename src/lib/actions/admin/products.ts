"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { productSchema } from "@/lib/validations/admin";
import { formToObject, type ActionResult } from "./form-utils";

const BOOLEAN_FIELDS = ["is_featured", "is_popular", "is_ai", "is_gpu", "is_active"];

export async function createProduct(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return { success: false, error: "Supabase is not connected." };

  const parsed = productSchema.safeParse(formToObject(formData, BOOLEAN_FIELDS));
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const { data, error } = await supabase.from("products").insert(parsed.data).select("id").single();
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
  redirect(`/admin/products/${data.id}/edit`);
}

export async function updateProduct(id: string, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return { success: false, error: "Supabase is not connected." };

  const parsed = productSchema.safeParse(formToObject(formData, BOOLEAN_FIELDS));
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const { error } = await supabase.from("products").update(parsed.data).eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/", "layout");
  return { success: true };
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return { success: false, error: "Supabase is not connected." };

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/products");
  revalidatePath("/products");
  return { success: true };
}
