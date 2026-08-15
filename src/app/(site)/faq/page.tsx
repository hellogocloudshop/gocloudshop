import type { Metadata } from "next";
import { getGlobalFaqs } from "@/lib/data/faqs";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Answers to common questions about GoCloudShop products, ordering, payment and policies.",
  alternates: { canonical: "/faq" },
};

export default async function FaqPage() {
  const faqs = await getGlobalFaqs();
  const grouped = faqs.reduce<Record<string, typeof faqs>>((acc, faq) => {
    const key = faq.category ?? "General";
    acc[key] = acc[key] ?? [];
    acc[key].push(faq);
    return acc;
  }, {});

  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "FAQ" }]} />
      <SectionHeading eyebrow="Support" title="Frequently Asked Questions" className="mt-4" />

      <div className="mt-8 max-w-3xl">
        {faqs.length === 0 ? (
          <EmptyState title="No FAQs published yet." />
        ) : (
          Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="mb-10">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">{category}</h2>
              <div className="mt-2">
                <FaqAccordion faqs={items} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
