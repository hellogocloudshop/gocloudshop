import { Fragment } from "react";
import { getAllSellableItems } from "@/lib/data/allProducts";
import { getSiteSettings } from "@/lib/data/settings";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { providerHref } from "@/lib/utils";
import type { Provider } from "@/lib/types";
import type { ContactChannels } from "@/lib/contact";
import { CLOUD_SERVICE_DISPLAY_OVERRIDES } from "@/config/cloudServiceDisplay";
import { PROVIDER_LANDING_CONTENT, type ProviderLandingContent } from "@/config/providerLandingContent";
import { ContactHelpSection } from "@/components/contact/ContactHelpSection";
import { ProviderProductCatalog } from "./ProviderProductCatalog";
import { ProviderLandingHero } from "./providerLanding/ProviderLandingHero";
import { ProviderSectionNav } from "./providerLanding/ProviderSectionNav";
import { ProviderLandingFaq } from "./providerLanding/ProviderLandingFaq";
import { ProviderLandingCta } from "./providerLanding/ProviderLandingCta";
import {
  ProviderIntroSection,
  ProviderBenefitsGrid,
  ProviderTrustSection,
  ProviderCategoryGrid,
  ProviderInfoBlock,
  ProviderTierShowcase,
  ProviderAIFeatureGrid,
  ProviderComparisonList,
  ProviderAgedSection,
  ProviderBulkSection,
  ProviderRegionsSection,
  ProviderHowToBuy,
  ProviderServiceOverview,
  ProviderDualListSection,
  ProviderTwoColumnTable,
  ProviderBeforeAfterSection,
  ProviderSafeVsRiskSection,
  ProviderChecklistSection,
  ProviderProductionUseSection,
  ProviderSpecComparison,
  ProviderAccountTypesGrid,
  ProviderAccountTypeDetails,
  ProviderServiceGrid,
  ProviderCreditHighlight,
  ProviderStatGrid,
} from "./providerLanding/ProviderLandingSections";
import { Wallet, Cpu } from "lucide-react";

/**
 * The provider "account" page body — shared by its canonical route
 * (/buy-{Provider}-Account, resolved via the top-level [slug] catch-all) and
 * the legacy /providers/[slug] route, so both render identically with zero
 * duplicated markup/data-fetching logic.
 *
 * Every purchasable account/variation for this provider is shown as one
 * unified, table-style catalog (ProviderProductCatalog) rather than a grid of
 * separate cards — one row per sellable item (each standalone product, and
 * each active variation of a multi-tier product), all inside a single
 * container with dividers between rows. This is the same catalog/data/Buy
 * Now (Telegram order) logic for every provider, unmodified — extended
 * long-form content below never duplicates or replaces it.
 *
 * Providers with an entry in PROVIDER_LANDING_CONTENT (currently only
 * "aws") get the full premium landing-page treatment: dark hero, intro,
 * catalog, then a long sequence of informational/SEO sections, FAQ and a
 * final CTA. This is the same presentation-only "override map keyed by
 * provider.slug" pattern already used by cloudServiceDisplay.ts and
 * providerAccountUrls.ts — nothing here touches the products/providers
 * database, and every other provider page renders exactly as it did before
 * (Breadcrumbs -> catalog -> "need help?" block), completely unaffected.
 */
