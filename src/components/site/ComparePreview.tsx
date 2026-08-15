import Link from "next/link";
import { ArrowRight, GitCompareArrows } from "lucide-react";
import type { Comparison } from "@/lib/types";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function ComparePreview({ comparisons }: { comparisons: Comparison[] }) {
  if (comparisons.length === 0) return null;

  return (
    <section className="section-mesh-blue py-16 sm:py-20">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Compare"
            title="Compare Providers & Products"
            subtitle="Not sure which provider is right for you? We've got you covered. Compare features, pricing, and specifications across leading cloud platforms:"
          />
          <Link href="/choose" className="btn-secondary shrink-0">
            View All Comparisons
          </Link>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {comparisons.slice(0, 6).map((comparison) => (
            <Link
              key={comparison.id}
              href={`/compare/${comparison.slug}`}
              className="card-surface card-surface-hover flex items-center gap-3 p-5"
            >
              <span className="icon-tile icon-tile-b">
                <GitCompareArrows className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="flex-1 text-sm font-semibold text-ink">{comparison.title}</span>
              <ArrowRight className="h-4 w-4 shrink-0 text-ink-muted" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
