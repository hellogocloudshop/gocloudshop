-- GoCloudShop — initial schema
-- Apply with `supabase db push`, or paste into the Supabase SQL editor in order
-- (0001_init.sql -> 0002_rls.sql -> 0003_storage.sql), then run seed.sql.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

create type user_role as enum ('admin', 'editor');
create type availability_status as enum ('in_stock', 'limited', 'out_of_stock', 'preorder');
create type content_status as enum ('draft', 'published');
create type guide_type as enum ('guide', 'blog', 'provider_guide', 'product_guide', 'comparison_guide');
create type comparison_type as enum ('provider_vs_provider', 'topic');
create type order_status as enum (
  'new', 'contacted', 'pending', 'confirmed', 'paid', 'processing', 'completed', 'cancelled'
);
create type payment_status as enum ('unpaid', 'partially_paid', 'paid', 'refunded');

-- ---------------------------------------------------------------------------
-- Helper: shared updated_at trigger
-- ---------------------------------------------------------------------------

create function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ---------------------------------------------------------------------------
-- profiles — extends auth.users with a staff role
-- ---------------------------------------------------------------------------

create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role user_role not null default 'editor',
  name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on profiles
  for each row execute function set_updated_at();

-- Auto-create a profile row whenever a new auth user signs up. The very
-- first user created is granted 'admin' so there is always at least one
-- fully-privileged account; every subsequent signup defaults to 'editor'
-- and must be promoted by an existing admin via /admin/users.
create function handle_new_user() returns trigger as $$
begin
  insert into profiles (id, role, name)
  values (
    new.id,
    case when (select count(*) from profiles) = 0 then 'admin' else 'editor' end,
    new.raw_user_meta_data ->> 'name'
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ---------------------------------------------------------------------------
-- providers
-- ---------------------------------------------------------------------------

create table providers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  logo_url text,
  website_url text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index providers_slug_idx on providers (slug);
create index providers_is_active_idx on providers (is_active);

create trigger providers_set_updated_at
  before update on providers
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- categories — supports nested parent/child categories
-- ---------------------------------------------------------------------------

create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  icon text,
  parent_id uuid references categories (id) on delete set null,
  seo_title text,
  seo_description text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index categories_slug_idx on categories (slug);
create index categories_parent_id_idx on categories (parent_id);
create index categories_is_active_idx on categories (is_active);

create trigger categories_set_updated_at
  before update on categories
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- provider_category_pages — DB-driven combo SEO landing pages such as
-- /aws-accounts, /aws-credits, /aws-ai, /google-cloud-ai. Never hard-coded
-- in the router: admins create/edit/delete these freely.
-- ---------------------------------------------------------------------------

create table provider_category_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  provider_id uuid not null references providers (id) on delete cascade,
  category_id uuid references categories (id) on delete set null,
  product_type text,
  title text not null,
  intro_content text,
  seo_title text,
  seo_description text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index provider_category_pages_slug_idx on provider_category_pages (slug);
create index provider_category_pages_provider_id_idx on provider_category_pages (provider_id);
create index provider_category_pages_category_id_idx on provider_category_pages (category_id);
create index provider_category_pages_is_active_idx on provider_category_pages (is_active);

create trigger provider_category_pages_set_updated_at
  before update on provider_category_pages
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- products — the parent catalog entry. Variations (below) carry the actual
-- sellable price tiers; base_price is used only for products with no
-- variations at all.
-- ---------------------------------------------------------------------------

create table products (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid references providers (id) on delete set null,
  category_id uuid references categories (id) on delete set null,
  name text not null,
  slug text not null unique,
  product_type text not null,
  description text,
  short_description text,
  base_price numeric(12, 2),
  currency text not null default 'USD',
  features jsonb not null default '[]'::jsonb,
  whats_included jsonb not null default '[]'::jsonb,
  specifications jsonb not null default '{}'::jsonb,
  image_url text,
  provider_logo_override_url text,
  region text,
  availability availability_status not null default 'in_stock',
  delivery_time_text text,
  support_type text,
  replacement_policy text,
  refund_policy text,
  badge text,
  is_featured boolean not null default false,
  is_popular boolean not null default false,
  is_ai boolean not null default false,
  is_gpu boolean not null default false,
  is_active boolean not null default true,
  sort_order int not null default 0,
  seo_title text,
  seo_description text,
  og_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  search_vector tsvector generated always as (
    setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(short_description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(product_type, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'C')
  ) stored
);

create index products_slug_idx on products (slug);
create index products_provider_id_idx on products (provider_id);
create index products_category_id_idx on products (category_id);
create index products_product_type_idx on products (product_type);
create index products_is_active_idx on products (is_active);
create index products_is_featured_idx on products (is_featured);
create index products_is_ai_idx on products (is_ai);
create index products_is_gpu_idx on products (is_gpu);
create index products_base_price_idx on products (base_price);
create index products_search_vector_idx on products using gin (search_vector);

create trigger products_set_updated_at
  before update on products
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- product_variations — the core of the account/credit/AI tier system.
-- Everything a customer sees (price, features, specs, availability, region,
-- delivery, badge) can differ per variation and updates client-side when the
-- shopper switches selection (no full page reload).
-- ---------------------------------------------------------------------------

create table product_variations (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products (id) on delete cascade,
  name text not null,
  slug text not null,
  price numeric(12, 2) not null,
  currency text not null default 'USD',
  description text,
  features jsonb not null default '[]'::jsonb,
  specifications jsonb not null default '{}'::jsonb,
  region text,
  availability availability_status not null default 'in_stock',
  delivery_time_text text,
  image_url text,
  badge text,
  -- AI-specific fields (nullable; only rendered when populated)
  ai_category text,
  ai_platform text,
  gpu_type text,
  gpu_count int,
  vram text,
  compute_type text,
  model_support text,
  architecture text,
  ai_services jsonb not null default '[]'::jsonb,
  inference_support boolean,
  training_support boolean,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, slug)
);

create index product_variations_product_id_idx on product_variations (product_id);
create index product_variations_is_active_idx on product_variations (is_active);

create trigger product_variations_set_updated_at
  before update on product_variations
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- comparisons — /compare and /compare/[slug]
-- ---------------------------------------------------------------------------

create table comparisons (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  comparison_type comparison_type not null default 'provider_vs_provider',
  provider_ids uuid[] not null default '{}',
  category_id uuid references categories (id) on delete set null,
  description text,
  rows jsonb not null default '[]'::jsonb,
  seo_title text,
  seo_description text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index comparisons_slug_idx on comparisons (slug);
create index comparisons_is_active_idx on comparisons (is_active);

create trigger comparisons_set_updated_at
  before update on comparisons
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- use_cases — /use-cases and /use-cases/[slug]
-- ---------------------------------------------------------------------------

create table use_cases (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  icon text,
  content text,
  related_category_ids uuid[] not null default '{}',
  related_product_type text,
  seo_title text,
  seo_description text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index use_cases_slug_idx on use_cases (slug);
create index use_cases_is_active_idx on use_cases (is_active);

create trigger use_cases_set_updated_at
  before update on use_cases
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- guides — /guides, /guides/[slug] (also serves the Blog, filtered by type)
-- ---------------------------------------------------------------------------

create table guides (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  content text,
  cover_image_url text,
  guide_type guide_type not null default 'guide',
  related_provider_id uuid references providers (id) on delete set null,
  related_category_id uuid references categories (id) on delete set null,
  tags text[] not null default '{}',
  status content_status not null default 'published',
  published_at timestamptz default now(),
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  search_vector tsvector generated always as (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(excerpt, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(content, '')), 'C')
  ) stored
);

create index guides_slug_idx on guides (slug);
create index guides_guide_type_idx on guides (guide_type);
create index guides_status_idx on guides (status);
create index guides_search_vector_idx on guides using gin (search_vector);

create trigger guides_set_updated_at
  before update on guides
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- faqs — global (category text groups them), or scoped to a product/provider
-- ---------------------------------------------------------------------------

create table faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  product_id uuid references products (id) on delete cascade,
  provider_id uuid references providers (id) on delete cascade,
  category text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index faqs_product_id_idx on faqs (product_id);
create index faqs_provider_id_idx on faqs (provider_id);
create index faqs_is_active_idx on faqs (is_active);

create trigger faqs_set_updated_at
  before update on faqs
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- reviews — genuine customer reviews only; no rows are seeded
-- ---------------------------------------------------------------------------

create table reviews (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_role text,
  product_id uuid references products (id) on delete set null,
  quote text not null,
  rating int not null check (rating between 1 and 5),
  country text,
  review_date date not null default current_date,
  is_approved boolean not null default false,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index reviews_product_id_idx on reviews (product_id);
create index reviews_is_approved_idx on reviews (is_approved);

create trigger reviews_set_updated_at
  before update on reviews
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- orders — leads/orders captured from the storefront (Telegram-order flow)
-- and managed from the admin dashboard.
-- ---------------------------------------------------------------------------

create table orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text,
  contact text,
  product_id uuid references products (id) on delete set null,
  variation_id uuid references product_variations (id) on delete set null,
  product_name_snapshot text,
  variation_name_snapshot text,
  price_snapshot numeric(12, 2),
  currency text not null default 'USD',
  order_status order_status not null default 'new',
  payment_status payment_status not null default 'unpaid',
  notes text,
  referrer text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index orders_product_id_idx on orders (product_id);
create index orders_order_status_idx on orders (order_status);
create index orders_created_at_idx on orders (created_at desc);

create trigger orders_set_updated_at
  before update on orders
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- site_settings — singleton row; the single source of truth for the
-- Telegram ordering handle and other global/editable site config
-- ---------------------------------------------------------------------------

create table site_settings (
  id int primary key default 1 check (id = 1),
  site_name text not null default 'GoCloudShop',
  tagline text not null default 'Cloud Access. Simplified.',
  logo_url text,
  favicon_url text,
  telegram_username text not null default 'GoCloudShopSupport',
  support_email text,
  social_links jsonb not null default '{}'::jsonb,
  footer_content jsonb not null default '{}'::jsonb,
  default_seo jsonb not null default '{}'::jsonb,
  privacy_policy text,
  terms_of_service text,
  refund_policy text,
  disclaimer text,
  updated_at timestamptz not null default now()
);

create trigger site_settings_set_updated_at
  before update on site_settings
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- homepage_sections — light CMS for editorial copy blocks (e.g. Why Choose
-- cards, How It Works steps) so copy edits don't require a redeploy.
-- ---------------------------------------------------------------------------

create table homepage_sections (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique,
  title text,
  subtitle text,
  content jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger homepage_sections_set_updated_at
  before update on homepage_sections
  for each row execute function set_updated_at();
