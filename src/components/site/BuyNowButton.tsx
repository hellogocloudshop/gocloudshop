import Link from "next/link";
import { CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The site's one "Buy Now" action for real catalog products/variations —
 * takes the customer to /checkout (order review, customer info, payment
 * method) rather than opening Telegram. Replaces TelegramOrderButton on
 * every purchase surface (product detail page, catalog cards, provider
 * account tables). Navigation only — price/availability are always
 * re-verified server-side once the customer reaches checkout and again
 * when payment is created, never trusted from this link's query params.
 */
export function BuyNowButton({
  productId,
  variationId,
  className,
  label = "Buy Now",
}: {
  productId: string;
  variationId?: string | null;
  className?: string;
  label?: string;
}) {
  const params = new URLSearchParams({ product: productId });
  if (variationId) params.set("variation", variationId);

  return (
    <Link href={`/checkout?${params.toString()}`} className={cn("btn-primary", className)}>
      <CreditCard className="h-4 w-4" aria-hidden="true" />
      {label}
    </Link>
  );
}
