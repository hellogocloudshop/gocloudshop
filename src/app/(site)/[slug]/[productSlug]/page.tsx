import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/lib/data/categories";
import { getProviderCategoryPageBySlug } from "@/lib/data/providerPages";
import { getProductBySlug, getRelatedProducts } from "@/lib/data/products";
import { getFaqsByProduct, getGlobalFaqs } from "@/lib/data/faqs";
import { getSiteSettings } from "@/lib/data/settings";
import { effectivePrice, productHref } from "@/lib/utils";
import type { ContactChannels } from "@/lib/contact";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProductBadge, AvailabilityBadge } from "@/components/ui/Badge";
import { ProductImage } from "@/components/ui/SmartImage";
import { ContactHelpSection } from "@/components/contact/ContactHelpSection";
import { VariationSelector } from "@/components/site/VariationSelector";
import { WhatsIncluded } from "@/components/site/WhatsIncluded";
import { BeforeYouOrder } from "@/components/site/BeforeYouOrder";
import { RelatedProducts } from "@/components/site/RelatedProducts";
import { FaqAccordion } from "@/components/site/FaqAccordion";

async function resolveParentTitle(slug: string): Promise<string | null> {
  const category = await getCategoryBySlug(slug);
  if (category) return category.name;
  const providerPage = await getProviderCategoryPageBySlug(slug);
  return providerPage?.title ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; productSlug: string }>;
}): Promise<Metadata> {
  const { productSlug } = await params;
  const product = await getProductBySlug(productSlug);
  if (!product) return {};

  const title = product.seo_title ?? `${product.name} | ${product.provider?.name ?? "GoCloudShop"}`;
  const description = product.seo_description ?? product.short_description ?? undefined;
  const canonical = productHref(product);

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      images: product.og_image_url ? [product.og_image_url] : undefined,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string; productSlug: string }>;
}) {
  const { slug, productSlug } = await params;

  const [parentTitle, product, settings] = await Promise.all([
    resolveParentTitle(slug),
    getProductBySlug(productSlug),
    getSiteSettings(),
  ]);

  if (!parentTitle || !product) notFound();

  const variations = product.variations ?? [];
  const { price, currency } = effectivePrice(product, variations);
  const channels: ContactChannels = {
    telegramUsername: settings.telegram_username,
    whatsappNumber: settings.whatsapp_number,
    telegramChannelUrl: settings.telegram_channel_url,
  };
  const [productFaqs, globalFaqs, relatedProducts] = await Promise.all([
    getFaqsByProduct(product.id),
    getGlobalFaqs(),
    getRelatedProducts(product, 4),
  ]);
  const faqs = productFaqs.length > 0 ? productFaqs : globalFaqs.slice(0, 5);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.short_description ?? product.description ?? undefined,
    brand: product.provider ? { "@type": "Brand", name: product.provider.name } : undefined,
    offers:
      price !== null
        ? {
            "@type": "Offer",
            price,
            priceCurrency: currency,
            availability:
              product.availability === "in_stock"
                ? "https://schema.org/InStock"
                : product.availability === "out_of_stock"
                  ? "https://schema.org/OutOfStock"
                  : "https://schema.org/LimitedAvailability",
            url: productHref(product),
          }
        : undefined,
  };

  return (
    <div className="container-page py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: parentTitle, href: `/${slug}` },
          { label: product.name },
        ]}
      />

      <div className="mt-6 grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <ProductImage
            name={product.name}
            imageUrl={product.image_url}
            fallbackLabel={product.provider?.name ?? product.name}
            className="aspect-square w-full"
          />
          {product.description && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-ink">Overview</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-muted">{product.description}</p>
            </div>
          )}
          <div className="mt-8">
            <WhatsIncluded items={product.whats_included} />
          </div>
          <div className="mt-8">
            <BeforeYouOrder product={product} />
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-ink-muted">{product.provider?.name}</p>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">{product.name}</h1>
            {product.badge && <ProductBadge badge={product.badge} />}
          </div>
          {product.short_description && <p className="mt-2 text-ink-muted">{product.short_description}</p>}
          <div className="mt-2">
            <AvailabilityBadge status={product.availability} />
          </div>

          <div className="mt-6">
            <VariationSelector product={product} variations={variations} />
          </div>

          <div className="mt-6">
            <ContactHelpSection
              channels={channels}
              title="Need help choosing this account?"
              description="Have a question before you order? Reach our team directly."
            />
          </div>
        </div>
      </div>

      {faqs.length > 0 && (
        <section className="mt-16 max-w-3xl">
          <h2 className="text-xl font-bold text-ink">FAQ</h2>
          <div className="mt-4">
            <FaqAccordion faqs={faqs} />
          </div>
        </section>
      )}

      <RelatedProducts products={relatedProducts} />
    </div>
  );
}
