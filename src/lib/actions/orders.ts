"use server";

import { createClient } from "@/lib/supabase/server";

interface CreateOrderInput {
  /** Null for product-less leads (e.g. a Stock Update announcement that
   *  isn't yet a catalog product row) — orders.product_id is nullable. */
  productId: string | null;
  productName: string;
  variationId?: string | null;
  variationName?: string | null;
  price: number | null;
  currency: string;
  referrer?: string;
}

/**
 * Called by TelegramOrderButton just before opening the Telegram deep link,
 * so every "Order via Telegram" click is captured as a real order/lead with
 * an accurate price snapshot for the admin Orders inbox. Fails silently
 * (returns false) when no Supabase project is connected yet, so it never
 * blocks the Telegram redirect during local development.
 */
export async function createOrder(input: CreateOrderInput): Promise<boolean> {
  const supabase = await createClient();
  if (!supabase) return false;

  const { error } = await supabase.from("orders").insert({
    product_id: input.productId,
    variation_id: input.variationId ?? null,
    product_name_snapshot: input.productName,
    variation_name_snapshot: input.variationName ?? null,
    price_snapshot: input.price,
    currency: input.currency,
    order_status: "new",
    payment_status: "unpaid",
    referrer: input.referrer ?? null,
  });

  return !error;
}

interface ContactMessageInput {
  name: string;
  contact: string;
  message: string;
}

/**
 * The general Contact page has no product context, so it's captured in the
 * same orders table as a product-less inquiry (customer_name/contact/notes)
 * rather than a separate table — it flows into the same admin Orders inbox
 * our team already checks, tagged "new" for follow-up.
 */
export async function submitContactMessage(input: ContactMessageInput): Promise<{ success: boolean; error?: string }> {
  if (!input.name.trim() || !input.contact.trim() || !input.message.trim()) {
    return { success: false, error: "Please fill in every field." };
  }

  const supabase = await createClient();
  if (!supabase) return { success: false, error: "Contact form is not available yet — Supabase is not connected." };

  const { error } = await supabase.from("orders").insert({
    customer_name: input.name,
    contact: input.contact,
    notes: input.message,
    order_status: "new",
    payment_status: "unpaid",
  });
  if (error) return { success: false, error: error.message };

  return { success: true };
}

interface NewsletterSignupInput {
  email: string;
}

export async function subscribeNewsletter(input: NewsletterSignupInput): Promise<{ success: boolean; error?: string }> {
  const email = input.email.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "Enter a valid email address." };
  }

  const supabase = await createClient();
  if (!supabase) return { success: false, error: "Newsletter signup is not available yet — Supabase is not connected." };

  const { error } = await supabase.from("newsletter_subscribers").insert({ email });
  if (error) {
    if (error.code === "23505") return { success: false, error: "This email is already subscribed." };
    return { success: false, error: error.message };
  }

  return { success: true };
}
