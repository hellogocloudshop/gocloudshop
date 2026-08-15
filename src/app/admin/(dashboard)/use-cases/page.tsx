import Link from "next/link";
import { Pencil } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteUseCase } from "@/lib/actions/admin/useCases";
import type { UseCase } from "@/lib/types";

export default async function AdminUseCasesPage() {
  const supabase = await createClient();
  const { data } = supabase ? await supabase.from("use_cases").select("*").order("sort_order") : { data: [] };
  const useCases = (data ?? []) as UseCase[];

  return (
    <div>
      <AdminPageHeader title="Use Cases" description={`${useCases.length} use cases`} newHref="/admin/use-cases/new" newLabel="Add Use Case" />
      <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-bg-subtle text-xs uppercase tracking-wide text-ink-muted">
            <tr>
              <th className="px-4 py-3">Use Case</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {useCases.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-3">
                  <p className="font-medium text-ink">{u.title}</p>
                  <p className="text-xs text-ink-muted">/use-cases/{u.slug}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={u.is_active ? "badge-success" : "badge-neutral"}>{u.is_active ? "Active" : "Inactive"}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/use-cases/${u.id}/edit`} className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted hover:bg-bg-subtle hover:text-ink">
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                    </Link>
                    <DeleteButton action={deleteUseCase.bind(null, u.id)} />
                  </div>
                </td>
              </tr>
            ))}
            {useCases.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-10 text-center text-ink-muted">
                  No use cases yet.{" "}
                  <Link href="/admin/use-cases/new" className="text-accent-blue">
                    Add your first use case
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
