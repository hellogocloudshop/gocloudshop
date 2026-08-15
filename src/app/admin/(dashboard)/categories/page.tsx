import Link from "next/link";
import { Pencil } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteCategory } from "@/lib/actions/admin/categories";
import type { Category } from "@/lib/types";

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const { data } = supabase
    ? await supabase.from("categories").select("*").order("sort_order", { ascending: true })
    : { data: [] };
  const categories = (data ?? []) as Category[];

  return (
    <div>
      <AdminPageHeader title="Categories" description={`${categories.length} categories`} newHref="/admin/categories/new" newLabel="Add Category" />
      <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-bg-subtle text-xs uppercase tracking-wide text-ink-muted">
            <tr>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="px-4 py-3">
                  <p className="font-medium text-ink">{category.name}</p>
                  <p className="text-xs text-ink-muted">/{category.slug}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={category.is_active ? "badge-success" : "badge-neutral"}>
                    {category.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/categories/${category.id}/edit`} className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted hover:bg-bg-subtle hover:text-ink">
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                    </Link>
                    <DeleteButton action={deleteCategory.bind(null, category.id)} />
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-10 text-center text-ink-muted">
                  No categories yet.{" "}
                  <Link href="/admin/categories/new" className="text-accent-blue">
                    Add your first category
                  </Link>
                  .
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
