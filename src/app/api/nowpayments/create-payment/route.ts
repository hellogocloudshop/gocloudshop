import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { getProductById } from "@/lib/data/products";
import { getVariationById } from "@/lib/data/variations";
import { createNowPayment, getAvailableCurrencies, NowPaymentsError } from "@/lib/nowpayments";

export const runtime = "nodejs";

const bodySchema = z.object({
  productId: z.string().uuid("Invalid product."),
  variationId: z.string().uuid("Invalid variation.").nullish(),
  // Required by NOWPayments' /v1/payment endpoint. The checkout UI defaults
  // this today (no currency-picker exists yet — see CryptoPaymentButton),
  // but it's still fully validated below rather than trusted as-is.
  payCurrency: z.string().trim().min(2).max(20),
});

/**
 * Creates a NOWPayments crypto payment for an existing catalog
 * product/variation. Price and currency are ALWAYS re-derived from the
 * database here — the client only ever supplies IDs, never an amount.
 * Every response path returns only the minimum safe fields a browser
 * needs; the NOWPayments API key is never referenced outside lib/nowpayments.ts.
 */
export async function POST(request: NextRequest) {
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request." }, { status: 400 });
  }
  const { productId, variationId, payCurrency } = parsed.data;

  const product = await getProductById(productId);
  if (!product || !product.is_active) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  let variationName: string | null = null;
  let price: number | null = product.base_price;
  let currency = product.currency;

  if (variationId) {
    const variation = await getVariationById(variationId);
    if (!variation || variation.product_id !== product.id || !variation.is_active) {
      return NextResponse.json({ error: "Selected variation not found." }, { status: 400 });
    }
    variationName = variation.name;
    price = variation.price;
    currency = variation.currency;
  }

  if (price === null || price === undefined || price <= 0) {
    return NextResponse.json({ error: "This product has no set price yet — please contact support." }, { status: 400 });
  }

  // Validate the requested pay_currency against what NOWPayments actually
  // supports before ever sending it along — never assume a client-supplied
  // currency ticker is safe.
  try {
    const supported = await getAvailableCurrencies();
    if (!supported.includes(payCurrency.toLowerCase())) {
      return NextResponse.json({ error: "Unsupported payment currency." }, { status: 400 });
    }
  } catch (err) {
    console.error("[nowpayments] currency lookup failed:", err instanceof Error ? err.message : "unknown error");
    return NextResponse.json({ error: "Unable to verify supported currencies right now. Please try again shortly." }, { status: 503 });
  }

  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "Payments are not available yet — please contact support." }, { status: 503 });
  }

  // Create the internal order BEFORE calling NOWPayments, so an order
  // record always exists even if the customer abandons before completing
  // payment, or if the NOWPayments call itself fails.
  const { data: order, error: insertError } = await admin
    .from("orders")
    .insert({
      product_id: product.id,
      variation_id: variationId ?? null,
      product_name_snapshot: product.name,
      variation_name_snapshot: variationName,
      price_snapshot: price,
      currency,
      order_status: "new",
      payment_status: "unpaid",
      payment_provider: "nowpayments",
      referrer: request.headers.get("referer"),
    })
    .select("id")
    .single();

  if (insertError || !order) {
    console.error("[nowpayments] order insert failed:", insertError?.message ?? "no row returned");
    return NextResponse.json({ error: "Could not create order. Please try again." }, { status: 500 });
  }

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://gocloudshop.com").replace(/\/$/, "");

  try {
    const payment = await createNowPayment({
      price_amount: price,
      price_currency: currency.toLowerCase(),
      pay_currency: payCurrency.toLowerCase(),
      order_id: order.id,
      order_description: `${product.name}${variationName ? ` — ${variationName}` : ""}`.slice(0, 500),
      ipn_callback_url: `${siteUrl}/api/payments/nowpayments/ipn`,
    });

    const { error: updateError } = await admin
      .from("orders")
      .update({
        nowpayments_payment_id: String(payment.payment_id),
        nowpayments_order_id: order.id,
        pay_currency: payment.pay_currency,
        pay_amount: payment.pay_amount,
        pay_address: payment.pay_address,
        crypto_payment_status: payment.payment_status,
      })
      .eq("id", order.id);

    if (updateError) {
      console.error("[nowpayments] order update after payment creation failed:", updateError.message);
    }

    // Only the minimum the frontend needs — never the API key, and never
    // the raw NOWPayments response.
    return NextResponse.json({
      orderId: order.id,
      statusUrl: `/order/${order.id}`,
      paymentId: String(payment.payment_id),
      paymentStatus: payment.payment_status,
      payAddress: payment.pay_address,
      payAmount: payment.pay_amount,
      payCurrency: payment.pay_currency,
      priceAmount: payment.price_amount,
      priceCurrency: payment.price_currency,
    });
  } catch (err) {
    // Never leave the order silently stuck as "new" with no explanation —
    // but never expose provider error detail (which could include internal
    // NOWPayments messages) to the client either.
    await admin
      .from("orders")
      .update({ order_status: "cancelled", notes: "NOWPayments payment creation failed." })
      .eq("id", order.id);

    console.error(
      "[nowpayments] payment creation failed:",
      err instanceof NowPaymentsError ? `status=${err.status ?? "n/a"} message=${err.message}` : "unknown error"
    );

    const status = err instanceof NowPaymentsError && err.status && err.status < 500 ? 400 : 502;
    return NextResponse.json({ error: "Unable to create payment right now. Please try again or contact support." }, { status });
  }
}
