-- MarketLab schema: profiles, markets, positions, ledger_entries

-- Enums
create type public.market_status as enum ('open', 'closed', 'resolved');

create type public.ledger_entry_type as enum (
  'signup_bonus',
  'trade_buy',
  'trade_sell',
  'market_payout',
  'adjustment'
);

-- Profiles (one-to-one with auth.users)
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  balance_cents bigint not null default 0 check (balance_cents >= 0),
  first_name text not null default '',
  last_name text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Binary Yes/No markets
create table public.markets (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  status public.market_status not null default 'open',
  close_date timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- One row per user per market
create table public.positions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  market_id uuid not null references public.markets (id) on delete cascade,
  yes_shares_cents bigint not null default 0 check (yes_shares_cents >= 0),
  no_shares_cents bigint not null default 0 check (no_shares_cents >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, market_id)
);

create index positions_user_id_idx on public.positions (user_id);
create index positions_market_id_idx on public.positions (market_id);

-- Append-only ledger
create table public.ledger_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  market_id uuid references public.markets (id) on delete set null,
  amount_cents bigint not null,
  entry_type public.ledger_entry_type not null,
  description text,
  created_at timestamptz not null default now()
);

create index ledger_entries_user_id_idx on public.ledger_entries (user_id);

-- updated_at helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

create trigger markets_set_updated_at
  before update on public.markets
  for each row
  execute function public.set_updated_at();

create trigger positions_set_updated_at
  before update on public.positions
  for each row
  execute function public.set_updated_at();

-- Create profile on signup ($10,000 fake starting balance)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, first_name, last_name, balance_cents)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', ''),
    1000000
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.markets enable row level security;
alter table public.positions enable row level security;
alter table public.ledger_entries enable row level security;

-- Public market reads
create policy "markets_select_public"
  on public.markets
  for select
  to anon, authenticated
  using (true);

-- Owner-scoped reads (no client writes)
create policy "profiles_select_own"
  on public.profiles
  for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "positions_select_own"
  on public.positions
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "ledger_entries_select_own"
  on public.ledger_entries
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- Data API grants (RLS still applies)
grant select on public.markets to anon, authenticated;
grant select on public.profiles to authenticated;
grant select on public.positions to authenticated;
grant select on public.ledger_entries to authenticated;
