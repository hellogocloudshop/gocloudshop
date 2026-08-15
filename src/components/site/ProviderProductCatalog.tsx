import Link from "next/link";
import type { SellableItem } from "@/lib/data/allProducts";
import { cn, formatPrice } from "@/lib/utils";
import { AvailabilityBadge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { BuyNowButton } from "./BuyNowButton";

/** Real spec text only — features first, falling back to specifications
 *  key/value pairs. Never fabricated; returns null when neither exists. */
function configurationLine(item: SellableItem): string | null {
  if (item.features.length > 0) return item.features.slice(0, 4).join(" · ");
  const specs = item.variation?.specifications ?? item.product.specifications;
  const entries = Object.entries(specs ?? {});
  if (entries.length === 0) return null;
  return entries.map(([key, value]) => `${key}: ${value}`).join(" · ");
}

/**
 * ONE unified catalog section for a provider's account page — every
 * purchasable variation/account tier as a compact row inside a single
 * bordered container, separated by dividers, rather than a grid of
 * individual cards. Each row's Buy Now button takes the customer to the
 * same /checkout flow used everywhere else in the app.
 */
export function ProviderProductCatalog({
  items,
  title,
  emptyDescription,
  tone = "light",
}: {
  items: SellableItem[];
  title: string;
  emptyDescription: string;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";

  return (
    <section>
      <h2 className={cn("text-lg font-semibold", dark ? "text-white" : "text-ink")}>{title}</h2>

      {items.length === 0 ? (
        <div className="mt-4">
          <EmptyState title="No active products yet." description={emptyDescription} />
        </div>
      ) : (
        <div
          className={cn(
            "mt-4 overflow-hidden rounded-2xl border",
            dark ? "border-white/10 bg-white/[0.04] backdrop-blur-xl" : "border-line bg-card"
          )}
        >
          {/* Column labels — desktop only; the mobile layout stacks each row instead. */}
          <div
            className={cn(
              "hidden border-b px-5 py-3 text-xs font-semibold uppercase tracking-wide sm:flex sm:items-center sm:gap-4",
              dark ? "border-white/10 bg-white/[0.03] text-white/50" : "border-line bg-bg-subtle text-ink-muted"
            )}
          >
            <span className="flex-1">Configuration</span>
            <span className="w-28 text-right">Price</span>
            <span className="w-36 text-center">Availability</span>
            <span className="w-32 text-right">Action</span>
          </div>

          <div className={cn("divide-y", dark ? "divide-white/10" : "divide-line")}>
            {items.map((item) => {
              const spec = configurationLine(item);
              return (
                <div
                  key={item.id}
                  className={cn(
                    "flex flex-col gap-3 p-5 transition-colors duration-200 sm:flex-row sm:items-center sm:gap-4",
                    dark ? "hover:bg-white/[0.06]" : "hover:bg-bg-subtle"
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <p className={cn("font-semibold leading-snug", dark ? "text-white" : "text-ink")}>{item.displayName}</p>
                    {spec && <p className={cn("mt-0.5 truncate text-sm", dark ? "text-white/55" : "text-ink-muted")}>{spec}</p>}
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:w-28 sm:justify-end">
                    <span className={cn("text-xs font-medium sm:hidden", dark ? "text-white/50" : "text-ink-muted")}>Price</span>
                    <p className={cn("text-lg font-bold", dark ? "text-white" : "text-ink")}>
                      {item.price !== null ? formatPrice(item.price, item.currency) : "Contact us"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:w-36 sm:justify-center">
                    <span className={cn("text-xs font-medium sm:hidden", dark ? "text-white/50" : "text-ink-muted")}>Availability</span>
                    <AvailabilityBadge status={item.availability} tone={tone} />
                  </div>

                  <div className="sm:w-32 sm:text-right">
                    {item.price !== null && item.availability !== "out_of_stock" ? (
                      <BuyNowButton
                        productId={item.product.id}
                        variationId={item.variation?.id}
                        label="Buy Now"
                        className="w-full justify-center !px-4 !py-2 text-sm sm:w-auto"
                      />
                    ) : (
                      <Link href="/contact" className="btn-secondary w-full justify-center !px-4 !py-2 text-sm sm:w-auto">
                        Contact
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
