import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import type { Product } from "@/lib/types";
import { effectivePrice, formatPrice, productHref } from "@/lib/utils";
import { AvailabilityBadge, ProductBadge } from "@/components/ui/Badge";
import { ProviderLogo } from "@/components/ui/SmartImage";
import { HERO_CONTENT } from "@/config/homepageContent";

export function Hero({ featuredProduct }: { featuredProduct: Product | null }) {
  const variations = featuredProduct?.variations ?? [];
  const price = featuredProduct ? effectivePrice(featuredProduct, variations) : null;

  return (
    <section className="surface-dark relative">
      <div className="bg-grid-pattern absolute inset-0 opacity-30" aria-hidden="true" />
      <div
        className="animate-float pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-accent-blue/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="animate-float-slow pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-violet/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="container-page relative grid gap-12 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-28">
        <div className="animate-fade-up">
          <p className="section-eyebrow text-sky-accent">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> {HERO_CONTENT.eyebrow}
          </p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Go Cloud Shop – Cloud Access. <span className="text-gradient-premium">Simplified.</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg font-medium leading-relaxed text-white/85">{HERO_CONTENT.subheading}</p>
          {HERO_CONTENT.paragraphs.map((paragraph) => (
            <p key={paragraph} className="mt-4 max-w-xl leading-relaxed text-white/70">
              {paragraph}
            </p>
          ))}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/cloud-accounts" className="btn-primary">
              Browse Cloud Accounts <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/ai-cloud"
              className="btn-secondary !border-white/15 !bg-white/5 !text-white hover:!bg-white/10"
            >
              Explore AI Cloud
            </Link>
          </div>
        </div>

        {featuredProduct && (
          <div className="animate-fade-up card-premium mx-auto w-full max-w-sm" style={{ animationDelay: "150ms" }}>
            <div className="card-premium-inner p-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-sky-accent">Featured Product</span>
                {featuredProduct.badge && <ProductBadge badge={featuredProduct.badge} />}
              </div>
              <div className="mt-4 flex items-center gap-3">
                <ProviderLogo
                  name={featuredProduct.provider?.name ?? featuredProduct.name}
                  logoUrl={featuredProduct.provider_logo_override_url ?? featuredProduct.provider?.logo_url}
                  className="h-11 w-11 text-sm"
                />
                <div>
                  <p className="text-sm font-medium text-white/60">{featuredProduct.provider?.name}</p>
                  <p className="font-semibold text-white">{featuredProduct.name}</p>
                </div>
              </div>
              <p className="mt-4 text-3xl font-extrabold text-white">
                {price?.price !== null && price?.price !== undefined ? formatPrice(price.price, price.currency) : "Contact us"}
              </p>
              {featuredProduct.region && (
                <div className="mt-4 flex items-center justify-between text-sm text-white/60">
                  <span>Region</span>
                  <span className="text-white">{featuredProduct.region}</span>
                </div>
              )}
              <div className="mt-2 flex items-center justify-between text-sm text-white/60">
                <span>Availability</span>
                <AvailabilityBadge status={featuredProduct.availability} />
              </div>
              <Link
                href={productHref(featuredProduct)}
                className="btn-primary mt-6 w-full justify-center"
              >
                View Details <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
