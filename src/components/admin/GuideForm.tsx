"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import type { Category, Guide, Provider } from "@/lib/types";
import type { ActionResult } from "@/lib/actions/admin/form-utils";
import { Field, TextArea, Select, FormError } from "@/components/admin/FormFields";

export function GuideForm({
  guide,
  providers,
  categories,
  action,
}: {
  guide?: Guide;
  providers: Provider[];
  categories: Category[];
  action: (formData: FormData) => Promise<ActionResult>;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [guideType, setGuideType] = useState(guide?.guide_type ?? "guide");
  const isStockUpdate = guideType === "stock_update";

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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Slug" name="slug" defaultValue={guide?.slug} required placeholder="cloud-account-buying-guide" />
          <Field label="Title" name="title" defaultValue={guide?.title} required />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Select
            label="Type"
            name="guide_type"
            defaultValue={guide?.guide_type ?? "guide"}
            onChange={(v) => setGuideType(v as Guide["guide_type"])}
          >
            <option value="guide">Guide</option>
            <option value="blog">Blog</option>
            <option value="provider_guide">Provider Guide</option>
            <option value="product_guide">Product Guide</option>
            <option value="comparison_guide">Comparison Guide</option>
            <option value="stock_update">Stock Update</option>
          </Select>
          <Select label="Status" name="status" defaultValue={guide?.status ?? "draft"}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </Select>
          <Field label="Tags (comma separated)" name="tags" defaultValue={(guide?.tags ?? []).join(", ")} />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select label="Related Provider" name="related_provider_id" defaultValue={guide?.related_provider_id ?? ""}>
            <option value="">None</option>
            {providers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>
          <Select label="Related Category" name="related_category_id" defaultValue={guide?.related_category_id ?? ""}>
            <option value="">None</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>
        {isStockUpdate && (
          <div className="grid grid-cols-1 gap-4 rounded-lg border border-dashed border-line p-4 sm:grid-cols-3">
            <Field
              label="Price"
              name="price"
              type="number"
              step="0.01"
              defaultValue={guide?.price ?? undefined}
              placeholder="249"
            />
            <Field label="Currency" name="currency" defaultValue={guide?.currency ?? "USD"} />
            <Select label="Availability" name="availability" defaultValue={guide?.availability ?? "in_stock"}>
              <option value="in_stock">In Stock</option>
              <option value="limited">Limited</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="preorder">Pre-order</option>
            </Select>
          </div>
        )}
        <Field label="Cover Image URL" name="cover_image_url" defaultValue={guide?.cover_image_url ?? ""} />
        <TextArea label="Excerpt" name="excerpt" defaultValue={guide?.excerpt ?? ""} rows={2} />
        <TextArea label="Content (markdown)" name="content" defaultValue={guide?.content ?? ""} rows={10} />
      </section>
      <section className="card-surface space-y-4 p-6">
        <h2 className="font-semibold text-ink">SEO</h2>
        <Field label="SEO Title" name="seo_title" defaultValue={guide?.seo_title ?? ""} />
        <TextArea label="SEO Description" name="seo_description" defaultValue={guide?.seo_description ?? ""} rows={2} />
      </section>
      <button type="submit" disabled={isPending} className="btn-primary">
        {isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {guide ? "Save Changes" : "Create Guide"}
      </button>
    </form>
  );
}
