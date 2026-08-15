"use client";

import { useMemo, useState } from "react";
import { Check, MapPin, Search, Truck } from "lucide-react";
import type { Product, ProductVariation } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";
import { AvailabilityBadge, ProductBadge } from "@/components/ui/Badge";
import { SpecificationTable } from "./SpecificationTable";
import { AIProductSpecs } from "./AIProductSpecs";
import { TelegramOrderButton } from "./TelegramOrderButton";

const SEARCHABLE_THRESHOLD = 7;

/**
 * The full variation-aware purchase experience for a product page: selector
 * UI, price, availability, delivery, specifications, key features and AI
 * specs all update together from the same in-memory variation list — no
 * refetch, no full page reload (spec §25).
 */
export function VariationSelector({
  product,
  variations,
  telegramUsername,
}: {
  product: Product;
  variations: ProductVariation[];
  telegramUsername: string;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(variations[0]?.id ?? null);
  const [query, setQuery] = useState("");

  const selected = useMemo(
    () => variations.find((v) => v.id === selectedId) ?? null,
    [variations, selectedId]
  );

  const filteredVariations = useMemo(() => {
    if (!query.trim()) return variations;
    const q = query.toLowerCase();
    return variations.filter((v) => v.name.toLowerCase().includes(q));
  }, [variations, query]);

  const price = selected ? selected.price : product.base_price;
  const currency = selected ? selected.currency : product.currency;
  const availability = selected ? selected.availability : product.availability;
  const region = selected ? selected.region ?? product.region : product.region;
  const delivery = selected ? selected.delivery_time_text ?? product.delivery_time_text : product.delivery_time_text;
  const badge = selected?.badge ?? product.badge;
  const features = selected?.features?.length ? selected.features : product.features;
  const specifications = {
    ...(product.specifications ?? {}),
    ...(selected?.specifications ?? {}),
  };
  const hasAiInfo =
    product.is_ai &&
    selected &&
    (selected.ai_category ||
      selected.ai_platform ||
      selected.gpu_type ||
      selected.gpu_count ||
      selected.vram ||
      selected.compute_type ||
      selected.model_support ||
      selected.architecture ||
      selected.ai_services?.length ||
      selected.inference_support !== null ||
      selected.training_support !== null);

  return (
    <div className="flex flex-col gap-8">
      {variations.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">Choose Your Variation</h2>

          {variations.length > SEARCHABLE_THRESHOLD && (
            <div className="relative mt-3">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search variations…"
                className="w-full rounded-xl border border-line bg-surface py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-ink-muted focus:border-accent-blue/50 focus:outline-none focus:ring-2 focus:ring-accent-blue/20"
              />
            </div>
          )}

          <div
            role="radiogroup"
            aria-label="Product variation"
            className={cn(
              "mt-3 grid gap-2.5",
              variations.length > SEARCHABLE_THRESHOLD
                ? "max-h-72 overflow-y-auto pr-1 sm:grid-cols-2"
                : "sm:grid-cols-2 lg:grid-cols-3"
            )}
          >
            {filteredVariations.map((variation) => {
              const isSelected = variation.id === selectedId;
              return (
                <button
                  key={variation.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setSelectedId(variation.id)}
                  className={cn(
                    "flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition-all",
                    isSelected
                      ? "border-accent-blue bg-accent-blue/5 shadow-[0_0_0_1px_rgb(37_99_235_/_0.35)]"
                      : "border-line bg-surface hover:border-accent-blue/30"
                  )}
                >
                  <div className="flex w-full items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-ink">{variation.name}</span>
                    {isSelected && <Check className="h-4 w-4 shrink-0 text-accent-blue" aria-hidden="true" />}
                  </div>
                  {variation.badge && <ProductBadge badge={variation.badge} className="mt-0.5" />}
                  <span className="mt-1 text-sm font-bold text-ink">{formatPrice(variation.price, variation.currency)}</span>
                  {Object.entries(variation.specifications).slice(0, 1).map(([key, value]) => (
                    <span key={key} className="text-xs text-ink-muted">
                      {key}: {value}
                    </span>
                  ))}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="card-surface p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-ink-muted">Price</p>
            <p className="text-3xl font-extrabold text-ink">
              {price !== null ? formatPrice(price, currency) : "Contact us"}
            </p>
          </div>
          {badge && <ProductBadge badge={badge} />}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-muted">
          <AvailabilityBadge status={availability} />
          {region && (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" aria-hidden="true" /> {region}
            </span>
          )}
          {delivery && (
            <span className="flex items-center gap-1.5">
              <Truck className="h-4 w-4" aria-hidden="true" /> {delivery}
            </span>
          )}
        </div>

        <TelegramOrderButton
          telegramUsername={telegramUsername}
          productId={product.id}
          productName={product.name}
          variationId={selected?.id}
          variationName={selected?.name}
          price={price}
          currency={currency}
          className="mt-5 w-full justify-center"
        />
      </div>

      {features.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-ink">Key Features</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm text-ink-muted">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-blue" aria-hidden="true" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}

      <SpecificationTable
        product={product}
        variationName={selected?.name}
        region={region}
        availability={availability}
        delivery={delivery}
        specifications={specifications}
      />

      {hasAiInfo && selected && <AIProductSpecs variation={selected} />}
    </div>
  );
}
