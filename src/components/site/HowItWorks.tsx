import { Compass, GitCompareArrows, MousePointerClick, MessageCircle, CheckCircle2, CreditCard, PackageCheck } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const steps = [
  { icon: Compass, title: "Explore", description: "Browse Cloud, AI, Credits, or Compute products across every supported provider." },
  { icon: GitCompareArrows, title: "Compare", description: "Compare prices and specifications side by side before making your decision." },
  { icon: MousePointerClick, title: "Choose", description: "Select the product and variation that matches your project requirements." },
  { icon: MessageCircle, title: "Contact", description: "Use the \"Order via Telegram\" button to reach our support team directly." },
  { icon: CheckCircle2, title: "Confirm", description: "We confirm availability and order details with you personally." },
  { icon: CreditCard, title: "Complete", description: "Complete the payment process securely with our team." },
  { icon: PackageCheck, title: "Receive", description: "Receive your delivery and access information—usually within minutes." },
];

export function HowItWorks() {
  return (
    <section className="container-page py-16 sm:py-20">
      <SectionHeading
        eyebrow="Process"
        title="How Go Cloud Shop Works"
        subtitle="Getting started is simple. Here's how it works:"
        align="center"
        className="mx-auto"
      />
      <ol className="relative mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div className="pointer-events-none absolute inset-x-0 top-6 hidden h-px bg-line lg:block" aria-hidden="true" />
        {steps.map((step, index) => (
          <li key={step.title} className="relative flex flex-col items-center text-center lg:items-start lg:text-left">
            <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-accent-blue to-secondary text-white shadow-[var(--shadow-glow-blue)]">
              <step.icon className="h-5 w-5" aria-hidden="true" />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-surface text-[10px] font-bold text-ink ring-1 ring-line">
                {index + 1}
              </span>
            </span>
            <h3 className="mt-4 font-semibold text-ink">{step.title}</h3>
            <p className="mt-1.5 text-sm text-ink-muted">{step.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
