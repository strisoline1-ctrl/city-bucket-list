-- Add payment_url to drivers so each driver can store their CashApp / Venmo / PayPal / etc. link.
-- Run in Supabase SQL editor after 0001_init.sql.

alter table drivers
  add column if not exists payment_url text;
