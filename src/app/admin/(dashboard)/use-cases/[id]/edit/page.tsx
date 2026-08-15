import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { UseCaseForm } from "@/components/admin/UseCaseForm";
import { updateUseCase } from "@/lib/actions/admin/useCases";
import type { Category, UseCase } from "@/lib/types";

export default async function EditUseCasePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  if (!supabase) notFound();

  const [{ data: useCase }, { data: categories }] = await Promise.all([
    supabase.from("use_cases").select("*").eq("id", id).maybeSingle(),
    supabase.from("categories").select("*").order("name"),
  ]);
  if (!useCase) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <AdminPageHeader title="Edit Use Case" description={useCase.title} />
      <div className="mt-6">
        <UseCaseForm useCase={useCase as UseCase} categories={(categories ?? []) as Category[]} action={updateUseCase.bind(null, id)} />
      </div>
    </div>
  );
}
