import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * Original GoCloudShop mark — a cloud silhouette with connected compute
 * nodes, rendered as inline SVG (no image asset dependency). Used by the
 * Header, Footer and MobileNav — all of which can be present in the DOM at
 * the same time (Header + Footer on every page load) — so the gradient's id
 * is generated per-instance via useId() rather than hardcoded. A hardcoded
 * id would create duplicate SVG ids on the page, which is invalid HTML and
 * can make the gradient render unreliably in some browsers.
 */
export function LogoMark({ className }: { className?: string }) {
  const gradientId = `gcs-logo-grad-${useId()}`;
  return (
    <svg viewBox="0 0 40 40" fill="none" className={cn("h-full w-full", className)} aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="4" y1="6" x2="36" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="55%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      <path
        d="M12.5 27.5a6.5 6.5 0 0 1-.8-12.95A8 8 0 0 1 27 12.2a6 6 0 0 1 1.5 11.8v.5H12.5v-.5Z"
        fill={`url(#${gradientId})`}
      />
      <circle cx="11.5" cy="30.5" r="1.6" fill="#67e8f9" />
      <circle cx="19" cy="32.5" r="1.6" fill="#93c5fd" />
      <circle cx="26.5" cy="30.5" r="1.6" fill="#a5b4fc" />
      <path d="M12.6 28.6 11.5 29.8M19 29.3v2.4M25.9 28.6l1.1 1.2" stroke="#e0f2fe" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({
  siteName,
  tagline,
  size = "md",
  showTagline = true,
  className,
}: {
  siteName: string;
  tagline?: string | null;
  size?: "sm" | "md";
  showTagline?: boolean;
  className?: string;
}) {
  const tile = size === "sm" ? "h-8 w-8" : "h-9 w-9 sm:h-10 sm:w-10";
  const title = size === "sm" ? "text-base" : "text-base sm:text-lg lg:text-xl";

  // Render the real (admin-editable) site name, gradient-accenting every
  // word after the first so a rename in Settings never leaves stale
  // "GoCloudShop" text in the header/footer. site_name is stored without
  // spaces ("GoCloudShop"), so it's split on camelCase boundaries first —
  // "GoCloudShop" -> "Go Cloud Shop" — giving a readable "Go" / "Cloud Shop"
  // split instead of one long run-together gradient word. Already-spaced
  // names pass through unchanged.
  const words = siteName
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/\s+/)
    .filter(Boolean);
  const [firstWord = "", ...restWords] = words;
  const accentedWords = restWords.join(" ");

  return (
    <span className={cn("flex items-center gap-2 sm:gap-2.5", className)}>
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-white/[0.10] to-white/[0.02] ring-1 ring-white/15 shadow-[0_0_18px_-6px_rgb(56_189_248_/_0.45)]",
          tile
        )}
      >
        <LogoMark />
      </span>
      <span className="flex flex-col leading-tight">
        <span className={cn("font-extrabold uppercase tracking-tight text-white", title)}>
          {firstWord}
          {accentedWords && <span className="text-gradient-sky">{" " + accentedWords}</span>}
        </span>
        {showTagline && tagline && (
          <span className="hidden text-[10px] font-semibold uppercase tracking-[0.14em] text-white/50 sm:block">
            {tagline}
          </span>
        )}
      </span>
    </span>
  );
}
