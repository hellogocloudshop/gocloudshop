import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/data/settings";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Terms of Service",
  alternates: { canonical: "/terms-of-service" },
};

export default async function TermsOfServicePage() {
  const settings = await getSiteSettings();
  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Terms of Service" }]} />
      <SectionHeading title="Terms of Service" className="mt-4" />
      <div className="prose prose-sm mt-8 max-w-2xl whitespace-pre-line text-ink">
        {settings.terms_of_service ?? "Our terms of service are being finalized. Contact support with any questions before ordering."}
      </div>
    </div>
  );
}
