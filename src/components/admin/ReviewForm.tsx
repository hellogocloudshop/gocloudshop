"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import type { Product, Review } from "@/lib/types";
import type { ActionResult } from "@/lib/actions/admin/form-utils";
import { Field, TextArea, Select, Checkbox, FormError } from "@/components/admin/FormFields";

export function ReviewForm({
  review,
  products,
  action,
}: {
  review?: Review;
  products: Pick<Product, "id" | "name">[];
  action: (formData: FormData) => Promise<ActionResult>;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await action(formData);
      if (result && !result.success) setError(result.error);
    });
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <FormError error={error} />
      <p className="alert-warning">
        Only add reviews from genuine customers. GoCloudShop does not display fabricated reviews or ratings.
      </p>
      <section className="card-surface space-y-4 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Customer Name" name="customer_name" defaultValue={review?.customer_name} required />
          <Field label="Customer Role (optional)" name="customer_role" defaultValue={review?.customer_role ?? ""} />
        </div>
        <TextArea label="Quote" name="quote" defaultValue={review?.quote} rows={3} required />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Rating (1-5)" name="rating" type="number" defaultValue={review?.rating ?? 5} required />
          <Field label="Country (optional)" name="country" defaultValue={review?.country ?? ""} />
          <Field label="Review Date" name="review_date" type="date" defaultValue={review?.review_date ?? ""} />
        </div>
        <Select label="Related Product (optional)" name="product_id" defaultValue={review?.product_id ?? ""}>
          <option value="">None</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </Select>
        <div className="flex items-center gap-6">
          <Checkbox label="Approved (visible on site)" name="is_approved" defaultChecked={review?.is_approved ?? false} />
          <Checkbox label="Featured" name="is_featured" defaultChecked={review?.is_featured ?? false} />
        </div>
      </section>
      <button type="submit" disabled={isPending} className="btn-primary">
        {isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {review ? "Save Changes" : "Add Review"}
      </button>
    </form>
  );
}
