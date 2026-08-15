import { Megaphone, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { buildTelegramSupportUrl } from "@/lib/telegram";
import { buildWhatsAppUrl, type ContactChannels } from "@/lib/contact";

interface ChannelLink {
  key: "telegram" | "whatsapp" | "channel";
  /** Short visible label / title-attribute text (e.g. "Telegram"). */
  label: string;
  /** Fuller accessible name distinguishing this from the other Telegram
   *  destination — e.g. "Contact us on Telegram" vs "Open Telegram Channel",
   *  so screen-reader users never see two identically-announced controls. */
  ariaLabel: string;
  description: string;
  href: string;
  /** Real brand-mark image (public/icons/*.svg) — used when set. Telegram
   *  Channel has no provided asset yet, so it falls back to `icon` below. */
  iconSrc?: string;
  icon: LucideIcon;
}

/** Only returns channels that are actually configured — WhatsApp and the
 *  Telegram Channel are omitted entirely (not shown as broken/fake links)
 *  until a real number/URL is set from Admin -> Settings. */
function getChannelLinks(channels: ContactChannels): ChannelLink[] {
  const links: ChannelLink[] = [
    {
      key: "telegram",
      label: "Telegram",
      ariaLabel: "Contact us on Telegram",
      description: "Chat with support",
      href: buildTelegramSupportUrl(channels.telegramUsername),
      iconSrc: "/icons/telegram.svg",
      icon: Megaphone,
    },
  ];

  const whatsappUrl = buildWhatsAppUrl(channels.whatsappNumber);
  if (whatsappUrl) {
    links.push({
      key: "whatsapp",
      label: "WhatsApp",
      ariaLabel: "Contact us on WhatsApp",
      description: "Message us",
      href: whatsappUrl,
      iconSrc: "/icons/whatsapp.svg",
      icon: Megaphone,
    });
  }

  if (channels.telegramChannelUrl) {
    links.push({
      key: "channel",
      label: "Telegram Channel",
      ariaLabel: "Open Telegram Channel",
      description: "View Account Stock & Delivery Proof",
      href: channels.telegramChannelUrl,
      // No dedicated Telegram Channel asset provided yet — falls back to a
      // distinct Lucide glyph (Megaphone, not the Telegram mark) so it never
      // reads as a duplicate of the Telegram Profile icon in the meantime.
      // Swap to iconSrc: "/icons/telegram-channel.svg" once that asset lands.
      icon: Megaphone,
    });
  }

  return links;
}

/**
 * Renders a channel's real brand-mark image when available, otherwise its
 * Lucide fallback glyph — one place so every variant stays in sync.
 *
 * Plain <img>, not next/image, for the brand-mark case: these are local
 * SVGs, which Next's built-in raster optimizer blocks by default (400)
 * unless dangerouslyAllowSVG is configured — and a vector icon this small
 * gets no real benefit from that optimizer anyway.
 */
function ChannelIcon({ link, className }: { link: ChannelLink; className?: string }) {
  if (link.iconSrc) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={link.iconSrc} alt="" aria-hidden="true" className={cn("object-contain", className)} />;
  }
  const Icon = link.icon;
  return <Icon className={className} aria-hidden="true" />;
}

/**
 * The single reusable renderer for all three contact channels — every
 * surface (Header, mobile nav, homepage, product/provider pages, Footer,
 * floating widget, Contact page) renders through this component so the
 * channel list, icons and hidden-when-unconfigured behavior never drift.
 */
export function ContactLinks({
  channels,
  variant = "list",
  tone = "light",
  onNavigate,
}: {
  channels: ContactChannels;
  variant?: "list" | "inline" | "buttons" | "cards";
  tone?: "light" | "dark";
  onNavigate?: () => void;
}) {
  const links = getChannelLinks(channels);
  const dark = tone === "dark";

  // Compact horizontal card — icon, title, description — for surfaces with
  // real horizontal room to give each channel (e.g. the Footer's Contact Us
  // section, which used to squeeze the "list" variant into one narrow grid
  // column and wrap its description text word-by-word). Deliberately
  // returns bare cards (no wrapping grid) so the caller can lay them out
  // alongside other cards that aren't channels — e.g. the Footer places an
  // Email card, which isn't part of ContactChannels, in the same grid.
  if (variant === "cards") {
    return (
      <>
        {links.map((link) => (
          <a
            key={link.key}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onNavigate}
            className={cn(
              "flex flex-col items-start gap-2 rounded-xl border p-4 transition-colors",
              dark
                ? "border-white/10 bg-white/5 hover:border-accent-blue/40 hover:bg-white/10"
                : "border-line bg-card hover:border-accent-blue/40 hover:bg-bg-subtle"
            )}
          >
            <span className="icon-tile icon-tile-a h-9 w-9 shrink-0">
              <ChannelIcon link={link} className="h-[18px] w-[18px]" />
            </span>
            <span className="min-w-0">
              <span className={cn("block text-sm font-semibold", dark ? "text-white" : "text-ink")}>{link.label}</span>
              <span className={cn("block text-xs leading-relaxed", dark ? "text-white/60" : "text-ink-muted")}>
                {link.description}
              </span>
            </span>
          </a>
        ))}
      </>
    );
  }

  if (variant === "buttons") {
    return (
      <div className="flex flex-wrap items-center gap-3">
        {links.map((link, index) => (
          <a
            key={link.key}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onNavigate}
            className={index === 0 ? "btn-primary" : "btn-secondary"}
          >
            <ChannelIcon link={link} className="h-4 w-4" />
            {link.label}
          </a>
        ))}
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className="flex items-center gap-1.5">
        {links.map((link) => {
          // Telegram and WhatsApp are the two brand-mark icons the header
          // wants more visually prominent (larger tap target + icon, subtle
          // hover scale). Telegram Channel intentionally keeps its original
          // size/hover here — only these two should change.
          const featured = link.key === "telegram" || link.key === "whatsapp";
          return (
            <a
              key={link.key}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onNavigate}
              aria-label={link.ariaLabel}
              title={link.label}
              className={cn(
                "flex items-center justify-center rounded-lg transition-all duration-200",
                featured ? "h-10 w-10 sm:h-[42px] sm:w-[42px]" : "h-9 w-9",
                dark
                  ? cn("text-white/70 hover:bg-white/10 hover:text-white", featured && "hover:scale-110")
                  : cn("text-ink-muted hover:bg-bg-subtle hover:text-ink", featured && "hover:scale-110")
              )}
            >
              <ChannelIcon link={link} className={featured ? "h-6 w-6 sm:h-7 sm:w-7" : "h-[22px] w-[22px]"} />
            </a>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {links.map((link) => (
        <a
          key={link.key}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 rounded-xl border p-3 transition-colors",
            dark
              ? "border-white/10 bg-white/5 hover:border-accent-blue/40 hover:bg-white/10"
              : "border-line bg-card hover:border-accent-blue/40 hover:bg-bg-subtle"
          )}
        >
          <span className="icon-tile icon-tile-a h-9 w-9 shrink-0">
            <ChannelIcon link={link} className="h-[18px] w-[18px]" />
          </span>
          <span className="min-w-0">
            <span className={cn("block text-sm font-semibold", dark ? "text-white" : "text-ink")}>{link.label}</span>
            <span className={cn("block text-xs", dark ? "text-white/60" : "text-ink-muted")}>{link.description}</span>
          </span>
        </a>
      ))}
    </div>
  );
}
