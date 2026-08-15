import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import type { Product } from "@/lib/types";
import { cn, effectivePrice, formatPrice, productHref } from "@/lib/utils";
import { ProductBadge, AvailabilityBadge } from "@/components/ui/Badge";
import { ProviderLogo } from "@/components/ui/SmartImage";

export function ProductCard({ product, tone = "light" }: { product: Product; tone?: "light" | "dark" }) {
  const variations = product.variations ?? [];
  const { price, currency, fromVariation } = effectivePrice(product, variations);
  const features = (variations[0]?.features?.length ? variations[0].features : product.features).slice(0, 3);
  const badge = product.badge ?? variations.find((v) => v.badge)?.badge;
  const dark = tone === "dark";

  return (
    <Link
      href={productHref(product)}
      className={cn(
        "card-surface-hover group flex flex-col p-5 transition-all duration-300",
        dark
          ? "rounded-2xl border border-white/10 bg-white/5 shadow-none backdrop-blur-xl hover:border-accent-blue/40"
          : "card-surface"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <ProviderLogo
            name={product.provider?.name ?? product.name}
            logoUrl={product.provider_logo_override_url ?? product.provider?.logo_url}
            className="h-9 w-9 text-xs"
          />
          <div>
            <p className={cn("text-xs font-medium", dark ? "text-white/60" : "text-ink-muted")}>
              {product.provider?.name ?? "GoCloudShop"}
            </p>
            <p className={cn("text-[11px]", dark ? "text-white/40" : "text-ink-muted")}>{product.product_type}</p>
          </div>
        </div>
        {badge && <ProductBadge badge={badge} />}
      </div>

      <h3
        className={cn(
          "mt-4 text-base font-semibold leading-snug group-hover:text-accent-blue",
          dark ? "text-white" : "text-ink"
        )}
      >
        {product.name}
      </h3>
      {product.short_description && (
        <p className={cn("mt-1.5 line-clamp-2 text-sm", dark ? "text-white/60" : "text-ink-muted")}>
          {product.short_description}
        </p>
      )}

      {features.length > 0 && (
        <ul className="mt-3 space-y-1">
          {features.map((f) => (
            <li key={f} className={cn("flex items-center gap-1.5 text-xs", dark ? "text-white/60" : "text-ink-muted")}>
              <Check className="h-3.5 w-3.5 shrink-0 text-accent-blue" aria-hidden="true" />
              <span className="truncate">{f}</span>
            </li>
          ))}
        </ul>
      )}

      <div className={cn("mt-4 flex items-center justify-between gap-2 border-t pt-4", dark ? "border-white/10" : "border-line")}>
        <div>
          <p className={cn("text-lg font-bold", dark ? "text-white" : "text-ink")}>
            {fromVariation && (
              <span className={cn("mr-1 text-xs font-normal", dark ? "text-white/50" : "text-ink-muted")}>From</span>
            )}
            {price !== null ? formatPrice(price, currency) : "Contact us"}
          </p>
          <AvailabilityBadge status={product.availability} />
        </div>
        <span className="flex items-center gap-1 text-sm font-semibold text-accent-blue">
          View Details <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
