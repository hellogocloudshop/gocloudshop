import Link from "next/link";
import { Pencil } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteReview } from "@/lib/actions/admin/reviews";
import { StarRating } from "@/components/ui/StarRating";
import type { Review } from "@/lib/types";

export default async function AdminReviewsPage() {
  const supabase = await createClient();
  const { data } = supabase ? await supabase.from("reviews").select("*").order("created_at", { ascending: false }) : { data: [] };
  const reviews = (data ?? []) as Review[];

  return (
    <div>
      <AdminPageHeader title="Reviews" description={`${reviews.length} reviews`} newHref="/admin/reviews/new" newLabel="Add Review" />
      <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-bg-subtle text-xs uppercase tracking-wide text-ink-muted">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {reviews.map((review) => (
              <tr key={review.id}>
                <td className="px-4 py-3">
                  <p className="font-medium text-ink">{review.customer_name}</p>
                  <p className="max-w-xs truncate text-xs text-ink-muted">{review.quote}</p>
                </td>
                <td className="px-4 py-3">
                  <StarRating rating={review.rating} />
                </td>
                <td className="px-4 py-3">
                  <span className={review.is_approved ? "badge-success" : "badge-warning"}>
                    {review.is_approved ? "Approved" : "Pending"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/reviews/${review.id}/edit`} className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted hover:bg-bg-subtle hover:text-ink">
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                    </Link>
                    <DeleteButton action={deleteReview.bind(null, review.id)} />
                  </div>
                </td>
              </tr>
            ))}
            {reviews.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-ink-muted">
                  No reviews yet.{" "}
                  <Link href="/admin/reviews/new" className="text-accent-blue">
                    Add a genuine customer review
                  </Link>
                  .
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
