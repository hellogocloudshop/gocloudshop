"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Mail } from "lucide-react";
import { subscribeNewsletter } from "@/lib/actions/orders";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    const result = await subscribeNewsletter({ email });
    if (result.success) {
      setStatus("success");
      setEmail("");
    } else {
      setStatus("error");
      setError(result.error ?? "Something went wrong. Please try again.");
    }
  }

  return (
    <section className="section-mesh-violet border-y border-line py-16">
      <div className="container-page flex flex-col items-center text-center">
        <span className="icon-tile icon-tile-c">
          <Mail className="h-5 w-5" aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-ink sm:text-3xl">Get Cloud & AI Updates</h2>
        <p className="mt-3 max-w-md text-ink-muted">
          Get product updates, pricing information, cloud guides and AI infrastructure insights.
        </p>

        {status === "success" ? (
          <p className="alert-success mt-6">You&apos;re subscribed — thanks for joining.</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex w-full max-w-md flex-col gap-2 sm:flex-row">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="glass w-full rounded-xl px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-accent-blue/50 focus:outline-none focus:ring-2 focus:ring-accent-blue/20"
            />
            <button type="submit" disabled={status === "loading"} className="btn-primary shrink-0">
              {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : "Subscribe"}
            </button>
          </form>
        )}
        {status === "error" && error && <p className="alert-danger mt-3 max-w-md">{error}</p>}
      </div>
    </section>
  );
}
