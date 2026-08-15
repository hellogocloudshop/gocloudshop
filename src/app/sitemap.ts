import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/data/products";
import { getProviders } from "@/lib/data/providers";
import { getCategories } from "@/lib/data/categories";
import { getProviderCategoryPages } from "@/lib/data/providerPages";
import { getComparisons } from "@/lib/data/comparisons";
import { getUseCases } from "@/lib/data/useCases";
import { getGuides } from "@/lib/data/guides";
import { productHref, providerHref } from "@/lib/utils";

const STATIC_ROUTES = [
  "",
  "/products",
  "/all-products",
  "/Cloud-Service",
  "/ai-cloud",
  "/choose",
  "/use-cases",
  "/guides",
  "/faq",
  "/search",
  "/about",
  "/contact",
  "/how-it-works",
  "/privacy-policy",
  "/terms-of-service",
  "/refund-policy",
  "/disclaimer",
];

function baseUrl() {
  // Never fall back to localhost in a generated sitemap.
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://gocloudshop.com";
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = baseUrl();

  const [providers, categories, providerPages, { products }, comparisons, useCases, guides] = await Promise.all([
    getProviders(),
    getCategories(),
    getProviderCategoryPages(),
    getProducts({ pageSize: 500 }),
    getComparisons(),
    getUseCases(),
    getGuides(),
  ]);

  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${site}${route}`,
    lastModified: new Date(),
  }));

  for (const provider of providers) {
    entries.push({ url: `${site}${providerHref(provider)}`, lastModified: new Date(provider.updated_at) });
  }
  for (const category of categories) {
    entries.push({ url: `${site}/${category.slug}`, lastModified: new Date(category.updated_at) });
  }
  for (const page of providerPages) {
    entries.push({ url: `${site}/${page.slug}`, lastModified: new Date(page.updated_at) });
  }
  for (const product of products) {
    entries.push({ url: `${site}${productHref(product)}`, lastModified: new Date(product.updated_at) });
  }
  for (const comparison of comparisons) {
    entries.push({ url: `${site}/compare/${comparison.slug}`, lastModified: new Date(comparison.updated_at) });
  }
  for (const useCase of useCases) {
    entries.push({ url: `${site}/use-cases/${useCase.slug}`, lastModified: new Date(useCase.updated_at) });
  }
  for (const guide of guides) {
    entries.push({ url: `${site}/guides/${guide.slug}`, lastModified: new Date(guide.updated_at) });
  }

  return entries;
}
