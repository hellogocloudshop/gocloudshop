import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { FaqForm } from "@/components/admin/FaqForm";
import { createFaq } from "@/lib/actions/admin/faqs";
import type { Provider } from "@/lib/types";

export default async function NewFaqPage() {
  const supabase = await createClient();
  const [{ data: products }, { data: providers }] = supabase
    ? await Promise.all([supabase.from("products").select("id, name").order("name"), supabase.from("providers").select("*").order("name")])
    : [{ data: [] }, { data: [] }];

  return (
    <div className="mx-auto max-w-2xl">
      <AdminPageHeader title="Add FAQ" />
      <div className="mt-6">
        <FaqForm products={products ?? []} providers={(providers ?? []) as Provider[]} action={createFaq} />
      </div>
    </div>
  );
}
