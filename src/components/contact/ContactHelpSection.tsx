import { HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ContactChannels } from "@/lib/contact";
import { ContactLinks } from "./ContactLinks";

/**
 * The compact "need help?" block reused near purchase areas — provider
 * account pages, individual product pages, and the Cloud Service page.
 * Deliberately small (one row on desktop) so it never competes with the
 * primary Buy Now action for attention.
 */
export function ContactHelpSection({
  channels,
  title = "Need help choosing?",
  description = "Our team can help you pick the right account or answer questions before you order.",
  tone = "light",
}: {
  channels: ContactChannels;
  title?: string;
  description?: string;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";

  return (
    <div
      className={cn(
        "flex flex-col items-start gap-4 rounded-2xl border p-6 sm:flex-row sm:items-center sm:justify-between",
        dark ? "border-white/10 bg-white/5" : "border-line bg-bg-subtle"
      )}
    >
      <div className="flex items-start gap-3">
        <span className="icon-tile icon-tile-c h-10 w-10 shrink-0">
          <HelpCircle className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className={cn("font-semibold", dark ? "text-white" : "text-ink")}>{title}</p>
          <p className={cn("mt-1 text-sm", dark ? "text-white/60" : "text-ink-muted")}>{description}</p>
        </div>
      </div>
      <ContactLinks channels={channels} variant="buttons" tone={tone} />
    </div>
  );
}
