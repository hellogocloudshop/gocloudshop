import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { GuideForm } from "@/components/admin/GuideForm";
import { updateGuide } from "@/lib/actions/admin/guides";
import type { Category, Guide, Provider } from "@/lib/types";

export default async function EditGuidePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  if (!supabase) notFound();

  const [{ data: guide }, { data: providers }, { data: categories }] = await Promise.all([
    supabase.from("guides").select("*").eq("id", id).maybeSingle(),
    supabase.from("providers").select("*").order("name"),
    supabase.from("categories").select("*").order("name"),
  ]);
  if (!guide) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <AdminPageHeader title="Edit Guide" description={guide.title} />
      <div className="mt-6">
        <GuideForm guide={guide as Guide} providers={(providers ?? []) as Provider[]} categories={(categories ?? []) as Category[]} action={updateGuide.bind(null, id)} />
      </div>
    </div>
  );
}
