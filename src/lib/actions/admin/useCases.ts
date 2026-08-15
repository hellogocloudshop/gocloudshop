"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { useCaseSchema } from "@/lib/validations/admin";
import { formToObject, type ActionResult } from "./form-utils";

export async function createUseCase(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return { success: false, error: "Supabase is not connected." };

  const parsed = useCaseSchema.safeParse(formToObject(formData, ["is_active"]));
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const { error } = await supabase.from("use_cases").insert(parsed.data);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/use-cases");
  revalidatePath("/use-cases");
  redirect("/admin/use-cases");
}

export async function updateUseCase(id: string, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return { success: false, error: "Supabase is not connected." };

  const parsed = useCaseSchema.safeParse(formToObject(formData, ["is_active"]));
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const { error } = await supabase.from("use_cases").update(parsed.data).eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/use-cases");
  revalidatePath("/use-cases");
  return { success: true };
}

export async function deleteUseCase(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return { success: false, error: "Supabase is not connected." };

  const { error } = await supabase.from("use_cases").delete().eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/use-cases");
  revalidatePath("/use-cases");
  return { success: true };
}
