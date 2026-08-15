"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bitcoin, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Crypto checkout via NOWPayments, offered alongside (not replacing) the
 * existing Telegram order flow — see TelegramOrderButton. Clicking this
 * calls our own server-side /api/nowpayments/create-payment route (which
 * re-derives the real price from the database and creates the payment with
 * NOWPayments) and then sends the customer to our own order-status page —
 * never marks anything paid client-side.
 */
export function CryptoPaymentButton({
  productId,
  variationId,
  className,
  label = "Pay with Crypto",
}: {
  productId: string;
  variationId?: string | null;
  className?: string;
  label?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/nowpayments/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          variationId: variationId ?? undefined,
          // No currency-picker UI exists yet — defaults to USDT (TRC-20), a
          // widely supported, low-fee option. Still fully validated
          // server-side against NOWPayments' supported currencies before use.
          payCurrency: "usdttrc20",
        }),
      });

      const data: { error?: string; statusUrl?: string } = await res.json();

      if (!res.ok || !data.statusUrl) {
        setError(data.error ?? "Unable to start payment. Please try again.");
        setLoading(false);
        return;
      }

      router.push(data.statusUrl);
    } catch {
      setError("Unable to start payment. Please check your connection and try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button type="button" onClick={handleClick} disabled={loading} className={cn("btn-secondary", className)}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Bitcoin className="h-4 w-4" aria-hidden="true" />}
        {loading ? "Starting payment…" : label}
      </button>
      {error && (
        <p className="alert-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
