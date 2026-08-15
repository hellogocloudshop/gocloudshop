"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import type { Provider } from "@/lib/types";
import type { ActionResult } from "@/lib/actions/admin/form-utils";
import { Field, TextArea, Checkbox, FormError } from "@/components/admin/FormFields";

export function ProviderForm({
  provider,
  action,
}: {
  provider?: Provider;
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Name" name="name" defaultValue={provider?.name} required />
          <Field label="Slug" name="slug" defaultValue={provider?.slug} required placeholder="aws" />
        </div>
        <TextArea label="Description" name="description" defaultValue={provider?.description ?? ""} rows={3} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Logo URL" name="logo_url" defaultValue={provider?.logo_url ?? ""} />
          <Field label="Website URL" name="website_url" defaultValue={provider?.website_url ?? ""} />
        </div>
        <div className="flex items-center gap-6">
          <Field label="Sort Order" name="sort_order" type="number" defaultValue={provider?.sort_order ?? 0} />
          <Checkbox label="Active" name="is_active" defaultChecked={provider?.is_active ?? true} />
        </div>
      </section>

      <section className="card-surface space-y-4 p-6">
        <h2 className="font-semibold text-ink">SEO</h2>
        <Field label="SEO Title" name="seo_title" defaultValue={provider?.seo_title ?? ""} />
        <TextArea label="SEO Description" name="seo_description" defaultValue={provider?.seo_description ?? ""} rows={2} />
      </section>

      <button type="submit" disabled={isPending} className="btn-primary">
        {isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {provider ? "Save Changes" : "Create Provider"}
      </button>
    </form>
  );
}
