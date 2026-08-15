"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, Copy, Loader2, Plus, Trash2 } from "lucide-react";
import type { ProductVariation } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { Field, TextArea, Select, Checkbox, FormError } from "@/components/admin/FormFields";
import {
  createVariation,
  updateVariation,
  deleteVariation,
  duplicateVariation,
  reorderVariations,
} from "@/lib/actions/admin/variations";

function specsToLines(specs: Record<string, string>) {
  return Object.entries(specs)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
}

function VariationFields({ variation }: { variation?: ProductVariation }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="Name" name="name" defaultValue={variation?.name} required placeholder="32 vCPU" />
        <Field label="Slug" name="slug" defaultValue={variation?.slug} required placeholder="32-vcpu" />
        <Field label="Price (USD)" name="price" type="number" step="0.01" defaultValue={variation?.price} required />
      </div>
      <TextArea label="Description" name="description" defaultValue={variation?.description ?? ""} rows={2} />
      <TextArea label="Features (one per line)" name="features" defaultValue={(variation?.features ?? []).join("\n")} rows={3} />
      <TextArea
        label="Specifications (one per line — Key: Value)"
        name="specifications"
        defaultValue={specsToLines(variation?.specifications ?? {})}
        rows={3}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="Region" name="region" defaultValue={variation?.region ?? ""} />
        <Select label="Availability" name="availability" defaultValue={variation?.availability ?? "in_stock"}>
          <option value="in_stock">In Stock</option>
          <option value="limited">Limited</option>
          <option value="out_of_stock">Out of Stock</option>
          <option value="preorder">Pre-order</option>
        </Select>
        <Field label="Delivery Time" name="delivery_time_text" defaultValue={variation?.delivery_time_text ?? ""} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Badge" name="badge" defaultValue={variation?.badge ?? ""} />
        <Field label="Image URL" name="image_url" defaultValue={variation?.image_url ?? ""} />
      </div>

      <details className="rounded-lg border border-line p-3">
        <summary className="cursor-pointer text-sm font-medium text-ink">AI Specifications (optional)</summary>
        <div className="mt-3 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="AI Category" name="ai_category" defaultValue={variation?.ai_category ?? ""} />
            <Field label="AI Platform" name="ai_platform" defaultValue={variation?.ai_platform ?? ""} />
            <Field label="GPU Type" name="gpu_type" defaultValue={variation?.gpu_type ?? ""} />
            <Field label="GPU Count" name="gpu_count" type="number" defaultValue={variation?.gpu_count ?? undefined} />
            <Field label="VRAM" name="vram" defaultValue={variation?.vram ?? ""} />
            <Field label="Compute Type" name="compute_type" defaultValue={variation?.compute_type ?? ""} />
            <Field label="Model Support" name="model_support" defaultValue={variation?.model_support ?? ""} />
            <Field label="Architecture" name="architecture" defaultValue={variation?.architecture ?? ""} />
          </div>
          <TextArea label="AI Services (one per line)" name="ai_services" defaultValue={(variation?.ai_services ?? []).join("\n")} rows={2} />
          <div className="flex items-center gap-6">
            <Checkbox label="Inference Support" name="inference_support" defaultChecked={variation?.inference_support ?? false} />
            <Checkbox label="Training Support" name="training_support" defaultChecked={variation?.training_support ?? false} />
          </div>
        </div>
      </details>

      <div className="flex items-center gap-6">
        <Field label="Sort Order" name="sort_order" type="number" defaultValue={variation?.sort_order ?? 0} />
        <Checkbox label="Active" name="is_active" defaultChecked={variation?.is_active ?? true} />
      </div>
    </div>
  );
}

