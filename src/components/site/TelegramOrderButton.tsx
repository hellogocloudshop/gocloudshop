"use client";

import { useState } from "react";
import { Loader2, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { buildTelegramOrderUrl } from "@/lib/telegram";
import { createOrder } from "@/lib/actions/orders";

export function TelegramOrderButton({
  telegramUsername,
  productId,
  productName,
  variationId,
  variationName,
  price,
  currency,
  className,
  label = "Order via Telegram",
}: {
  telegramUsername: string;
  /** Null for product-less leads (e.g. a Stock Update announcement that
   *  isn't yet a catalog product row). */
  productId: string | null;
  productName: string;
  variationId?: string | null;
  variationName?: string | null;
  price: number | null;
  currency: string;
  className?: string;
  /** Button text — the underlying dynamic Telegram message/order flow is
   *  identical regardless of label (e.g. "Buy" on compact catalog cards). */
  label?: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      await createOrder({
        productId,
        productName,
        variationId,
        variationName,
        price,
        currency,
        referrer: typeof window !== "undefined" ? window.location.pathname : undefined,
      });
    } finally {
      const url = buildTelegramOrderUrl({
        telegramUsername,
        product: { name: productName },
        variation: variationName ? { name: variationName } : null,
        price,
        currency,
      });
      window.open(url, "_blank", "noopener,noreferrer");
      setLoading(false);
    }
  }

  return (
    <button type="button" onClick={handleClick} disabled={loading} className={cn("btn-primary", className)}>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <MessageCircle className="h-4 w-4" aria-hidden="true" />}
      {label}
    </button>
  );
}
