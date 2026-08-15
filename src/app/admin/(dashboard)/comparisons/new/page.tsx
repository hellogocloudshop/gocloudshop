import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ComparisonForm } from "@/components/admin/ComparisonForm";
import { createComparison } from "@/lib/actions/admin/comparisons";
import type { Category, Provider } from "@/lib/types";

export default async function NewComparisonPage() {
  const supabase = await createClient();
  const [{ data: providers }, { data: categories }] = supabase
    ? await Promise.all([supabase.from("providers").select("*").order("name"), supabase.from("categories").select("*").order("name")])
    : [{ data: [] }, { data: [] }];

  return (
    <div className="mx-auto max-w-2xl">
      <AdminPageHeader title="Add Comparison" />
      <div className="mt-6">
        <ComparisonForm providers={(providers ?? []) as Provider[]} categories={(categories ?? []) as Category[]} action={createComparison} />
      </div>
    </div>
  );
}
