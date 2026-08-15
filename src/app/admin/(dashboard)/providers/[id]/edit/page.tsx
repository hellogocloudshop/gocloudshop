import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProviderForm } from "@/components/admin/ProviderForm";
import { updateProvider } from "@/lib/actions/admin/providers";
import type { Provider } from "@/lib/types";

export default async function EditProviderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: provider } = supabase
    ? await supabase.from("providers").select("*").eq("id", id).maybeSingle()
    : { data: null };
  if (!provider) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <AdminPageHeader title="Edit Provider" description={provider.name} />
      <div className="mt-6">
        <ProviderForm provider={provider as Provider} action={updateProvider.bind(null, id)} />
      </div>
    </div>
  );
}
