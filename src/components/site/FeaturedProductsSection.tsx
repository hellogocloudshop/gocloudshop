import type { Product } from "@/lib/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductGrid } from "./ProductGrid";

export function FeaturedProductsSection({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="container-page py-16 sm:py-20">
      <SectionHeading eyebrow="Featured" title="Featured Products" align="center" className="mx-auto" />
      <div className="mt-10">
        <ProductGrid products={products} />
      </div>
    </section>
  );
}
