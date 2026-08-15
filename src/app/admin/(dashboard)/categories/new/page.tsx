import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { createCategory } from "@/lib/actions/admin/categories";
import type { Category } from "@/lib/types";

export default async function NewCategoryPage() {
  const supabase = await createClient();
  const { data } = supabase ? await supabase.from("categories").select("*").order("name") : { data: [] };

  return (
    <div className="mx-auto max-w-2xl">
      <AdminPageHeader title="Add Category" />
      <div className="mt-6">
        <CategoryForm categories={(data ?? []) as Category[]} action={createCategory} />
      </div>
    </div>
  );
}
