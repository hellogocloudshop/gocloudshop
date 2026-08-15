"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import type { Category, ProviderCategoryPage, Provider } from "@/lib/types";
import type { ActionResult } from "@/lib/actions/admin/form-utils";
import { Field, TextArea, Select, Checkbox, FormError } from "@/components/admin/FormFields";

export function ProviderPageForm({
  page,
  providers,
  categories,
  action,
}: {
  page?: ProviderCategoryPage;
  providers: Provider[];
  categories: Category[];
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
        <p className="text-xs text-ink-muted">
          Creates a combo SEO landing page such as <code>/aws-accounts</code> or <code>/aws-credits</code>,
          listing products that match the selected provider (and category, if set).
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Slug" name="slug" defaultValue={page?.slug} required placeholder="aws-accounts" />
          <Field label="Title" name="title" defaultValue={page?.title} required placeholder="AWS Cloud Accounts" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select label="Provider" name="provider_id" defaultValue={page?.provider_id ?? ""}>
            <option value="">Select a provider…</option>
            {providers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>
          <Select label="Category" name="category_id" defaultValue={page?.category_id ?? ""}>
            <option value="">None</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>
        <Field label="Product Type filter (optional, used instead of/with Category)" name="product_type" defaultValue={page?.product_type ?? ""} />
        <TextArea label="Intro Content" name="intro_content" defaultValue={page?.intro_content ?? ""} rows={3} />
        <div className="flex items-center gap-6">
          <Field label="Sort Order" name="sort_order" type="number" defaultValue={page?.sort_order ?? 0} />
          <Checkbox label="Active" name="is_active" defaultChecked={page?.is_active ?? true} />
        </div>
      </section>
      <section className="card-surface space-y-4 p-6">
        <h2 className="font-semibold text-ink">SEO</h2>
        <Field label="SEO Title" name="seo_title" defaultValue={page?.seo_title ?? ""} />
        <TextArea label="SEO Description" name="seo_description" defaultValue={page?.seo_description ?? ""} rows={2} />
      </section>
      <button type="submit" disabled={isPending} className="btn-primary">
        {isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {page ? "Save Changes" : "Create Page"}
      </button>
    </form>
  );
}
