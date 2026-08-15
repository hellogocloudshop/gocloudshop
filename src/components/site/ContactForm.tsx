"use client";

import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { submitContactMessage } from "@/lib/actions/orders";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    const form = new FormData(e.currentTarget);
    const result = await submitContactMessage({
      name: String(form.get("name") ?? ""),
      contact: String(form.get("contact") ?? ""),
      message: String(form.get("message") ?? ""),
    });
    if (result.success) {
      setStatus("success");
      e.currentTarget.reset();
    } else {
      setStatus("error");
      setError(result.error ?? "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return <p className="alert-success">Thanks — we received your message and will get back to you soon.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="contact-name" className="text-sm font-medium text-ink">
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          className="mt-1.5 w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink focus:border-accent-blue/50 focus:outline-none focus:ring-2 focus:ring-accent-blue/20"
        />
      </div>
      <div>
        <label htmlFor="contact-method" className="text-sm font-medium text-ink">
          Email or Telegram
        </label>
        <input
          id="contact-method"
          name="contact"
          type="text"
          required
          className="mt-1.5 w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink focus:border-accent-blue/50 focus:outline-none focus:ring-2 focus:ring-accent-blue/20"
        />
      </div>
      <div>
        <label htmlFor="contact-message" className="text-sm font-medium text-ink">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          className="mt-1.5 w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink focus:border-accent-blue/50 focus:outline-none focus:ring-2 focus:ring-accent-blue/20"
        />
      </div>
      <button type="submit" disabled={status === "loading"} className="btn-primary justify-center">
        {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : "Send Message"}
      </button>
      {status === "error" && error && <p className="alert-danger">{error}</p>}
    </form>
  );
}
