import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ComparisonForm } from "@/components/admin/ComparisonForm";
import { updateComparison } from "@/lib/actions/admin/comparisons";
import type { Category, Comparison, Provider } from "@/lib/types";

export default async function EditComparisonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  if (!supabase) notFound();

  const [{ data: comparison }, { data: providers }, { data: categories }] = await Promise.all([
    supabase.from("comparisons").select("*").eq("id", id).maybeSingle(),
    supabase.from("providers").select("*").order("name"),
    supabase.from("categories").select("*").order("name"),
  ]);
  if (!comparison) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <AdminPageHeader title="Edit Comparison" description={comparison.title} />
      <div className="mt-6">
        <ComparisonForm
          comparison={comparison as Comparison}
          providers={(providers ?? []) as Provider[]}
          categories={(categories ?? []) as Category[]}
          action={updateComparison.bind(null, id)}
        />
      </div>
    </div>
  );
}
