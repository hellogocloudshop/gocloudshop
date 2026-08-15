import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Provider } from "@/lib/types";
import { formatPrice, providerHref } from "@/lib/utils";
import { ProviderLogo } from "@/components/ui/SmartImage";
import { CLOUD_SERVICE_DISPLAY_OVERRIDES } from "@/config/cloudServiceDisplay";

/**
 * Premium marketplace card for /Cloud-Service. Every string here is derived
 * from the provider record + its live catalog summary — nothing is
 * hardcoded per-provider, so a newly-added provider automatically gets a
 * correctly worded "Buy {name} Accounts" card with no code changes. A small
 * presentation-only override table (cloudServiceDisplay.ts) lets a handful
 * of providers use different marketing wording without touching the
 * database — see that file for details.
 */
export function CloudServiceCard({
  provider,
  productCount,
  startingPrice,
  categories,
}: {
  provider: Provider;
  productCount: number;
  startingPrice: number | null;
  categories: string[];
}) {
  const override = CLOUD_SERVICE_DISPLAY_OVERRIDES[provider.slug];
  const displayName = override?.displayName ?? provider.name;
  const buyLabel = override?.buyLabel ?? `Buy ${provider.name} Accounts`;

  return (
    <Link
      href={providerHref(provider)}
      aria-label={`${buyLabel} — view ${displayName} products and pricing`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-accent-blue/40 hover:bg-white/[0.06] hover:shadow-[0_24px_48px_-16px_rgba(2,6,23,0.65),0_0_0_1px_rgba(37,99,235,0.28),0_0_44px_-10px_rgba(124,58,237,0.4)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue"
    >
      {/* Soft decorative glow — purely visual, never the sole carrier of information */}
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-gradient-to-br from-accent-blue/25 to-violet/25 opacity-40 blur-3xl transition-opacity duration-300 group-hover:opacity-80"
        aria-hidden="true"
      />

      {/* 1. Provider identity */}
      <div className="relative flex items-center gap-3">
        <ProviderLogo
          name={displayName}
          logoUrl={provider.logo_url}
          className="h-12 w-12 shrink-0 text-sm transition-transform duration-300 group-hover:scale-105"
        />
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-sky-accent">Cloud Service</p>
          <p className="truncate text-sm font-medium text-white/80">{displayName}</p>
        </div>
      </div>

      {/* 2. Customer-facing purchase intent */}
      <h3 className="relative mt-4 text-xl font-bold leading-snug text-white">{buyLabel}</h3>

      {/* 3. Description */}
      {provider.description && (
        <p className="relative mt-2 line-clamp-2 text-sm leading-relaxed text-white/60">{provider.description}</p>
      )}

      {/* 4. Category chips (only real, existing categories) */}
      {categories.length > 0 && (
        <div className="relative mt-4 flex flex-wrap gap-1.5">
          {categories.slice(0, 4).map((category) => (
            <span
              key={category}
              className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-white/70"
            >
              {category}
            </span>
          ))}
        </div>
      )}

      <div className="relative mt-auto pt-5">
        <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-4">
          {/* 5. Pricing */}
          <div>
            {startingPrice !== null ? (
              <>
                <p className="text-xs font-medium text-white/50">From</p>
                <p className="text-2xl font-extrabold tracking-tight text-white">{formatPrice(startingPrice)}</p>
              </>
            ) : (
              <p className="text-sm font-medium text-white/60">Contact for pricing</p>
            )}
          </div>
          <p className="text-right text-xs text-white/50">
            {productCount} {productCount === 1 ? "Product" : "Products"}
          </p>
        </div>

        {/* 6. Buy CTA */}
        <span className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-blue to-violet bg-[length:160%_100%] bg-[position:0%_0%] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_-6px_rgba(37,99,235,0.5)] transition-all duration-300 group-hover:bg-[position:100%_0%] group-hover:shadow-[0_10px_32px_-4px_rgba(124,58,237,0.6)]">
          {buyLabel}
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
