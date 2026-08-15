import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CartButtonProps {
  /** Number of items currently in the cart. Defaults to 0 — GoCloudShop has
   *  no real cart state yet (every order goes through the per-product
   *  Telegram flow — see TelegramOrderButton), so 0 is the accurate current
   *  count, not a placeholder. Once real cart state exists, pass the live
   *  count here — nothing else about this component needs to change. */
  itemCount?: number;
  /** Opens the cart (drawer/page) once real cart functionality exists. When
   *  omitted (today), the button falls back to `href` instead of doing
   *  nothing or opening a fake checkout — so it's always a real, honest
   *  destination. */
  onOpen?: () => void;
  /** Fallback navigation target used only when `onOpen` isn't provided. */
  href?: string;
  className?: string;
}

/**
 * Scalable cart entry point for the header. Today it's a real, honest link
 * into the product catalog with an accurate empty-cart badge (no fake
 * checkout, no fabricated item count). Later, a real cart implementation can
 * pass `itemCount` and `onOpen` (e.g. to open a cart drawer) without any
 * change to the Header/HeaderTop that renders this component.
 */
export function CartButton({ itemCount = 0, onOpen, href = "/all-products", className }: CartButtonProps) {
  const badge = (
    <span
      aria-hidden="true"
      className={cn(
        "absolute right-1 top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full px-0.5 text-[9px] font-bold leading-none",
        itemCount > 0 ? "bg-accent-blue text-white" : "bg-white/10 text-ink-muted ring-1 ring-line"
      )}
    >
      {itemCount > 9 ? "9+" : itemCount}
    </span>
  );

  const sharedClassName = cn(
    "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-ink-muted transition-all duration-200 hover:scale-105 hover:bg-white/[0.06] hover:text-ink",
    className
  );
  const ariaLabel = `Shopping cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`;

  if (onOpen) {
    return (
      <button type="button" onClick={onOpen} aria-label={ariaLabel} className={sharedClassName}>
        <ShoppingCart className="h-[18px] w-[18px]" aria-hidden="true" />
        {badge}
      </button>
    );
  }

  return (
    <Link href={href} aria-label={ariaLabel} title="Browse products" className={sharedClassName}>
      <ShoppingCart className="h-[18px] w-[18px]" aria-hidden="true" />
      {badge}
    </Link>
  );
}
