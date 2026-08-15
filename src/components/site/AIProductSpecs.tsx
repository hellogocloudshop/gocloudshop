import type { ProductVariation } from "@/lib/types";

/** AI-specific specification block — only rendered when the variation has AI data configured. */
export function AIProductSpecs({ variation }: { variation: ProductVariation }) {
  const rows: { label: string; value: string }[] = [
    { label: "AI Category", value: variation.ai_category ?? "" },
    { label: "AI Platform", value: variation.ai_platform ?? "" },
    { label: "GPU", value: variation.gpu_type ?? "" },
    { label: "GPU Count", value: variation.gpu_count ? String(variation.gpu_count) : "" },
    { label: "VRAM", value: variation.vram ?? "" },
    { label: "Compute Type", value: variation.compute_type ?? "" },
    { label: "Model Support", value: variation.model_support ?? "" },
    { label: "Architecture", value: variation.architecture ?? "" },
    { label: "Inference", value: variation.inference_support === null ? "" : variation.inference_support ? "Supported" : "Not supported" },
    { label: "Training", value: variation.training_support === null ? "" : variation.training_support ? "Supported" : "Not supported" },
  ].filter((row) => row.value);

  if (rows.length === 0 && variation.ai_services.length === 0) return null;

  return (
    <div>
      <h2 className="text-lg font-semibold text-ink">AI Specifications</h2>
      <div className="mt-3 overflow-hidden rounded-xl border border-violet/20 bg-violet/5">
        {rows.length > 0 && (
          <dl className="divide-y divide-violet/10">
            {rows.map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                <dt className="text-ink-muted">{row.label}</dt>
                <dd className="text-right font-medium text-ink">{row.value}</dd>
              </div>
            ))}
          </dl>
        )}
        {variation.ai_services.length > 0 && (
          <div className="border-t border-violet/10 px-4 py-3">
            <p className="text-sm text-ink-muted">AI Services</p>
            <ul className="mt-1.5 flex flex-wrap gap-1.5">
              {variation.ai_services.map((service) => (
                <li key={service} className="badge-violet badge">
                  {service}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
