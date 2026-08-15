import type { NextConfig } from "next";
// Relative imports only — next.config.ts resolves modules relatively, not
// via the "@/" tsconfig path alias used elsewhere in the app.
import { mockProviders } from "./src/lib/mock-data";
import { providerAccountHref } from "./src/config/providerAccountUrls";

// Redirects every known provider's legacy /providers/{slug} URL to its new
// canonical /buy-{Provider}-Account URL. Built from the same provider list
// and URL-generation helper the live app uses, so there's one source of
// truth for the mapping — but because next.config.ts redirects are static,
// a provider added purely through the admin dashboard after the last deploy
// won't get its old-URL redirect until the next deploy (its NEW canonical
// /buy-{Provider}-Account URL, however, works immediately — see the [slug]
// catch-all route, which resolves providers dynamically at request time).
const providerAccountRedirects = mockProviders.map((provider) => ({
  source: `/providers/${provider.slug}`,
  destination: providerAccountHref(provider),
  permanent: true,
}));

const nextConfig: NextConfig = {
  images: {
    // Provider logos / product images are admin-entered URLs (Supabase
    // Storage or any external host), so remote patterns can't be narrowed
    // to a fixed list of domains.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  async redirects() {
    return [
      // The provider listing/index page was renamed to Cloud Service.
      // Scoped to the exact path only — /providers/[slug] individual
      // provider pages are untouched and keep working at their existing URLs.
      // (Next.js matches redirect paths case-insensitively, so this alone
      // also covers /Providers, /PROVIDERS, etc. — no separate rule needed,
      // and adding a same-target "/cloud-service" rule would self-redirect
      // "/Cloud-Service" into an infinite loop against its own route.)
      {
        source: "/providers",
        destination: "/Cloud-Service",
        permanent: true,
      },
      // The comparison hub/index page was renamed to Choose. Scoped to the
      // exact path only — /compare/[slug] individual comparison pages
      // (e.g. /compare/aws-vs-azure) are untouched and keep working at
      // their existing URLs.
      {
        source: "/compare",
        destination: "/choose",
        permanent: true,
      },
      // Individual provider "Buy Account" pages moved from /providers/{slug}
      // to /buy-{Provider}-Account. /providers/[slug] itself keeps working
      // as a live fallback route (see src/app/(site)/providers/[slug]/page.tsx)
      // for any provider not covered here yet.
      ...providerAccountRedirects,
    ];
  },
};

export default nextConfig;
