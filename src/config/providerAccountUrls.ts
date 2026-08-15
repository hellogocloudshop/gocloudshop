// Public "Buy {Provider} Account" URL generation for cloud-service provider
// pages (e.g. /buy-Aws-Account). This does NOT touch the database — provider
// slugs/IDs/names stay exactly as stored; this only computes the public URL
// segment used for routing, canonical URLs, redirects and internal links.
//
// Deliberately has no dependency on "@/..." path aliases or any Next.js/React
// APIs so it can be safely imported both from application code (src/) and
// from next.config.ts (which resolves modules relatively, not via tsconfig
// path aliases) to build the old-URL redirect list from the same data.

// Explicit overrides for providers whose desired URL segment isn't a
// mechanical transform of their name (e.g. dropping a "Cloud"/".Net" suffix,
// or merging two words with no separating hyphen). Keyed by provider slug.
// A provider with no entry here falls back to defaultPascalSegment() below,
// so newly added providers get a working URL immediately with no code change.
export const PROVIDER_ACCOUNT_URL_SLUGS: Record<string, string> = {
  aws: "Aws",
  "google-cloud": "Google-Cloud",
  azure: "Azure",
  digitalocean: "DigitalOcean",
  "oracle-cloud": "Oracle-Cloud",
  linode: "Linode",
  "ibm-cloud": "Ibm",
  kamatera: "Kamatera",
  "alibaba-cloud": "Alibaba",
  "atlantic-net": "Atlantic",
};

type ProviderLike = { slug: string; name: string };

function defaultPascalSegment(name: string): string {
  return name
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("-");
}

export function providerAccountUrlSegment(provider: ProviderLike): string {
  return PROVIDER_ACCOUNT_URL_SLUGS[provider.slug] ?? defaultPascalSegment(provider.name);
}

/** Canonical public URL for a provider's "Buy {Provider} Account" page. */
export function providerAccountHref(provider: ProviderLike): string {
  return `/buy-${providerAccountUrlSegment(provider)}-Account`;
}

/** Cheap pre-check so the top-level [slug] catch-all only bothers resolving
 *  against the provider list when the requested slug actually looks like a
 *  "buy-*-Account" URL (avoids an extra query for every other page). */
export function looksLikeProviderAccountSlug(slug: string): boolean {
  return /^buy-.+-Account$/.test(slug);
}

/** Finds the provider (from an already-fetched list) whose computed account
 *  URL matches the given top-level slug, e.g. "buy-Aws-Account". */
export function findProviderByAccountSlug<T extends ProviderLike>(providers: T[], slug: string): T | undefined {
  const target = `/${slug}`;
  return providers.find((p) => providerAccountHref(p) === target);
}
