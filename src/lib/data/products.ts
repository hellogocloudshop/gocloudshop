import { createClient } from "@/lib/supabase/server";
import { logSupabaseError } from "@/lib/supabase/logError";
import { mockProducts, mockVariations, mockProviders, mockCategories } from "@/lib/mock-data";
import type { Product, ProductVariation } from "@/lib/types";
import { effectivePrice } from "@/lib/utils";

export type SortOption = "recommended" | "popular" | "newest" | "price-asc" | "price-desc";

export interface ProductFilters {
  search?: string;
  categorySlug?: string;
  providerSlug?: string;
  productType?: string;
  isAi?: boolean;
  isGpu?: boolean;
  isFeatured?: boolean;
  priceMin?: number;
  priceMax?: number;
  region?: string;
  sort?: SortOption;
  page?: number;
  pageSize?: number;
}

function attachRelations(product: Product): Product {
  const provider = product.provider_id ? mockProviders.find((p) => p.id === product.provider_id) : null;
  const category = product.category_id ? mockCategories.find((c) => c.id === product.category_id) : null;
  const variations = mockVariations.filter((v) => v.product_id === product.id);
  return {
    ...product,
    provider: provider ?? null,
    category: category ?? null,
    variations,
  };
}

function filterMockProducts(products: Product[], filters: ProductFilters): Product[] {
  let result = products.filter((p) => p.is_active);

  if (filters.categorySlug) {
    result = result.filter((p) => p.category?.slug === filters.categorySlug);
  }
  if (filters.providerSlug) {
    result = result.filter((p) => p.provider?.slug === filters.providerSlug);
  }
  if (filters.productType) {
    result = result.filter((p) => p.product_type === filters.productType);
  }
  if (filters.isAi) {
    result = result.filter((p) => p.is_ai);
  }
  if (filters.isGpu) {
    result = result.filter((p) => p.is_gpu);
  }
  if (filters.isFeatured) {
    result = result.filter((p) => p.is_featured);
  }
  if (filters.region) {
    result = result.filter((p) => p.region === filters.region || p.variations?.some((v) => v.region === filters.region));
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter((p) => {
      const haystack = [
        p.name,
        p.short_description ?? "",
        p.description ?? "",
        p.product_type,
        p.provider?.name ?? "",
        p.category?.name ?? "",
        ...(p.variations ?? []).map((v) => `${v.name} ${Object.values(v.specifications).join(" ")}`),
        ...p.features,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }
  if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
    result = result.filter((p) => {
      const { price } = effectivePrice(p, p.variations ?? []);
      if (price === null) return false;
      if (filters.priceMin !== undefined && price < filters.priceMin) return false;
      if (filters.priceMax !== undefined && price > filters.priceMax) return false;
      return true;
    });
  }

  const sort = filters.sort ?? "recommended";
  result = [...result].sort((a, b) => {
    switch (sort) {
      case "price-asc":
        return (effectivePrice(a, a.variations ?? []).price ?? 0) - (effectivePrice(b, b.variations ?? []).price ?? 0);
      case "price-desc":
        return (effectivePrice(b, b.variations ?? []).price ?? 0) - (effectivePrice(a, a.variations ?? []).price ?? 0);
      case "newest":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "popular":
        return Number(b.is_popular) - Number(a.is_popular);
      case "recommended":
      default:
        return Number(b.is_featured) - Number(a.is_featured) || a.sort_order - b.sort_order;
    }
  });

  return result;
}

export async function getProducts(
  filters: ProductFilters = {}
): Promise<{ products: Product[]; total: number }> {
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 12;
  const supabase = await createClient();

  if (!supabase) {
    const withRelations = mockProducts.map(attachRelations);
    const filtered = filterMockProducts(withRelations, filters);
    const start = (page - 1) * pageSize;
    return { products: filtered.slice(start, start + pageSize), total: filtered.length };
  }

  /* Supabase equivalent (simplified):
     select *, provider:providers(*), category:categories(*), variations:product_variations(*)
     from products where is_active = true
     [+ .eq / .ilike / .textSearch per filter]
     order by sort_order
     range((page-1)*pageSize, page*pageSize - 1) */
  let query = supabase
    .from("products")
    .select("*, provider:providers(*), category:categories(*), variations:product_variations(*)", {
      count: "exact",
    })
    .eq("is_active", true);

  // Resolve slug filters to indexed foreign-key columns rather than filtering
  // through the embedded join (PostgREST only filters parent rows by an
  // embedded column when the embed uses `!inner`, so we resolve IDs first).
  if (filters.categorySlug) {
    const { data: category, error: categoryError } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", filters.categorySlug)
      .maybeSingle();
    logSupabaseError(`getProducts (category lookup: ${filters.categorySlug})`, categoryError);
    query = query.eq("category_id", category?.id ?? "00000000-0000-0000-0000-000000000000");
  }
  if (filters.providerSlug) {
    const { data: provider, error: providerError } = await supabase
      .from("providers")
      .select("id")
      .eq("slug", filters.providerSlug)
      .maybeSingle();
    logSupabaseError(`getProducts (provider lookup: ${filters.providerSlug})`, providerError);
    query = query.eq("provider_id", provider?.id ?? "00000000-0000-0000-0000-000000000000");
  }
  if (filters.productType) query = query.eq("product_type", filters.productType);
  if (filters.isAi) query = query.eq("is_ai", true);
  if (filters.isGpu) query = query.eq("is_gpu", true);
  if (filters.isFeatured) query = query.eq("is_featured", true);
  if (filters.region) query = query.eq("region", filters.region);
  if (filters.search) query = query.textSearch("search_vector", filters.search);

  const sort = filters.sort ?? "recommended";
  if (sort === "price-asc") query = query.order("base_price", { ascending: true, nullsFirst: false });
  else if (sort === "price-desc") query = query.order("base_price", { ascending: false, nullsFirst: false });
  else if (sort === "newest") query = query.order("created_at", { ascending: false });
  else if (sort === "popular") query = query.order("is_popular", { ascending: false });
  else query = query.order("is_featured", { ascending: false }).order("sort_order", { ascending: true });

  const start = (page - 1) * pageSize;
  query = query.range(start, start + pageSize - 1);

  const { data, count, error } = await query;
  logSupabaseError("getProducts", error);
  return { products: (data as Product[]) ?? [], total: count ?? 0 };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();

  if (!supabase) {
    const product = mockProducts.find((p) => p.slug === slug && p.is_active);
    return product ? attachRelations(product) : null;
  }

  const { data, error } = await supabase
    .from("products")
    .select("*, provider:providers(*), category:categories(*), variations:product_variations(*)")
    .eq("slug", slug)
    .maybeSingle();
  logSupabaseError("getProductBySlug", error);
  return (data as Product) ?? null;
}

/**
 * Looked up by id (not slug) — used server-side by the NOWPayments
 * create-payment route, which only ever receives a product id from the
 * client and must independently re-derive the real price/currency from the
 * database, never trusting anything the client sends.
 */
export async function getProductById(id: string): Promise<Product | null> {
  const supabase = await createClient();

  if (!supabase) {
    const product = mockProducts.find((p) => p.id === id && p.is_active);
    return product ? attachRelations(product) : null;
  }

  const { data, error } = await supabase
    .from("products")
    .select("*, provider:providers(*), category:categories(*), variations:product_variations(*)")
    .eq("id", id)
    .maybeSingle();
  logSupabaseError("getProductById", error);
  return (data as Product) ?? null;
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const { products } = await getProducts({ isFeatured: true, pageSize: limit, sort: "recommended" });
  return products;
}

export async function getAiProducts(limit = 12): Promise<Product[]> {
  const { products } = await getProducts({ isAi: true, pageSize: limit, sort: "recommended" });
  return products;
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const { products } = await getProducts({
    categorySlug: product.category?.slug,
    pageSize: limit + 1,
    sort: "recommended",
  });
  return products.filter((p) => p.id !== product.id).slice(0, limit);
}

export interface ProviderCatalogSummary {
  productCount: number;
  startingPrice: number | null;
  categories: string[];
}

/**
 * Aggregates a provider's active catalog for provider cards: product count,
 * starting ("from") price and the distinct categories it sells in. Computed
 * from the same getProducts() data path used everywhere else, so it never
 * drifts from what the storefront actually shows.
 */
export async function getProviderCatalogSummary(providerSlug: string): Promise<ProviderCatalogSummary> {
  const { products } = await getProducts({ providerSlug, pageSize: 200 });
  return summarizeProducts(products);
}

function summarizeProducts(products: Product[]): ProviderCatalogSummary {
  const prices = products
    .map((p) => effectivePrice(p, p.variations ?? []).price)
    .filter((p): p is number => p !== null);
  const categories = Array.from(new Set(products.map((p) => p.category?.name).filter((c): c is string => Boolean(c))));

  return {
    productCount: products.length,
    startingPrice: prices.length > 0 ? Math.min(...prices) : null,
    categories,
  };
}

/**
 * Same per-provider summary as getProviderCatalogSummary(), but for every
 * active provider at once from a single products query instead of one
 * query per provider. Used on the homepage's provider grid and the Cloud
 * Service listing page, which previously called getProviderCatalogSummary()
 * once per provider in a loop — each call did its own slug->id lookup plus
 * its own full products query, so a page with N providers issued roughly
 * 2N sequential Supabase round trips just to render provider cards. This
 * does it in one.
 */
export async function getProviderCatalogSummaries(): Promise<Map<string, ProviderCatalogSummary>> {
  const { products } = await getProducts({ pageSize: 1000 });
  const byProvider = new Map<string, Product[]>();
  for (const product of products) {
    if (!product.provider_id) continue;
    const list = byProvider.get(product.provider_id);
    if (list) list.push(product);
    else byProvider.set(product.provider_id, [product]);
  }

  const summaries = new Map<string, ProviderCatalogSummary>();
  for (const [providerId, providerProducts] of byProvider) {
    summaries.set(providerId, summarizeProducts(providerProducts));
  }
  return summaries;
}

export type { ProductVariation };
