"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { providerSchema } from "@/lib/validations/admin";
import { formToObject, type ActionResult } from "./form-utils";

export async function createProvider(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return { success: false, error: "Supabase is not connected." };

  const parsed = providerSchema.safeParse(formToObject(formData, ["is_active"]));
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const { error } = await supabase.from("providers").insert(parsed.data);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/providers");
  revalidatePath("/providers");
  revalidatePath("/", "layout");
  redirect("/admin/providers");
}

export async function updateProvider(id: string, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return { success: false, error: "Supabase is not connected." };

  const parsed = providerSchema.safeParse(formToObject(formData, ["is_active"]));
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const { error } = await supabase.from("providers").update(parsed.data).eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/providers");
  revalidatePath("/providers");
  revalidatePath("/", "layout");
  return { success: true };
}

export async function deleteProvider(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return { success: false, error: "Supabase is not connected." };

  const { error } = await supabase.from("providers").delete().eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/providers");
  revalidatePath("/providers");
  return { success: true };
}
