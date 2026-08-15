import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProductForm } from "@/components/admin/ProductForm";
import { VariationManager } from "@/components/admin/VariationManager";
import { updateProduct } from "@/lib/actions/admin/products";
import type { Category, Product, ProductVariation, Provider } from "@/lib/types";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  if (!supabase) notFound();

  const [{ data: product }, { data: providers }, { data: categories }, { data: variations }] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).maybeSingle(),
    supabase.from("providers").select("*").order("name"),
    supabase.from("categories").select("*").order("name"),
    supabase.from("product_variations").select("*").eq("product_id", id).order("sort_order", { ascending: true }),
  ]);

  if (!product) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <AdminPageHeader title="Edit Product" description={product.name} />
        <div className="mt-6">
          <ProductForm
            product={product as Product}
            providers={(providers ?? []) as Provider[]}
            categories={(categories ?? []) as Category[]}
            action={updateProduct.bind(null, id)}
          />
        </div>
      </div>

      <VariationManager productId={id} variations={(variations ?? []) as ProductVariation[]} />
    </div>
  );
}
