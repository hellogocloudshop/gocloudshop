import { CalendarDays, Check } from "lucide-react";
import type { Guide } from "@/lib/types";
import { formatDate, formatPrice } from "@/lib/utils";
import { AvailabilityBadge, ProductBadge } from "@/components/ui/Badge";
import { ProviderLogo } from "@/components/ui/SmartImage";
import { TelegramOrderButton } from "@/components/site/TelegramOrderButton";

/**
 * A dated stock-availability announcement — reuses the `guides` content type
 * (guide_type: "stock_update") rather than a second product/content system,
 * so this component is fully data-driven off whatever guides are in the DB.
 * Never hardcode a stock update here; new entries are just new rows.
 */
export function StockUpdateCard({ update, telegramUsername }: { update: Guide; telegramUsername: string }) {
  const features = (update.content ?? "")
    .split("\n")
    .filter((line) => line.trim().startsWith("- "))
    .map((line) => line.trim().replace(/^-\s*/, ""))
    .slice(0, 4);
  const premiumTag = update.tags.find((t) => /premium/i.test(t));

  return (
    <article className="card-surface-hover group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition-all duration-300 hover:border-accent-blue/40">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <ProviderLogo
            name={update.related_provider?.name ?? update.title}
            logoUrl={update.related_provider?.logo_url}
            className="h-10 w-10 text-xs"
          />
          <div>
            <p className="text-xs font-medium text-white/60">{update.related_provider?.name ?? "GoCloudShop"}</p>
            {update.published_at && (
              <p className="mt-0.5 flex items-center gap-1 text-[11px] text-white/40">
                <CalendarDays className="h-3 w-3" aria-hidden="true" />
                Added on {formatDate(update.published_at)}
              </p>
            )}
          </div>
        </div>
        {premiumTag && <ProductBadge badge={premiumTag} />}
      </div>

      <h3 className="mt-4 text-base font-semibold leading-snug text-white group-hover:text-accent-blue">
        {update.title}
      </h3>
      {update.excerpt && <p className="mt-1.5 line-clamp-2 text-sm text-white/60">{update.excerpt}</p>}

      {features.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-1.5 text-xs text-white/70">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-blue" aria-hidden="true" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
        <div>
          <p className="text-lg font-bold text-white">
            {typeof update.price === "number" ? formatPrice(update.price, update.currency ?? "USD") : "Contact us"}
          </p>
          {update.availability && <AvailabilityBadge status={update.availability} />}
        </div>
        <TelegramOrderButton
          telegramUsername={telegramUsername}
          productId={null}
          productName={update.title}
          price={update.price ?? null}
          currency={update.currency ?? "USD"}
          label="Buy Now"
        />
      </div>
    </article>
  );
}
