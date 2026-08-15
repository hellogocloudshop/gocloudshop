import { BadgeDollarSign, Cpu, Gift, History, Mail, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ACCOUNT_OPTIONS, ACCOUNT_OPTIONS_DISCLAIMER } from "@/config/homepageContent";

// Icons mapped 1:1 to ACCOUNT_OPTIONS (config/homepageContent.ts), in order:
// Cloud Credit, AI-Ready, Compute, Free Trial, Aged, Port-25-Open.
const ICONS = [BadgeDollarSign, Sparkles, Cpu, Gift, History, Mail];

export function AvailableAccountOptions() {
  return (
    <section className="section-mesh-violet py-16 sm:py-20">
      <div className="container-page">
        <SectionHeading
          eyebrow="Catalog"
          title="Available Account Options"
          subtitle="Our marketplace offers various cloud account types and configurations depending on the provider and current availability."
          align="center"
          className="mx-auto"
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ACCOUNT_OPTIONS.map(({ title, description }, index) => {
            const Icon = ICONS[index] ?? Sparkles;
            return (
              <div key={title} className="card-surface-hover flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
                <span className="icon-tile icon-tile-a">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-semibold text-white">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/60">{description}</p>
              </div>
            );
          })}
        </div>
        <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-white/50">{ACCOUNT_OPTIONS_DISCLAIMER}</p>
      </div>
    </section>
  );
}
