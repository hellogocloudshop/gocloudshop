import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { logSupabaseError } from "@/lib/supabase/logError";
import type { Order, OrderStatus, PaymentStatus } from "@/lib/types";

/**
 * Orders are staff-only reads (see RLS policy orders_staff_select), so this
 * is only ever called from authenticated admin routes. There is no mock
 * fallback catalog for orders — an unconnected project simply shows an empty
 * inbox until Supabase is wired up.
 */
export async function getOrders(options?: { status?: OrderStatus; page?: number; pageSize?: number }): Promise<{
  orders: Order[];
  total: number;
}> {
  const supabase = await createClient();
  if (!supabase) return { orders: [], total: 0 };

  const page = options?.page ?? 1;
  const pageSize = options?.pageSize ?? 20;
  const start = (page - 1) * pageSize;

  let query = supabase.from("orders").select("*", { count: "exact" }).order("created_at", { ascending: false });
  if (options?.status) query = query.eq("order_status", options.status);
  query = query.range(start, start + pageSize - 1);

  const { data, count, error } = await query;
  logSupabaseError("getOrders", error);
  return { orders: (data as Order[]) ?? [], total: count ?? 0 };
}

export async function getOrderById(id: string): Promise<Order | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data, error } = await supabase.from("orders").select("*").eq("id", id).maybeSingle();
  logSupabaseError("getOrderById", error);
  return (data as Order) ?? null;
}

export async function getOrderCounts(): Promise<Record<OrderStatus, number>> {
  const supabase = await createClient();
  const empty: Record<OrderStatus, number> = {
    new: 0,
    contacted: 0,
    pending: 0,
    confirmed: 0,
    paid: 0,
    processing: 0,
    completed: 0,
    cancelled: 0,
  };
  if (!supabase) return empty;

  const { data, error } = await supabase.from("orders").select("order_status");
  logSupabaseError("getOrderCounts", error);
  for (const row of (data as { order_status: OrderStatus }[]) ?? []) {
    empty[row.order_status] += 1;
  }
  return empty;
}

export interface PublicOrderStatus {
  id: string;
  productName: string | null;
  variationName: string | null;
  price: number | null;
  currency: string;
  quantity: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  cryptoPaymentStatus: string | null;
  payCurrency: string | null;
  payAmount: number | null;
  payAddress: string | null;
  paidAt: string | null;
  createdAt: string;
}

/**
 * Public order-status lookup by id, for the customer-facing /order/[id]
 * page after a NOWPayments checkout. `orders` is staff-only readable via
 * RLS (see 0002_rls.sql — there are no customer accounts on this storefront
 * to scope a policy to), so this deliberately uses the service-role admin
 * client to read a single row by its own unguessable random id — the same
 * "possession of the link is the authorization" model used by most
 * anonymous-checkout order-status pages. Only returns the safe subset of
 * fields a customer should see — never customer_name/contact/notes/
 * referrer/ipn_payload, which stay staff-only (see admin/orders).
 */
export async function getPublicOrderStatus(id: string): Promise<PublicOrderStatus | null> {
  const admin = createAdminClient();
  if (!admin) return null;

  const { data, error } = await admin
    .from("orders")
    .select(
      "id, product_name_snapshot, variation_name_snapshot, price_snapshot, currency, quantity, order_status, payment_status, crypto_payment_status, pay_currency, pay_amount, pay_address, paid_at, created_at"
    )
    .eq("id", id)
    .maybeSingle();
  logSupabaseError("getPublicOrderStatus", error);
  if (!data) return null;

  return {
    id: data.id,
    productName: data.product_name_snapshot,
    variationName: data.variation_name_snapshot,
    price: data.price_snapshot,
    currency: data.currency,
    quantity: data.quantity ?? 1,
    orderStatus: data.order_status,
    paymentStatus: data.payment_status,
    cryptoPaymentStatus: data.crypto_payment_status,
    payCurrency: data.pay_currency,
    payAmount: data.pay_amount,
    payAddress: data.pay_address,
    paidAt: data.paid_at,
    createdAt: data.created_at,
  };
}
