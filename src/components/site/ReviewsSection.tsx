import type { Review } from "@/lib/types";
import { StarRating } from "@/components/ui/StarRating";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/utils";

export function ReviewsSection({ reviews }: { reviews: Review[] }) {
  return (
    <section className="container-page py-16 sm:py-20">
      <SectionHeading eyebrow="Reviews" title="What Our Customers Say" align="center" className="mx-auto" />
      <div className="mt-10">
        {reviews.length === 0 ? (
          <EmptyState
            title="No reviews yet"
            description="Genuine customer reviews will appear here once submitted and approved."
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <div key={review.id} className="card-surface flex flex-col p-6">
                <StarRating rating={review.rating} />
                <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-muted">&ldquo;{review.quote}&rdquo;</p>
                <div className="mt-5 border-t border-line pt-4">
                  <p className="text-sm font-semibold text-ink">{review.customer_name}</p>
                  <p className="text-xs text-ink-muted">
                    {[review.customer_role, review.country].filter(Boolean).join(" · ")}
                  </p>
                  <p className="mt-1 text-xs text-ink-muted">{formatDate(review.review_date)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
