import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyIpnSignature } from "@/lib/nowpayments";
import type { OrderStatus, PaymentStatus } from "@/lib/types";

export const runtime = "nodejs";

// NOWPayments' documented payment_status values. "finished" is the only
// state where funds are actually confirmed and credited — "confirmed" is an
// earlier, non-final on-chain-confirmation state. See NOWPayments' IPN docs
// before changing which status is treated as final-success.
const FINAL_SUCCESS_STATUS = "finished";
const PARTIALLY_PAID_STATUS = "partially_paid";
const REFUNDED_STATUS = "refunded";
const TERMINAL_FAILURE_STATUSES = new Set(["failed", "expired"]);

function mapPaymentStatus(cryptoStatus: string): PaymentStatus {
  if (cryptoStatus === FINAL_SUCCESS_STATUS) return "paid";
  if (cryptoStatus === PARTIALLY_PAID_STATUS) return "partially_paid";
  if (cryptoStatus === REFUNDED_STATUS) return "refunded";
  // waiting / confirming / confirmed / sending / failed / expired — none of
  // these mean the order is actually paid.
  return "unpaid";
}

function mapOrderStatus(cryptoStatus: string, current: OrderStatus): OrderStatus {
  if (cryptoStatus === FINAL_SUCCESS_STATUS) return "paid";
  if (TERMINAL_FAILURE_STATUSES.has(cryptoStatus)) {
    // Only downgrade an order that's still fresh — never overwrite staff
    // progress (e.g. "processing"/"completed") set after a real payment.
    return current === "new" ? "cancelled" : current;
  }
  return current === "new" ? "pending" : current;
}

/**
 * NOWPayments IPN webhook. Configure this exact URL
 * (https://gocloudshop.com/api/payments/nowpayments/ipn) in the NOWPayments
 * dashboard. Every request is signature-verified before any database write
 * — an invalid/missing signature is rejected with no order lookup, no
 * update, and no information about whether the referenced order exists.
 */
export async function POST(request: NextRequest) {
  const ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET;
  if (!ipnSecret) {
    // Never attempt to "verify" against a secret that doesn't exist —
    // reject outright instead of silently trusting unverified input.
    return NextResponse.json({ error: "IPN not configured." }, { status: 503 });
  }

  const rawBody = await request.text();
  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const signature = request.headers.get("x-nowpayments-sig");
  if (!verifyIpnSignature(payload, signature, ipnSecret)) {
    // Deliberately generic — never reveal which part of verification failed.
    return NextResponse.json({ error: "Invalid signature." }, { status: 403 });
  }

  const orderId = typeof payload.order_id === "string" ? payload.order_id : null;
  const paymentId =
    payload.payment_id !== undefined && payload.payment_id !== null ? String(payload.payment_id) : null;
  const cryptoStatus = typeof payload.payment_status === "string" ? payload.payment_status : null;

  if (!orderId || !paymentId || !cryptoStatus) {
    return NextResponse.json({ error: "Malformed IPN payload." }, { status: 400 });
  }

  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "Supabase is not connected." }, { status: 503 });
  }

  const { data: order } = await admin.from("orders").select("*").eq("id", orderId).maybeSingle();
  if (!order) {
    // Signature was valid but the order id doesn't exist here. Acknowledge
    // with 200 rather than erroring — an unknown id will never resolve, so
    // there's no value in NOWPayments retrying it, and no order to update.
    return NextResponse.json({ received: true, note: "Unknown order." }, { status: 200 });
  }

  // The order must actually belong to this payment — never let a
  // differently-numbered payment update an order that's already tied to
  // another payment id.
  if (order.nowpayments_payment_id && order.nowpayments_payment_id !== paymentId) {
    return NextResponse.json({ error: "Payment/order mismatch." }, { status: 409 });
  }

  // Idempotency: if this exact status for this exact payment has already
  // been recorded, there's nothing new — acknowledge without writing again,
  // so duplicate/replayed IPNs never cause duplicate fulfillment side effects.
  if (order.nowpayments_payment_id === paymentId && order.crypto_payment_status === cryptoStatus) {
    return NextResponse.json({ received: true, idempotent: true }, { status: 200 });
  }

  const isFinal = cryptoStatus === FINAL_SUCCESS_STATUS;
  const update: Record<string, unknown> = {
    nowpayments_payment_id: paymentId,
    crypto_payment_status: cryptoStatus,
    payment_status: mapPaymentStatus(cryptoStatus),
    order_status: mapOrderStatus(cryptoStatus, order.order_status),
    ipn_payload: payload,
  };
  if (typeof payload.pay_amount === "number") update.pay_amount = payload.pay_amount;
  if (typeof payload.pay_currency === "string") update.pay_currency = payload.pay_currency;
  if (typeof payload.pay_address === "string") update.pay_address = payload.pay_address;
  if (typeof payload.outcome_amount === "number") update.outcome_amount = payload.outcome_amount;
  if (typeof payload.outcome_currency === "string") update.outcome_currency = payload.outcome_currency;
  // Set once, only on the genuine transition into the final successful
  // status — a later duplicate "finished" IPN never overwrites it.
  if (isFinal && !order.paid_at) update.paid_at = new Date().toISOString();

  const { error } = await admin.from("orders").update(update).eq("id", orderId);
  if (error) {
    console.error("[nowpayments-ipn] order update failed:", error.message);
    return NextResponse.json({ error: "Failed to update order." }, { status: 500 });
  }

  return NextResponse.json({ received: true }, { status: 200 });
}

/** NOWPayments only ever sends POST IPNs — GET just confirms the endpoint
 *  is reachable (useful for a manual check from the dashboard/deploy). */
export async function GET() {
  return NextResponse.json({ ok: true });
}
