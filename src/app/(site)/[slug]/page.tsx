import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/lib/data/categories";
import { getProviderCategoryPageBySlug } from "@/lib/data/providerPages";
import { getProviders } from "@/lib/data/providers";
import { getProducts } from "@/lib/data/products";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductGrid } from "@/components/site/ProductGrid";
import { ProviderDetailView } from "@/components/site/ProviderDetailView";
import { providerHref } from "@/lib/utils";
import { looksLikeProviderAccountSlug, findProviderByAccountSlug } from "@/config/providerAccountUrls";

// Reserve top-level static routes so this catch-all never shadows them.
const RESERVED_SLUGS = new Set([
  "products",
  "all-products",
  "providers",
  "Cloud-Service",
  "cloud-service",
  "ai-cloud",
  "compare",
  "choose",
  "use-cases",
  "guides",
  "faq",
  "search",
  "about",
  "contact",
  "how-it-works",
  "privacy-policy",
  "terms-of-service",
  "refund-policy",
  "disclaimer",
  "admin",
]);

async function resolvePage(slug: string) {
  if (RESERVED_SLUGS.has(slug)) return null;

  // Provider "Buy {Provider} Account" pages (e.g. /buy-Aws-Account) — the
  // canonical destination for cloud-service provider pages. Cheap pattern
  // check first so every other slug (categories, combo pages) skips the
  // extra provider lookup entirely.
  if (looksLikeProviderAccountSlug(slug)) {
    const providers = await getProviders();
    const provider = findProviderByAccountSlug(providers, slug);
    if (provider) return { type: "provider" as const, provider, category: null, providerPage: null };
  }

  const category = await getCategoryBySlug(slug);
  if (category) return { type: "category" as const, category, providerPage: null, provider: null };
  const providerPage = await getProviderCategoryPageBySlug(slug);
  if (providerPage) {
    return { type: "provider-page" as const, category: providerPage.category ?? null, providerPage, provider: null };
  }
  return null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const resolved = await resolvePage(slug);
  if (!resolved) return {};

  if (resolved.type === "provider") {
    const { provider } = resolved;
    const canonical = providerHref(provider);
    return {
      title: provider.seo_title ?? `${provider.name} Cloud Accounts & Credits`,
      description: provider.seo_description ?? provider.description ?? undefined,
      alternates: { canonical },
      openGraph: { url: canonical },
    };
  }

  const title = resolved.providerPage
    ? resolved.providerPage.seo_title ?? resolved.providerPage.title
    : resolved.category!.seo_title ?? resolved.category!.name;
  const description = resolved.providerPage
    ? resolved.providerPage.seo_description ?? resolved.providerPage.intro_content ?? undefined
    : resolved.category!.seo_description ?? resolved.category!.description ?? undefined;

  return {
    title,
    description,
    alternates: { canonical: `/${slug}` },
    openGraph: { title, description },
  };
}

export default async function CategoryOrComboPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resolved = await resolvePage(slug);
  if (!resolved) notFound();

  if (resolved.type === "provider") {
    if (!resolved.provider.is_active) notFound();
    return <ProviderDetailView provider={resolved.provider} />;
  }

  const title = resolved.providerPage ? resolved.providerPage.title : resolved.category!.name;
  const description = resolved.providerPage
    ? resolved.providerPage.intro_content
    : resolved.category!.description;

  const { products } = await getProducts({
    categorySlug: resolved.category?.slug,
    providerSlug: resolved.providerPage?.provider?.slug,
    pageSize: 48,
    sort: "recommended",
  });

  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: title }]} />
      <SectionHeading title={title} subtitle={description} className="mt-4" />
      <div className="mt-8">
        <ProductGrid
          products={products}
          emptyTitle="No active products in this category yet."
          emptyDescription="Check back soon, or browse the full marketplace."
        />
      </div>
    </div>
  );
}
