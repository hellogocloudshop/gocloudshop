import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { getSiteSettings } from "@/lib/data/settings";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gocloudshop.com";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = settings.default_seo?.title ?? `${settings.site_name} — ${settings.tagline}`;
  const description =
    settings.default_seo?.description ??
    "Explore cloud accounts, AI-ready infrastructure, cloud credits and compute solutions from multiple providers — with clear pricing, detailed specifications and responsive support.";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s | ${settings.site_name}`,
    },
    description,
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName: settings.site_name,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    // Google Search Console ownership verification. Set once here at the
    // root — Next.js merges metadata up the tree, so this renders exactly
    // one <meta name="google-site-verification"> tag in <head> on every
    // page; no child route defines this field, so it can never be
    // overridden or duplicated.
    verification: {
      google: "cBUTWjqrY33M87t2VN6WZfwuN_XxKrnbSsWl64yknoM",
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.site_name,
    url: siteUrl,
    description: settings.tagline,
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings.site_name,
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en">
      <body className={`${inter.variable} ${geistMono.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        {children}
      </body>
    </html>
  );
}
