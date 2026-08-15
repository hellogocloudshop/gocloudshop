-- Adds a "stock_update" guide_type so the existing guides table/CRUD/admin
-- architecture can also power the new "Stock Updates" marketplace feed
-- (dated stock-availability announcements) without a second content system.
-- price/currency/availability are additive, nullable columns — every
-- existing guide/blog/provider-guide row is unaffected (they stay null).

alter type guide_type add value if not exists 'stock_update';

alter table guides
  add column if not exists price numeric(12, 2),
  add column if not exists currency text not null default 'USD',
  add column if not exists availability availability_status;

comment on column guides.price is 'Only meaningful for guide_type = stock_update; null for ordinary guides/blog posts.';
comment on column guides.availability is 'Only meaningful for guide_type = stock_update; null for ordinary guides/blog posts.';
