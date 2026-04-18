-- MyKapiGo initial schema
-- Creates all core tables with RLS enabled.

create extension if not exists "pgcrypto";

-- ============================================================
-- PROFILES (extends auth.users for admin flag)
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  is_admin boolean default false,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Helper function: is the current auth user an admin?
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
$$;

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- CATEGORIES
-- ============================================================
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  image_url text,
  sort_order int default 0,
  created_at timestamptz default now()
);

alter table public.categories enable row level security;

drop policy if exists "Anyone can read categories" on public.categories;
create policy "Anyone can read categories"
  on public.categories for select using (true);

drop policy if exists "Admins manage categories" on public.categories;
create policy "Admins manage categories"
  on public.categories for all using (public.is_admin()) with check (public.is_admin());

-- ============================================================
-- PRODUCTS
-- ============================================================
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  price numeric(10,2) not null default 0,
  currency text default 'INR',
  category_id uuid references public.categories(id) on delete set null,
  image_url text,
  gallery jsonb default '[]'::jsonb,
  stock int default 0,
  is_active boolean default true,
  featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_products_category on public.products(category_id);
create index if not exists idx_products_active on public.products(is_active);

alter table public.products enable row level security;

drop policy if exists "Anyone can read active products" on public.products;
create policy "Anyone can read active products"
  on public.products for select using (is_active = true or public.is_admin());

drop policy if exists "Admins manage products" on public.products;
create policy "Admins manage products"
  on public.products for all using (public.is_admin()) with check (public.is_admin());

-- ============================================================
-- ORDERS
-- ============================================================
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null default ('MKG-' || to_char(now(),'YYMMDD') || '-' || substr(gen_random_uuid()::text,1,6)),
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  shipping_address jsonb not null,
  subtotal numeric(10,2) not null default 0,
  shipping_fee numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  currency text default 'INR',
  status text not null default 'pending',        -- pending | paid | processing | shipped | delivered | cancelled
  payment_status text not null default 'pending', -- pending | success | failed | refunded
  payment_method text default 'phonepe',
  payment_txn_id text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_created on public.orders(created_at desc);

alter table public.orders enable row level security;

-- Public can insert (guest checkout) and read by order_number from the server
drop policy if exists "Anyone can create an order" on public.orders;
create policy "Anyone can create an order"
  on public.orders for insert with check (true);

drop policy if exists "Admins read all orders" on public.orders;
create policy "Admins read all orders"
  on public.orders for select using (public.is_admin());

drop policy if exists "Admins manage orders" on public.orders;
create policy "Admins manage orders"
  on public.orders for update using (public.is_admin()) with check (public.is_admin());

-- ============================================================
-- ORDER ITEMS
-- ============================================================
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  product_image text,
  unit_price numeric(10,2) not null,
  quantity int not null check (quantity > 0),
  line_total numeric(10,2) not null,
  created_at timestamptz default now()
);

create index if not exists idx_order_items_order on public.order_items(order_id);

alter table public.order_items enable row level security;

drop policy if exists "Anyone can insert order items" on public.order_items;
create policy "Anyone can insert order items"
  on public.order_items for insert with check (true);

drop policy if exists "Admins read order items" on public.order_items;
create policy "Admins read order items"
  on public.order_items for select using (public.is_admin());

-- ============================================================
-- SERVICE REQUESTS (Buy From India)
-- ============================================================
create table if not exists public.service_requests (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  email text not null,
  country text not null,
  whatsapp text,
  product_name text not null,
  product_link text,
  product_description text,
  quantity int default 1,
  budget numeric(10,2),
  currency text default 'USD',
  shipping_destination text not null,
  notes text,
  status text default 'new', -- new | quoted | approved | sourcing | shipped | closed
  created_at timestamptz default now()
);

create index if not exists idx_service_requests_status on public.service_requests(status);

alter table public.service_requests enable row level security;

drop policy if exists "Anyone can submit a service request" on public.service_requests;
create policy "Anyone can submit a service request"
  on public.service_requests for insert with check (true);

drop policy if exists "Admins read service requests" on public.service_requests;
create policy "Admins read service requests"
  on public.service_requests for select using (public.is_admin());

drop policy if exists "Admins update service requests" on public.service_requests;
create policy "Admins update service requests"
  on public.service_requests for update using (public.is_admin()) with check (public.is_admin());

-- ============================================================
-- CONTACTS
-- ============================================================
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  handled boolean default false,
  created_at timestamptz default now()
);

alter table public.contacts enable row level security;

drop policy if exists "Anyone can submit a contact" on public.contacts;
create policy "Anyone can submit a contact"
  on public.contacts for insert with check (true);

drop policy if exists "Admins read contacts" on public.contacts;
create policy "Admins read contacts"
  on public.contacts for select using (public.is_admin());

drop policy if exists "Admins update contacts" on public.contacts;
create policy "Admins update contacts"
  on public.contacts for update using (public.is_admin()) with check (public.is_admin());

-- ============================================================
-- PAYMENTS
-- ============================================================
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  provider text not null default 'phonepe',
  merchant_txn_id text unique,
  provider_txn_id text,
  amount numeric(10,2) not null,
  currency text default 'INR',
  status text not null default 'pending',
  raw_response jsonb,
  created_at timestamptz default now()
);

alter table public.payments enable row level security;

drop policy if exists "Anyone can create a payment intent" on public.payments;
create policy "Anyone can create a payment intent"
  on public.payments for insert with check (true);

drop policy if exists "Admins read payments" on public.payments;
create policy "Admins read payments"
  on public.payments for select using (public.is_admin());

-- ============================================================
-- SHIPPING UPDATES
-- ============================================================
create table if not exists public.shipping_updates (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  status text not null,
  location text,
  note text,
  created_at timestamptz default now()
);

create index if not exists idx_shipping_order on public.shipping_updates(order_id);

alter table public.shipping_updates enable row level security;

drop policy if exists "Admins manage shipping updates" on public.shipping_updates;
create policy "Admins manage shipping updates"
  on public.shipping_updates for all using (public.is_admin()) with check (public.is_admin());
