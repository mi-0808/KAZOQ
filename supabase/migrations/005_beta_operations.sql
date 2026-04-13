alter table public.families
  add column if not exists notification_level text not null default 'important',
  add column if not exists diary_visibility text not null default 'family',
  add column if not exists location_sharing_mode text not null default 'manual',
  add column if not exists tasks_enabled boolean not null default true;

alter table public.families
  drop constraint if exists families_notification_level_check,
  add constraint families_notification_level_check check (notification_level in ('off', 'important', 'all'));

alter table public.families
  drop constraint if exists families_diary_visibility_check,
  add constraint families_diary_visibility_check check (diary_visibility in ('family', 'guardians', 'private'));

alter table public.families
  drop constraint if exists families_location_sharing_mode_check,
  add constraint families_location_sharing_mode_check check (location_sharing_mode in ('manual', 'auto'));

alter table public.diary_entries
  add column if not exists visibility_scope text not null default 'family';

alter table public.diary_entries
  drop constraint if exists diary_entries_visibility_scope_check,
  add constraint diary_entries_visibility_scope_check check (visibility_scope in ('family', 'guardians', 'private'));

alter table public.locations
  add column if not exists share_mode text;

alter table public.locations
  drop constraint if exists locations_share_mode_check,
  add constraint locations_share_mode_check check (share_mode in ('manual', 'auto'));

create table if not exists public.family_tasks (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  created_by uuid not null references public.users(id) on delete cascade,
  assignee_id uuid references public.users(id) on delete set null,
  title text not null,
  note text,
  due_date date,
  status text not null default 'open',
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  constraint family_tasks_status_check check (status in ('open', 'done'))
);

create index if not exists idx_family_tasks_family_status on public.family_tasks (family_id, status, created_at desc);

alter table public.family_tasks enable row level security;

drop policy if exists "family_tasks_select_for_members" on public.family_tasks;
create policy "family_tasks_select_for_members"
on public.family_tasks
for select
using (public.is_family_member(family_id));

drop policy if exists "family_tasks_insert_for_members" on public.family_tasks;
create policy "family_tasks_insert_for_members"
on public.family_tasks
for insert
with check (
  public.is_family_member(family_id)
  and created_by = public.current_app_user_id()
);

drop policy if exists "family_tasks_update_for_members" on public.family_tasks;
create policy "family_tasks_update_for_members"
on public.family_tasks
for update
using (public.is_family_member(family_id))
with check (public.is_family_member(family_id));
