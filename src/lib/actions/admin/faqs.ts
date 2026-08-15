"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { faqSchema } from "@/lib/validations/admin";
import { formToObject, type ActionResult } from "./form-utils";

export async function createFaq(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return { success: false, error: "Supabase is not connected." };

  const parsed = faqSchema.safeParse(formToObject(formData, ["is_active"]));
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const { error } = await supabase.from("faqs").insert(parsed.data);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/faqs");
  revalidatePath("/faq");
  redirect("/admin/faqs");
}

export async function updateFaq(id: string, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return { success: false, error: "Supabase is not connected." };

  const parsed = faqSchema.safeParse(formToObject(formData, ["is_active"]));
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const { error } = await supabase.from("faqs").update(parsed.data).eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/faqs");
  revalidatePath("/faq");
  return { success: true };
}

export async function deleteFaq(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return { success: false, error: "Supabase is not connected." };

  const { error } = await supabase.from("faqs").delete().eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/faqs");
  revalidatePath("/faq");
  return { success: true };
}
