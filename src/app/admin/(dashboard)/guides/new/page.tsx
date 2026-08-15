import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { GuideForm } from "@/components/admin/GuideForm";
import { createGuide } from "@/lib/actions/admin/guides";
import type { Category, Provider } from "@/lib/types";

export default async function NewGuidePage() {
  const supabase = await createClient();
  const [{ data: providers }, { data: categories }] = supabase
    ? await Promise.all([supabase.from("providers").select("*").order("name"), supabase.from("categories").select("*").order("name")])
    : [{ data: [] }, { data: [] }];

  return (
    <div className="mx-auto max-w-2xl">
      <AdminPageHeader title="Add Guide" />
      <div className="mt-6">
        <GuideForm providers={(providers ?? []) as Provider[]} categories={(categories ?? []) as Category[]} action={createGuide} />
      </div>
    </div>
  );
}
