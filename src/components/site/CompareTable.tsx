import type { Comparison, Provider } from "@/lib/types";

export function CompareTable({ comparison, providers }: { comparison: Comparison; providers: Provider[] }) {
  if (comparison.rows.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-xl border border-line">
      <table className="w-full min-w-[36rem] border-collapse text-sm">
        <thead>
          <tr className="bg-bg-subtle text-left">
            <th className="px-4 py-3 font-semibold text-ink">Feature</th>
            {providers.map((provider) => (
              <th key={provider.id} className="px-4 py-3 font-semibold text-ink">
                {provider.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {comparison.rows.map((row) => (
            <tr key={row.feature}>
              <td className="px-4 py-3 font-medium text-ink-muted">{row.feature}</td>
              {providers.map((provider) => (
                <td key={provider.id} className="px-4 py-3 text-ink">
                  {row.values[provider.slug] ?? "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
