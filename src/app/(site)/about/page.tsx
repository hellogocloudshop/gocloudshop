import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/data/settings";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "About Us",
  description: "GoCloudShop is a cloud and AI infrastructure marketplace with transparent pricing across multiple providers.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />
      <SectionHeading eyebrow="About" title={`About ${settings.site_name}`} className="mt-4" />

      <div className="prose prose-sm mt-8 max-w-2xl text-ink prose-headings:text-ink prose-a:text-accent-blue">
        <p>
          {settings.site_name} is a cloud and AI infrastructure marketplace. We list cloud accounts, cloud
          credits, AI-ready accounts and compute solutions from multiple providers — each with clear pricing,
          detailed specifications and a straightforward ordering process over Telegram.
        </p>
        <p>
          {settings.disclaimer ?? "Product listings are independent offerings and are not officially endorsed by the referenced cloud providers unless explicitly stated on the listing."}
        </p>
      </div>
    </div>
  );
}
