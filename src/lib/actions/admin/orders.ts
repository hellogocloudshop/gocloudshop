"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { orderStatusSchema } from "@/lib/validations/admin";
import { formToObject, type ActionResult } from "./form-utils";

export async function updateOrderStatus(id: string, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return { success: false, error: "Supabase is not connected." };

  const parsed = orderStatusSchema.safeParse(formToObject(formData));
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const { error } = await supabase.from("orders").update(parsed.data).eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  return { success: true };
}
