import { Info } from "lucide-react";
import type { Product } from "@/lib/types";

/** Only renders policy fields that are actually configured — never invents policy text. */
export function BeforeYouOrder({ product }: { product: Product }) {
  const rows: { label: string; value: string }[] = [
    { label: "Delivery", value: product.delivery_time_text ?? "" },
    { label: "Support", value: product.support_type ?? "" },
    { label: "Replacement Policy", value: product.replacement_policy ?? "" },
    { label: "Refund Policy", value: product.refund_policy ?? "" },
  ].filter((row) => row.value);

  if (rows.length === 0) return null;

  return (
    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-ink">
        <Info className="h-5 w-5 text-amber-600" aria-hidden="true" /> Before You Order
      </h2>
      <dl className="mt-4 space-y-3">
        {rows.map((row) => (
          <div key={row.label}>
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{row.label}</dt>
            <dd className="mt-0.5 text-sm text-ink">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
