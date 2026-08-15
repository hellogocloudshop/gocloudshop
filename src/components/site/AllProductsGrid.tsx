import type { SellableItem } from "@/lib/data/allProducts";
import { EmptyState } from "@/components/ui/EmptyState";
import { AllProductsCard } from "./AllProductsCard";

export function AllProductsGrid({ items }: { items: SellableItem[] }) {
  if (items.length === 0) {
    return (
      <EmptyState
        title="No products available"
        description="No active products or account variations match your current filters. Try clearing a filter, or check back soon as new products are added."
      />
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <AllProductsCard key={item.id} item={item} />
      ))}
    </div>
  );
}
