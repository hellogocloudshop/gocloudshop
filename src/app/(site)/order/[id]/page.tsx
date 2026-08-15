import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPublicOrderStatus } from "@/lib/data/orders";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { cn, formatDate, formatPrice } from "@/lib/utils";

// Never indexed — every URL here is a specific customer's private order.
export const metadata: Metadata = {
  title: "Order Status",
  robots: { index: false, follow: false },
};

interface StatusCopy {
  title: string;
  description: string;
  /** Only set for failed/expired payments — lets the customer retry
   *  without a dead end. Points at the catalog rather than the specific
   *  product, since this page doesn't have the product's slug/category on
   *  hand (only its name snapshot). */
  retryHref?: string;
}

/**
 * Status text is derived entirely from the order fetched server-side (via
 * getPublicOrderStatus, which reads the database) — never from a query
 * parameter, and never assumed just because the customer navigated here.
 * IPN processing is the only thing that ever changes what's shown.
 */
function getStatusCopy(orderStatus: string, paymentStatus: string, cryptoStatus: string | null): StatusCopy {
  if (paymentStatus === "paid") {
    return { title: "Payment confirmed.", description: "Your payment has been confirmed. Our team will be in touch shortly to deliver your order." };
  }
  if (paymentStatus === "refunded") {
    return { title: "Payment was refunded.", description: "This payment has been refunded. Contact support if you have any questions." };
  }
  if (cryptoStatus === "failed" || cryptoStatus === "expired" || orderStatus === "cancelled") {
    return {
      title: "Payment was not completed.",
      description: "This payment failed or expired before it was confirmed. You can browse the catalog to try again, or contact support.",
      retryHref: "/all-products",
    };
  }
  if (paymentStatus === "partially_paid") {
    return {
      title: "Payment is being confirmed.",
      description: "We've received a partial payment. Please contact support if you believe the full amount was sent.",
    };
  }
  return {
    title: "Payment is being confirmed.",
    description: "We haven't received final confirmation of your payment yet. This page updates automatically once it's confirmed — no need to refresh.",
  };
}

export default async function OrderStatusPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getPublicOrderStatus(id);
  if (!order) notFound();

  const copy = getStatusCopy(order.orderStatus, order.paymentStatus, order.cryptoPaymentStatus);
  const showDepositInstructions = order.payAddress && order.paymentStatus === "unpaid" && order.cryptoPaymentStatus !== "failed" && order.cryptoPaymentStatus !== "expired";

  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Order Status" }]} />

      <div className="mx-auto mt-6 max-w-xl">
        <div className="card-surface p-6 sm:p-8">
          <h1 className="text-2xl font-bold tracking-tight text-ink">{copy.title}</h1>
          <p className="mt-2 text-ink-muted">{copy.description}</p>

          <dl className="mt-6 space-y-3 border-t border-line pt-6 text-sm">
            <div className="flex items-start justify-between gap-4">
              <dt className="text-ink-muted">Order Number</dt>
              <dd className="break-all text-right font-mono text-xs text-ink">{order.id}</dd>
            </div>
            {order.productName && (
              <div className="flex items-start justify-between gap-4">
                <dt className="shrink-0 text-ink-muted">Product</dt>
                <dd className="text-right text-ink">
                  {order.productName}
                  {order.variationName ? ` — ${order.variationName}` : ""}
                </dd>
              </div>
            )}
            {order.quantity > 1 && (
              <div className="flex items-center justify-between gap-4">
                <dt className="text-ink-muted">Quantity</dt>
                <dd className="text-ink">{order.quantity}</dd>
              </div>
            )}
            {order.price !== null && (
              <div className="flex items-center justify-between gap-4">
                <dt className="text-ink-muted">Amount</dt>
                <dd className="font-semibold text-ink">{formatPrice(order.price, order.currency)}</dd>
              </div>
            )}
            {order.payCurrency && (
              <div className="flex items-center justify-between gap-4">
                <dt className="text-ink-muted">Payment Method</dt>
                <dd className="uppercase text-ink">{order.payCurrency}</dd>
              </div>
            )}
            <div className="flex items-center justify-between gap-4">
              <dt className="text-ink-muted">Placed</dt>
              <dd className="text-ink">{formatDate(order.createdAt)}</dd>
            </div>
          </dl>

          {showDepositInstructions && (
            <div className="mt-6 rounded-xl border border-line bg-surface p-4">
              <p className="text-sm font-semibold text-ink">Complete your payment</p>
              {order.payAmount !== null && order.payCurrency && (
                <p className="mt-1 text-sm text-ink-muted">
                  Send exactly <span className="font-semibold text-ink">{order.payAmount}</span>{" "}
                  <span className="uppercase">{order.payCurrency}</span> to the address below.
                </p>
              )}
              <p className="mt-3 break-all rounded-lg border border-line bg-card p-3 font-mono text-xs text-ink">{order.payAddress}</p>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
            {copy.retryHref && (
              <Link href={copy.retryHref} className="btn-primary w-full justify-center sm:flex-1">
                Browse Products
              </Link>
            )}
            <Link href="/contact" className={cn("btn-secondary w-full justify-center", copy.retryHref && "sm:flex-1")}>
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
