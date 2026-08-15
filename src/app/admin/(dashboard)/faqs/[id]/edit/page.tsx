import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { FaqForm } from "@/components/admin/FaqForm";
import { updateFaq } from "@/lib/actions/admin/faqs";
import type { Faq, Provider } from "@/lib/types";

export default async function EditFaqPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  if (!supabase) notFound();

  const [{ data: faq }, { data: products }, { data: providers }] = await Promise.all([
    supabase.from("faqs").select("*").eq("id", id).maybeSingle(),
    supabase.from("products").select("id, name").order("name"),
    supabase.from("providers").select("*").order("name"),
  ]);
  if (!faq) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <AdminPageHeader title="Edit FAQ" description={faq.question} />
      <div className="mt-6">
        <FaqForm faq={faq as Faq} products={products ?? []} providers={(providers ?? []) as Provider[]} action={updateFaq.bind(null, id)} />
      </div>
    </div>
  );
}
