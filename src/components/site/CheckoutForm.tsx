"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Loader2, Minus, Plus, ShieldCheck } from "lucide-react";
import { formatPrice } from "@/lib/utils";

const MAX_QUANTITY = 10;

// A short, well-supported starter list — the full set NOWPayments actually
// supports is validated server-side in /api/nowpayments/create-payment
// regardless of what's selected here.
const PAY_CURRENCIES = [
  { value: "usdttrc20", label: "USDT (TRC-20)" },
  { value: "usdterc20", label: "USDT (ERC-20)" },
  { value: "btc", label: "Bitcoin (BTC)" },
  { value: "eth", label: "Ethereum (ETH)" },
  { value: "ltc", label: "Litecoin (LTC)" },
  { value: "trx", label: "TRON (TRX)" },
];

/**
 * Order-review + payment-creation form. Submitting calls our own
 * server-side /api/nowpayments/create-payment (which re-derives the real
 * price from the database) and redirects to the resulting order-status
 * page — this component never marks anything paid, and the total shown
 * here is only ever a display convenience, not what's actually charged.
 */
export function CheckoutForm({
  productId,
  variationId,
  unitPrice,
  currency,
}: {
  productId: string;
  variationId: string | null;
  unitPrice: number;
  currency: string;
}) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [payCurrency, setPayCurrency] = useState(PAY_CURRENCIES[0].value);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = useMemo(() => Math.round(unitPrice * quantity * 100) / 100, [unitPrice, quantity]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/nowpayments/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          variationId: variationId ?? undefined,
          quantity,
          payCurrency,
          customerName: String(form.get("customerName") ?? ""),
          customerContact: String(form.get("customerContact") ?? ""),
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div>
        <h2 className="font-semibold text-ink">Your Information</h2>
        <div className="mt-4 flex flex-col gap-4">
          <div>
            <label htmlFor="customerName" className="text-sm font-medium text-ink">
              Full Name
            </label>
            <input
              id="customerName"
              name="customerName"
              type="text"
              required
              maxLength={200}
              autoComplete="name"
              disabled={loading}
              className="mt-1.5 w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink focus:border-accent-blue/50 focus:outline-none focus:ring-2 focus:ring-accent-blue/20 disabled:opacity-60"
            />
          </div>
          <div>
            <label htmlFor="customerContact" className="text-sm font-medium text-ink">
              Email or Telegram
            </label>
            <input
              id="customerContact"
              name="customerContact"
              type="text"
              required
              maxLength={200}
              placeholder="you@email.com or @yourtelegram"
              autoComplete="email"
              disabled={loading}
              className="mt-1.5 w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink focus:border-accent-blue/50 focus:outline-none focus:ring-2 focus:ring-accent-blue/20 disabled:opacity-60"
            />
            <p className="mt-1 text-xs text-ink-muted">We&apos;ll use this to deliver your account details once payment is confirmed.</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-semibold text-ink">Order Details</h2>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end">
          <div>
            <span id="quantity-label" className="text-sm font-medium text-ink">
              Quantity
            </span>
            <div className="mt-1.5 flex items-center gap-3" role="group" aria-labelledby="quantity-label">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={loading || quantity <= 1}
                className="btn-secondary !h-10 !w-10 justify-center !p-0 disabled:opacity-40"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" aria-hidden="true" />
              </button>
              <span className="w-6 text-center font-semibold text-ink" aria-live="polite">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(MAX_QUANTITY, q + 1))}
                disabled={loading || quantity >= MAX_QUANTITY}
                className="btn-secondary !h-10 !w-10 justify-center !p-0 disabled:opacity-40"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="flex-1">
            <label htmlFor="payCurrency" className="text-sm font-medium text-ink">
              Pay With
            </label>
            <select
              id="payCurrency"
              value={payCurrency}
              onChange={(e) => setPayCurrency(e.target.value)}
              disabled={loading}
              className="mt-1.5 w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink focus:border-accent-blue/50 focus:outline-none focus:ring-2 focus:ring-accent-blue/20 disabled:opacity-60"
            >
              {PAY_CURRENCIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-line pt-4">
        <span className="text-ink-muted">Total</span>
        <span className="text-2xl font-extrabold text-ink">{formatPrice(total, currency)}</span>
      </div>

      <button type="submit" disabled={loading} className="btn-primary justify-center">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <CreditCard className="h-4 w-4" aria-hidden="true" />}
        {loading ? "Creating secure payment…" : "Complete Payment"}
      </button>

      {error && (
        <p className="alert-danger" role="alert">
          {error}
        </p>
      )}

      <p className="flex items-start gap-1.5 text-xs text-ink-muted">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        Secure crypto payment powered by NOWPayments. Your order is confirmed automatically once payment is verified — no need to wait or contact us.
      </p>
    </form>
  );
}
