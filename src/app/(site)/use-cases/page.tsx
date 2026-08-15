import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getUseCases } from "@/lib/data/useCases";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { IconTile } from "@/components/ui/DynamicIcon";

export const metadata: Metadata = {
  title: "Use Cases",
  description: "Explore cloud and AI infrastructure by use case, from machine learning to enterprise workloads.",
  alternates: { canonical: "/use-cases" },
};

export default async function UseCasesPage() {
  const useCases = await getUseCases();

  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Use Cases" }]} />
      <SectionHeading eyebrow="Use Cases" title="Built for Every Workload" subtitle="Find cloud and AI infrastructure matched to your project." className="mt-4" />

      <div className="mt-8">
        {useCases.length === 0 ? (
          <EmptyState title="No use cases published yet." />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {useCases.map((useCase, index) => (
              <Link key={useCase.id} href={`/use-cases/${useCase.slug}`} className="card-surface card-surface-hover p-6">
                <IconTile name={useCase.icon} index={index} />
                <h2 className="mt-4 font-semibold text-ink">{useCase.title}</h2>
                {useCase.description && <p className="mt-1.5 text-sm text-ink-muted">{useCase.description}</p>}
                <span className="mt-4 flex items-center gap-1 text-sm font-semibold text-accent-blue">
                  Learn more <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
