import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/data/orders";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { OrderStatusForm } from "@/components/admin/OrderStatusForm";
import { formatDate, formatPrice } from "@/lib/utils";

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <AdminPageHeader title="Order Details" description={formatDate(order.created_at)} />

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="card-surface p-6">
          <h2 className="font-semibold text-ink">Customer</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div>
              <dt className="text-ink-muted">Name</dt>
              <dd className="text-ink">{order.customer_name ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-ink-muted">Contact</dt>
              <dd className="text-ink">{order.contact ?? "—"}</dd>
            </div>
          </dl>
        </div>
        <div className="card-surface p-6">
          <h2 className="font-semibold text-ink">Order</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div>
              <dt className="text-ink-muted">Product</dt>
              <dd className="text-ink">{order.product_name_snapshot ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-ink-muted">Variation</dt>
              <dd className="text-ink">{order.variation_name_snapshot ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-ink-muted">Price</dt>
              <dd className="text-ink">{order.price_snapshot !== null ? formatPrice(order.price_snapshot, order.currency) : "—"}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-6 card-surface p-6">
        <h2 className="font-semibold text-ink">Status</h2>
        <div className="mt-4">
          <OrderStatusForm order={order} />
        </div>
      </div>
    </div>
  );
}
