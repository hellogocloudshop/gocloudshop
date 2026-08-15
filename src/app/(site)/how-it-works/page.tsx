import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { HowItWorks } from "@/components/site/HowItWorks";

export const metadata: Metadata = {
  title: "How It Works",
  description: "How ordering a cloud or AI product from GoCloudShop works, step by step.",
  alternates: { canonical: "/how-it-works" },
};

export default function HowItWorksPage() {
  return (
    <div>
      <div className="container-page pt-10">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "How It Works" }]} />
      </div>
      <HowItWorks />
    </div>
  );
}
