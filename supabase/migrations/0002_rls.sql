-- GoCloudShop — Row Level Security
-- Public (anon) visitors may only ever read active/published/approved rows.
-- All writes, and all reads of inactive/unpublished/unapproved rows, require
-- staff (admin or editor). Never grant anonymous users insert/update/delete
-- on catalog or settings tables.

create function is_staff() returns boolean as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role in ('admin', 'editor')
  );
$$ language sql security definer stable;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------

alter table profiles enable row level security;

create policy "profiles_select_own_or_staff" on profiles
  for select using (auth.uid() = id or is_staff());

create policy "profiles_update_own" on profiles
  for update using (auth.uid() = id);

create policy "profiles_staff_manage" on profiles
  for all using (is_staff()) with check (is_staff());

-- ---------------------------------------------------------------------------
-- providers — fully public-readable (no draft state)
-- ---------------------------------------------------------------------------

alter table providers enable row level security;

create policy "providers_public_read" on providers for select using (true);

create policy "providers_staff_write" on providers
  for insert with check (is_staff());
create policy "providers_staff_update" on providers
  for update using (is_staff()) with check (is_staff());
create policy "providers_staff_delete" on providers
  for delete using (is_staff());

-- ---------------------------------------------------------------------------
-- categories — fully public-readable
-- ---------------------------------------------------------------------------

alter table categories enable row level security;

create policy "categories_public_read" on categories for select using (true);

create policy "categories_staff_write" on categories
  for insert with check (is_staff());
create policy "categories_staff_update" on categories
  for update using (is_staff()) with check (is_staff());
create policy "categories_staff_delete" on categories
  for delete using (is_staff());

-- ---------------------------------------------------------------------------
-- provider_category_pages
-- ---------------------------------------------------------------------------

alter table provider_category_pages enable row level security;

create policy "provider_category_pages_read" on provider_category_pages
  for select using (is_active or is_staff());

create policy "provider_category_pages_staff_write" on provider_category_pages
  for insert with check (is_staff());
create policy "provider_category_pages_staff_update" on provider_category_pages
  for update using (is_staff()) with check (is_staff());
create policy "provider_category_pages_staff_delete" on provider_category_pages
  for delete using (is_staff());

-- ---------------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------------

alter table products enable row level security;

create policy "products_read" on products
  for select using (is_active or is_staff());

create policy "products_staff_write" on products
  for insert with check (is_staff());
create policy "products_staff_update" on products
  for update using (is_staff()) with check (is_staff());
create policy "products_staff_delete" on products
  for delete using (is_staff());

-- ---------------------------------------------------------------------------
-- product_variations
-- ---------------------------------------------------------------------------

alter table product_variations enable row level security;

create policy "product_variations_read" on product_variations
  for select using (is_active or is_staff());

create policy "product_variations_staff_write" on product_variations
  for insert with check (is_staff());
create policy "product_variations_staff_update" on product_variations
  for update using (is_staff()) with check (is_staff());
create policy "product_variations_staff_delete" on product_variations
  for delete using (is_staff());

-- ---------------------------------------------------------------------------
-- comparisons
-- ---------------------------------------------------------------------------

alter table comparisons enable row level security;

create policy "comparisons_read" on comparisons
  for select using (is_active or is_staff());

create policy "comparisons_staff_write" on comparisons
  for insert with check (is_staff());
create policy "comparisons_staff_update" on comparisons
  for update using (is_staff()) with check (is_staff());
create policy "comparisons_staff_delete" on comparisons
  for delete using (is_staff());

-- ---------------------------------------------------------------------------
-- use_cases
-- ---------------------------------------------------------------------------

alter table use_cases enable row level security;

create policy "use_cases_read" on use_cases
  for select using (is_active or is_staff());

create policy "use_cases_staff_write" on use_cases
  for insert with check (is_staff());
create policy "use_cases_staff_update" on use_cases
  for update using (is_staff()) with check (is_staff());
create policy "use_cases_staff_delete" on use_cases
  for delete using (is_staff());

-- ---------------------------------------------------------------------------
-- guides
-- ---------------------------------------------------------------------------

alter table guides enable row level security;

create policy "guides_read" on guides
  for select using (status = 'published' or is_staff());

create policy "guides_staff_write" on guides
  for insert with check (is_staff());
create policy "guides_staff_update" on guides
  for update using (is_staff()) with check (is_staff());
create policy "guides_staff_delete" on guides
  for delete using (is_staff());

-- ---------------------------------------------------------------------------
-- faqs
-- ---------------------------------------------------------------------------

alter table faqs enable row level security;

create policy "faqs_read" on faqs
  for select using (is_active or is_staff());

create policy "faqs_staff_write" on faqs
  for insert with check (is_staff());
create policy "faqs_staff_update" on faqs
  for update using (is_staff()) with check (is_staff());
create policy "faqs_staff_delete" on faqs
  for delete using (is_staff());

-- ---------------------------------------------------------------------------
-- reviews — only approved reviews are publicly visible
-- ---------------------------------------------------------------------------

alter table reviews enable row level security;

create policy "reviews_read" on reviews
  for select using (is_approved or is_staff());

create policy "reviews_staff_write" on reviews
  for insert with check (is_staff());
create policy "reviews_staff_update" on reviews
  for update using (is_staff()) with check (is_staff());
create policy "reviews_staff_delete" on reviews
  for delete using (is_staff());

-- ---------------------------------------------------------------------------
-- orders — anyone may create an order/lead (storefront checkout), but only
-- staff may ever read, update, or delete them.
-- ---------------------------------------------------------------------------

alter table orders enable row level security;

create policy "orders_public_insert" on orders
  for insert with check (true);

create policy "orders_staff_select" on orders
  for select using (is_staff());
create policy "orders_staff_update" on orders
  for update using (is_staff()) with check (is_staff());
create policy "orders_staff_delete" on orders
  for delete using (is_staff());

-- ---------------------------------------------------------------------------
-- site_settings — fully public-readable singleton, staff-only write
-- ---------------------------------------------------------------------------

alter table site_settings enable row level security;

create policy "site_settings_public_read" on site_settings for select using (true);

create policy "site_settings_staff_update" on site_settings
  for update using (is_staff()) with check (is_staff());
create policy "site_settings_staff_insert" on site_settings
  for insert with check (is_staff());

-- ---------------------------------------------------------------------------
-- homepage_sections — public-readable when active, staff-only write
-- ---------------------------------------------------------------------------

alter table homepage_sections enable row level security;

create policy "homepage_sections_read" on homepage_sections
  for select using (is_active or is_staff());

create policy "homepage_sections_staff_write" on homepage_sections
  for insert with check (is_staff());
create policy "homepage_sections_staff_update" on homepage_sections
  for update using (is_staff()) with check (is_staff());
create policy "homepage_sections_staff_delete" on homepage_sections
  for delete using (is_staff());
