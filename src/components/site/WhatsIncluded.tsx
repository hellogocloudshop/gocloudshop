import { CheckCircle2 } from "lucide-react";

export function WhatsIncluded({ items }: { items: string[] }) {
  if (items.length === 0) return null;

  return (
    <div>
      <h2 className="text-lg font-semibold text-ink">What&apos;s Included</h2>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-ink-muted">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
