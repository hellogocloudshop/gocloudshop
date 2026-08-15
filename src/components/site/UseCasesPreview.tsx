import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { UseCase } from "@/lib/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { IconTile } from "@/components/ui/DynamicIcon";

export function UseCasesPreview({ useCases }: { useCases: UseCase[] }) {
  if (useCases.length === 0) return null;

  return (
    <section className="container-page py-16 sm:py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading eyebrow="Use Cases" title="Built for Every Workload" />
        <Link href="/use-cases" className="btn-secondary">
          View All Use Cases
        </Link>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {useCases.slice(0, 8).map((useCase, index) => (
          <Link key={useCase.id} href={`/use-cases/${useCase.slug}`} className="card-surface card-surface-hover p-6">
            <IconTile name={useCase.icon} index={index} />
            <h3 className="mt-4 font-semibold text-ink">{useCase.title}</h3>
            {useCase.description && <p className="mt-1.5 text-sm text-ink-muted">{useCase.description}</p>}
            <span className="mt-4 flex items-center gap-1 text-sm font-semibold text-accent-blue">
              Learn more <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
