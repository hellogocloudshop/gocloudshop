"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { siteSettingsSchema } from "@/lib/validations/admin";
import { formToObject, type ActionResult } from "./form-utils";

export async function updateSiteSettings(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return { success: false, error: "Supabase is not connected." };

  const parsed = siteSettingsSchema.safeParse(formToObject(formData));
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const { error } = await supabase.from("site_settings").update(parsed.data).eq("id", 1);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
  return { success: true };
}
