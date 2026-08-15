import type { Product } from "@/lib/types";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProductCard } from "./ProductCard";

export function ProductGrid({
  products,
  emptyTitle = "No products found.",
  emptyDescription = "No matching products found for your selected filters.",
  tone = "light",
}: {
  products: Product[];
  emptyTitle?: string;
  emptyDescription?: string;
  tone?: "light" | "dark";
}) {
  if (products.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} tone={tone} />
      ))}
    </div>
  );
}
