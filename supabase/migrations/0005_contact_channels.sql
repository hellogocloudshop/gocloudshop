-- GoCloudShop — additional customer contact channels on the existing
-- site_settings singleton (WhatsApp + Telegram Channel), alongside the
-- pre-existing telegram_username. No new tables — this extends the same
-- centralized settings row everything else already reads from.

alter table site_settings
  add column if not exists whatsapp_number text,
  add column if not exists telegram_channel_url text;

comment on column site_settings.whatsapp_number is
  'Digits-only international WhatsApp number (e.g. 15551234567), used to build wa.me click-to-chat links. Null = WhatsApp contact is hidden site-wide until configured.';
comment on column site_settings.telegram_channel_url is
  'Full URL of the public Telegram announcements channel (distinct from telegram_username, which is the support/order contact). Null = Telegram Channel links are hidden site-wide until configured.';
