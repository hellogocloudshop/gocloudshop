"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Cloud, Loader2, TriangleAlert } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const unauthorized = searchParams.get("error") === "unauthorized";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  if (!supabase) {
    return (
      <div className="surface-dark relative flex min-h-screen items-center justify-center overflow-hidden px-4">
        <div className="card-surface max-w-md p-8 text-center">
          <TriangleAlert className="mx-auto h-8 w-8 text-amber-500" aria-hidden="true" />
          <h1 className="mt-4 text-lg font-semibold text-ink">Supabase isn&apos;t connected yet</h1>
          <p className="mt-2 text-sm text-ink-muted">
            Add <code className="rounded bg-bg-subtle px-1 py-0.5">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code className="rounded bg-bg-subtle px-1 py-0.5">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to{" "}
            <code className="rounded bg-bg-subtle px-1 py-0.5">.env.local</code>, run the migrations in{" "}
            <code className="rounded bg-bg-subtle px-1 py-0.5">supabase/migrations</code>, then create your first
            admin user to sign in here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="surface-dark relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="bg-grid-pattern absolute inset-0 opacity-20" aria-hidden="true" />
      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
            <Cloud className="h-6 w-6" aria-hidden="true" />
          </span>
          <h1 className="text-xl font-bold text-white">GoCloudShop Admin</h1>
          <p className="text-sm text-white/60">Sign in to manage your site</p>
        </div>

        <form onSubmit={handleSubmit} className="card-surface flex flex-col gap-4 p-6">
          {unauthorized && <p className="alert-warning">That account doesn&apos;t have admin access.</p>}
          {error && <p className="alert-danger">{error}</p>}

          <div>
            <label htmlFor="email" className="text-sm font-medium text-ink">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink focus:border-accent-blue focus:outline-none focus:ring-2 focus:ring-accent-blue/20"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-ink">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink focus:border-accent-blue focus:outline-none focus:ring-2 focus:ring-accent-blue/20"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary mt-2 justify-center">
            {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
