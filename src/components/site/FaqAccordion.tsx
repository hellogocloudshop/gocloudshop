"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Faq } from "@/lib/types";

export function FaqAccordion({ faqs, tone = "light" }: { faqs: Faq[]; tone?: "light" | "dark" }) {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);
  const dark = tone === "dark";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <div className={cn("divide-y", dark ? "divide-white/10" : "divide-line")}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {faqs.map((faq) => {
        const isOpen = openId === faq.id;
        return (
          <div key={faq.id} className="py-4">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`faq-${faq.id}`}
              onClick={() => setOpenId(isOpen ? null : faq.id)}
              className="flex w-full items-center justify-between gap-4 text-left"
            >
              <span className={cn("font-medium", dark ? "text-white" : "text-ink")}>{faq.question}</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 transition-transform",
                  dark ? "text-white/50" : "text-ink-muted",
                  isOpen && "rotate-180"
                )}
                aria-hidden="true"
              />
            </button>
            {/*
              Always rendered in the DOM (never conditionally mounted) so every
              answer is present in the server-rendered HTML for search engines
              and users with JS disabled — only visually collapsed via a
              CSS grid-rows transition. aria-hidden mirrors the visual state so
              assistive tech doesn't announce collapsed answers as if visible.
            */}
            <div
              id={`faq-${faq.id}`}
              aria-hidden={!isOpen}
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-out",
                isOpen ? "grid-rows-[1fr] mt-3" : "grid-rows-[0fr]"
              )}
            >
              <p className={cn("overflow-hidden text-sm leading-relaxed", dark ? "text-white/60" : "text-ink-muted")}>
                {faq.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
