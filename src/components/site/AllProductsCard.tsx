import Link from "next/link";
import { Check } from "lucide-react";
import type { SellableItem } from "@/lib/data/allProducts";
import { cn, formatPrice, productHref } from "@/lib/utils";
import { ProductBadge, AvailabilityBadge } from "@/components/ui/Badge";
import { ProviderLogo } from "@/components/ui/SmartImage";
import { TelegramOrderButton } from "./TelegramOrderButton";

/**
 * One card per purchasable variation (or per standalone product with no
 * variations) — the /all-products catalog card. Visually modeled on
 * ProductCard (same design tokens/spacing/shadows) but the primary CTA is a
 * direct "Order via Telegram" action instead of a "View Details" navigation
 * link; the product title still links to the detail page as a secondary,
 * accessible route.
 */
export function AllProductsCard({ item, telegramUsername }: { item: SellableItem; telegramUsername: string }) {
  const { product, variation, displayName, price, currency, availability, badge, features } = item;
  const detailsHref = productHref(product);
  const isBuyable = price !== null && availability !== "out_of_stock";

  return (
    <div className="card-surface card-surface-hover flex flex-col p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <ProviderLogo
            name={product.provider?.name ?? product.name}
            logoUrl={product.provider_logo_override_url ?? product.provider?.logo_url}
            className="h-9 w-9 text-xs"
          />
          <div>
            <p className="text-xs font-medium text-ink-muted">{product.provider?.name ?? "GoCloudShop"}</p>
            <p className="text-[11px] text-ink-muted">{product.product_type}</p>
          </div>
        </div>
        {badge && <ProductBadge badge={badge} />}
      </div>

      <Link href={detailsHref} className="mt-4 text-base font-semibold leading-snug text-ink hover:text-accent-blue">
        {displayName}
      </Link>
      {product.short_description && (
        <p className="mt-1.5 line-clamp-2 text-sm text-ink-muted">{product.short_description}</p>
      )}

      {features.length > 0 && (
        <ul className="mt-3 space-y-1">
          {features.slice(0, 3).map((f) => (
            <li key={f} className="flex items-center gap-1.5 text-xs text-ink-muted">
              <Check className="h-3.5 w-3.5 shrink-0 text-accent-blue" aria-hidden="true" />
              <span className="truncate">{f}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex items-end justify-between gap-3 border-t border-line pt-4">
        <div className="flex flex-col gap-1.5">
          <p className="text-lg font-bold leading-none text-ink">{price !== null ? formatPrice(price, currency) : "Contact us"}</p>
          <AvailabilityBadge status={availability} />
        </div>
        {isBuyable ? (
          <TelegramOrderButton
            telegramUsername={telegramUsername}
            productId={product.id}
            productName={displayName}
            variationId={variation?.id}
            variationName={variation?.name}
            price={price}
            currency={currency}
            label="Order"
            className="!px-4 !py-2 shrink-0"
          />
        ) : (
          <Link href="/contact" className={cn("btn-secondary shrink-0", "!px-4 !py-2")}>
            Contact
          </Link>
        )}
      </div>
    </div>
  );
}
