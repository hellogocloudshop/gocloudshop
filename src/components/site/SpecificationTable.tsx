import type { AvailabilityStatus, Product } from "@/lib/types";

const AVAILABILITY_LABEL: Record<AvailabilityStatus, string> = {
  in_stock: "Available",
  limited: "Limited Availability",
  out_of_stock: "Out of Stock",
  preorder: "Pre-order",
};

/** Only ever renders fields that actually have data — never fabricates specs. */
export function SpecificationTable({
  product,
  variationName,
  region,
  availability,
  delivery,
  specifications,
}: {
  product: Product;
  variationName?: string;
  region?: string | null;
  availability: AvailabilityStatus;
  delivery?: string | null;
  specifications: Record<string, string>;
}) {
  const rows: { label: string; value: string }[] = [
    { label: "Provider", value: product.provider?.name ?? "" },
    { label: "Product Type", value: product.product_type },
    { label: "Category", value: product.category?.name ?? "" },
    { label: "Variation", value: variationName ?? "" },
    { label: "Region", value: region ?? "" },
    { label: "Availability", value: AVAILABILITY_LABEL[availability] },
    { label: "Delivery", value: delivery ?? "" },
    { label: "Support", value: product.support_type ?? "" },
    { label: "Currency", value: product.currency },
    ...Object.entries(specifications).map(([label, value]) => ({ label, value })),
  ].filter((row) => row.value);

  if (rows.length === 0) return null;

  return (
    <div>
      <h2 className="text-lg font-semibold text-ink">Specifications</h2>
      <div className="mt-3 overflow-hidden rounded-xl border border-line">
        <dl className="divide-y divide-line">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-4 px-4 py-3 text-sm odd:bg-bg-subtle">
              <dt className="text-ink-muted">{row.label}</dt>
              <dd className="text-right font-medium text-ink">{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
