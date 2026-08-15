import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Server-only NOWPayments API client. Never import this from a Client
 * Component — the `server-only` import above makes that a build error if
 * it's ever attempted by accident.
 *
 * https://api.nowpayments.io — API key is read from NOWPAYMENTS_API_KEY
 * (server env, never NEXT_PUBLIC_-prefixed) and sent via the x-api-key
 * header, per NOWPayments' documented auth scheme. Uses native fetch —
 * no HTTP client dependency needed for a handful of JSON endpoints.
 */
const NOWPAYMENTS_API_BASE = "https://api.nowpayments.io/v1";
const REQUEST_TIMEOUT_MS = 15_000;

export class NowPaymentsError extends Error {
  /** HTTP status from NOWPayments, when the error came from a response
   *  rather than a network/timeout failure. */
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "NowPaymentsError";
    this.status = status;
  }
}

function getApiKey(): string {
  const key = process.env.NOWPAYMENTS_API_KEY;
  if (!key) {
    // Message intentionally names only the missing env var, never a value —
    // there is no secret to leak here since none was found.
    throw new NowPaymentsError("NOWPAYMENTS_API_KEY is not configured on the server.");
  }
  return key;
}

async function nowpaymentsFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(`${NOWPAYMENTS_API_BASE}${path}`, {
      ...init,
      headers: {
        "x-api-key": getApiKey(),
        "Content-Type": "application/json",
        ...init?.headers,
      },
      signal: controller.signal,
      cache: "no-store",
    });
  } catch (err) {
    if (err instanceof NowPaymentsError) throw err;
    if (err instanceof Error && err.name === "AbortError") {
      throw new NowPaymentsError("NOWPayments request timed out.");
    }
    // Never include the raw network error (could echo back request details)
    // — just a generic, safe message.
    throw new NowPaymentsError("Unable to reach NOWPayments.");
  } finally {
    clearTimeout(timeout);
  }

  let body: unknown = null;
  try {
    body = await res.json();
  } catch {
    // Non-JSON response — body stays null, handled below.
  }

  if (!res.ok) {
    const message =
      body && typeof body === "object" && "message" in body && typeof (body as { message?: unknown }).message === "string"
        ? (body as { message: string }).message
        : `NOWPayments request failed with status ${res.status}.`;
    throw new NowPaymentsError(message, res.status);
  }

  return body as T;
}

export interface CreatePaymentParams {
  price_amount: number;
  price_currency: string;
  pay_currency: string;
  order_id: string;
  order_description?: string;
  ipn_callback_url: string;
}

export interface NowPaymentsPayment {
  payment_id: string | number;
  payment_status: string;
  pay_address: string;
  price_amount: number;
  price_currency: string;
  pay_amount: number;
  pay_currency: string;
  order_id: string | null;
  order_description: string | null;
  created_at?: string;
  updated_at?: string;
  purchase_id?: string;
}

/** Validates the response has the fields this integration actually relies
 *  on, so a malformed/unexpected NOWPayments response fails loudly here
 *  rather than silently propagating bad data into an order record. */
function assertValidPayment(data: unknown): asserts data is NowPaymentsPayment {
  if (
    !data ||
    typeof data !== "object" ||
    !("payment_id" in data) ||
    !("payment_status" in data) ||
    !("pay_address" in data)
  ) {
    throw new NowPaymentsError("NOWPayments returned an unexpected payment response.");
  }
}

export async function createNowPayment(params: CreatePaymentParams): Promise<NowPaymentsPayment> {
  const data = await nowpaymentsFetch<unknown>("/payment", {
    method: "POST",
    body: JSON.stringify(params),
  });
  assertValidPayment(data);
  return data;
}

export async function getNowPaymentStatus(paymentId: string): Promise<NowPaymentsPayment> {
  const data = await nowpaymentsFetch<unknown>(`/payment/${encodeURIComponent(paymentId)}`, { method: "GET" });
  assertValidPayment(data);
  return data;
}

/** The set of pay_currency tickers NOWPayments currently supports for this
 *  merchant account — used to validate any customer-selected currency
 *  before it's ever sent to /v1/payment. Lowercase, matching NOWPayments'
 *  own ticker casing. */
export async function getAvailableCurrencies(): Promise<string[]> {
  const data = await nowpaymentsFetch<{ currencies: string[] }>("/currencies", { method: "GET" });
  return (data.currencies ?? []).map((c) => c.toLowerCase());
}

// ---------------------------------------------------------------------------
// IPN signature verification
//
// NOWPayments' documented scheme: recursively sort the JSON payload's keys,
// re-serialize with no extra whitespace, then HMAC-SHA512 that string with
// the IPN secret. Compared as hex against the x-nowpayments-sig header.
// This is NOT invented here — it's the standard, unchanged algorithm from
// NOWPayments' IPN documentation. Do not alter it without checking NOWPayments'
// current docs first.
// ---------------------------------------------------------------------------

function sortObjectKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortObjectKeys);
  if (value !== null && typeof value === "object") {
    return Object.keys(value as Record<string, unknown>)
      .sort()
      .reduce<Record<string, unknown>>((sorted, key) => {
        sorted[key] = sortObjectKeys((value as Record<string, unknown>)[key]);
        return sorted;
      }, {});
  }
  return value;
}

/**
 * Verifies an IPN request's x-nowpayments-sig header against its JSON
 * payload. Returns false (never throws) for any malformed input — callers
 * must treat a false result as "reject the request", not as an error to
 * otherwise recover from.
 */
export function verifyIpnSignature(payload: unknown, signatureHeader: string | null, ipnSecret: string): boolean {
  if (!signatureHeader || !ipnSecret) return false;

  try {
    const sortedPayload = JSON.stringify(sortObjectKeys(payload));
    const expectedHex = createHmac("sha512", ipnSecret).update(sortedPayload).digest("hex");

    const expectedBuf = Buffer.from(expectedHex, "hex");
    const providedBuf = Buffer.from(signatureHeader.trim().toLowerCase(), "hex");
    if (expectedBuf.length === 0 || providedBuf.length === 0 || expectedBuf.length !== providedBuf.length) {
      return false;
    }
    return timingSafeEqual(expectedBuf, providedBuf);
  } catch {
    // Malformed header (not valid hex) or unserializable payload — reject,
    // don't throw, so the route can respond with a clean 403.
    return false;
  }
}
