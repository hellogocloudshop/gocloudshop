import { ClipboardList, Cloud, DollarSign, LifeBuoy, MousePointerClick, Sparkles } from "lucide-react";

const indicators = [
  { icon: ClipboardList, label: "Clear Product Information" },
  { icon: DollarSign, label: "Transparent Pricing" },
  { icon: Cloud, label: "Multiple Providers" },
  { icon: Sparkles, label: "Cloud + AI" },
  { icon: LifeBuoy, label: "Responsive Support" },
  { icon: MousePointerClick, label: "Easy Ordering" },
];

export function TrustIndicators() {
  return (
    <section className="border-b border-line bg-bg-subtle py-8">
      <div className="container-page">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {indicators.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-2.5 text-sm font-medium text-ink-muted">
              <Icon className="h-4 w-4 shrink-0 text-accent-blue" aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
