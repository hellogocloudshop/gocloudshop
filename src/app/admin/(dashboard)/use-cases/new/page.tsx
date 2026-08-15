import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { UseCaseForm } from "@/components/admin/UseCaseForm";
import { createUseCase } from "@/lib/actions/admin/useCases";
import type { Category } from "@/lib/types";

export default async function NewUseCasePage() {
  const supabase = await createClient();
  const { data: categories } = supabase ? await supabase.from("categories").select("*").order("name") : { data: [] };

  return (
    <div className="mx-auto max-w-2xl">
      <AdminPageHeader title="Add Use Case" />
      <div className="mt-6">
        <UseCaseForm categories={(categories ?? []) as Category[]} action={createUseCase} />
      </div>
    </div>
  );
}
