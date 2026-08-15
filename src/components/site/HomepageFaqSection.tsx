import type { Faq } from "@/lib/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HOMEPAGE_FAQS } from "@/config/homepageContent";
import { FaqAccordion } from "./FaqAccordion";

// Fixed placeholder timestamp — this is static Homepage copy (not a database
// record), so these fields exist only to satisfy the shape FaqAccordion
// expects; nothing reads them. Kept separate from the sitewide global FAQ
// pool (used by /faq and the product-detail fallback) so this section can
// show exactly the Homepage's approved Q&A set without changing either.
const PLACEHOLDER_TIMESTAMP = "2026-01-01T00:00:00.000Z";

export function HomepageFaqSection() {
  const faqs: Faq[] = HOMEPAGE_FAQS.map((item, index) => ({
    id: `homepage-faq-${index}`,
    question: item.question,
    answer: item.answer,
    product_id: null,
    provider_id: null,
    category: "Homepage",
    sort_order: index,
    is_active: true,
    created_at: PLACEHOLDER_TIMESTAMP,
    updated_at: PLACEHOLDER_TIMESTAMP,
  }));

  return (
    <section id="faq" className="container-page py-16 sm:py-20 scroll-mt-20">
      <SectionHeading
        eyebrow="FAQ"
        title="Frequently Asked Questions"
        subtitle="Answers to the questions we hear most often about our cloud accounts, verification and support."
        align="center"
        className="mx-auto"
      />
      <div className="mx-auto mt-10 max-w-3xl">
        <FaqAccordion faqs={faqs} />
      </div>
    </section>
  );
}
