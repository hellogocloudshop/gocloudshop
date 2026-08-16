import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { getProductById } from "@/lib/data/products";
import { getVariationById } from "@/lib/data/variations";
import { createNowPayment, getAvailableCurrencies, NowPaymentsError } from "@/lib/nowpayments";

export const runtime = "nodejs";

const bodySchema = z.object({
  // Deliberately NOT z.string().uuid() — getProductById()/getVariationById()
  // fall back to src/lib/mock-data.ts (non-UUID string ids, e.g.
  // "p-aws-compute") whenever Supabase isn't connected yet, which is the
  // exact cause of a previously-reported "Invalid product." error here: a
  // real id was rejected by this schema before ever reaching the actual
  // lookup. The real trust boundary is that lookup (returns 404 for
  // anything that doesn't exist) plus createAdminClient() returning null
  // (503) when Supabase isn't configured — not this field's text format. A
  // genuine Supabase row's id is always a real UUID regardless (enforced by
  // the schema itself), so this is strictly more permissive, never less safe.
  productId: z.string().trim().min(1, "Invalid product.").max(100, "Invalid product."),
  variationId: z.string().trim().min(1, "Invalid variation.").max(100, "Invalid variation.").nullish(),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1.").max(10, "Quantity cannot exceed 10.").default(1),
  customerName: z.string().trim().min(1, "Name is required.").max(200),
  customerContact: z.string().trim().min(1, "Contact information is required.").max(200),
  // Required by NOWPayments' /v1/payment endpoint. Chosen on the checkout
  // page's payment-method select — still fully validated below rather than
  // trusted as-is.
  payCurrency: z.string().trim().min(2).max(20),
});

/**
 * Creates a NOWPayments crypto payment for an existing catalog
 * product/variation, from the /checkout page. Price, currency and
 * availability are ALWAYS re-derived from the database here — the client
 * only ever supplies IDs and a quantity, never an amount. Every response
 * path returns only the minimum safe fields a browser needs; the
 * NOWPayments API key is never referenced outside lib/nowpayments.ts.
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
  const { productId, variationId, quantity, customerName, customerContact, payCurrency } = parsed.data;

  const product = await getProductById(productId);
  if (!product || !product.is_active) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  let variationName: string | null = null;
  let unitPrice: number | null = product.base_price;
  let currency = product.currency;
  let availability = product.availability;

  if (variationId) {
    const variation = await getVariationById(variationId);
    if (!variation || variation.product_id !== product.id || !variation.is_active) {
      return NextResponse.json({ error: "Selected variation not found." }, { status: 400 });
    }
    variationName = variation.name;
    unitPrice = variation.price;
    currency = variation.currency;
    availability = variation.availability;
  }

  // Stock/availability must be re-checked here too — it can change between
  // the customer loading the checkout page and clicking "Complete Payment".
  if (availability === "out_of_stock") {
    return NextResponse.json({ error: "This product just went out of stock. Please check back soon or contact support." }, { status: 409 });
  }

  if (unitPrice === null || unitPrice === undefined || unitPrice <= 0) {
    return NextResponse.json({ error: "This product has no set price yet — please contact support." }, { status: 400 });
  }

  const totalPrice = Math.round(unitPrice * quantity * 100) / 100;

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
      price_snapshot: totalPrice,
      currency,
      quantity,
      customer_name: customerName,
      contact: customerContact,
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
      price_amount: totalPrice,
      price_currency: currency.toLowerCase(),
      pay_currency: payCurrency.toLowerCase(),
      order_id: order.id,
      order_description: `${quantity > 1 ? `${quantity}x ` : ""}${product.name}${variationName ? ` — ${variationName}` : ""}`.slice(0, 500),
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
