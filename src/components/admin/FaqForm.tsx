"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import type { Faq, Product, Provider } from "@/lib/types";
import type { ActionResult } from "@/lib/actions/admin/form-utils";
import { Field, TextArea, Select, Checkbox, FormError } from "@/components/admin/FormFields";

export function FaqForm({
  faq,
  products,
  providers,
  action,
}: {
  faq?: Faq;
  products: Pick<Product, "id" | "name">[];
  providers: Provider[];
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
      <section className="card-surface space-y-4 p-6">
        <Field label="Question" name="question" defaultValue={faq?.question} required />
        <TextArea label="Answer" name="answer" defaultValue={faq?.answer} rows={4} required />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Category (groups global FAQs)" name="category" defaultValue={faq?.category ?? ""} placeholder="General, Ordering, Policies…" />
          <Select label="Product (optional — scopes to one product)" name="product_id" defaultValue={faq?.product_id ?? ""}>
            <option value="">None (global)</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>
          <Select label="Provider (optional — scopes to one provider)" name="provider_id" defaultValue={faq?.provider_id ?? ""}>
            <option value="">None (global)</option>
            {providers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex items-center gap-6">
          <Field label="Sort Order" name="sort_order" type="number" defaultValue={faq?.sort_order ?? 0} />
          <Checkbox label="Active" name="is_active" defaultChecked={faq?.is_active ?? true} />
        </div>
      </section>
      <button type="submit" disabled={isPending} className="btn-primary">
        {isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {faq ? "Save Changes" : "Create FAQ"}
      </button>
    </form>
  );
}
