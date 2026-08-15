// Presentation-only display overrides for the /Cloud-Service marketplace
// cards. These do NOT touch the database — providers.name stays exactly as
// stored (used everywhere else: admin, breadcrumbs on the provider detail
// page, product cards, SEO, etc.). This map only substitutes the *visible*
// identity label and "Buy ..." CTA wording on the Cloud Service cards for
// providers that need marketing copy different from their literal DB name
// (e.g. an abbreviation, or a singular vs. plural CTA). Keyed by the stable
// provider slug. A provider with no entry here falls back to the standard
// dynamic "Buy {provider.name} Accounts" pattern — nothing needs to be added
// here for new providers unless their default wording needs a manual tweak.
export const CLOUD_SERVICE_DISPLAY_OVERRIDES: Record<string, { displayName?: string; buyLabel?: string }> = {
  aws: { displayName: "Amazon AWS", buyLabel: "Buy AWS Account" },
  "atlantic-net": { displayName: "Atlantic", buyLabel: "Buy Atlantic Accounts" },
};
