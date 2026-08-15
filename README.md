# GoCloudShop

**Cloud Access. Simplified.** A production-ready, database-driven marketplace for cloud accounts, cloud credits and AI Cloud infrastructure across multiple providers.

Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4 and Supabase (Postgres + Auth + Storage).

## What's here

- **Public marketplace** — homepage, category & provider pages, combo SEO landing pages (`/aws-accounts`, `/aws-credits`, `/aws-ai`, …), full search/filter/sort marketplace, product detail pages with a live variation selector, Compare, Use Cases, Guides/Blog, FAQ.
- **Admin dashboard** (`/admin`) — full CRUD for products (with a variation manager), providers, categories, provider landing pages, comparisons, use cases, guides, FAQs, reviews, orders/leads (with a status workflow), site settings and staff users.
- **Everything admin-editable** — no product, price, provider, category, badge or SEO value is hard-coded in a component. Nothing in the UI ever inlines a `$` price literal; every price is derived from `lib/utils.ts#effectivePrice`.
- **Runs before you connect Supabase** — every data-access function in `src/lib/data/*.ts` checks whether a Supabase project is configured and, if not, falls back to the bundled reference catalog in `src/lib/mock-data.ts` (which mirrors `supabase/seed.sql` row-for-row). This means `npm run dev` works immediately after `npm install`, with no environment setup required, so you can review the whole site before wiring up a database.

## Getting started

```bash
npm install
npm run dev
```

The site is fully browsable at this point using the bundled reference catalog — no Supabase project required yet.

### Connecting a real Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. Copy `.env.example` to `.env.local` and fill in `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` from your project's API settings. Set `NEXT_PUBLIC_SITE_URL` to your real domain before deploying (it feeds `sitemap.xml`, canonical URLs and OpenGraph tags).
3. Run the migrations, in order, either with the Supabase CLI:
   ```bash
   supabase link --project-ref <your-project-ref>
   supabase db push
   ```
   or by pasting each file from `supabase/migrations/` into the Supabase SQL Editor in numeric order (`0001_init.sql` → `0002_rls.sql` → `0003_storage.sql` → `0004_newsletter.sql`), followed by `supabase/seed.sql`.
4. Restart `npm run dev` (or redeploy) — the data layer automatically switches from the bundled catalog to your live database once the env vars are present.
5. **Create your first admin user**: sign up a user (Supabase Dashboard → Authentication → Add user, or your own sign-up flow) — the first account created is automatically granted the `admin` role via the `handle_new_user()` trigger. Every subsequent signup defaults to `editor` and must be promoted from **Admin → Users**.
6. Sign in at `/admin/login`.

## Project structure

```
src/
  app/
    (site)/            Public marketing + marketplace routes
    admin/              Admin dashboard (login is public; (dashboard) is auth-gated)
    sitemap.ts robots.ts
  components/
    layout/    site chrome — Header (mega menu), MobileNav, Footer, SearchBox
    site/      product cards, variation selector, filters, compare table, etc.
    admin/     admin forms, tables, sidebar/topbar
    ui/        shared primitives (Button, Badge, Breadcrumbs, EmptyState, …)
  lib/
    types.ts               hand-written types mirroring the DB schema
    utils.ts                cn(), formatPrice(), effectivePrice(), productHref()
    telegram.ts              dynamic "Order via Telegram" message builder
    mock-data.ts             bundled reference catalog (pre-Supabase fallback)
    supabase/                client/server/admin/middleware wiring
    data/                    read-only query layer (one file per entity)
    actions/                 server actions — public (orders) + admin/ (CRUD)
    validations/admin.ts     zod schemas for every admin form
supabase/
  migrations/*.sql   schema, RLS policies, storage buckets (apply in order)
  seed.sql            reference catalog matching src/lib/mock-data.ts
```

## Key architectural decisions

- **Product variations** (`product_variations` table) are the core of the pricing model — a parent product (e.g. "AWS Compute Accounts") can have any number of price/spec tiers (8 vCPU, 32 vCPU, …). The product detail page's variation selector updates price, features, specifications, availability, region, delivery and badge together, entirely client-side from already-fetched data — no reload.
- **Provider + category combo pages** (`provider_category_pages` table) power SEO landing pages like `/aws-accounts` or `/google-cloud-ai` without any hard-coded routes — admins create/edit/delete them from **Admin → Provider Pages**.
- **Telegram ordering** always uses live data: `TelegramOrderButton` records an `orders` row (status `new`, with a price snapshot) and opens a Telegram deep link built from the real product/variation/price via `lib/telegram.ts`. The Telegram handle itself comes from `site_settings.telegram_username` (Admin → Settings) — one source of truth.
- **No fabricated trust content.** Trust indicators and "why choose us" copy stay factual and non-numeric; the Reviews section renders an honest empty state until real, admin-approved reviews exist — nothing here seeds fake testimonials, counts or ratings.
- **RLS**: public (anon) reads are limited to active/published/approved rows; every mutation (and every read of hidden rows) requires a `profiles.role` of `admin` or `editor`. See `supabase/migrations/0002_rls.sql`.

## Scripts

```bash
npm run dev      # start the dev server
npm run build    # production build (also runs the TypeScript check)
npm run start    # run a production build
npm run lint     # eslint
```

## Known follow-ups

- Next.js 16 deprecated the `middleware.ts` file convention in favor of `proxy.ts`; this project still uses `middleware.ts` (matching the sibling CloudCreda project) since it functions correctly today — migrate when convenient.
- Storage buckets are provisioned and RLS-protected (`provider-logos`, `product-images`, `category-images`, see `0003_storage.sql`), but admin forms currently accept an image **URL** field rather than an in-browser upload widget. Upload a file via the Supabase Dashboard's Storage browser (or your own uploader built on `@supabase/storage-js`) and paste the resulting public URL into the form.
