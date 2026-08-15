import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/data/settings";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Refund Policy",
  alternates: { canonical: "/refund-policy" },
};

export default async function RefundPolicyPage() {
  const settings = await getSiteSettings();
  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Refund Policy" }]} />
      <SectionHeading title="Refund Policy" className="mt-4" />
      <div className="prose prose-sm mt-8 max-w-2xl whitespace-pre-line text-ink">
        {settings.refund_policy ?? "General refund terms are being finalized. Individual product pages list their specific refund policy where configured."}
      </div>
    </div>
  );
}
