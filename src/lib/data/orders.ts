import { createClient } from "@/lib/supabase/server";
import type { Order, OrderStatus } from "@/lib/types";

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

  const { data, count } = await query;
  return { orders: (data as Order[]) ?? [], total: count ?? 0 };
}

export async function getOrderById(id: string): Promise<Order | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data } = await supabase.from("orders").select("*").eq("id", id).maybeSingle();
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

  const { data } = await supabase.from("orders").select("order_status");
  for (const row of (data as { order_status: OrderStatus }[]) ?? []) {
    empty[row.order_status] += 1;
  }
  return empty;
}
