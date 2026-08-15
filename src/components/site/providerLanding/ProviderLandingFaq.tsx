import type { Faq } from "@/lib/types";
import type { ProviderLandingContent } from "@/config/providerLandingContent";
import { FaqAccordion } from "@/components/site/FaqAccordion";

// Fixed placeholder timestamp — this FAQ content is static page copy (not a
// database record), so these fields exist only to satisfy the shared Faq
// shape the existing FaqAccordion component expects; nothing reads them.
const PLACEHOLDER_TIMESTAMP = "2026-01-01T00:00:00.000Z";

/** Section 14 — FAQ, rendered through the exact same accordion component
 *  used site-wide (FaqAccordion), so the interaction/animation/JSON-LD
 *  behavior never drifts. This content is static page copy, not stored in
 *  the `faqs` table — it is shaped to match `Faq` purely so the reusable
 *  accordion component can render it without a parallel implementation. */
export function ProviderLandingFaq({
  id,
  content,
  providerId,
}: {
  id: string;
  content: ProviderLandingContent["faq"];
  providerId: string;
}) {
  const faqs: Faq[] = content.items.map((item, index) => ({
    id: `${providerId}-landing-faq-${index}`,
    question: item.question,
    answer: item.answer,
    product_id: null,
    provider_id: providerId,
    category: "provider-landing",
    sort_order: index,
    is_active: true,
    created_at: PLACEHOLDER_TIMESTAMP,
    updated_at: PLACEHOLDER_TIMESTAMP,
  }));

  return (
    <section id={id} className="scroll-mt-28">
      <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{content.heading}</h2>
      <div className="mt-6 max-w-3xl rounded-2xl border border-white/10 bg-white/[0.03] px-5 sm:px-6">
        <FaqAccordion faqs={faqs} tone="dark" />
      </div>
    </section>
  );
}
