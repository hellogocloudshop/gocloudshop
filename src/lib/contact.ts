/**
 * The three customer contact channels, sourced from site_settings (the one
 * centralized, admin-editable place — see Admin -> Settings -> Contact
 * Channels). Every contact component in src/components/contact/ takes this
 * same shape as a prop rather than each fetching/hard-coding its own values.
 */
export interface ContactChannels {
  telegramUsername: string;
  whatsappNumber: string | null;
  telegramChannelUrl: string | null;
}

// Centralized WhatsApp link builder — mirrors the pattern in lib/telegram.ts
// (single source of truth, never hard-code a wa.me URL in a component). The
// number and pre-filled message text both come from one place so they can
// be changed without touching every call site.

/** Default click-to-chat message — override per-call only when the context
 *  genuinely needs different wording (e.g. a specific product). */
export const DEFAULT_WHATSAPP_MESSAGE = "Hello GoCloudShop, I would like help choosing a cloud account.";

/**
 * Builds a wa.me click-to-chat URL from a site_settings.whatsapp_number
 * value. Returns null when no number is configured so callers can hide the
 * WhatsApp option entirely rather than rendering a broken link.
 */
export function buildWhatsAppUrl(whatsappNumber: string | null | undefined, message: string = DEFAULT_WHATSAPP_MESSAGE): string | null {
  if (!whatsappNumber) return null;
  const digits = whatsappNumber.replace(/[^\d]/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
