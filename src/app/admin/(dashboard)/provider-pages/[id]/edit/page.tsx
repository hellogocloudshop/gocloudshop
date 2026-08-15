import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProviderPageForm } from "@/components/admin/ProviderPageForm";
import { updateProviderCategoryPage } from "@/lib/actions/admin/providerPages";
import type { Category, ProviderCategoryPage, Provider } from "@/lib/types";

export default async function EditProviderPagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  if (!supabase) notFound();

  const [{ data: page }, { data: providers }, { data: categories }] = await Promise.all([
    supabase.from("provider_category_pages").select("*").eq("id", id).maybeSingle(),
    supabase.from("providers").select("*").order("name"),
    supabase.from("categories").select("*").order("name"),
  ]);
  if (!page) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <AdminPageHeader title="Edit Provider Page" description={page.title} />
      <div className="mt-6">
        <ProviderPageForm
          page={page as ProviderCategoryPage}
          providers={(providers ?? []) as Provider[]}
          categories={(categories ?? []) as Category[]}
          action={updateProviderCategoryPage.bind(null, id)}
        />
      </div>
    </div>
  );
}
