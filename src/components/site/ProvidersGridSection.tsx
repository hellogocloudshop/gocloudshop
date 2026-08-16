import type { Provider } from "@/lib/types";
import type { ProviderCatalogSummary } from "@/lib/data/products";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HOMEPAGE_PROVIDER_COPY } from "@/config/homepageProviderCopy";
import { ProviderCard } from "./ProviderCard";

const EMPTY_SUMMARY = { productCount: 0, startingPrice: null, categories: [] as string[] };

/** "Cloud Account Categories" — one premium card per provider with the
 *  complete marketing description (not a preview/clip), live product count
 *  and starting price pulled straight from the catalog, and a CTA into that
 *  provider's real account page. Providers without Homepage-specific copy
 *  (e.g. Atlantic.Net) fall back to their real database description, so
 *  every active provider still gets a full, working card.
 *
 *  Purely presentational — takes providers/summaries as props instead of
 *  fetching its own data. It used to run its own Promise.all() internally,
 *  which (since it's nested inside the JSX HomePage() returns) could only
 *  start *after* HomePage's own top-level Promise.all had already
 *  resolved — an extra sequential round trip on every homepage load. Now
 *  its data is fetched by HomePage() as part of that same top-level
 *  Promise.all, so this and every other section's data is one parallel
 *  batch instead of two sequential ones. */
export function ProvidersGridSection({
  providers,
  summaries,
}: {
  providers: Provider[];
  summaries: Map<string, ProviderCatalogSummary>;
}) {
  const withSummary = providers.map((provider) => ({
    provider,
    summary: summaries.get(provider.id) ?? EMPTY_SUMMARY,
  }));

  return (
    <section id="providers" className="section-mesh-blue py-16 sm:py-20 scroll-mt-20">
      <div className="container-page">
        <SectionHeading
          eyebrow="Providers"
          title="Cloud Account Categories"
          subtitle="We partner with the biggest names in cloud computing so you can compare, choose, and deploy with confidence."
          align="center"
          className="mx-auto"
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {withSummary.map(({ provider, summary }) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              productCount={summary.productCount}
              startingPrice={summary.startingPrice}
              categories={summary.categories}
              description={HOMEPAGE_PROVIDER_COPY[provider.slug]}
              truncate={false}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
