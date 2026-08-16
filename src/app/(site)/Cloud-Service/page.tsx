import type { Metadata } from "next";
import { CheckCircle2, DollarSign, LifeBuoy, MousePointerClick } from "lucide-react";
import { getProviders } from "@/lib/data/providers";
import { getProviderCatalogSummaries } from "@/lib/data/products";
import { getSiteSettings } from "@/lib/data/settings";
import type { ContactChannels } from "@/lib/contact";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CloudServiceCard } from "@/components/site/CloudServiceCard";
import { ContactHelpSection } from "@/components/contact/ContactHelpSection";

// Canonical listing page for cloud providers/services (formerly "/providers").
// Reuses the same provider data-access layer as before — only the page's
// presentation and the card component changed. Each card links to that
// provider's canonical "Buy {Provider} Account" page (/buy-{Provider}-Account,
// see providerAccountUrls.ts); the legacy /providers/[slug] route still works
// as a fallback. Every "Buy {name} Accounts" heading below is generated
// purely from provider.name (with per-provider overrides in
// cloudServiceDisplay.ts), so a newly-added provider gets a correctly worded
// card automatically with zero code changes.
export const metadata: Metadata = {
  title: "Buy Cloud Accounts & Credits",
  description: "Explore cloud accounts, cloud credits, and infrastructure products from leading cloud service providers.",
  alternates: { canonical: "/Cloud-Service" },
  openGraph: {
    title: "Buy Cloud Accounts & Credits | GoCloudShop",
    description: "Explore cloud accounts, cloud credits, and infrastructure products from leading cloud service providers.",
    url: "/Cloud-Service",
  },
};

// Reuses the exact same trust copy already shown site-wide on the homepage
// (see TrustIndicators) — no new business claims are introduced here.
const TRUST_ROW = [
  { icon: DollarSign, label: "Transparent Pricing" },
  { icon: LifeBuoy, label: "Responsive Support" },
  { icon: MousePointerClick, label: "Easy Ordering" },
];

const EMPTY_SUMMARY = { productCount: 0, startingPrice: null, categories: [] as string[] };

export default async function CloudServicePage() {
  const [providers, settings, summaries] = await Promise.all([getProviders(), getSiteSettings(), getProviderCatalogSummaries()]);
  const withSummary = providers.map((provider) => ({ provider, summary: summaries.get(provider.id) ?? EMPTY_SUMMARY }));
  const channels: ContactChannels = {
    telegramUsername: settings.telegram_username,
    whatsappNumber: settings.whatsapp_number,
    telegramChannelUrl: settings.telegram_channel_url,
  };

  return (
    <div className="surface-dark relative">
      <div className="bg-grid-pattern absolute inset-0 opacity-20" aria-hidden="true" />
      <div
        className="animate-float pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-accent-blue/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="animate-float-slow pointer-events-none absolute -right-16 top-64 h-80 w-80 rounded-full bg-violet/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="container-page relative py-10">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Cloud Service" }]} tone="dark" />

        <div className="mt-4 max-w-2xl">
          <SectionHeading
            eyebrow="Cloud Services"
            title="Buy Cloud Accounts & Credits"
            subtitle="Choose from trusted cloud platforms and explore available account, credit and infrastructure options — with transparent pricing on every listing."
            tone="dark"
          />
        </div>

        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
          {TRUST_ROW.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-2 text-sm font-medium text-white/70">
              <Icon className="h-4 w-4 shrink-0 text-sky-accent" aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>

        {withSummary.length === 0 ? (
          <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/5 py-16 text-center">
            <CheckCircle2 className="h-8 w-8 text-white/40" aria-hidden="true" />
            <h2 className="mt-4 font-semibold text-white">No cloud services available yet</h2>
            <p className="mt-1.5 max-w-sm text-sm text-white/60">Check back soon, or contact support for current availability.</p>
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {withSummary.map(({ provider, summary }) => (
              <CloudServiceCard
                key={provider.id}
                provider={provider}
                productCount={summary.productCount}
                startingPrice={summary.startingPrice}
                categories={summary.categories}
              />
            ))}
          </div>
        )}

        <div className="mt-12">
          <ContactHelpSection
            channels={channels}
            title="Not sure which provider to choose?"
            description="Tell us what you're building and we'll help you pick the right cloud service."
            tone="dark"
          />
        </div>
      </div>
    </div>
  );
}
