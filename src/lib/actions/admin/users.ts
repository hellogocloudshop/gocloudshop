"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { inviteUserSchema } from "@/lib/validations/admin";
import { formToObject, type ActionResult } from "./form-utils";

export async function inviteStaffUser(formData: FormData): Promise<ActionResult> {
  const parsed = inviteUserSchema.safeParse(formToObject(formData));
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const adminClient = createAdminClient();
  if (!adminClient) {
    return {
      success: false,
      error: "Inviting users requires SUPABASE_SERVICE_ROLE_KEY to be set in your server environment.",
    };
  }

  const { data, error } = await adminClient.auth.admin.inviteUserByEmail(parsed.data.email, {
    data: { name: parsed.data.name },
  });
  if (error) return { success: false, error: error.message };

  if (data.user) {
    const { error: profileError } = await adminClient
      .from("profiles")
      .update({ role: parsed.data.role, name: parsed.data.name })
      .eq("id", data.user.id);
    if (profileError) return { success: false, error: profileError.message };
  }

  revalidatePath("/admin/users");
  return { success: true };
}

export async function updateUserRole(id: string, role: "admin" | "editor"): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return { success: false, error: "Supabase is not connected." };

  const { error } = await supabase.from("profiles").update({ role }).eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/users");
  return { success: true };
}
