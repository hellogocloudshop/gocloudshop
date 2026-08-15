import type { Product } from "@/lib/types";
import { ProductGrid } from "./ProductGrid";

export function RelatedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="container-page py-14">
      <h2 className="text-xl font-bold text-ink">Related Products</h2>
      <div className="mt-6">
        <ProductGrid products={products} />
      </div>
    </section>
  );
}
