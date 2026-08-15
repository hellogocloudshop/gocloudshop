import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { updateCategory } from "@/lib/actions/admin/categories";
import type { Category } from "@/lib/types";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: category }, { data: categories }] = supabase
    ? await Promise.all([
        supabase.from("categories").select("*").eq("id", id).maybeSingle(),
        supabase.from("categories").select("*").order("name"),
      ])
    : [{ data: null }, { data: [] }];
  if (!category) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <AdminPageHeader title="Edit Category" description={category.name} />
      <div className="mt-6">
        <CategoryForm category={category as Category} categories={(categories ?? []) as Category[]} action={updateCategory.bind(null, id)} />
      </div>
    </div>
  );
}
