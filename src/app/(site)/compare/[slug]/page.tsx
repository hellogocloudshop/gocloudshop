import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getComparisonBySlug } from "@/lib/data/comparisons";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CompareTable } from "@/components/site/CompareTable";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const comparison = await getComparisonBySlug(slug);
  if (!comparison) return {};
  return {
    title: comparison.seo_title ?? comparison.title,
    description: comparison.seo_description ?? comparison.description ?? undefined,
    alternates: { canonical: `/compare/${slug}` },
  };
}

export default async function ComparisonDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const comparison = await getComparisonBySlug(slug);
  if (!comparison) notFound();

  const providers = comparison.providers ?? [];

  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Choose", href: "/choose" }, { label: comparison.title }]} />
      <SectionHeading title={comparison.title} subtitle={comparison.description} className="mt-4" />
      <div className="mt-8">
        <CompareTable comparison={comparison} providers={providers} />
      </div>
    </div>
  );
}
