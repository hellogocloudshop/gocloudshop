import type { ContactChannels } from "@/lib/contact";
import { ContactLinks } from "./ContactLinks";

/**
 * Desktop (`lg` and up) Header contact area: the three contact channels as
 * compact, individually-labeled icons (Telegram, WhatsApp, Telegram Channel
 * — see ContactLinks' inline variant for how each stays distinguishable via
 * aria-label/title). Below `lg`, the Header shows ContactMenu (a single
 * dropdown trigger) instead — there isn't room for this full row.
 *
 * "Contact Us" itself lives in the bottom nav row now (MAIN_NAV, in
 * config/nav.ts), not here — it moved so it renders with the exact same
 * styling/active-state as every other nav item.
 */
export function ContactBar({ channels }: { channels: ContactChannels }) {
  return (
    <div className="hidden items-center lg:flex">
      <ContactLinks channels={channels} variant="inline" />
    </div>
  );
}
