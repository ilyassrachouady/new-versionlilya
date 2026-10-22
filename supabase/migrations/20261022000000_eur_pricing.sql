-- Execute once in the SQL editor for project eapbuabfehdzcdtwfhsv.
-- Reference: 2026-10-22, 1 EUR = 10.9953 MAD.
-- Source: https://mparsio.com/outils/taux-de-change (Bank Al-Maghrib reference).
-- Additive rollout: the old site can keep working until the EUR release is deployed.
-- Existing orders and order_items retain their original amounts and currencies.
begin;

alter table public.products
  add column if not exists price_eur numeric(12,2),
  add column if not exists currency text not null default 'EUR';

-- Only convert rows that have never been migrated. Safe to run again.
update public.products
set price_eur = round(price_mad / 10.9953, 2),
    currency = 'EUR',
    metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
      'eur_migration', jsonb_build_object(
        'original_price_mad', price_mad,
        'mad_per_eur', 10.9953,
        'rate_date', '2026-10-22',
        'converted_at', now()
      )
    )
where price_eur is null;

alter table public.products alter column price_eur set not null;
alter table public.products alter column price_mad set default 0;

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'products_price_eur_nonnegative' and conrelid = 'public.products'::regclass) then
    alter table public.products add constraint products_price_eur_nonnegative check (price_eur >= 0);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'products_currency_eur' and conrelid = 'public.products'::regclass) then
    alter table public.products add constraint products_currency_eur check (currency = 'EUR');
  end if;
end $$;

-- Temporary compatibility for the currently deployed MAD dashboard.
-- The EUR application reads/writes price_eur only. The legacy column is a rollback aid.
create or replace function public.sync_product_eur_rollout()
returns trigger language plpgsql set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    if new.price_eur is null then
      new.price_eur := round(new.price_mad / 10.9953, 2);
    else
      new.price_mad := round(new.price_eur * 10.9953, 2);
    end if;
  elsif new.price_eur is distinct from old.price_eur then
    new.price_mad := round(new.price_eur * 10.9953, 2);
  elsif new.price_mad is distinct from old.price_mad then
    new.price_eur := round(new.price_mad / 10.9953, 2);
  end if;
  new.currency := 'EUR';
  return new;
end $$;

drop trigger if exists products_sync_eur_rollout on public.products;
create trigger products_sync_eur_rollout before insert or update on public.products
for each row execute function public.sync_product_eur_rollout();

alter table public.orders alter column currency set default 'EUR';

notify pgrst, 'reload schema';
commit;

-- Expected: 26 existing products, each with currency EUR and converted price_eur.
select slug, price_mad as legacy_mad, price_eur, currency
from public.products order by slug;
