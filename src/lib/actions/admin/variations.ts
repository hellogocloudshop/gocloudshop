"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { variationSchema } from "@/lib/validations/admin";
import { formToObject, type ActionResult } from "./form-utils";

const BOOLEAN_FIELDS = ["is_active", "inference_support", "training_support"];

export async function createVariation(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return { success: false, error: "Supabase is not connected." };

  const parsed = variationSchema.safeParse(formToObject(formData, BOOLEAN_FIELDS));
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const { error } = await supabase.from("product_variations").insert(parsed.data);
  if (error) return { success: false, error: error.message };

  revalidatePath(`/admin/products/${parsed.data.product_id}/edit`);
  revalidatePath("/products");
  revalidatePath("/", "layout");
  return { success: true };
}

export async function updateVariation(id: string, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return { success: false, error: "Supabase is not connected." };

  const parsed = variationSchema.safeParse(formToObject(formData, BOOLEAN_FIELDS));
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const { error } = await supabase.from("product_variations").update(parsed.data).eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath(`/admin/products/${parsed.data.product_id}/edit`);
  revalidatePath("/products");
  revalidatePath("/", "layout");
  return { success: true };
}

export async function deleteVariation(id: string, productId: string): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return { success: false, error: "Supabase is not connected." };

  const { error } = await supabase.from("product_variations").delete().eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath(`/admin/products/${productId}/edit`);
  revalidatePath("/products");
  return { success: true };
}

export async function duplicateVariation(id: string, productId: string): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return { success: false, error: "Supabase is not connected." };

  const { data: original, error: fetchError } = await supabase
    .from("product_variations")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (fetchError || !original) return { success: false, error: fetchError?.message ?? "Variation not found" };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- stripped so the duplicate gets fresh id/timestamps
  const { id: _id, created_at: _createdAt, updated_at: _updatedAt, ...rest } = original;
  const { error } = await supabase.from("product_variations").insert({
    ...rest,
    name: `${rest.name} (Copy)`,
    slug: `${rest.slug}-copy-${Date.now().toString(36)}`,
  });
  if (error) return { success: false, error: error.message };

  revalidatePath(`/admin/products/${productId}/edit`);
  return { success: true };
}

export async function reorderVariations(productId: string, orderedIds: string[]): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return { success: false, error: "Supabase is not connected." };

  const updates = orderedIds.map((id, index) =>
    supabase.from("product_variations").update({ sort_order: index }).eq("id", id)
  );
  const results = await Promise.all(updates);
  const failed = results.find((r) => r.error);
  if (failed?.error) return { success: false, error: failed.error.message };

  revalidatePath(`/admin/products/${productId}/edit`);
  revalidatePath("/products");
  return { success: true };
}
