import type { Metadata } from "next";
import { PackageSearch } from "lucide-react";
import { getStockUpdates } from "@/lib/data/guides";
import { getSiteSettings } from "@/lib/data/settings";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { StockUpdateCard } from "@/components/site/StockUpdateCard";

export const metadata: Metadata = {
  title: "Stock Updates",
  description: "Dated stock-availability announcements for premium cloud and AI accounts as new batches are confirmed.",
  alternates: { canonical: "/stock-updates" },
};

export default async function StockUpdatesPage() {
  const [updates, settings] = await Promise.all([getStockUpdates(), getSiteSettings()]);

  return (
    <div className="section-mesh-blue">
      <div className="container-page py-10">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Stock Updates" }]} tone="dark" />
        <div className="mt-4 flex items-start gap-4">
          <span className="icon-tile icon-tile-a hidden sm:flex">
            <PackageSearch className="h-5 w-5" aria-hidden="true" />
          </span>
          <SectionHeading
            eyebrow="Live Availability"
            title="Stock Updates"
            subtitle="Dated announcements as new premium account batches are confirmed and go into stock — updated regularly by our team."
            tone="dark"
          />
        </div>

        <div className="mt-8">
          {updates.length === 0 ? (
            <EmptyState
              title="No stock updates posted yet."
              description="Check back soon, or contact us directly for current availability."
              className="border-white/10 bg-white/[0.03]"
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {updates.map((update) => (
                <StockUpdateCard key={update.id} update={update} telegramUsername={settings.telegram_username} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
