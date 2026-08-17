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
    <div className="flex flex-col gap-2.5">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {faqs.map((faq) => {
        const isOpen = openId === faq.id;
        return (
          <div
            key={faq.id}
            className={cn(
              "rounded-xl border transition-colors duration-200",
              dark
                ? isOpen
                  ? "border-accent-blue/30 bg-white/[0.05]"
                  : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04]"
                : isOpen
                  ? "border-accent-blue/30 bg-accent-blue/[0.03]"
                  : "border-line bg-card hover:bg-bg-subtle"
            )}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`faq-${faq.id}`}
              onClick={() => setOpenId(isOpen ? null : faq.id)}
              className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left sm:px-5"
            >
              <span className={cn("text-sm font-semibold sm:text-base", dark ? "text-white" : "text-ink")}>
                {faq.question}
              </span>
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-300",
                  dark ? "bg-white/[0.06]" : "bg-bg-subtle",
                  isOpen && (dark ? "bg-accent-blue/20" : "bg-accent-blue/10")
                )}
              >
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform duration-300",
                    isOpen ? "rotate-180 text-accent-blue" : dark ? "text-white/50" : "text-ink-muted"
                  )}
                  aria-hidden="true"
                />
              </span>
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
                "grid px-4 transition-[grid-template-rows] duration-300 ease-out sm:px-5",
                isOpen ? "grid-rows-[1fr] pb-4 sm:pb-5" : "grid-rows-[0fr]"
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
