import { getProviders } from "@/lib/data/providers";
import { getProviderCatalogSummary } from "@/lib/data/products";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HOMEPAGE_PROVIDER_COPY } from "@/config/homepageProviderCopy";
import { ProviderCard } from "./ProviderCard";

/** "Cloud Account Categories" — one premium card per provider with the
 *  complete marketing description (not a preview/clip), live product count
 *  and starting price pulled straight from the catalog, and a CTA into that
 *  provider's real account page. Providers without Homepage-specific copy
 *  (e.g. Atlantic.Net) fall back to their real database description, so
 *  every active provider still gets a full, working card. */
export async function ProvidersGridSection() {
  const providers = await getProviders();
  const withSummary = await Promise.all(
    providers.map(async (provider) => ({
      provider,
      summary: await getProviderCatalogSummary(provider.slug),
    }))
  );

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
