"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import type { Category, UseCase } from "@/lib/types";
import type { ActionResult } from "@/lib/actions/admin/form-utils";
import { Field, TextArea, Checkbox, FormError } from "@/components/admin/FormFields";

export function UseCaseForm({
  useCase,
  categories,
  action,
}: {
  useCase?: UseCase;
  categories: Category[];
  action: (formData: FormData) => Promise<ActionResult>;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    const selected = formData.getAll("related_category_ids");
    formData.set("related_category_ids", selected.join(","));
    startTransition(async () => {
      const result = await action(formData);
      if (result && !result.success) setError(result.error);
    });
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <FormError error={error} />
      <section className="card-surface space-y-4 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Slug" name="slug" defaultValue={useCase?.slug} required placeholder="ai-machine-learning" />
          <Field label="Title" name="title" defaultValue={useCase?.title} required placeholder="AI & Machine Learning" />
        </div>
        <TextArea label="Short Description" name="description" defaultValue={useCase?.description ?? ""} rows={2} />
        <Field label="Icon (lucide-react name)" name="icon" defaultValue={useCase?.icon ?? ""} placeholder="BrainCircuit" />
        <TextArea label="Content (markdown)" name="content" defaultValue={useCase?.content ?? ""} rows={6} />
        <div>
          <label className="text-sm font-medium text-ink">Related Categories</label>
          <select
            name="related_category_ids"
            multiple
            defaultValue={useCase?.related_category_ids ?? []}
            className="mt-1.5 w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink"
            size={Math.min(6, categories.length)}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-6">
          <Field label="Sort Order" name="sort_order" type="number" defaultValue={useCase?.sort_order ?? 0} />
          <Checkbox label="Active" name="is_active" defaultChecked={useCase?.is_active ?? true} />
        </div>
      </section>
      <section className="card-surface space-y-4 p-6">
        <h2 className="font-semibold text-ink">SEO</h2>
        <Field label="SEO Title" name="seo_title" defaultValue={useCase?.seo_title ?? ""} />
        <TextArea label="SEO Description" name="seo_description" defaultValue={useCase?.seo_description ?? ""} rows={2} />
      </section>
      <button type="submit" disabled={isPending} className="btn-primary">
        {isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {useCase ? "Save Changes" : "Create Use Case"}
      </button>
    </form>
  );
}
