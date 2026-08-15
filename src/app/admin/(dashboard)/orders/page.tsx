import Link from "next/link";
import { getOrders } from "@/lib/data/orders";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { formatDate, formatPrice } from "@/lib/utils";
import type { OrderStatus } from "@/lib/types";

const STATUSES: { label: string; value: OrderStatus | "" }[] = [
  { label: "All", value: "" },
  { label: "New", value: "new" },
  { label: "Contacted", value: "contacted" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Paid", value: "paid" },
  { label: "Processing", value: "processing" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

const STATUS_BADGE: Record<OrderStatus, string> = {
  new: "badge-info",
  contacted: "badge-neutral",
  pending: "badge-warning",
  confirmed: "badge-info",
  paid: "badge-success",
  processing: "badge-warning",
  completed: "badge-success",
  cancelled: "badge-danger",
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const { orders, total } = await getOrders({ status: (status as OrderStatus) || undefined, pageSize: 50 });

  return (
    <div>
      <AdminPageHeader title="Orders" description={`${total} orders`} />

      <div className="mt-4 flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <Link
            key={s.label}
            href={s.value ? `/admin/orders?status=${s.value}` : "/admin/orders"}
            className={`rounded-full px-3 py-1.5 text-xs font-medium ${
              (status ?? "") === s.value ? "bg-accent-blue text-white" : "border border-line text-ink-muted hover:text-ink"
            }`}
          >
            {s.label}
          </Link>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-bg-subtle text-xs uppercase tracking-wide text-ink-muted">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {orders.map((order) => (
              <tr key={order.id} className="cursor-pointer hover:bg-bg-subtle">
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${order.id}`} className="block">
                    <p className="font-medium text-ink">{order.customer_name ?? "—"}</p>
                    <p className="text-xs text-ink-muted">{order.contact ?? "No contact info"}</p>
                  </Link>
                </td>
                <td className="px-4 py-3 text-ink-muted">
                  <Link href={`/admin/orders/${order.id}`} className="block">
                    {order.product_name_snapshot ?? "—"}
                    {order.variation_name_snapshot && <span className="block text-xs">{order.variation_name_snapshot}</span>}
                  </Link>
                </td>
                <td className="px-4 py-3 text-ink-muted">
                  {order.price_snapshot !== null ? formatPrice(order.price_snapshot, order.currency) : "—"}
                </td>
                <td className="px-4 py-3">
                  <span className={STATUS_BADGE[order.order_status]}>{order.order_status}</span>
                </td>
                <td className="px-4 py-3 text-ink-muted">{formatDate(order.created_at)}</td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-ink-muted">
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
