import type { Product, ProductVariation } from "./types";
import { formatPrice } from "./utils";

/**
 * Every "Order via Telegram" button in the app must build its link through
 * this function so the message always reflects the real, currently-selected
 * product/variation/price. Never hard-code a static Telegram message when
 * product information is available (spec requirement).
 *
 * The Telegram handle itself is read from site_settings.telegram_username
 * (admin-editable, see Settings) with NEXT_PUBLIC_TELEGRAM_USERNAME as a
 * build-time fallback only — one source of truth, not two.
 */
export function buildTelegramOrderUrl(params: {
  telegramUsername: string;
  product: Pick<Product, "name">;
  variation?: Pick<ProductVariation, "name"> | null;
  price: number | null;
  currency: string;
}) {
  const { telegramUsername, product, variation, price, currency } = params;

  const lines = [
    "Hello GoCloudShop,",
    "",
    `Product: ${product.name}`,
    "",
    ...(variation ? [`Variation: ${variation.name}`, ""] : []),
    `Price: ${price !== null ? formatPrice(price, currency) : "Contact for pricing"}`,
    "",
    "I would like to order this product.",
  ];

  const text = encodeURIComponent(lines.join("\n"));
  const handle = telegramUsername.replace(/^@/, "");
  return `https://t.me/${handle}?text=${text}`;
}

export function buildTelegramSupportUrl(telegramUsername: string) {
  const handle = telegramUsername.replace(/^@/, "");
  return `https://t.me/${handle}`;
}

export const DEFAULT_TELEGRAM_USERNAME =
  process.env.NEXT_PUBLIC_TELEGRAM_USERNAME ?? "GoCloudShopSupport";
