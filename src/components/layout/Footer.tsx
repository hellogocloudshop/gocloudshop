import Link from "next/link";
import { Mail } from "lucide-react";
import type { SiteSettings } from "@/lib/types";
import type { ContactChannels } from "@/lib/contact";
import { ContactLinks } from "@/components/contact/ContactLinks";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";
import { FOOTER_COLUMNS, FOOTER_LINK_ACCENTS } from "@/config/nav";

export function Footer({ settings }: { settings: SiteSettings }) {
  const channels: ContactChannels = {
    telegramUsername: settings.telegram_username,
    whatsappNumber: settings.whatsapp_number,
    telegramChannelUrl: settings.telegram_channel_url,
  };

  return (
    <footer className="section-mesh-violet relative mt-24 overflow-hidden border-t border-line">
      <div className="bg-grid-pattern absolute inset-0 opacity-[0.04]" aria-hidden="true" />

      <div className="container-page relative py-16">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-9">
          <div className="col-span-2 sm:col-span-3 lg:col-span-2 xl:col-span-2">
            <Link href="/" aria-label={`${settings.site_name} home`}>
              <Logo siteName={settings.site_name} showTagline={false} />
            </Link>
            <p className="mt-3 text-sm font-medium text-sky-accent">{settings.tagline}</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-muted">
              A cloud and AI infrastructure marketplace — every order is confirmed directly with our team.
            </p>
            {settings.support_email && (
              <a
                href={`mailto:${settings.support_email}`}
                className="mt-5 flex w-fit items-center gap-2 text-sm text-ink-muted hover:text-accent-blue"
              >
                <Mail className="h-4 w-4" aria-hidden="true" /> {settings.support_email}
              </a>
            )}
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-ink">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link, index) => {
                  // Eight specific links get a permanent premium accent
                  // color (see FOOTER_LINK_ACCENTS) — every other link keeps
                  // this exact same neutral treatment, unchanged.
                  const accent = FOOTER_LINK_ACCENTS[`${link.label}::${link.href}`];
                  return (
                    // Keyed by title+href+index: a couple of columns intentionally
                    // link two labels to the same route (e.g. "AI Cloud" and "AI
                    // Cloud Accounts" both -> /ai-cloud), so href alone isn't
                    // always unique within a column.
                    <li key={`${col.title}-${link.href}-${index}`}>
                      <Link
                        href={link.href}
                        className={cn(
                          "text-sm transition-all duration-200",
                          accent ? cn(accent.text, "font-medium hover:brightness-125", accent.glow) : "text-ink-muted hover:text-accent-blue"
                        )}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/*
          Contact Us — deliberately its own full-width row below the link
          columns grid above, not one more slim column inside it. As a
          shared column it only had ~110px of width, which wrapped "Chat
          with support" etc. word-by-word; a dedicated row gives it real
          horizontal room for a proper 4/2/1-per-row card grid.
        */}
        <div className="mt-10 border-t border-line pt-10">
          <h3 className="text-sm font-semibold text-ink">Contact Us</h3>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <ContactLinks channels={channels} variant="cards" />
            {settings.support_email && (
              <a
                href={`mailto:${settings.support_email}`}
                className="flex flex-col items-start gap-2 rounded-xl border border-line bg-card p-4 transition-colors hover:border-accent-blue/40 hover:bg-bg-subtle"
              >
                <span className="icon-tile icon-tile-b h-9 w-9 shrink-0">
                  <Mail className="h-[18px] w-[18px]" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-ink">Email</span>
                  <span className="block text-xs leading-relaxed text-ink-muted">{settings.support_email}</span>
                </span>
              </a>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-line pt-6 text-xs text-ink-muted sm:flex-row">
          <p>
            © {new Date().getFullYear()} {settings.site_name}. All rights reserved.
          </p>
          <p>Products and services listed are provided at our discretion and subject to our policies.</p>
        </div>
      </div>
    </footer>
  );
}
