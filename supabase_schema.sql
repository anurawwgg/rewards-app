-- ============================================================
-- Loyalty Rewards App — Supabase Schema
-- Run this entire file in the Supabase SQL editor.
-- ============================================================

-- ─── PROFILES ────────────────────────────────────────────────
-- Linked to auth.users. One row per customer.
create table public.profiles (
  id            uuid        primary key references auth.users(id) on delete cascade,
  name          text        not null,
  mobile_number text        not null unique,
  total_points  integer     not null default 0,
  created_at    timestamptz not null default now()
);

-- ─── PURCHASES ───────────────────────────────────────────────
-- Recorded by the admin when a customer makes a purchase.
create table public.purchases (
  id           uuid        primary key default gen_random_uuid(),
  customer_id  uuid        not null references public.profiles(id) on delete cascade,
  amount_spent numeric     not null check (amount_spent > 0),
  points_earned integer    not null check (points_earned >= 0),
  description  text,
  created_at   timestamptz not null default now()
);

-- ─── REWARDS ─────────────────────────────────────────────────
-- The catalog of things customers can redeem points for.
create table public.rewards (
  id              uuid        primary key default gen_random_uuid(),
  name            text        not null,
  description     text,
  points_required integer     not null check (points_required > 0),
  is_active       boolean     not null default true,
  created_at      timestamptz not null default now()
);

-- ─── REDEMPTIONS ─────────────────────────────────────────────
-- Logged when a customer redeems a reward.
create table public.redemptions (
  id          uuid        primary key default gen_random_uuid(),
  customer_id uuid        not null references public.profiles(id) on delete cascade,
  reward_id   uuid        references public.rewards(id) on delete set null,
  reward_name text        not null,  -- snapshot in case reward is later deleted
  points_spent integer    not null check (points_spent > 0),
  created_at  timestamptz not null default now()
);

-- ─── TRIGGER: auto-create profile on signup ──────────────────
-- This fires after a new auth.users row is inserted, so the
-- client never needs two separate API calls at signup.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, mobile_number)
  values (
    new.id,
    new.raw_user_meta_data ->> 'name',
    new.raw_user_meta_data ->> 'mobile_number'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── RPC: add_points ─────────────────────────────────────────
-- Atomically adds points to a customer's balance.
-- Called by the admin after inserting a purchase row.
create or replace function public.add_points(customer_id uuid, delta integer)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
  set total_points = total_points + delta
  where id = customer_id;
end;
$$;

-- ─── RPC: redeem_reward ──────────────────────────────────────
-- Atomically checks balance, inserts redemption, deducts points.
-- Returns 'ok' on success, 'insufficient_points' on failure.
create or replace function public.redeem_reward(
  p_customer_id  uuid,
  p_reward_id    uuid,
  p_reward_name  text,
  p_points_cost  integer
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  current_points integer;
begin
  -- lock the profile row for the duration of this transaction
  select total_points into current_points
  from public.profiles
  where id = p_customer_id
  for update;

  if current_points < p_points_cost then
    return 'insufficient_points';
  end if;

  insert into public.redemptions (customer_id, reward_id, reward_name, points_spent)
  values (p_customer_id, p_reward_id, p_reward_name, p_points_cost);

  update public.profiles
  set total_points = total_points - p_points_cost
  where id = p_customer_id;

  return 'ok';
end;
$$;

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────

alter table public.profiles    enable row level security;
alter table public.purchases   enable row level security;
alter table public.rewards     enable row level security;
alter table public.redemptions enable row level security;

-- profiles: customers can read/update only their own row
create policy "profiles: own row select"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles: own row update"
  on public.profiles for update
  using (auth.uid() = id);

-- purchases: customers can read their own purchases
create policy "purchases: own rows select"
  on public.purchases for select
  using (auth.uid() = customer_id);

-- purchases: only service_role (used by admin RPCs) can insert
-- The admin panel calls the add_points() RPC (security definer),
-- which runs as the function owner, bypassing RLS.
-- Direct inserts from the client are done via the anon key but
-- we need to allow insert for authenticated users acting as admin.
-- We handle admin authorization at the application layer (password gate).
create policy "purchases: insert for authenticated"
  on public.purchases for insert
  with check (true);

-- rewards: anyone (even unauthenticated) can read active rewards
create policy "rewards: public read active"
  on public.rewards for select
  using (is_active = true);

-- rewards: authenticated users can read all (admin needs inactive ones too)
create policy "rewards: authenticated read all"
  on public.rewards for select
  using (auth.role() = 'authenticated');

-- rewards: insert/update for authenticated (admin gate is in the app)
create policy "rewards: authenticated insert"
  on public.rewards for insert
  with check (auth.role() = 'authenticated');

create policy "rewards: authenticated update"
  on public.rewards for update
  using (auth.role() = 'authenticated');

-- redemptions: customers read their own
create policy "redemptions: own rows select"
  on public.redemptions for select
  using (auth.uid() = customer_id);

-- redemptions: insert only via RPC (security definer, bypasses RLS)
-- No direct client insert policy needed.
