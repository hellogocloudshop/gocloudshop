import { cn } from "@/lib/utils";
import type { AvailabilityStatus } from "@/lib/types";

/**
 * Product/variation badges are free-text (admin can type anything — spec
 * requires new badges without a code change), so we derive a visual style
 * from keywords rather than a fixed enum. Unknown badges still render, just
 * with the neutral style.
 */
const KEYWORD_STYLES: { match: RegExp; className: string }[] = [
  { match: /popular|hot/i, className: "bg-orange-500/10 text-orange-600 ring-1 ring-orange-500/20" },
  { match: /best value/i, className: "badge-success" },
  { match: /new/i, className: "badge-info" },
  { match: /featured/i, className: "badge-info" },
  { match: /enterprise/i, className: "bg-slate-500/10 text-slate-600 ring-1 ring-slate-500/20" },
  { match: /ai|gpu/i, className: "badge-violet" },
  { match: /ultimate|premium/i, className: "badge-violet" },
];

export function ProductBadge({ badge, className }: { badge?: string | null; className?: string }) {
  if (!badge) return null;
  const style = KEYWORD_STYLES.find((s) => s.match.test(badge))?.className ?? "badge-neutral";
  return <span className={cn("badge backdrop-blur-sm", style, className)}>{badge}</span>;
}

const availabilityConfig: Record<AvailabilityStatus, { label: string; className: string; darkClassName: string }> = {
  in_stock: { label: "Available", className: "badge-success", darkClassName: "bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-400/20" },
  limited: { label: "Limited Availability", className: "badge-warning", darkClassName: "bg-amber-400/15 text-amber-300 ring-1 ring-amber-400/20" },
  out_of_stock: { label: "Out of Stock", className: "badge-danger", darkClassName: "bg-red-400/15 text-red-300 ring-1 ring-red-400/20" },
  preorder: { label: "Pre-order", className: "badge-info", darkClassName: "bg-accent-blue/15 text-sky-300 ring-1 ring-accent-blue/25" },
};

// tone="dark" is for forced-dark panels (surface-dark) where the badge must
// stay legible regardless of the visitor's OS light/dark preference — the
// plain badge-* classes only switch color via a prefers-color-scheme media
// query, which isn't enough on a page that's always dark.
export function AvailabilityBadge({ status, tone = "light" }: { status: AvailabilityStatus; tone?: "light" | "dark" }) {
  const config = availabilityConfig[status];
  return <span className={cn("badge", tone === "dark" ? config.darkClassName : config.className)}>{config.label}</span>;
}
