# Agent notes — GoCloudShop

- Stack: Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS v4 (CSS-first `@theme`, no `tailwind.config`), `@supabase/ssr`. No ORM, no React Query, no UI kit — Server Components + Server Actions + native `<form action>` + `useTransition`.
- **Never hard-code a price, product, provider or category in a component.** Prices always come from `lib/utils.ts#effectivePrice()` / `formatPrice()` against live `products`/`product_variations` data (or the mock-data fallback with the identical shape).
- Data flow: `src/lib/data/*.ts` is the only place components should query Supabase from. Every function there checks `isSupabaseConfigured()` and falls back to `src/lib/mock-data.ts` — keep both in sync when adding fields.
- Mutations: `src/lib/actions/admin/*.ts` (staff-only, validated with `src/lib/validations/admin.ts`) and `src/lib/actions/orders.ts` (public: `createOrder`, `subscribeNewsletter`, `submitContactMessage`).
- Schema changes go in a new numbered file under `supabase/migrations/`; never edit an already-applied migration. Update `supabase/seed.sql` and `src/lib/mock-data.ts` together so they stay row-for-row identical in content.
- Admin auth: `src/middleware.ts` (edge check) + `src/app/admin/(dashboard)/layout.tsx` (server re-check) both gate on `profiles.role in ('admin','editor')`. Keep both in sync if the role model changes.
- Telegram: every order CTA must go through `lib/telegram.ts#buildTelegramOrderUrl()` so the message reflects the real selected product/variation/price. The handle comes from `site_settings.telegram_username`, not a hard-coded constant.
