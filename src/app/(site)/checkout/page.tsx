import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductById } from "@/lib/data/products";
import { getVariationById } from "@/lib/data/variations";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { AvailabilityBadge } from "@/components/ui/Badge";
import { ProviderLogo } from "@/components/ui/SmartImage";
import { CheckoutForm } from "@/components/site/CheckoutForm";
import { formatPrice, productHref } from "@/lib/utils";

// Never indexed — this is a transactional page, not content.
export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

/**
 * Order-review checkout — the required step between "Buy Now" and payment
 * creation. Product/variation, price and availability are all re-fetched
 * from the database here (never trusted from the query string), which is
 * also re-verified a second time server-side when the payment is actually
 * created (see /api/nowpayments/create-payment) in case either changed
 * between page load and submit.
 */
export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string; variation?: string }>;
}) {
  const { product: productId, variation: variationId } = await searchParams;
  if (!productId) notFound();

  const product = await getProductById(productId);
  if (!product || !product.is_active) notFound();

  const variation = variationId ? await getVariationById(variationId) : null;
  if (variationId && (!variation || variation.product_id !== product.id || !variation.is_active)) notFound();

  const price = variation ? variation.price : product.base_price;
  const currency = variation ? variation.currency : product.currency;
  const availability = variation ? variation.availability : product.availability;
  const isOutOfStock = availability === "out_of_stock";
  const detailsHref = productHref(product);

  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: product.name, href: detailsHref }, { label: "Checkout" }]} />

      <div className="mx-auto mt-6 grid max-w-4xl gap-6 lg:grid-cols-[1fr_1.3fr] lg:items-start">
        <div className="card-surface p-6 lg:sticky lg:top-24">
          <h2 className="font-semibold text-ink">Order Summary</h2>
          <div className="mt-4 flex items-center gap-3">
            <ProviderLogo
              name={product.provider?.name ?? product.name}
              logoUrl={product.provider_logo_override_url ?? product.provider?.logo_url}
              className="h-11 w-11 shrink-0 text-sm"
            />
            <div className="min-w-0">
              <p className="truncate font-semibold text-ink">{product.name}</p>
              {variation && <p className="truncate text-sm text-ink-muted">{variation.name}</p>}
            </div>
          </div>

          <div className="mt-4 space-y-2.5 border-t border-line pt-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-ink-muted">Availability</span>
              <AvailabilityBadge status={availability} />
            </div>
            {price !== null && (
              <div className="flex items-center justify-between">
                <span className="text-ink-muted">Unit Price</span>
                <span className="font-semibold text-ink">{formatPrice(price, currency)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="card-surface p-6">
          {isOutOfStock ? (
            <div className="alert-danger">
              This product just went out of stock and can&apos;t be ordered right now.{" "}
              <Link href={detailsHref} className="font-semibold underline">
                Go back
              </Link>{" "}
              or{" "}
              <Link href="/contact" className="font-semibold underline">
                contact support
              </Link>{" "}
              for availability updates.
            </div>
          ) : price === null ? (
            <div className="alert-warning">
              This product doesn&apos;t have a fixed online price yet.{" "}
              <Link href="/contact" className="font-semibold underline">
                Contact us
              </Link>{" "}
              to order it directly.
            </div>
          ) : (
            <CheckoutForm productId={product.id} variationId={variation?.id ?? null} unitPrice={price} currency={currency} />
          )}
        </div>
      </div>
    </div>
  );
}
