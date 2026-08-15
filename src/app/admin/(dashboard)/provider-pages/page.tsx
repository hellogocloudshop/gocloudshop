import Link from "next/link";
import { Pencil } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteProviderCategoryPage } from "@/lib/actions/admin/providerPages";
import type { ProviderCategoryPage } from "@/lib/types";

export default async function AdminProviderPagesPage() {
  const supabase = await createClient();
  const { data } = supabase
    ? await supabase.from("provider_category_pages").select("*, provider:providers(name)").order("sort_order")
    : { data: [] };
  const pages = (data ?? []) as unknown as ProviderCategoryPage[];

  return (
    <div>
      <AdminPageHeader title="Provider Pages" description={`${pages.length} combo landing pages`} newHref="/admin/provider-pages/new" newLabel="Add Page" />
      <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-bg-subtle text-xs uppercase tracking-wide text-ink-muted">
            <tr>
              <th className="px-4 py-3">Page</th>
              <th className="px-4 py-3">Provider</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {pages.map((page) => (
              <tr key={page.id}>
                <td className="px-4 py-3">
                  <p className="font-medium text-ink">{page.title}</p>
                  <p className="text-xs text-ink-muted">/{page.slug}</p>
                </td>
                <td className="px-4 py-3 text-ink-muted">{page.provider?.name ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className={page.is_active ? "badge-success" : "badge-neutral"}>{page.is_active ? "Active" : "Inactive"}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/provider-pages/${page.id}/edit`} className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted hover:bg-bg-subtle hover:text-ink">
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                    </Link>
                    <DeleteButton action={deleteProviderCategoryPage.bind(null, page.id)} />
                  </div>
                </td>
              </tr>
            ))}
            {pages.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-ink-muted">
                  No provider pages yet.{" "}
                  <Link href="/admin/provider-pages/new" className="text-accent-blue">
                    Add your first page
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
