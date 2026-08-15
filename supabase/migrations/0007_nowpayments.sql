-- Extends the existing `orders` table with NOWPayments cryptocurrency
-- payment fields, rather than creating a second/parallel payment system.
-- All new columns are additive and nullable — every existing Telegram-lead
-- order row is unaffected (they simply stay null in these columns).

alter table orders
  add column if not exists payment_provider text,
  add column if not exists nowpayments_payment_id text,
  add column if not exists nowpayments_order_id text,
  add column if not exists pay_currency text,
  add column if not exists pay_amount numeric(20, 8),
  add column if not exists pay_address text,
  add column if not exists outcome_amount numeric(20, 8),
  add column if not exists outcome_currency text,
  add column if not exists crypto_payment_status text,
  add column if not exists ipn_payload jsonb,
  add column if not exists paid_at timestamptz,
  add column if not exists fulfilled_at timestamptz;

-- Prevent duplicate order/payment records for the same NOWPayments payment
-- or order id (defense against duplicate create-payment calls and replayed
-- IPNs). Partial unique indexes, not table-level constraints, so the many
-- existing/future non-crypto rows — which leave these columns null — never
-- collide with each other.
create unique index if not exists orders_nowpayments_payment_id_key
  on orders (nowpayments_payment_id) where nowpayments_payment_id is not null;
create unique index if not exists orders_nowpayments_order_id_key
  on orders (nowpayments_order_id) where nowpayments_order_id is not null;

create index if not exists orders_payment_provider_idx on orders (payment_provider);

comment on column orders.payment_provider is 'e.g. ''nowpayments''. Null for the existing Telegram-lead flow.';
comment on column orders.nowpayments_payment_id is 'NOWPayments'' own payment id (from the create-payment response). Unique when set.';
comment on column orders.nowpayments_order_id is 'The order_id we sent to NOWPayments when creating the payment (equals orders.id). Unique when set.';
comment on column orders.crypto_payment_status is 'Raw NOWPayments payment_status string (waiting/confirming/confirmed/sending/partially_paid/finished/failed/refunded/expired) — kept alongside the coarser payment_status enum for exact auditability.';
comment on column orders.ipn_payload is 'Most recent verified IPN payload for this order, for audit/debugging. Never contains secrets — NOWPayments does not include API keys or the IPN secret in payment notifications.';
comment on column orders.fulfilled_at is 'Set manually by staff once the account/credentials have been delivered — this project has no automated provisioning system, matching the rest of the site''s manual Telegram-fulfillment workflow.';
