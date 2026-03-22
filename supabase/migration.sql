-- Symposium Bingo — Supabase Setup
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- 1. Players table
create table if not exists players (
  id uuid primary key default gen_random_uuid(),
  session_id text unique not null,
  name text not null,
  board jsonb not null,
  marked jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

-- 2. Photos table
create table if not exists photos (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references players(id) on delete cascade,
  square_index integer not null check (square_index >= 0 and square_index <= 24),
  photo_url text not null,
  created_at timestamptz not null default now()
);

-- 3. Wins table
create table if not exists wins (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references players(id) on delete cascade,
  claim_code text unique not null,
  winning_line jsonb not null,
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

-- 4. Indexes
create index if not exists idx_players_session_id on players(session_id);
create index if not exists idx_photos_player_id on photos(player_id);
create index if not exists idx_wins_player_id on wins(player_id);
create index if not exists idx_wins_claim_code on wins(claim_code);

-- 5. Row Level Security (RLS)
-- Enable RLS on all tables
alter table players enable row level security;
alter table photos enable row level security;
alter table wins enable row level security;

-- Players: anyone can insert and read their own row (matched by session_id via anon key)
create policy "Anyone can create a player"
  on players for insert
  to anon
  with check (true);

create policy "Anyone can read players"
  on players for select
  to anon
  using (true);

create policy "Anyone can update their own player"
  on players for update
  to anon
  using (true)
  with check (true);

-- Photos: anyone can insert and read
create policy "Anyone can upload photos"
  on photos for insert
  to anon
  with check (true);

create policy "Anyone can view photos"
  on photos for select
  to anon
  using (true);

-- Wins: anyone can insert and read
create policy "Anyone can claim a win"
  on wins for insert
  to anon
  with check (true);

create policy "Anyone can view wins"
  on wins for select
  to anon
  using (true);

-- 6. Storage bucket
insert into storage.buckets (id, name, public)
values ('bingo-photos', 'bingo-photos', true)
on conflict (id) do nothing;

-- Storage policies: anyone can upload and read photos
create policy "Anyone can upload bingo photos"
  on storage.objects for insert
  to anon
  with check (bucket_id = 'bingo-photos');

create policy "Anyone can view bingo photos"
  on storage.objects for select
  to anon
  using (bucket_id = 'bingo-photos');

create policy "Anyone can update bingo photos"
  on storage.objects for update
  to anon
  using (bucket_id = 'bingo-photos')
  with check (bucket_id = 'bingo-photos');
