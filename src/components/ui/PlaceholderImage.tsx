import { Cloud } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Branded placeholder used whenever a product/provider image isn't
 * configured yet — never render a broken <img> src.
 */
export function PlaceholderLogo({ name, className }: { name: string; className?: string }) {
  const initial = name.trim().charAt(0).toUpperCase() || "G";
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-xl bg-gradient-to-br from-accent-blue to-secondary text-sm font-bold text-white",
        className
      )}
      role="img"
      aria-label={`${name} logo placeholder`}
    >
      {initial}
    </div>
  );
}

export function PlaceholderImage({ className, label }: { className?: string; label?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-line bg-bg-subtle text-ink-muted",
        className
      )}
      role="img"
      aria-label={label ?? "Image not available"}
    >
      <Cloud className="h-8 w-8" aria-hidden="true" />
      {label && <span className="text-xs font-medium">{label}</span>}
    </div>
  );
}
