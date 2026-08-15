"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import type { Category, Product, Provider } from "@/lib/types";
import type { ActionResult } from "@/lib/actions/admin/form-utils";
import { Field, TextArea, Select, Checkbox, FormError } from "@/components/admin/FormFields";

function specsToLines(specs: Record<string, string>) {
  return Object.entries(specs)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
}

export function ProductForm({
  product,
  providers,
  categories,
  action,
}: {
  product?: Product;
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
        <h2 className="font-semibold text-ink">Basics</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Product Name" name="name" defaultValue={product?.name} required />
          <Field label="Slug" name="slug" defaultValue={product?.slug} required placeholder="aws-compute-accounts" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select label="Provider" name="provider_id" defaultValue={product?.provider_id ?? ""}>
            <option value="">None</option>
            {providers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>
          <Select label="Category" name="category_id" defaultValue={product?.category_id ?? ""}>
            <option value="">None</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>
        <Field
          label="Product Type"
          name="product_type"
          defaultValue={product?.product_type}
          required
          placeholder="Cloud Account, Cloud Credit, AI Cloud Account, Compute, Free Trial…"
        />
        <TextArea label="Short Description" name="short_description" defaultValue={product?.short_description ?? ""} rows={2} />
        <TextArea label="Description" name="description" defaultValue={product?.description ?? ""} rows={5} />
      </section>

      <section className="card-surface space-y-4 p-6">
        <h2 className="font-semibold text-ink">Pricing</h2>
        <p className="text-xs text-ink-muted">
          Leave Base Price blank if this product will use variations (variations are managed below once the
          product is created) — the storefront will show &quot;From&quot; the cheapest active variation price.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Base Price (USD)" name="base_price" type="number" step="0.01" defaultValue={product?.base_price ?? undefined} />
          <Field label="Currency" name="currency" defaultValue={product?.currency ?? "USD"} />
        </div>
      </section>

      <section className="card-surface space-y-4 p-6">
        <h2 className="font-semibold text-ink">Content</h2>
        <TextArea
          label="Key Features (one per line — used when this product has no variations)"
          name="features"
          defaultValue={(product?.features ?? []).join("\n")}
          rows={4}
        />
        <TextArea
          label="What's Included (one per line)"
          name="whats_included"
          defaultValue={(product?.whats_included ?? []).join("\n")}
          rows={4}
        />
        <TextArea
          label="Specifications (one per line — Key: Value)"
          name="specifications"
          defaultValue={specsToLines(product?.specifications ?? {})}
          rows={4}
          hint="Example: vCPU: 32"
        />
      </section>

      <section className="card-surface space-y-4 p-6">
        <h2 className="font-semibold text-ink">Delivery & Support</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Region" name="region" defaultValue={product?.region ?? ""} placeholder="Worldwide, US, Europe, Asia…" />
          <Select label="Availability" name="availability" defaultValue={product?.availability ?? "in_stock"}>
            <option value="in_stock">In Stock</option>
            <option value="limited">Limited</option>
            <option value="out_of_stock">Out of Stock</option>
            <option value="preorder">Pre-order</option>
          </Select>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Delivery Time" name="delivery_time_text" defaultValue={product?.delivery_time_text ?? ""} placeholder="Within 24 hours" />
          <Field label="Support Type" name="support_type" defaultValue={product?.support_type ?? ""} placeholder="Telegram support" />
        </div>
        <TextArea label="Replacement Policy" name="replacement_policy" defaultValue={product?.replacement_policy ?? ""} rows={2} />
        <TextArea label="Refund Policy" name="refund_policy" defaultValue={product?.refund_policy ?? ""} rows={2} />
      </section>

      <section className="card-surface space-y-4 p-6">
        <h2 className="font-semibold text-ink">Merchandising</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Badge" name="badge" defaultValue={product?.badge ?? ""} placeholder="Popular, Best Value, AI Ready…" />
          <Field label="Sort Order" name="sort_order" type="number" defaultValue={product?.sort_order ?? 0} />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          <Checkbox label="Featured" name="is_featured" defaultChecked={product?.is_featured} />
          <Checkbox label="Popular" name="is_popular" defaultChecked={product?.is_popular} />
          <Checkbox label="AI" name="is_ai" defaultChecked={product?.is_ai} />
          <Checkbox label="GPU" name="is_gpu" defaultChecked={product?.is_gpu} />
          <Checkbox label="Active" name="is_active" defaultChecked={product?.is_active ?? true} />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Image URL" name="image_url" defaultValue={product?.image_url ?? ""} />
          <Field label="Provider Logo Override URL" name="provider_logo_override_url" defaultValue={product?.provider_logo_override_url ?? ""} />
        </div>
      </section>

      <section className="card-surface space-y-4 p-6">
        <h2 className="font-semibold text-ink">SEO</h2>
        <Field label="SEO Title" name="seo_title" defaultValue={product?.seo_title ?? ""} />
        <TextArea label="SEO Description" name="seo_description" defaultValue={product?.seo_description ?? ""} rows={2} />
        <Field label="OG Image URL" name="og_image_url" defaultValue={product?.og_image_url ?? ""} />
      </section>

      <button type="submit" disabled={isPending} className="btn-primary">
        {isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {product ? "Save Changes" : "Create Product"}
      </button>
    </form>
  );
}
