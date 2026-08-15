import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/data/settings";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Disclaimer",
  alternates: { canonical: "/disclaimer" },
};

export default async function DisclaimerPage() {
  const settings = await getSiteSettings();
  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Disclaimer" }]} />
      <SectionHeading title="Disclaimer" className="mt-4" />
      <div className="prose prose-sm mt-8 max-w-2xl whitespace-pre-line text-ink">
        {settings.disclaimer ?? "GoCloudShop is an independent marketplace. Product listings are not officially endorsed by the referenced cloud providers unless explicitly stated."}
      </div>
    </div>
  );
}
