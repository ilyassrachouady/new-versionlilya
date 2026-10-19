-- Schéma initial Maison Lilya Zahra pour Supabase/PostgreSQL.
-- Toutes les tables exposées utilisent RLS. Les écritures administratives
-- nécessitent un utilisateur Supabase Auth présent dans public.profiles.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'staff' check (role in ('owner', 'admin', 'staff')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role in ('owner', 'admin')
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  sku text not null unique,
  slug text not null unique,
  name text not null,
  description text,
  price_mad numeric(12,2) not null check (price_mad >= 0),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  low_stock_threshold integer not null default 10 check (low_stock_threshold >= 0),
  status text not null default 'draft' check (status in ('draft', 'active', 'archived')),
  image_url text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  status text not null default 'draft' check (status in ('draft', 'live', 'archived')),
  color text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.collection_products (
  collection_id uuid not null references public.collections(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  position integer not null default 0,
  primary key (collection_id, product_id)
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  full_name text not null,
  phone text,
  country text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_id uuid references public.customers(id) on delete set null,
  email text not null,
  status text not null default 'pending' check (status in ('pending', 'processing', 'fulfilled', 'shipped', 'delivered', 'cancelled', 'refunded')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  currency text not null default 'MAD',
  subtotal numeric(12,2) not null check (subtotal >= 0),
  shipping_total numeric(12,2) not null default 0 check (shipping_total >= 0),
  total numeric(12,2) not null check (total >= 0),
  shipping_address jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  sku text not null,
  name text not null,
  unit_price numeric(12,2) not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default now()
);

create table if not exists public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  quantity integer not null check (quantity <> 0),
  reason text not null,
  reference text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.content_entries (
  id uuid primary key default gen_random_uuid(),
  key text not null,
  locale text not null default 'fr',
  title text,
  body jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (key, locale)
);

create index if not exists products_status_idx on public.products(status);
create index if not exists orders_customer_id_idx on public.orders(customer_id);
create index if not exists orders_created_at_idx on public.orders(created_at desc);
create index if not exists inventory_movements_product_id_idx on public.inventory_movements(product_id, created_at desc);
create index if not exists content_entries_key_locale_idx on public.content_entries(key, locale);

drop trigger if exists products_set_updated_at on public.products;
drop trigger if exists collections_set_updated_at on public.collections;
drop trigger if exists customers_set_updated_at on public.customers;
drop trigger if exists orders_set_updated_at on public.orders;
drop trigger if exists content_entries_set_updated_at on public.content_entries;
drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger products_set_updated_at before update on public.products for each row execute function public.set_updated_at();
create trigger collections_set_updated_at before update on public.collections for each row execute function public.set_updated_at();
create trigger customers_set_updated_at before update on public.customers for each row execute function public.set_updated_at();
create trigger orders_set_updated_at before update on public.orders for each row execute function public.set_updated_at();
create trigger content_entries_set_updated_at before update on public.content_entries for each row execute function public.set_updated_at();
create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.collections enable row level security;
alter table public.collection_products enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.inventory_movements enable row level security;
alter table public.content_entries enable row level security;

revoke all on table public.profiles, public.products, public.collections, public.collection_products, public.customers, public.orders, public.order_items, public.inventory_movements, public.content_entries from anon, authenticated;
grant select on public.products, public.collections, public.collection_products, public.content_entries to anon, authenticated;
grant select, insert, update, delete on public.profiles, public.products, public.collections, public.collection_products, public.customers, public.orders, public.order_items, public.inventory_movements, public.content_entries to authenticated;

drop policy if exists "Produits actifs visibles publiquement" on public.products;
drop policy if exists "Collections publiées visibles publiquement" on public.collections;
drop policy if exists "Associations des collections visibles publiquement" on public.collection_products;
drop policy if exists "Contenus publiés visibles publiquement" on public.content_entries;
drop policy if exists "Administrateurs gèrent les profils" on public.profiles;
drop policy if exists "Utilisateur consulte son profil" on public.profiles;
drop policy if exists "Administrateurs gèrent les produits" on public.products;
drop policy if exists "Administrateurs gèrent les collections" on public.collections;
drop policy if exists "Administrateurs gèrent les associations" on public.collection_products;
drop policy if exists "Administrateurs gèrent les clients" on public.customers;
drop policy if exists "Administrateurs gèrent les commandes" on public.orders;
drop policy if exists "Administrateurs gèrent les lignes de commande" on public.order_items;
drop policy if exists "Administrateurs gèrent les mouvements de stock" on public.inventory_movements;
drop policy if exists "Administrateurs gèrent les contenus" on public.content_entries;

create policy "Produits actifs visibles publiquement" on public.products for select to anon, authenticated using (status = 'active' or (select public.is_admin()));
create policy "Collections publiées visibles publiquement" on public.collections for select to anon, authenticated using (status = 'live' or (select public.is_admin()));
create policy "Associations des collections visibles publiquement" on public.collection_products for select to anon, authenticated using (true);
create policy "Contenus publiés visibles publiquement" on public.content_entries for select to anon, authenticated using (status = 'published' or (select public.is_admin()));

create policy "Administrateurs gèrent les profils" on public.profiles for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Utilisateur consulte son profil" on public.profiles for select to authenticated using (id = (select auth.uid()));
create policy "Administrateurs gèrent les produits" on public.products for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Administrateurs gèrent les collections" on public.collections for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Administrateurs gèrent les associations" on public.collection_products for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Administrateurs gèrent les clients" on public.customers for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Administrateurs gèrent les commandes" on public.orders for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Administrateurs gèrent les lignes de commande" on public.order_items for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Administrateurs gèrent les mouvements de stock" on public.inventory_movements for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Administrateurs gèrent les contenus" on public.content_entries for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
