import type { Metadata } from "next";
import { getProducts, type SortOption } from "@/lib/data/products";
import { getProviders } from "@/lib/data/providers";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductFilters } from "@/components/site/ProductFilters";
import { ProductGrid } from "@/components/site/ProductGrid";
import { Pagination } from "@/components/site/Pagination";
import { SearchBox } from "@/components/layout/SearchBox";

export const metadata: Metadata = {
  title: "Cloud & AI Products",
  description: "Browse the full GoCloudShop catalog of cloud accounts, credits, AI Cloud and compute products.",
  alternates: { canonical: "/products" },
};

const PAGE_SIZE = 12;
const VALID_SORTS: SortOption[] = ["recommended", "popular", "newest", "price-asc", "price-desc"];

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const get = (key: string) => (typeof sp[key] === "string" ? (sp[key] as string) : undefined);

  const page = Math.max(1, Number(get("page") ?? "1") || 1);
  const sortParam = get("sort");
  const sort: SortOption = VALID_SORTS.includes(sortParam as SortOption) ? (sortParam as SortOption) : "recommended";

  const [providers, { products, total }] = await Promise.all([
    getProviders(),
    getProducts({
      search: get("q"),
      providerSlug: get("provider"),
      productType: get("type"),
      isAi: get("ai") === "1",
      isGpu: get("gpu") === "1",
      region: get("region"),
      priceMin: get("priceMin") ? Number(get("priceMin")) : undefined,
      priceMax: get("priceMax") ? Number(get("priceMax")) : undefined,
      sort,
      page,
      pageSize: PAGE_SIZE,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function buildHref(targetPage: number) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(sp)) {
      if (typeof value === "string" && key !== "page") params.set(key, value);
    }
    if (targetPage > 1) params.set("page", String(targetPage));
    const qs = params.toString();
    return qs ? `/products?${qs}` : "/products";
  }

  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Products" }]} />
      <SectionHeading
        eyebrow="Marketplace"
        title="Cloud & AI Products"
        subtitle="Find the right cloud account, credit package, AI solution or infrastructure for your project."
        className="mt-4"
      />

      <div className="mt-6 max-w-lg">
        <SearchBox defaultValue={get("q") ?? ""} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        <ProductFilters providers={providers} />
        <div>
          <p className="mb-4 text-sm text-ink-muted">
            {total} {total === 1 ? "product" : "products"} found
          </p>
          <ProductGrid products={products} />
          <Pagination page={page} totalPages={totalPages} buildHref={buildHref} />
        </div>
      </div>
    </div>
  );
}
