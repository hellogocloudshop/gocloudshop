import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Product, ProductVariation } from "./types";
import { providerAccountHref } from "@/config/providerAccountUrls";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency: string = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: price % 1 === 0 ? 0 : 2,
  }).format(price);
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

/**
 * The single source of truth for "what price do we show for this product".
 * Never hard-code a price in a component — always derive it here from the
 * live product/variation data.
 */
export function effectivePrice(
  product: Pick<Product, "base_price" | "currency">,
  variations: ProductVariation[] = []
): { price: number | null; currency: string; fromVariation: boolean } {
  const activeVariations = variations.filter((v) => v.is_active);
  if (activeVariations.length > 0) {
    const cheapest = activeVariations.reduce((min, v) => (v.price < min.price ? v : min));
    return { price: cheapest.price, currency: cheapest.currency, fromVariation: true };
  }
  return { price: product.base_price, currency: product.currency, fromVariation: false };
}

/** Canonical, SEO-stable product detail URL: /[category-slug]/[product-slug]. */
export function productHref(product: Pick<Product, "slug"> & { category?: { slug: string } | null }) {
  const categorySlug = product.category?.slug ?? "products";
  return `/${categorySlug}/${product.slug}`;
}

/**
 * Canonical public URL for a provider's account page, e.g. /buy-Aws-Account.
 * Single source of truth used by provider cards, the provider detail page,
 * the footer and the sitemap — update providerAccountUrls.ts, not call sites,
 * to change how a provider's URL segment is generated.
 */
export function providerHref(provider: { slug: string; name: string }) {
  return providerAccountHref(provider);
}

export function truncate(text: string, max: number) {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}
