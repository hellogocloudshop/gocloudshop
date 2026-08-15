import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProductForm } from "@/components/admin/ProductForm";
import { createProduct } from "@/lib/actions/admin/products";
import type { Category, Provider } from "@/lib/types";

export default async function NewProductPage() {
  const supabase = await createClient();
  const [{ data: providers }, { data: categories }] = supabase
    ? await Promise.all([
        supabase.from("providers").select("*").order("name"),
        supabase.from("categories").select("*").order("name"),
      ])
    : [{ data: [] }, { data: [] }];

  return (
    <div className="mx-auto max-w-2xl">
      <AdminPageHeader title="Add Product" description="After creating the product, you can add variations (price tiers) below." />
      <div className="mt-6">
        <ProductForm providers={(providers ?? []) as Provider[]} categories={(categories ?? []) as Category[]} action={createProduct} />
      </div>
    </div>
  );
}
