import type { Metadata } from "next";
import Link from "next/link";
import { getAiProducts } from "@/lib/data/products";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductGrid } from "@/components/site/ProductGrid";
import { AI_CLOUD_MENU } from "@/config/nav";

export const metadata: Metadata = {
  title: "AI Cloud",
  description: "AI-ready cloud accounts, AI/ML infrastructure, GPU Cloud and Generative AI solutions.",
  alternates: { canonical: "/ai-cloud" },
};

export default async function AiCloudPage() {
  const products = await getAiProducts(24);

  return (
    <div className="surface-dark relative">
      <div className="bg-grid-pattern absolute inset-0 opacity-20" aria-hidden="true" />
      <div className="container-page relative py-10">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "AI Cloud" }]} />
        <SectionHeading
          eyebrow="AI Cloud"
          title="AI-Ready Cloud Accounts & Infrastructure"
          subtitle="Explore AI Cloud accounts, AI/ML infrastructure, GPU Cloud and Generative AI solutions for development, experimentation and production workloads."
          tone="dark"
          className="mt-4"
        />

        <div className="mt-6 flex flex-wrap gap-2">
          {AI_CLOUD_MENU.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="mt-10">
          <ProductGrid
            products={products}
            tone="dark"
            emptyTitle="No AI products active right now."
            emptyDescription="Check back soon, or contact support for current AI Cloud availability."
          />
        </div>
      </div>
    </div>
  );
}
