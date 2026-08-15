"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { guideSchema } from "@/lib/validations/admin";
import { formToObject, type ActionResult } from "./form-utils";

export async function createGuide(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return { success: false, error: "Supabase is not connected." };

  const parsed = guideSchema.safeParse(formToObject(formData));
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const { error } = await supabase.from("guides").insert({
    ...parsed.data,
    published_at: parsed.data.status === "published" ? new Date().toISOString() : null,
  });
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/guides");
  revalidatePath("/guides");
  redirect("/admin/guides");
}

export async function updateGuide(id: string, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return { success: false, error: "Supabase is not connected." };

  const parsed = guideSchema.safeParse(formToObject(formData));
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const { error } = await supabase.from("guides").update(parsed.data).eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/guides");
  revalidatePath("/guides");
  revalidatePath(`/guides/${parsed.data.slug}`);
  return { success: true };
}

export async function deleteGuide(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return { success: false, error: "Supabase is not connected." };

  const { error } = await supabase.from("guides").delete().eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/guides");
  revalidatePath("/guides");
  return { success: true };
}
