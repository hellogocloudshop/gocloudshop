import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProviderBySlug } from "@/lib/data/providers";
import { providerHref } from "@/lib/utils";
import { ProviderDetailView } from "@/components/site/ProviderDetailView";

// Legacy route, kept working (not deleted) for any provider not yet covered
// by the static /providers/:slug -> /buy-{Provider}-Account redirects in
// next.config.ts (e.g. a brand-new provider added after the last deploy).
// For every currently known provider this route is unreachable in normal
// browsing since the config-level redirect intercepts first — but its
// canonical metadata still points at the new URL either way, so there's no
// duplicate-content risk if it's ever hit directly.
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const provider = await getProviderBySlug(slug);
  if (!provider) return {};
  const canonical = providerHref(provider);
  return {
    title: provider.seo_title ?? `${provider.name} Cloud Accounts & Credits`,
    description: provider.seo_description ?? provider.description ?? undefined,
    alternates: { canonical },
    openGraph: { url: canonical },
  };
}

export default async function ProviderDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const provider = await getProviderBySlug(slug);
  if (!provider || !provider.is_active) notFound();

  return <ProviderDetailView provider={provider} />;
}
