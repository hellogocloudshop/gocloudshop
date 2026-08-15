import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/data/settings";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Privacy Policy",
  alternates: { canonical: "/privacy-policy" },
};

export default async function PrivacyPolicyPage() {
  const settings = await getSiteSettings();
  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />
      <SectionHeading title="Privacy Policy" className="mt-4" />
      <div className="prose prose-sm mt-8 max-w-2xl whitespace-pre-line text-ink">
        {settings.privacy_policy ?? "Our privacy policy is being finalized. Contact support with any questions about how your information is handled."}
      </div>
    </div>
  );
}
