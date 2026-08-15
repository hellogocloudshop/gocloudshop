"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import type { Category, Comparison, Provider } from "@/lib/types";
import type { ActionResult } from "@/lib/actions/admin/form-utils";
import { Field, TextArea, Select, Checkbox, FormError } from "@/components/admin/FormFields";

function rowsToLines(comparison?: Comparison) {
  if (!comparison) return "";
  return comparison.rows
    .map((row) => {
      const values = Object.entries(row.values)
        .map(([k, v]) => `${k}=${v}`)
        .join(" | ");
      return `${row.feature} | ${values}`;
    })
    .join("\n");
}

export function ComparisonForm({
  comparison,
  providers,
  categories,
  action,
}: {
  comparison?: Comparison;
  providers: Provider[];
  categories: Category[];
  action: (formData: FormData) => Promise<ActionResult>;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    // The multi-select submits one "provider_ids" entry per selection;
    // collapse them into the single comma-separated value the server action
    // expects (formData.set replaces every existing entry for the key).
    const selectedProviderIds = formData.getAll("provider_ids");
    formData.set("provider_ids", selectedProviderIds.join(","));

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
          <Field label="Slug" name="slug" defaultValue={comparison?.slug} required placeholder="aws-vs-google-cloud" />
          <Field label="Title" name="title" defaultValue={comparison?.title} required placeholder="AWS vs Google Cloud" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select label="Comparison Type" name="comparison_type" defaultValue={comparison?.comparison_type ?? "provider_vs_provider"}>
            <option value="provider_vs_provider">Provider vs Provider</option>
            <option value="topic">Topic (multi-provider)</option>
          </Select>
          <Select label="Related Category" name="category_id" defaultValue={comparison?.category_id ?? ""}>
            <option value="">None</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium text-ink">Providers to compare</label>
          <select
            name="provider_ids"
            multiple
            defaultValue={comparison?.provider_ids ?? []}
            className="mt-1.5 w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink"
            size={Math.min(6, providers.length)}
          >
            {providers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-ink-muted">Hold Ctrl/Cmd to select multiple providers.</p>
        </div>
        <TextArea label="Description" name="description" defaultValue={comparison?.description ?? ""} rows={2} />
        <TextArea
          label="Comparison Rows — one per line: Feature | provider-slug=value | provider-slug=value"
          name="rows"
          defaultValue={rowsToLines(comparison)}
          rows={6}
          hint="Example: Compute options | aws=EC2 instance families | google-cloud=Compute Engine machine families"
        />
        <div className="flex items-center gap-6">
          <Field label="Sort Order" name="sort_order" type="number" defaultValue={comparison?.sort_order ?? 0} />
          <Checkbox label="Active" name="is_active" defaultChecked={comparison?.is_active ?? true} />
        </div>
      </section>
      <section className="card-surface space-y-4 p-6">
        <h2 className="font-semibold text-ink">SEO</h2>
        <Field label="SEO Title" name="seo_title" defaultValue={comparison?.seo_title ?? ""} />
        <TextArea label="SEO Description" name="seo_description" defaultValue={comparison?.seo_description ?? ""} rows={2} />
      </section>
      <button type="submit" disabled={isPending} className="btn-primary">
        {isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {comparison ? "Save Changes" : "Create Comparison"}
      </button>
    </form>
  );
}