export async function ProviderDetailView({ provider }: { provider: Provider }) {
  const [{ items }, settings] = await Promise.all([
    getAllSellableItems({ providerSlug: provider.slug, pageSize: 200, sort: "recommended" }),
    getSiteSettings(),
  ]);
  const accountHref = providerHref(provider);
  const displayName = CLOUD_SERVICE_DISPLAY_OVERRIDES[provider.slug]?.displayName ?? provider.name;
  const channels: ContactChannels = {
    telegramUsername: settings.telegram_username,
    whatsappNumber: settings.whatsapp_number,
    telegramChannelUrl: settings.telegram_channel_url,
  };
  const landing = PROVIDER_LANDING_CONTENT[provider.slug];

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Cloud Service", href: "/Cloud-Service" },
    { label: provider.name, href: accountHref },
  ];

  const catalog = (
    <ProviderProductCatalog
      items={items}
      title={`Available ${displayName} Accounts`}
      emptyDescription={`${provider.name} has no active products right now — check back soon.`}
      telegramUsername={settings.telegram_username}
      tone={landing ? "dark" : "light"}
    />
  );

  if (!landing) {
    return (
      <div className="container-page py-10">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="mt-6 mb-8">{catalog}</div>

        <div className="mb-10">
          <ContactHelpSection
            channels={channels}
            title={`Need help choosing your ${displayName} account?`}
            description="Contact us directly and our team will help you pick the right tier."
          />
        </div>

        {/* Page-specific content (overview, benefits, FAQ, etc.) goes here when ready. */}
      </div>
    );
  }

  return (
    <div className="surface-dark relative">
      <div className="bg-grid-pattern absolute inset-0 opacity-20" aria-hidden="true" />
      <div
        className="animate-float pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-accent-blue/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="animate-float-slow pointer-events-none absolute -right-16 top-96 h-80 w-80 rounded-full bg-violet/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="container-page relative pt-6">
        <Breadcrumbs items={breadcrumbItems} tone="dark" />
      </div>

      <div className="container-page relative">
        <ProviderLandingHero content={landing.hero} channels={channels} />
      </div>

      <div className="container-page relative pb-24">
        <ProviderSectionNav items={landing.navItems} />

        <div className="mt-12">
          <ProviderIntroSection content={landing.intro} />
        </div>

        <div id="catalog" className="mt-10 scroll-mt-28">
          {catalog}
        </div>

        <div className="mt-8">
          <ContactHelpSection
            channels={channels}
            title={`Need help choosing your ${displayName} account?`}
            description="Contact us directly and our team will help you pick the right tier."
            tone="dark"
          />
        </div>

        {/* Every entry below is optional per-provider content (see
            providerLandingContent.ts) — a section renders only when this
            provider's entry actually supplies its content, and providers
            render their own explicit `sectionOrder` sequence rather than one
            fixed layout, since e.g. Google Cloud and Azure legitimately want
            "Common Problems" in different relative positions. */}
        <div className="mt-20 flex flex-col gap-20">
          {landing.sectionOrder.map((key) => (
            <Fragment key={key}>{renderLandingSection(key, landing, provider, channels)}</Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Maps a `sectionOrder` key to its rendered section, or null when this
 *  provider's content doesn't include that section. Keeping this as one
 *  lookup (rather than per-provider branching) means adding a new provider
 *  is just a new PROVIDER_LANDING_CONTENT entry + sectionOrder array — no
 *  component or rendering-logic changes. */
function renderLandingSection(key: string, landing: ProviderLandingContent, provider: Provider, channels: ContactChannels) {
  switch (key) {
    case "why-choose":
      return <ProviderBenefitsGrid id="why-choose" content={landing.benefits} />;
    case "trust":
      return <ProviderTrustSection id="trust" content={landing.trust} />;
    case "service-overview":
      return landing.serviceOverview ? <ProviderServiceOverview id="what-is" content={landing.serviceOverview} /> : null;
    case "options":
      return landing.categoryOptions ? <ProviderCategoryGrid id="options" content={landing.categoryOptions} /> : null;
    case "standard":
      return landing.standard ? <ProviderInfoBlock id="standard" content={landing.standard} /> : null;
    case "standard-detail":
      return landing.standardAccountDetail ? (
        <ProviderDualListSection id="standard-detail" content={landing.standardAccountDetail} />
      ) : null;
    case "aged":
      return landing.aged ? <ProviderAgedSection id="aged" content={landing.aged} /> : null;
    case "business":
      return landing.businessAccount ? <ProviderBulkSection id="business" content={landing.businessAccount} /> : null;
    case "credits":
      return landing.credits ? (
        <ProviderTierShowcase id="credits" content={landing.credits} icon={Wallet} iconTile="icon-tile-a" />
      ) : null;
    case "compute":
      return landing.compute ? (
        <ProviderTierShowcase id="compute" content={landing.compute} icon={Cpu} iconTile="icon-tile-b" />
      ) : null;
    case "compare":
      return landing.freeTier ? <ProviderSpecComparison id="compare" content={landing.freeTier} /> : null;
    case "account-types":
      return landing.accountTypesGrid ? (
        <ProviderAccountTypesGrid id="account-types" content={landing.accountTypesGrid} />
      ) : null;
    case "account-type-details":
      return landing.accountTypeDetails ? (
        <ProviderAccountTypeDetails id="account-type-details" content={landing.accountTypeDetails} />
      ) : null;
    case "service-grid":
      return landing.serviceGrid ? <ProviderServiceGrid id="services" content={landing.serviceGrid} /> : null;
    case "credit-highlight":
      return landing.creditHighlight ? (
        <ProviderCreditHighlight id="credit" content={landing.creditHighlight} />
      ) : null;
    case "port25":
      return landing.port25 ? <ProviderServiceOverview id="port25" content={landing.port25} /> : null;
    case "stat-grid":
      return landing.statGrid ? <ProviderStatGrid id="free-tier" content={landing.statGrid} /> : null;
    case "starter":
      return landing.starter ? <ProviderInfoBlock id="starter" content={landing.starter} variant="highlight" /> : null;
    case "pay-as-you-go":
      return landing.payAsYouGo ? (
        <ProviderInfoBlock id="pay-as-you-go" content={landing.payAsYouGo} variant="highlight" />
      ) : null;
    case "high-limits":
      return landing.highLimits ? <ProviderTrustSection id="high-limits" content={landing.highLimits} /> : null;
    case "ai":
      return landing.ai ? <ProviderAIFeatureGrid id="ai" content={landing.ai} /> : null;
    case "ai-variants":
      return landing.aiVariants ? <ProviderComparisonList id="ai-variants" content={landing.aiVariants} /> : null;
    case "bulk":
      return landing.bulk ? <ProviderBulkSection id="bulk" content={landing.bulk} /> : null;
    case "regions":
      return landing.regions ? <ProviderRegionsSection id="regions" content={landing.regions} /> : null;
    case "common-problems":
      return landing.commonProblems ? (
        <ProviderTwoColumnTable
          id="common-problems"
          heading={landing.commonProblems.heading}
          intro={landing.commonProblems.intro}
          columnA="Issue"
          columnB="Impact"
          rows={landing.commonProblems.rows}
          extraParagraph={landing.commonProblems.extraParagraph}
          closing={landing.commonProblems.closing}
        />
      ) : null;
    case "solved-issues":
      return landing.solvedIssues ? <ProviderBeforeAfterSection id="solved-issues" content={landing.solvedIssues} /> : null;
    case "safety":
      return landing.safety ? <ProviderSafeVsRiskSection id="security" content={landing.safety} /> : null;
    case "legitimacy":
      return landing.legitimacyCheck ? (
        <ProviderTwoColumnTable
          id="legitimacy"
          heading={landing.legitimacyCheck.heading}
          columnA={landing.legitimacyCheck.columnA ?? "Check"}
          columnB={landing.legitimacyCheck.columnB ?? "What to Look For"}
          rows={landing.legitimacyCheck.rows}
        />
      ) : null;
    case "how-to-buy":
      return <ProviderHowToBuy id="how-to-buy" content={landing.howToBuy} />;
    case "best-practices":
      return landing.bestPractices ? <ProviderChecklistSection id="best-practices" content={landing.bestPractices} /> : null;
    case "production-use":
      return landing.productionUse ? <ProviderProductionUseSection id="production-use" content={landing.productionUse} /> : null;
    case "faq":
      return <ProviderLandingFaq id="faq" content={landing.faq} providerId={provider.id} />;
    case "final-cta":
      return <ProviderLandingCta content={landing.finalCta} channels={channels} />;
    default:
      return null;
  }
}
