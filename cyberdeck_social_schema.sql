create extension if not exists pgcrypto;

create table if not exists cyberdeck_social_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  email text not null,
  display_name text not null default '',
  status text not null default 'online',
  field_visibility jsonb not null default '{"username":"public","email":"private","displayName":"friends","status":"friends"}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table cyberdeck_social_profiles add column if not exists email text not null default '';
alter table cyberdeck_social_profiles add column if not exists field_visibility jsonb not null default '{"username":"public","email":"private","displayName":"friends","status":"friends"}'::jsonb;

create table if not exists cyberdeck_friend_requests (
  id uuid primary key default gen_random_uuid(),
  from_user uuid not null references auth.users(id) on delete cascade,
  to_user uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending',
  trusted_by_from boolean not null default false,
  trusted_by_to boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint no_self_friend_request check (from_user <> to_user)
);

alter table cyberdeck_friend_requests add column if not exists trusted_by_from boolean not null default false;
alter table cyberdeck_friend_requests add column if not exists trusted_by_to boolean not null default false;

alter table cyberdeck_social_profiles enable row level security;
alter table cyberdeck_friend_requests enable row level security;

drop policy if exists "profiles read" on cyberdeck_social_profiles;
drop policy if exists "profiles insert own" on cyberdeck_social_profiles;
drop policy if exists "profiles update own" on cyberdeck_social_profiles;
create policy "profiles read" on cyberdeck_social_profiles for select using (true);
create policy "profiles insert own" on cyberdeck_social_profiles for insert with check (auth.uid() = user_id);
create policy "profiles update own" on cyberdeck_social_profiles for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "requests read side" on cyberdeck_friend_requests;
drop policy if exists "requests insert own" on cyberdeck_friend_requests;
drop policy if exists "requests update side" on cyberdeck_friend_requests;
drop policy if exists "requests delete side" on cyberdeck_friend_requests;
create policy "requests read side" on cyberdeck_friend_requests for select using (auth.uid() = from_user or auth.uid() = to_user);
create policy "requests insert own" on cyberdeck_friend_requests for insert with check (auth.uid() = from_user);
create policy "requests update side" on cyberdeck_friend_requests for update using (auth.uid() = from_user or auth.uid() = to_user) with check (auth.uid() = from_user or auth.uid() = to_user);
create policy "requests delete side" on cyberdeck_friend_requests for delete using (auth.uid() = from_user or auth.uid() = to_user);

create index if not exists idx_friend_requests_to on cyberdeck_friend_requests (to_user, status);
create index if not exists idx_friend_requests_from on cyberdeck_friend_requests (from_user, status);
create index if not exists idx_social_profiles_username on cyberdeck_social_profiles (username);