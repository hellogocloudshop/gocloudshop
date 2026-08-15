import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Provider } from "@/lib/types";
import { cn, formatPrice, providerHref } from "@/lib/utils";
import { ProviderLogo } from "@/components/ui/SmartImage";

export function ProviderCard({
  provider,
  productCount,
  startingPrice,
  categories,
  description,
  truncate = true,
}: {
  provider: Provider;
  productCount: number;
  startingPrice: number | null;
  categories: string[];
  /** Optional richer marketing description (e.g. the Homepage's provider
   *  showcase copy) — falls back to the real provider.description from the
   *  database when not supplied, so every other caller is unaffected. */
  description?: string | null;
  /** Clip the description to 3 lines (default, for compact grids). Set
   *  false to show the complete description in full — e.g. the Homepage's
   *  "Cloud Account Categories" section, which must render the full
   *  marketing copy, not a preview. */
  truncate?: boolean;
}) {
  const copy = description ?? provider.description;

  return (
    <Link href={providerHref(provider)} className="card-surface card-surface-hover group flex flex-col p-6">
      <div className="flex items-center gap-3">
        <ProviderLogo name={provider.name} logoUrl={provider.logo_url} className="h-11 w-11 text-sm" />
        <h3 className="text-base font-semibold text-ink group-hover:text-accent-blue">{provider.name}</h3>
      </div>
      {copy && (
        <p className={cn("mt-3 text-sm leading-relaxed text-ink-muted", truncate && "line-clamp-3")}>{copy}</p>
      )}
      <div className="mt-4 flex items-center gap-3 text-sm text-ink-muted">
        <span>
          {productCount} {productCount === 1 ? "Product" : "Products"}
        </span>
        {startingPrice !== null && (
          <>
            <span aria-hidden="true">·</span>
            <span>From {formatPrice(startingPrice)}</span>
          </>
        )}
      </div>
      {categories.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {categories.slice(0, 3).map((category) => (
            <span key={category} className="rounded-full border border-line bg-bg-subtle px-2.5 py-1 text-[11px] font-medium text-ink-muted">
              {category}
            </span>
          ))}
        </div>
      )}
      <span className="mt-5 flex items-center gap-1 text-sm font-semibold text-accent-blue">
        Explore {provider.name} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </span>
    </Link>
  );
}
