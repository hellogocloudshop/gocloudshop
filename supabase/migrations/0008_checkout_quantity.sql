-- Adds quantity support to the existing `orders` table for the new direct
-- online checkout flow (Buy Now -> Checkout -> NOWPayments), rather than
-- creating a second order/line-item system. Additive and safe: every
-- existing order row (Telegram leads, and NOWPayments orders created before
-- this migration) simply defaults to quantity = 1, which is exactly what
-- they always implicitly were.

alter table orders
  add column if not exists quantity integer not null default 1;

-- Plain PostgreSQL has no "add constraint if not exists", so this is
-- guarded manually to keep the migration safely re-runnable like every
-- other statement here.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'orders_quantity_positive'
  ) then
    alter table orders add constraint orders_quantity_positive check (quantity > 0);
  end if;
end $$;

comment on column orders.quantity is 'Number of units of the same product/variation in this order. Always 1 for the existing Telegram-lead flow; price_snapshot for NOWPayments orders is the total (unit price x quantity), not the unit price.';
