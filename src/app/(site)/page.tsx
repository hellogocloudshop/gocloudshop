import type { Metadata } from "next";
import { getProducts, getFeaturedProducts, getAiProducts, getProviderCatalogSummaries } from "@/lib/data/products";
import { getProviders } from "@/lib/data/providers";
import { getUseCases } from "@/lib/data/useCases";
import { getComparisons } from "@/lib/data/comparisons";
import { getApprovedReviews } from "@/lib/data/reviews";
import { getSiteSettings } from "@/lib/data/settings";

import { Hero } from "@/components/site/Hero";
import { TrustIndicators } from "@/components/site/TrustIndicators";
import { ProvidersGridSection } from "@/components/site/ProvidersGridSection";
import { CategoryTabsPreview } from "@/components/site/CategoryTabsPreview";
import { FeaturedProductsSection } from "@/components/site/FeaturedProductsSection";
import { AICloudSection } from "@/components/site/AICloudSection";
import { WhyChooseSection } from "@/components/site/WhyChooseSection";
import { ChooseRightPlatform } from "@/components/site/ChooseRightPlatform";
import { AvailableAccountOptions } from "@/components/site/AvailableAccountOptions";
import { UseCasesPreview } from "@/components/site/UseCasesPreview";
import { ComparePreview } from "@/components/site/ComparePreview";
import { HowItWorks } from "@/components/site/HowItWorks";
import { ReviewsSection } from "@/components/site/ReviewsSection";
import { HomepageFaqSection } from "@/components/site/HomepageFaqSection";
import { ContactCta } from "@/components/site/ContactCta";
import { HomepageDisclaimer } from "@/components/site/HomepageDisclaimer";
import { Newsletter } from "@/components/site/Newsletter";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { ContactChannels } from "@/lib/contact";

export const metadata: Metadata = {
  title: { absolute: "Go Cloud Shop – Buy Cloud Accounts, AI Infrastructure & Cloud Credits" },
  description:
    "Go Cloud Shop is a cloud marketplace for cloud accounts, AI infrastructure, cloud credits, compute resources, and solutions from leading cloud providers.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [
    { products: marketplaceProducts },
    featuredProducts,
    aiProducts,
    useCases,
    comparisons,
    reviews,
    settings,
    providers,
    providerSummaries,
  ] = await Promise.all([
    getProducts({ pageSize: 40 }),
    getFeaturedProducts(8),
    getAiProducts(8),
    getUseCases(),
    getComparisons(),
    getApprovedReviews({ limit: 6 }),
    getSiteSettings(),
    getProviders(),
    getProviderCatalogSummaries(),
  ]);

  const heroProduct = featuredProducts[0] ?? marketplaceProducts[0] ?? null;
  const channels: ContactChannels = {
    telegramUsername: settings.telegram_username,
    whatsappNumber: settings.whatsapp_number,
    telegramChannelUrl: settings.telegram_channel_url,
  };

  return (
    <>
      {/* 1. Hero — "Go Cloud Shop – Cloud Access. Simplified." */}
      <Hero featuredProduct={heroProduct} />

      {/* 2. Trust / value proposition */}
      <TrustIndicators />

      {/* 3. Cloud Account Categories (full provider marketing copy) */}
      <ProvidersGridSection providers={providers} summaries={providerSummaries} />

      {/* 4. Why Choose Our Cloud Accounts */}
      <WhyChooseSection />

      {/* 5. Choose the Right Cloud Platform (educational comparison copy) */}
      <ChooseRightPlatform />

      {/* 6. Available Account Options (account-type catalog copy) */}
      <AvailableAccountOptions />

      {/* 7. Featured Products (dynamic, DB-driven — see is_featured flags) */}
      <FeaturedProductsSection products={featuredProducts} />

      <section className="container-page py-16 sm:py-20">
        <SectionHeading
          eyebrow="Marketplace"
          title="Cloud & AI Products"
          subtitle="Find the right cloud account, credit package, AI solution or infrastructure for your project."
          align="center"
          className="mx-auto"
        />
        <div className="mt-10">
          <CategoryTabsPreview products={marketplaceProducts} />
        </div>
      </section>

      {/* 8. AI Infrastructure ("Power Your AI Projects") */}
      <AICloudSection products={aiProducts} />

      {/* 9. Built for Every Workload */}
      <UseCasesPreview useCases={useCases} />

      {/* 10. How Go Cloud Shop Works */}
      <HowItWorks />

      {/* 11. Compare Providers & Products */}
      <ComparePreview comparisons={comparisons} />

      <ReviewsSection reviews={reviews} />

      {/* 12. FAQ */}
      <HomepageFaqSection />

      {/* 13. Final CTA — "Ready to Explore Cloud Accounts?" */}
      <ContactCta channels={channels} />

      <Newsletter />

      {/* 14. Disclaimer (above the Footer, which the layout renders next) */}
      <HomepageDisclaimer />
    </>
  );
}
