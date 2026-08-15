import Link from "next/link";
import { Pencil } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteFaq } from "@/lib/actions/admin/faqs";
import type { Faq } from "@/lib/types";

export default async function AdminFaqsPage() {
  const supabase = await createClient();
  const { data } = supabase ? await supabase.from("faqs").select("*").order("sort_order") : { data: [] };
  const faqs = (data ?? []) as Faq[];

  return (
    <div>
      <AdminPageHeader title="FAQs" description={`${faqs.length} FAQs`} newHref="/admin/faqs/new" newLabel="Add FAQ" />
      <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-bg-subtle text-xs uppercase tracking-wide text-ink-muted">
            <tr>
              <th className="px-4 py-3">Question</th>
              <th className="px-4 py-3">Scope</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {faqs.map((faq) => (
              <tr key={faq.id}>
                <td className="max-w-md px-4 py-3 font-medium text-ink">{faq.question}</td>
                <td className="px-4 py-3 text-ink-muted">
                  {faq.product_id ? "Product" : faq.provider_id ? "Provider" : faq.category ?? "Global"}
                </td>
                <td className="px-4 py-3">
                  <span className={faq.is_active ? "badge-success" : "badge-neutral"}>{faq.is_active ? "Active" : "Inactive"}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/faqs/${faq.id}/edit`} className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted hover:bg-bg-subtle hover:text-ink">
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                    </Link>
                    <DeleteButton action={deleteFaq.bind(null, faq.id)} />
                  </div>
                </td>
              </tr>
            ))}
            {faqs.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-ink-muted">
                  No FAQs yet.{" "}
                  <Link href="/admin/faqs/new" className="text-accent-blue">
                    Add your first FAQ
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
