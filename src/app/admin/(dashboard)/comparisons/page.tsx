import Link from "next/link";
import { Pencil } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteComparison } from "@/lib/actions/admin/comparisons";
import type { Comparison } from "@/lib/types";

export default async function AdminComparisonsPage() {
  const supabase = await createClient();
  const { data } = supabase ? await supabase.from("comparisons").select("*").order("sort_order") : { data: [] };
  const comparisons = (data ?? []) as Comparison[];

  return (
    <div>
      <AdminPageHeader title="Comparisons" description={`${comparisons.length} comparisons`} newHref="/admin/comparisons/new" newLabel="Add Comparison" />
      <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-bg-subtle text-xs uppercase tracking-wide text-ink-muted">
            <tr>
              <th className="px-4 py-3">Comparison</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {comparisons.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-3">
                  <p className="font-medium text-ink">{c.title}</p>
                  <p className="text-xs text-ink-muted">/compare/{c.slug}</p>
                </td>
                <td className="px-4 py-3 text-ink-muted">{c.comparison_type}</td>
                <td className="px-4 py-3">
                  <span className={c.is_active ? "badge-success" : "badge-neutral"}>{c.is_active ? "Active" : "Inactive"}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/comparisons/${c.id}/edit`} className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted hover:bg-bg-subtle hover:text-ink">
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                    </Link>
                    <DeleteButton action={deleteComparison.bind(null, c.id)} />
                  </div>
                </td>
              </tr>
            ))}
            {comparisons.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-ink-muted">
                  No comparisons yet.{" "}
                  <Link href="/admin/comparisons/new" className="text-accent-blue">
                    Add your first comparison
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
