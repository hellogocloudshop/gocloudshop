// Navigational structure (labels + link targets) for the header mega menu,
// AI Cloud dropdown and footer. This is UI copy, not product data — every
// link below resolves to a category, provider-category combo, or content
// page whose actual content (name, price, description, SEO) is fully
// database-driven and admin-editable.

import { PROVIDER_ACCOUNT_URL_SLUGS } from "./providerAccountUrls";

export interface NavLink {
  label: string;
  href: string;
  icon?: string;
}

export interface NavGroup {
  title: string;
  links: NavLink[];
}

// Shared source of truth for provider "Buy Account" URLs (e.g.
// /buy-Aws-Account) — see providerAccountUrls.ts for how each segment is
// derived. Used below so the footer's hand-curated provider list never
// drifts from the URLs the rest of the app generates.
const buyAccountHref = (providerSlug: keyof typeof PROVIDER_ACCOUNT_URL_SLUGS) =>
  `/buy-${PROVIDER_ACCOUNT_URL_SLUGS[providerSlug]}-Account`;

// Header main navigation — exact labels/order/routes as specified for the
// header redesign. "Providers" was renamed to "Cloud Service"
// (/Cloud-Service) and "Compare" was renamed to "Choose" (/choose) — the old
// /providers and /compare paths permanently redirect to their new canonical
// URLs (see next.config.ts). Individual comparison pages (e.g.
// /compare/aws-vs-azure) were not moved. "Use Cases" and "Guides" stay out
// of the header (still fully intact, linked from the Footer instead — see
// FOOTER_COLUMNS below). "Contact Us" moved here (from the header's top
// utility row — see ContactBar.tsx) so it renders with the exact same
// styling/active-state as every other nav item, with no separate markup.
export const MAIN_NAV: NavLink[] = [
  { label: "All Products", href: "/all-products" },
  { label: "Cloud Service", href: "/Cloud-Service" },
  { label: "Stock Updates", href: "/stock-updates" },
  { label: "Cloud Credits", href: "/cloud-credits" },
  { label: "AI Cloud", href: "/ai-cloud" },
  { label: "Choose", href: "/choose" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact Us", href: "/contact" },
];

/**
 * Permanent (not just active-state) accent color for exactly two header nav
 * items — presentation-only, keyed by href, same override-map pattern as
 * homepageProviderCopy.ts. Every other nav item keeps its plain neutral
 * styling; only entries listed here get a persistent tint + their own
 * hover/active treatment (see Header.tsx). Cloud Service uses the site's
 * existing cyan/blue brand accent; Stock Updates uses emerald/green (the
 * same "available" color already used by AvailabilityBadge elsewhere), so
 * the two are always visually distinct from each other and from the rest of
 * the nav.
 */
export const NAV_ACCENTS: Record<string, { text: string; hoverBg: string; underline: string; glow: string }> = {
  "/Cloud-Service": {
    text: "text-sky-accent",
    hoverBg: "hover:bg-sky-accent/10",
    underline: "bg-gradient-to-r from-sky-accent to-accent-blue",
    glow: "shadow-[0_0_12px_rgb(6_182_212_/_0.65)]",
  },
  "/stock-updates": {
    text: "text-emerald-400",
    hoverBg: "hover:bg-emerald-400/10",
    underline: "bg-gradient-to-r from-emerald-400 to-emerald-300",
    glow: "shadow-[0_0_12px_rgb(52_211_153_/_0.65)]",
  },
};

/**
 * Permanent premium accent color for exactly eight specific Footer links —
 * presentation-only, same override-map pattern as NAV_ACCENTS above. Keyed
 * by "label::href" (not href alone) since a couple of these hrefs are
 * intentionally shared by a second, differently-labeled link elsewhere in
 * the Footer (e.g. "Contact" and "Support" both -> /contact) that must stay
 * unstyled — keying on the exact label+href pair targets only the requested
 * link, never its href-twin. Every other Footer link keeps its existing
 * plain `text-ink-muted` styling untouched (see Footer.tsx).
 */
export const FOOTER_LINK_ACCENTS: Record<string, { text: string; glow: string }> = {
  "All Products::/all-products": { text: "text-accent-blue", glow: "hover:drop-shadow-[0_0_6px_rgb(59_130_246_/_0.6)]" },
  "Cloud Service::/Cloud-Service": { text: "text-sky-accent", glow: "hover:drop-shadow-[0_0_6px_rgb(6_182_212_/_0.6)]" },
  "AWS::/buy-Aws-Account": { text: "text-amber-400", glow: "hover:drop-shadow-[0_0_6px_rgb(251_191_36_/_0.6)]" },
  "DigitalOcean::/buy-DigitalOcean-Account": { text: "text-sky-400", glow: "hover:drop-shadow-[0_0_6px_rgb(56_189_248_/_0.6)]" },
  "AI Cloud::/ai-cloud": { text: "text-violet-400", glow: "hover:drop-shadow-[0_0_6px_rgb(167_139_250_/_0.6)]" },
  "AWS AI Cloud::/aws-ai": { text: "text-fuchsia-400", glow: "hover:drop-shadow-[0_0_6px_rgb(232_121_249_/_0.6)]" },
  "Cloud Credits::/cloud-credits": { text: "text-yellow-300", glow: "hover:drop-shadow-[0_0_6px_rgb(253_224_71_/_0.6)]" },
  "Contact::/contact": { text: "text-emerald-400", glow: "hover:drop-shadow-[0_0_6px_rgb(52_211_153_/_0.6)]" },
};

export const PRODUCTS_MEGA_MENU: NavGroup[] = [
  {
    title: "Cloud Accounts",
    links: [
      { label: "All Cloud Accounts", href: "/cloud-accounts", icon: "Cloud" },
      { label: "Compute Accounts", href: "/compute", icon: "Server" },
      { label: "Free Trial Accounts", href: "/free-trials", icon: "Gift" },
      { label: "Pay-As-You-Go Accounts", href: "/pay-as-you-go", icon: "Wallet" },
      { label: "AWS Accounts", href: "/aws-accounts", icon: "Cloud" },
      { label: "DigitalOcean Accounts", href: "/digitalocean-accounts", icon: "Cloud" },
    ],
  },
  {
    title: "Cloud Credits",
    links: [
      { label: "All Cloud Credits", href: "/cloud-credits", icon: "Coins" },
      { label: "AWS Credits", href: "/aws-credits", icon: "Coins" },
      { label: "Google Cloud Credits", href: "/google-cloud-credits", icon: "Coins" },
      { label: "Azure Credits", href: "/azure-credits", icon: "Coins" },
    ],
  },
  {
    title: "AI Cloud",
    links: [
      { label: "All AI Cloud", href: "/ai-cloud", icon: "Sparkles" },
      { label: "AI/ML Infrastructure", href: "/ai-ml", icon: "BrainCircuit" },
      { label: "GPU Cloud", href: "/gpu-cloud", icon: "Cpu" },
      { label: "AWS AI Cloud", href: "/aws-ai", icon: "Sparkles" },
      { label: "Google Cloud AI", href: "/google-cloud-ai", icon: "Sparkles" },
      { label: "Azure AI", href: "/azure-ai", icon: "Sparkles" },
    ],
  },
  {
    title: "Infrastructure",
    links: [
      { label: "Compute", href: "/compute", icon: "Server" },
      { label: "Enterprise", href: "/enterprise", icon: "Building2" },
      { label: "Oracle Cloud Accounts", href: "/oracle-cloud-accounts", icon: "Cloud" },
      { label: "Linode Accounts", href: "/linode-accounts", icon: "Cloud" },
    ],
  },
];

export const AI_CLOUD_MENU: NavLink[] = [
  { label: "All AI Cloud", href: "/ai-cloud" },
  { label: "AWS AI Cloud", href: "/aws-ai" },
  { label: "Google Cloud AI", href: "/google-cloud-ai" },
  { label: "Azure AI", href: "/azure-ai" },
  { label: "AI/ML", href: "/ai-ml" },
  { label: "GPU Cloud", href: "/gpu-cloud" },
];

export const FOOTER_COLUMNS: NavGroup[] = [
  {
    title: "Products",
    links: [
      { label: "All Products", href: "/all-products" },
      { label: "Browse Products", href: "/products" },
      { label: "Cloud Accounts", href: "/cloud-accounts" },
      { label: "Cloud Credits", href: "/cloud-credits" },
      { label: "AI Cloud", href: "/ai-cloud" },
      { label: "AI/ML", href: "/ai-ml" },
      { label: "GPU Cloud", href: "/gpu-cloud" },
      { label: "Compute", href: "/compute" },
      { label: "Free Trials", href: "/free-trials" },
      { label: "Pay-As-You-Go", href: "/pay-as-you-go" },
      { label: "Enterprise", href: "/enterprise" },
    ],
  },
  {
    title: "Cloud Service",
    links: [
      { label: "Cloud Service", href: "/Cloud-Service" },
      { label: "AWS", href: buyAccountHref("aws") },
      { label: "Google Cloud", href: buyAccountHref("google-cloud") },
      { label: "Microsoft Azure", href: buyAccountHref("azure") },
      { label: "DigitalOcean", href: buyAccountHref("digitalocean") },
      { label: "Oracle Cloud", href: buyAccountHref("oracle-cloud") },
      { label: "Linode", href: buyAccountHref("linode") },
      { label: "IBM Cloud", href: buyAccountHref("ibm-cloud") },
      { label: "Kamatera", href: buyAccountHref("kamatera") },
      { label: "Alibaba Cloud", href: buyAccountHref("alibaba-cloud") },
    ],
  },
  {
    title: "AI Cloud",
    links: [
      { label: "AI Cloud", href: "/ai-cloud" },
      { label: "AI Cloud Accounts", href: "/ai-cloud" },
      { label: "AI/ML Infrastructure", href: "/ai-ml" },
      { label: "GPU Cloud", href: "/gpu-cloud" },
      { label: "AWS AI Cloud", href: "/aws-ai" },
      { label: "Google Cloud AI", href: "/google-cloud-ai" },
      { label: "Azure AI", href: "/azure-ai" },
    ],
  },
  {
    title: "Compare",
    links: [
      { label: "AWS vs Google Cloud", href: "/compare/aws-vs-google-cloud" },
      { label: "AWS vs Azure", href: "/compare/aws-vs-azure" },
      { label: "AWS vs DigitalOcean", href: "/compare/aws-vs-digitalocean" },
      { label: "Google Cloud vs Azure", href: "/compare/google-cloud-vs-azure" },
      { label: "DigitalOcean vs Linode", href: "/compare/digitalocean-vs-linode" },
      { label: "Oracle Cloud vs AWS", href: "/compare/oracle-cloud-vs-aws" },
      { label: "IBM Cloud vs AWS", href: "/compare/ibm-cloud-vs-aws" },
      { label: "AI Cloud Comparison", href: "/compare/ai-cloud-providers" },
      { label: "GPU Cloud Comparison", href: "/compare/gpu-cloud-providers" },
      { label: "Cloud Credit Comparison", href: "/compare/cloud-credit-comparison" },
    ],
  },
  {
    title: "Use Cases",
    links: [
      { label: "Use Cases", href: "/use-cases" },
      { label: "AI & Machine Learning", href: "/use-cases/ai-machine-learning" },
      { label: "Generative AI", href: "/use-cases/generative-ai" },
      { label: "SaaS", href: "/use-cases/saas" },
      { label: "Web Hosting", href: "/use-cases/web-hosting" },
      { label: "Kubernetes", href: "/use-cases/kubernetes" },
      { label: "DevOps", href: "/use-cases/devops" },
      { label: "Data Engineering", href: "/use-cases/data-engineering" },
      { label: "Data Analytics", href: "/use-cases/data-analytics" },
      { label: "GPU Computing", href: "/use-cases/gpu-computing" },
      { label: "Startups", href: "/use-cases/startup-infrastructure" },
      { label: "Enterprise", href: "/use-cases/enterprise-infrastructure" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Stock Updates", href: "/stock-updates" },
      { label: "Cloud Buying Guide", href: "/guides/cloud-account-buying-guide" },
      { label: "AI Cloud Guide", href: "/guides/ai-cloud-guide" },
      { label: "Cloud Credit Guide", href: "/guides/cloud-credit-buying-guide" },
      { label: "GPU Cloud Guide", href: "/guides/gpu-cloud-guide" },
      { label: "Provider Guides", href: "/guides/cloud-provider-guide" },
      { label: "Cloud Comparisons", href: "/choose" },
      { label: "Guides", href: "/guides" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "Support", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms-of-service" },
      { label: "Refund Policy", href: "/refund-policy" },
      { label: "Disclaimer", href: "/disclaimer" },
    ],
  },
];
