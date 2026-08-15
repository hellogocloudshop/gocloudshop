import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { getUseCaseBySlug } from "@/lib/data/useCases";
import { getProducts } from "@/lib/data/products";
import { getCategoryById } from "@/lib/data/categories";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductGrid } from "@/components/site/ProductGrid";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const useCase = await getUseCaseBySlug(slug);
  if (!useCase) return {};
  return {
    title: useCase.seo_title ?? useCase.title,
    description: useCase.seo_description ?? useCase.description ?? undefined,
    alternates: { canonical: `/use-cases/${slug}` },
  };
}

export default async function UseCaseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const useCase = await getUseCaseBySlug(slug);
  if (!useCase) notFound();

  const categories = await Promise.all(useCase.related_category_ids.map((id) => getCategoryById(id)));
  const primaryCategory = categories.find((c) => c !== null) ?? null;

  const { products } = await getProducts({
    categorySlug: primaryCategory?.slug,
    isAi: useCase.related_product_type === "ai" || undefined,
    pageSize: 8,
  });

  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Use Cases", href: "/use-cases" }, { label: useCase.title }]} />
      <SectionHeading title={useCase.title} subtitle={useCase.description} className="mt-4" />

      {useCase.content && (
        <div className="prose prose-sm mt-8 max-w-2xl text-ink prose-headings:text-ink prose-a:text-accent-blue">
          <ReactMarkdown>{useCase.content}</ReactMarkdown>
        </div>
      )}

      {products.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-ink">Suggested Products</h2>
          <div className="mt-5">
            <ProductGrid products={products} />
          </div>
        </section>
      )}
    </div>
  );
}
