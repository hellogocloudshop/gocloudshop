"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ProductGrid } from "./ProductGrid";

interface Tab {
  label: string;
  match: (product: Product) => boolean;
}

const TABS: Tab[] = [
  { label: "All", match: () => true },
  { label: "Cloud Accounts", match: (p) => p.category?.slug === "cloud-accounts" },
  { label: "Cloud Credits", match: (p) => p.category?.slug === "cloud-credits" },
  { label: "AI Cloud", match: (p) => p.category?.slug === "ai-cloud" || p.is_ai },
  { label: "GPU", match: (p) => p.is_gpu },
  { label: "Compute", match: (p) => p.category?.slug === "compute" },
  { label: "Free Trial", match: (p) => p.category?.slug === "free-trials" },
  { label: "PAYG", match: (p) => p.category?.slug === "pay-as-you-go" },
  { label: "Enterprise", match: (p) => p.category?.slug === "enterprise" },
];

/**
 * Homepage marketplace preview: tabs filter an already-fetched, database-backed
 * product set client-side (no reload, no extra query). Full search, filters,
 * sorting and pagination live on /products.
 */
export function CategoryTabsPreview({ products }: { products: Product[] }) {
  const [activeTab, setActiveTab] = useState("All");

  const filtered = useMemo(() => {
    const tab = TABS.find((t) => t.label === activeTab) ?? TABS[0];
    return products.filter(tab.match);
  }, [products, activeTab]);

  return (
    <div>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0" role="tablist" aria-label="Product categories">
        {TABS.map((tab) => (
          <button
            key={tab.label}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.label}
            onClick={() => setActiveTab(tab.label)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              activeTab === tab.label
                ? "bg-accent-blue text-white shadow-[var(--shadow-glow-blue)]"
                : "border border-line bg-surface text-ink-muted hover:text-ink"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <ProductGrid products={filtered.slice(0, 8)} />
      </div>

      <div className="mt-8 text-center">
        <Link href="/products" className="btn-secondary">
          Browse All Products
        </Link>
      </div>
    </div>
  );
}
