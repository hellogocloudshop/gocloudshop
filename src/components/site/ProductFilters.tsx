"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Provider } from "@/lib/types";

const PRICE_RANGES = [
  { label: "Under $50", min: undefined, max: 50 },
  { label: "$50–$100", min: 50, max: 100 },
  { label: "$100–$500", min: 100, max: 500 },
  { label: "$500+", min: 500, max: undefined },
];

const REGIONS = ["US", "Europe", "Asia", "Worldwide", "Other"];

const SORT_OPTIONS: { label: string; value: string }[] = [
  { label: "Recommended", value: "recommended" },
  { label: "Popular", value: "popular" },
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
];

const PRODUCT_TYPES = [
  "Cloud Account",
  "Cloud Credit",
  "AI Cloud Account",
  "Aged AI Cloud Account",
  "Enterprise AI Cloud Account",
  "AI/ML",
  "GPU",
  "Compute",
  "Free Trial",
  "PAYG",
  "Enterprise",
];

export function ProductFilters({ providers }: { providers: Provider[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);

  function updateParam(key: string, value: string | undefined) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === undefined || value === "") params.delete(key);
    else params.set(key, value);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  function setPriceRange(min?: number, max?: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (min !== undefined) params.set("priceMin", String(min));
    else params.delete("priceMin");
    if (max !== undefined) params.set("priceMax", String(max));
    else params.delete("priceMax");
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  function clearAll() {
    router.push(pathname);
  }

  const activeProvider = searchParams.get("provider") ?? "";
  const activeType = searchParams.get("type") ?? "";
  const activeRegion = searchParams.get("region") ?? "";
  const activeSort = searchParams.get("sort") ?? "recommended";
  const activePriceMin = searchParams.get("priceMin");
  const activePriceMax = searchParams.get("priceMax");
  const activeAi = searchParams.get("ai") === "1";
  const activeGpu = searchParams.get("gpu") === "1";

  const hasActiveFilters = Boolean(activeProvider || activeType || activeRegion || activePriceMin || activePriceMax || activeAi || activeGpu);

  const filterFields = (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Provider</h3>
        <div className="mt-2 flex flex-col gap-1">
          <FilterOption label="All" active={!activeProvider} onClick={() => updateParam("provider", undefined)} />
          {providers.map((p) => (
            <FilterOption key={p.id} label={p.name} active={activeProvider === p.slug} onClick={() => updateParam("provider", p.slug)} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Product Type</h3>
        <div className="mt-2 flex flex-col gap-1">
          <FilterOption label="All" active={!activeType} onClick={() => updateParam("type", undefined)} />
          {PRODUCT_TYPES.map((type) => (
            <FilterOption key={type} label={type} active={activeType === type} onClick={() => updateParam("type", type)} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">AI Category</h3>
        <div className="mt-2 flex flex-col gap-1">
          <FilterOption label="AI Enabled" active={activeAi} onClick={() => updateParam("ai", activeAi ? undefined : "1")} />
          <FilterOption label="GPU" active={activeGpu} onClick={() => updateParam("gpu", activeGpu ? undefined : "1")} />
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Price</h3>
        <div className="mt-2 flex flex-col gap-1">
          <FilterOption label="All" active={!activePriceMin && !activePriceMax} onClick={() => setPriceRange(undefined, undefined)} />
          {PRICE_RANGES.map((range) => (
            <FilterOption
              key={range.label}
              label={range.label}
              active={String(range.min ?? "") === (activePriceMin ?? "") && String(range.max ?? "") === (activePriceMax ?? "")}
              onClick={() => setPriceRange(range.min, range.max)}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Region</h3>
        <div className="mt-2 flex flex-col gap-1">
          <FilterOption label="All" active={!activeRegion} onClick={() => updateParam("region", undefined)} />
          {REGIONS.map((region) => (
            <FilterOption key={region} label={region} active={activeRegion === region} onClick={() => updateParam("region", region)} />
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <button type="button" onClick={clearAll} className="btn-ghost justify-center">
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <>
      <div className="flex items-center justify-between gap-3 lg:hidden">
        <button type="button" onClick={() => setDrawerOpen(true)} className="btn-secondary">
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" /> Filters
        </button>
        <SortSelect value={activeSort} onChange={(v) => updateParam("sort", v === "recommended" ? undefined : v)} />
      </div>

      <aside className="hidden lg:block">
        <div className="mb-4 hidden lg:flex lg:items-center lg:justify-between">
          <h2 className="font-semibold text-ink">Filters</h2>
          <SortSelect value={activeSort} onChange={(v) => updateParam("sort", v === "recommended" ? undefined : v)} className="w-44" />
        </div>
        {filterFields}
      </aside>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <div className="absolute inset-0 bg-primary-dark/40" onClick={() => setDrawerOpen(false)} aria-hidden="true" />
          <div className="absolute inset-y-0 left-0 w-full max-w-xs overflow-y-auto bg-surface p-5 shadow-[var(--shadow-elevated)]">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-ink">Filters</h2>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted hover:bg-bg-subtle"
                aria-label="Close filters"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-5">{filterFields}</div>
          </div>
        </div>
      )}
    </>
  );
}

function FilterOption({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors",
        active ? "bg-accent-blue/10 font-semibold text-accent-blue" : "text-ink-muted hover:bg-bg-subtle hover:text-ink"
      )}
    >
      {label}
    </button>
  );
}

function SortSelect({ value, onChange, className }: { value: string; onChange: (value: string) => void; className?: string }) {
  return (
    <label className={cn("flex items-center gap-2 text-sm", className)}>
      <span className="sr-only">Sort by</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink focus:border-accent-blue/50 focus:outline-none focus:ring-2 focus:ring-accent-blue/20"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
