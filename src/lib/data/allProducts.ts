import { getProducts, type ProductFilters, type SortOption } from "@/lib/data/products";
import type { AvailabilityStatus, Product, ProductVariation } from "@/lib/types";
import { effectivePrice } from "@/lib/utils";

/**
 * One row per *sellable* thing — a product with no variations is one item;
 * a product with N active variations becomes N items, one per variation.
 * This is the data shape /all-products needs (every purchasable account
 * tier as its own card), as opposed to getProducts() which returns one row
 * per parent product (used by /products, the homepage, etc.).
 */
export interface SellableItem {
  id: string;
  product: Product;
  variation: ProductVariation | null;
  /** Combined display title, e.g. "AWS Compute Accounts — 32 vCPU". Falls
   *  back to the product name alone for products without variations, whose
   *  names are already fully descriptive (e.g. the standalone AWS AI account products). */
  displayName: string;
  price: number | null;
  currency: string;
  availability: AvailabilityStatus;
  region: string | null;
  deliveryTime: string | null;
  badge: string | null;
  imageUrl: string | null;
  features: string[];
}

function toItems(product: Product): SellableItem[] {
  const activeVariations = (product.variations ?? []).filter((v) => v.is_active);

  if (activeVariations.length === 0) {
    const { price, currency } = effectivePrice(product, []);
    return [
      {
        id: product.id,
        product,
        variation: null,
        displayName: product.name,
        price,
        currency,
        availability: product.availability,
        region: product.region,
        deliveryTime: product.delivery_time_text,
        badge: product.badge,
        imageUrl: product.image_url,
        features: product.features,
      },
    ];
  }

  return activeVariations.map((variation) => ({
    id: variation.id,
    product,
    variation,
    displayName: `${product.name} — ${variation.name}`,
    price: variation.price,
    currency: variation.currency,
    availability: variation.availability,
    region: variation.region ?? product.region,
    deliveryTime: variation.delivery_time_text ?? product.delivery_time_text,
    badge: variation.badge ?? product.badge,
    imageUrl: variation.image_url ?? product.image_url,
    features: variation.features.length > 0 ? variation.features : product.features,
  }));
}

const ITEM_SORTERS: Record<SortOption, (a: SellableItem, b: SellableItem) => number> = {
  "price-asc": (a, b) => (a.price ?? 0) - (b.price ?? 0),
  "price-desc": (a, b) => (b.price ?? 0) - (a.price ?? 0),
  newest: (a, b) => new Date(b.product.created_at).getTime() - new Date(a.product.created_at).getTime(),
  popular: (a, b) => Number(b.product.is_popular) - Number(a.product.is_popular),
  recommended: (a, b) => Number(b.product.is_featured) - Number(a.product.is_featured) || a.product.sort_order - b.product.sort_order,
};

/**
 * The full flattened, filtered, sorted and paginated catalog for
 * /all-products. Reuses getProducts() for the underlying active-only,
 * RLS-respecting product+variation fetch (same DB/mock data source as every
 * other catalog page) — this function only adds the flatten/price-range/sort
 * step needed to show one card per purchasable variation.
 */
export async function getAllSellableItems(
  filters: ProductFilters = {}
): Promise<{ items: SellableItem[]; total: number }> {
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 24;

  // Fetch the full matching active catalog (everything except price, which
  // must be evaluated per-variation, not per-product) — capped generously,
  // matching the same cap sitemap.ts already uses for "the whole catalog".
  const { products } = await getProducts({
    ...filters,
    priceMin: undefined,
    priceMax: undefined,
    page: 1,
    pageSize: 1000,
  });

  let items = products.flatMap(toItems);

  if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
    items = items.filter((item) => {
      if (item.price === null) return false;
      if (filters.priceMin !== undefined && item.price < filters.priceMin) return false;
      if (filters.priceMax !== undefined && item.price > filters.priceMax) return false;
      return true;
    });
  }

  const sort = filters.sort ?? "recommended";
  items = [...items].sort(ITEM_SORTERS[sort]);

  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total };
}
