create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  email text not null unique,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.families (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  invite_code text not null unique,
  created_by uuid references public.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.family_members (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  role_label text not null,
  relation_label text,
  joined_at timestamptz not null default now(),
  unique (family_id, user_id)
);

create table if not exists public.profiles (
  user_id uuid primary key references public.users(id) on delete cascade,
  display_name text not null,
  avatar_path text,
  family_role text not null,
  organization text,
  activities text[] not null default '{}',
  bio text,
  status text,
  accent_color text,
  updated_at timestamptz not null default now()
);

create table if not exists public.message_templates (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null,
  category text not null,
  schema jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  author_id uuid not null references public.users(id) on delete cascade,
  category text not null,
  body text not null,
  template_id uuid references public.message_templates(id),
  payload jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.message_reads (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.messages(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  read_at timestamptz not null default now(),
  unique (message_id, user_id)
);

create table if not exists public.place_registrations (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  name text not null,
  category text not null,
  address text,
  lat numeric(10, 7),
  lng numeric(10, 7),
  color text,
  created_at timestamptz not null default now()
);

create table if not exists public.schedules (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  owner_id uuid references public.users(id) on delete set null,
  place_id uuid references public.place_registrations(id) on delete set null,
  source_message_id uuid references public.messages(id) on delete set null,
  title text not null,
  type text not null,
  note text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  family_id uuid not null references public.families(id) on delete cascade,
  place_id uuid references public.place_registrations(id) on delete set null,
  label text,
  lat numeric(10, 7),
  lng numeric(10, 7),
  captured_at timestamptz not null default now()
);

create table if not exists public.diary_entries (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  author_id uuid not null references public.users(id) on delete cascade,
  mood text not null,
  today_story text not null,
  happy_moment text,
  concern text,
  message_to_family text,
  created_at timestamptz not null default now()
);

create table if not exists public.diary_reactions (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.diary_entries(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  emoji text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_family_messages on public.messages (family_id, created_at desc);
create index if not exists idx_family_schedules on public.schedules (family_id, starts_at);
create index if not exists idx_family_locations on public.locations (family_id, captured_at desc);
create index if not exists idx_family_diaries on public.diary_entries (family_id, created_at desc);
