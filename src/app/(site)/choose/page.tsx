import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, GitCompareArrows } from "lucide-react";
import { getComparisons } from "@/lib/data/comparisons";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";

// Canonical hub page for provider/product comparisons (formerly "/compare").
// Reuses the same comparisons data-access layer and card layout — only the
// navigation label, URL and page copy changed. Individual comparison pages
// remain at /compare/[slug], unaffected by this rename.
export const metadata: Metadata = {
  title: "Choose Cloud & AI Providers",
  description: "Compare cloud providers, AI Cloud options and GPU infrastructure side by side to choose the right fit.",
  alternates: { canonical: "/choose" },
  openGraph: {
    title: "Choose Cloud & AI Providers | GoCloudShop",
    description: "Compare cloud providers, AI Cloud options and GPU infrastructure side by side to choose the right fit.",
    url: "/choose",
  },
};

export default async function ChoosePage() {
  const comparisons = await getComparisons();

  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Choose" }]} />
      <SectionHeading eyebrow="Choose" title="Choose Cloud & AI Providers" subtitle="Side-by-side comparisons of pricing, features and specifications." className="mt-4" />

      <div className="mt-8">
        {comparisons.length === 0 ? (
          <EmptyState title="No comparisons published yet." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {comparisons.map((comparison) => (
              <Link
                key={comparison.id}
                href={`/compare/${comparison.slug}`}
                className="card-surface card-surface-hover flex flex-col gap-2 p-5"
              >
                <span className="icon-tile icon-tile-b">
                  <GitCompareArrows className="h-5 w-5" aria-hidden="true" />
                </span>
                <h2 className="mt-2 font-semibold text-ink">{comparison.title}</h2>
                {comparison.description && <p className="text-sm text-ink-muted">{comparison.description}</p>}
                <span className="mt-2 flex items-center gap-1 text-sm font-semibold text-accent-blue">
                  View comparison <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
