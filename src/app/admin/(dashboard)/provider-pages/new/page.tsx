import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProviderPageForm } from "@/components/admin/ProviderPageForm";
import { createProviderCategoryPage } from "@/lib/actions/admin/providerPages";
import type { Category, Provider } from "@/lib/types";

export default async function NewProviderPagePage() {
  const supabase = await createClient();
  const [{ data: providers }, { data: categories }] = supabase
    ? await Promise.all([supabase.from("providers").select("*").order("name"), supabase.from("categories").select("*").order("name")])
    : [{ data: [] }, { data: [] }];

  return (
    <div className="mx-auto max-w-2xl">
      <AdminPageHeader title="Add Provider Page" />
      <div className="mt-6">
        <ProviderPageForm providers={(providers ?? []) as Provider[]} categories={(categories ?? []) as Category[]} action={createProviderCategoryPage} />
      </div>
    </div>
  );
}
