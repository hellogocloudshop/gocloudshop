import Link from "next/link";
import { Pencil } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteGuide } from "@/lib/actions/admin/guides";
import type { Guide } from "@/lib/types";

export default async function AdminGuidesPage() {
  const supabase = await createClient();
  const { data } = supabase ? await supabase.from("guides").select("*").order("created_at", { ascending: false }) : { data: [] };
  const guides = (data ?? []) as Guide[];

  return (
    <div>
      <AdminPageHeader title="Guides" description={`${guides.length} guides`} newHref="/admin/guides/new" newLabel="Add Guide" />
      <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-bg-subtle text-xs uppercase tracking-wide text-ink-muted">
            <tr>
              <th className="px-4 py-3">Guide</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {guides.map((g) => (
              <tr key={g.id}>
                <td className="px-4 py-3">
                  <p className="font-medium text-ink">{g.title}</p>
                  <p className="text-xs text-ink-muted">/guides/{g.slug}</p>
                </td>
                <td className="px-4 py-3 text-ink-muted">{g.guide_type}</td>
                <td className="px-4 py-3">
                  <span className={g.status === "published" ? "badge-success" : "badge-neutral"}>{g.status}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/guides/${g.id}/edit`} className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted hover:bg-bg-subtle hover:text-ink">
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                    </Link>
                    <DeleteButton action={deleteGuide.bind(null, g.id)} />
                  </div>
                </td>
              </tr>
            ))}
            {guides.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-ink-muted">
                  No guides yet.{" "}
                  <Link href="/admin/guides/new" className="text-accent-blue">
                    Add your first guide
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
