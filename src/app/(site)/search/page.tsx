import type { Metadata } from "next";
import { getProducts } from "@/lib/data/products";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SearchBox } from "@/components/layout/SearchBox";
import { ProductGrid } from "@/components/site/ProductGrid";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false, follow: true },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const { products, total } = q ? await getProducts({ search: q, pageSize: 24 }) : { products: [], total: 0 };

  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Search" }]} />
      <SectionHeading eyebrow="Search" title={q ? `Results for "${q}"` : "Search Products"} className="mt-4" />

      <div className="mt-6 max-w-lg">
        <SearchBox defaultValue={q ?? ""} />
      </div>

      <div className="mt-8">
        {q ? (
          <>
            <p className="mb-4 text-sm text-ink-muted">
              {total} {total === 1 ? "result" : "results"}
            </p>
            <ProductGrid
              products={products}
              emptyTitle="Search returned no results."
              emptyDescription="Try a different provider, product type, region or spec — e.g. “AWS 32 vCPU” or “AI GPU”."
            />
          </>
        ) : (
          <p className="text-ink-muted">Search by product name, provider, category, region, GPU, credit amount and more.</p>
        )}
      </div>
    </div>
  );
}
