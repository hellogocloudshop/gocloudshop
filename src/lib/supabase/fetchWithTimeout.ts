import "server-only";

const DEFAULT_TIMEOUT_MS = 10_000;

/**
 * Wraps global fetch with a hard timeout, passed to the Supabase client via
 * its `global.fetch` option, so a slow/unreachable network path fails fast
 * with a clear error instead of leaving a request hanging for however long
 * Node's own default socket behavior allows — well past what any page load
 * should tolerate.
 *
 * With this in place, a genuinely slow or unreachable Supabase connection
 * now fails after 10s with a normal AbortError, which @supabase/postgrest-js
 * surfaces as a regular `{ data: null, error }` result — already logged by
 * every data-layer call via logSupabaseError() — instead of the page
 * silently waiting far longer than necessary before falling back to an
 * empty catalog.
 *
 * Also logs, per request, exactly what Step 3 of the production
 * investigation asked for — hostname, start/end, elapsed ms, HTTP status,
 * error name/message — and nothing else (no keys, no tokens, no request/
 * response bodies). This is temporary and safe to remove once the cause of
 * the production slowness/empty-catalog issue is confirmed from these logs.
 */
export function fetchWithTimeout(label: string, timeoutMs: number = DEFAULT_TIMEOUT_MS): typeof fetch {
  return async (input, init) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    if (init?.signal) {
      init.signal.addEventListener("abort", () => controller.abort(), { once: true });
    }

    const host = (() => {
      try {
        return new URL(typeof input === "string" ? input : input instanceof URL ? input.href : input.url).host;
      } catch {
        return "unknown-host";
      }
    })();
    const start = Date.now();

    try {
      const res = await fetch(input, { ...init, signal: controller.signal });
      console.log(`[supabase-fetch] ${label} host=${host} status=${res.status} elapsed_ms=${Date.now() - start}`);
      return res;
    } catch (err) {
      const name = err instanceof Error ? err.name : "UnknownError";
      const message = err instanceof Error ? err.message : String(err);
      console.error(
        `[supabase-fetch] ${label} host=${host} FAILED elapsed_ms=${Date.now() - start} error_name=${name} error_message=${message}`
      );
      throw err;
    } finally {
      clearTimeout(timeout);
    }
  };
}
