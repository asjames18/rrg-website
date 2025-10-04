-- Production-Safe Auth Schema for RRG Website
-- Run this in Supabase SQL Editor

-- Profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  display_name text,
  created_at timestamptz default now()
);

-- Create profile row on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, split_part(new.email, '@', 1))
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Roles
do $$ 
begin
  create type public.app_role as enum ('user','admin');
exception when duplicate_object then null; 
end $$;

create table if not exists public.user_roles(
  user_id uuid references auth.users(id) on delete cascade,
  role public.app_role not null,
  primary key(user_id, role)
);

-- Helper for policies / middleware
create or replace function public.is_admin(uid uuid default auth.uid())
returns boolean language sql stable as $$
  select exists(select 1 from public.user_roles where user_id = uid and role = 'admin');
$$;

-- RLS Policies
alter table public.profiles enable row level security;

create policy "profiles: read self or admin" on public.profiles
for select using (
  auth.uid() = id or public.is_admin(auth.uid())
);

create policy "profiles: update self" on public.profiles
for update using (auth.uid() = id);

-- Enable RLS on user_roles
alter table public.user_roles enable row level security;

create policy "user_roles: admin only" on public.user_roles
for all using (public.is_admin(auth.uid()));

-- Seed your first admin (replace with your email)
insert into public.user_roles (user_id, role)
select id, 'admin'::public.app_role
from auth.users
where email = 'asjames18@proton.me'
on conflict do nothing;
