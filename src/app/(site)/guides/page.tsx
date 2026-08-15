import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { getGuides } from "@/lib/data/guides";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/utils";
import type { GuideType } from "@/lib/types";

export const metadata: Metadata = {
  title: "Guides & Resources",
  description: "Cloud and AI infrastructure buying guides, provider guides and comparisons.",
  alternates: { canonical: "/guides" },
};

const VALID_TYPES: GuideType[] = ["guide", "blog", "provider_guide", "product_guide", "comparison_guide"];

export default async function GuidesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const guideType = VALID_TYPES.includes(type as GuideType) ? (type as GuideType) : undefined;
  // Stock Updates has its own dedicated, premium listing at /stock-updates —
  // exclude it here so this general guides feed doesn't duplicate that content.
  const guides = (await getGuides({ guideType })).filter((g) => g.guide_type !== "stock_update");

  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Guides" }]} />
      <SectionHeading eyebrow="Resources" title="Guides & Resources" subtitle="Cloud and AI buying guides, provider guides and comparisons." className="mt-4" />

      <div className="mt-6 flex flex-wrap gap-2">
        {[
          { label: "All", value: undefined },
          { label: "Guides", value: "guide" },
          { label: "Blog", value: "blog" },
          { label: "Provider Guides", value: "provider_guide" },
          { label: "Product Guides", value: "product_guide" },
        ].map((tab) => (
          <Link
            key={tab.label}
            href={tab.value ? `/guides?type=${tab.value}` : "/guides"}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              guideType === tab.value ? "bg-accent-blue text-white" : "border border-line text-ink-muted hover:text-ink"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <div className="mt-8">
        {guides.length === 0 ? (
          <EmptyState title="No guides published yet." />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((guide) => (
              <Link key={guide.id} href={`/guides/${guide.slug}`} className="card-surface card-surface-hover flex flex-col p-6">
                <span className="icon-tile icon-tile-a">
                  <BookOpen className="h-5 w-5" aria-hidden="true" />
                </span>
                <h2 className="mt-4 font-semibold text-ink">{guide.title}</h2>
                {guide.excerpt && <p className="mt-1.5 line-clamp-3 text-sm text-ink-muted">{guide.excerpt}</p>}
                {guide.published_at && <p className="mt-3 text-xs text-ink-muted">{formatDate(guide.published_at)}</p>}
                <span className="mt-3 flex items-center gap-1 text-sm font-semibold text-accent-blue">
                  Read guide <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