function VariationRow({
  variation,
  index,
  total,
  onMove,
}: {
  variation: ProductVariation;
  index: number;
  total: number;
  onMove: (id: string, direction: -1 | 1) => void;
}) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await updateVariation(variation.id, formData);
      if (!result.success) setError(result.error);
      else router.refresh();
    });
  }

  function handleDelete() {
    if (!window.confirm(`Delete variation "${variation.name}"? This cannot be undone.`)) return;
    startTransition(async () => {
      await deleteVariation(variation.id, variation.product_id);
      router.refresh();
    });
  }

  function handleDuplicate() {
    startTransition(async () => {
      await duplicateVariation(variation.id, variation.product_id);
      router.refresh();
    });
  }

  return (
    <div className="rounded-xl border border-line">
      <div className="flex items-center justify-between gap-2 p-4">
        <button type="button" onClick={() => setExpanded((v) => !v)} className="flex flex-1 items-center gap-3 text-left">
          <span className="text-sm font-semibold text-ink">{variation.name}</span>
          <span className="text-sm text-ink-muted">{formatPrice(variation.price, variation.currency)}</span>
          {!variation.is_active && <span className="badge-neutral badge">Inactive</span>}
        </button>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => onMove(variation.id, -1)} disabled={index === 0 || isPending} className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted hover:bg-bg-subtle disabled:opacity-30" aria-label="Move up">
            <ChevronUp className="h-4 w-4" aria-hidden="true" />
          </button>
          <button type="button" onClick={() => onMove(variation.id, 1)} disabled={index === total - 1 || isPending} className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted hover:bg-bg-subtle disabled:opacity-30" aria-label="Move down">
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </button>
          <button type="button" onClick={handleDuplicate} disabled={isPending} className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted hover:bg-bg-subtle" aria-label="Duplicate">
            <Copy className="h-4 w-4" aria-hidden="true" />
          </button>
          <button type="button" onClick={handleDelete} disabled={isPending} className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted hover:bg-red-500/10 hover:text-red-600" aria-label="Delete">
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
          <button type="button" onClick={() => setExpanded((v) => !v)} className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted hover:bg-bg-subtle" aria-label={expanded ? "Collapse" : "Expand"}>
            {expanded ? <ChevronUp className="h-4 w-4" aria-hidden="true" /> : <ChevronDown className="h-4 w-4" aria-hidden="true" />}
          </button>
        </div>
      </div>
      {expanded && (
        <form action={handleSubmit} className="border-t border-line p-4">
          <FormError error={error} />
          <VariationFields variation={variation} />
          <button type="submit" disabled={isPending} className="btn-primary mt-4">
            {isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            Save Variation
          </button>
        </form>
      )}
    </div>
  );
}

export function VariationManager({ productId, variations }: { productId: string; variations: ProductVariation[] }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const sorted = [...variations].sort((a, b) => a.sort_order - b.sort_order);

  function handleCreate(formData: FormData) {
    setError(null);
    formData.set("product_id", productId);
    startTransition(async () => {
      const result = await createVariation(formData);
      if (!result.success) setError(result.error);
      else {
        setAdding(false);
        router.refresh();
      }
    });
  }

  function handleReorder(id: string, direction: -1 | 1) {
    const currentIndex = sorted.findIndex((v) => v.id === id);
    const targetIndex = currentIndex + direction;
    if (targetIndex < 0 || targetIndex >= sorted.length) return;
    const reordered = [...sorted];
    [reordered[currentIndex], reordered[targetIndex]] = [reordered[targetIndex], reordered[currentIndex]];
    startTransition(async () => {
      await reorderVariations(productId, reordered.map((v) => v.id));
      router.refresh();
    });
  }

  return (
    <section className="card-surface space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-ink">Variations</h2>
        <button type="button" onClick={() => setAdding((v) => !v)} className="btn-secondary">
          <Plus className="h-4 w-4" aria-hidden="true" /> Add Variation
        </button>
      </div>
      <p className="text-xs text-ink-muted">
        Customers select one of these on the product page — price, features, specifications, availability, region,
        delivery and badge all update together with their selection.
      </p>

      {adding && (
        <form action={handleCreate} className="rounded-xl border border-accent-blue/30 bg-accent-blue/5 p-4">
          <FormError error={error} />
          <VariationFields />
          <div className="mt-4 flex gap-2">
            <button type="submit" disabled={isPending} className="btn-primary">
              {isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              Add Variation
            </button>
            <button type="button" onClick={() => setAdding(false)} className="btn-ghost">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {sorted.map((variation, index) => (
          <VariationRow key={variation.id} variation={variation} index={index} total={sorted.length} onMove={handleReorder} />
        ))}
        {sorted.length === 0 && !adding && (
          <p className="rounded-xl border border-dashed border-line py-8 text-center text-sm text-ink-muted">
            No variations yet — this product will show its Base Price. Add a variation to offer multiple tiers.
          </p>
        )}
      </div>
    </section>
  );
}
