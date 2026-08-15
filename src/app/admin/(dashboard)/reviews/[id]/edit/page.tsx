import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ReviewForm } from "@/components/admin/ReviewForm";
import { updateReview } from "@/lib/actions/admin/reviews";
import type { Review } from "@/lib/types";

export default async function EditReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  if (!supabase) notFound();

  const [{ data: review }, { data: products }] = await Promise.all([
    supabase.from("reviews").select("*").eq("id", id).maybeSingle(),
    supabase.from("products").select("id, name").order("name"),
  ]);
  if (!review) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <AdminPageHeader title="Edit Review" description={review.customer_name} />
      <div className="mt-6">
        <ReviewForm review={review as Review} products={products ?? []} action={updateReview.bind(null, id)} />
      </div>
    </div>
  );
}
