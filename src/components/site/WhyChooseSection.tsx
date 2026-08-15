import { Activity, ClipboardCheck, Layers, LifeBuoy, MessageCircle, MousePointerClick, Cloud } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WHY_CHOOSE_CARDS } from "@/config/homepageContent";

// Icons mapped 1:1 to WHY_CHOOSE_CARDS (config/homepageContent.ts), in order.
const ICONS = [Cloud, Layers, ClipboardCheck, Activity, MessageCircle, LifeBuoy, MousePointerClick];

export function WhyChooseSection() {
  return (
    <section className="container-page py-16 sm:py-20">
      <SectionHeading
        eyebrow="Why Go Cloud Shop"
        title="Why Choose Our Cloud Accounts"
        subtitle="We're not just another reseller. We're a marketplace built by cloud professionals who understand the pain points of cloud procurement—and we've fixed them."
        align="center"
        className="mx-auto"
      />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {WHY_CHOOSE_CARDS.map(({ title, description }, index) => {
          const Icon = ICONS[index] ?? Cloud;
          return (
            <div key={title} className="card-surface p-6">
              <span className="icon-tile icon-tile-a">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-semibold text-ink">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
