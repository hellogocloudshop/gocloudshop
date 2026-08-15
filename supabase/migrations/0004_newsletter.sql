-- GoCloudShop — newsletter subscribers (kept separate from orders/leads so
-- the admin Orders inbox only ever shows real product orders).

create table newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table newsletter_subscribers enable row level security;

create policy "newsletter_public_insert" on newsletter_subscribers
  for insert with check (true);

create policy "newsletter_staff_select" on newsletter_subscribers
  for select using (is_staff());

create policy "newsletter_staff_delete" on newsletter_subscribers
  for delete using (is_staff());
