import Link from "next/link";
import { Pencil } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteProvider } from "@/lib/actions/admin/providers";
import type { Provider } from "@/lib/types";

export default async function AdminProvidersPage() {
  const supabase = await createClient();
  const { data } = supabase
    ? await supabase.from("providers").select("*").order("sort_order", { ascending: true })
    : { data: [] };
  const providers = (data ?? []) as Provider[];

  return (
    <div>
      <AdminPageHeader title="Providers" description={`${providers.length} providers`} newHref="/admin/providers/new" newLabel="Add Provider" />
      <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-bg-subtle text-xs uppercase tracking-wide text-ink-muted">
            <tr>
              <th className="px-4 py-3">Provider</th>
              <th className="px-4 py-3">Website</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {providers.map((provider) => (
              <tr key={provider.id}>
                <td className="px-4 py-3">
                  <p className="font-medium text-ink">{provider.name}</p>
                  <p className="text-xs text-ink-muted">/{provider.slug}</p>
                </td>
                <td className="px-4 py-3 text-ink-muted">{provider.website_url ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className={provider.is_active ? "badge-success" : "badge-neutral"}>
                    {provider.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/providers/${provider.id}/edit`} className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted hover:bg-bg-subtle hover:text-ink">
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                    </Link>
                    <DeleteButton action={deleteProvider.bind(null, provider.id)} />
                  </div>
                </td>
              </tr>
            ))}
            {providers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-ink-muted">
                  No providers yet.{" "}
                  <Link href="/admin/providers/new" className="text-accent-blue">
                    Add your first provider
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
