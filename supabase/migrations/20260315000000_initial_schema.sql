-- Initial Schema for Safia Sales SaaS

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  role text default 'partner' check (role in ('partner', 'super_admin')),
  balance numeric default 0,
  telegram_chat_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Trigger for new user to create profile
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'partner');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Products (Funnels) Table
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  description text,
  price numeric not null,
  image_url text,
  slug text unique not null,
  pixel_fb_id text,
  pixel_tt_id text,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Orders Table
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references public.products(id) on delete set null,
  customer_name text not null,
  customer_phone text not null,
  address_region text,
  payment_method text check (payment_method in ('Click', 'Payme', 'Uzum Nasiya', 'Alif Nasiya', 'Cash')),
  status text default 'lead' check (status in ('lead', 'pending', 'paid', 'cancelled')),
  source_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Seller Integrations
create table public.seller_integrations (
  user_id uuid references public.profiles(id) on delete cascade not null primary key,
  click_merchant_id text,
  click_service_id text,
  click_secret_key text,
  payme_merchant_id text,
  uzum_nasiya_id text,
  alif_nasiya_token text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Payments History
create table public.payments_history (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  amount numeric not null,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  receipt_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS setup
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.seller_integrations enable row level security;
alter table public.payments_history enable row level security;

-- Super Admin Policies Function
create or replace function public.is_super_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'super_admin'
  );
$$ language sql security definer;

-- Profiles Policies
create policy "Users can view own profile" on public.profiles for select using ( auth.uid() = id );
create policy "Users can update own profile" on public.profiles for update using ( auth.uid() = id );
create policy "Super Admins can view all profiles" on public.profiles for select using ( public.is_super_admin() );
create policy "Super Admins can update all profiles" on public.profiles for update using ( public.is_super_admin() );

-- Products Policies
create policy "Public can view approved products" on public.products for select using ( status = 'approved' );
create policy "Users can view own products" on public.products for select using ( auth.uid() = user_id );
create policy "Users can insert own products" on public.products for insert with check ( auth.uid() = user_id );
create policy "Users can update own products" on public.products for update using ( auth.uid() = user_id );
create policy "Super Admins can view all products" on public.products for select using ( public.is_super_admin() );
create policy "Super Admins can update all products" on public.products for update using ( public.is_super_admin() );

-- Orders Policies
create policy "Public can insert purely new orders (leads)" on public.orders for insert with check ( true );
-- Recreating this policy more restrictively requires checking if the public.product belongs to user etc.
create policy "Users can view their orders" on public.orders for select using ( 
  exists(select 1 from public.products where products.id = orders.product_id and products.user_id = auth.uid()) 
);
create policy "Users can update their orders" on public.orders for update using ( 
  exists(select 1 from public.products where products.id = orders.product_id and products.user_id = auth.uid()) 
);

-- Payments History Policies
create policy "Users can view own payments" on public.payments_history for select using ( auth.uid() = user_id );
create policy "Users can insert own payments" on public.payments_history for insert with check ( auth.uid() = user_id );
create policy "Super Admins can view all payments" on public.payments_history for select using ( public.is_super_admin() );
create policy "Super Admins can update all payments" on public.payments_history for update using ( public.is_super_admin() );
