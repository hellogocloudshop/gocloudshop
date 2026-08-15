import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ReviewForm } from "@/components/admin/ReviewForm";
import { createReview } from "@/lib/actions/admin/reviews";

export default async function NewReviewPage() {
  const supabase = await createClient();
  const { data: products } = supabase ? await supabase.from("products").select("id, name").order("name") : { data: [] };

  return (
    <div className="mx-auto max-w-2xl">
      <AdminPageHeader title="Add Review" />
      <div className="mt-6">
        <ReviewForm products={products ?? []} action={createReview} />
      </div>
    </div>
  );
}
