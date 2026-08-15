import type { Metadata } from "next";
import { getAllSellableItems } from "@/lib/data/allProducts";
import type { SortOption } from "@/lib/data/products";
import { getProviders } from "@/lib/data/providers";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductFilters as CatalogFilters } from "@/components/site/ProductFilters";
import { AllProductsGrid } from "@/components/site/AllProductsGrid";
import { Pagination } from "@/components/site/Pagination";
import { SearchBox } from "@/components/layout/SearchBox";

export const metadata: Metadata = {
  title: "All Cloud Accounts & Credits",
  description:
    "Browse all available cloud accounts, AI cloud accounts, cloud credits, and cloud service products from GoCloudShop.",
  alternates: { canonical: "/all-products" },
  openGraph: {
    title: "All Cloud Accounts & Credits | GoCloudShop",
    description:
      "Browse all available cloud accounts, AI cloud accounts, cloud credits, and cloud service products from GoCloudShop.",
    url: "/all-products",
  },
};

const PAGE_SIZE = 24;
const VALID_SORTS: SortOption[] = ["recommended", "popular", "newest", "price-asc", "price-desc"];

export default async function AllProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const get = (key: string) => (typeof sp[key] === "string" ? (sp[key] as string) : undefined);

  const page = Math.max(1, Number(get("page") ?? "1") || 1);
  const sortParam = get("sort");
  const sort: SortOption = VALID_SORTS.includes(sortParam as SortOption) ? (sortParam as SortOption) : "recommended";

  const [providers, { items, total }] = await Promise.all([
    getProviders(),
    getAllSellableItems({
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
    return qs ? `/all-products?${qs}` : "/all-products";
  }

  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "All Products" }]} />
      <SectionHeading
        eyebrow="Full Catalog"
        title="All Products"
        subtitle="Every active cloud account, AI Cloud account, cloud credit package and account variation available on GoCloudShop — each priced and ready to order individually."
        className="mt-4"
      />

      <div className="mt-6 max-w-lg">
        <SearchBox defaultValue={get("q") ?? ""} placeholder="Search by product, provider, GPU, region, credit amount…" />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        <CatalogFilters providers={providers} />
        <div>
          <p className="mb-4 text-sm text-ink-muted">
            {total} {total === 1 ? "product" : "products"} found
          </p>
          <AllProductsGrid items={items} />
          <Pagination page={page} totalPages={totalPages} buildHref={buildHref} />
        </div>
      </div>
    </div>
  );
}
