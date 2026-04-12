create table if not exists public.family_reports (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  author_id uuid not null references public.users(id) on delete cascade,
  kind text not null,
  title text not null,
  summary text not null,
  status text not null default '確認待ち',
  requires_response boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint family_reports_kind_check check (kind in ('ご飯連絡', '欠食届', '外泊届', 'お迎え相談', '帰宅連絡')),
  constraint family_reports_status_check check (status in ('確認待ち', '進行中', '完了'))
);

create table if not exists public.family_report_actions (
  id uuid primary key default gen_random_uuid(),
  family_report_id uuid not null references public.family_reports(id) on delete cascade,
  parent_action_id uuid references public.family_report_actions(id) on delete cascade,
  author_id uuid not null references public.users(id) on delete cascade,
  label text not null,
  body text not null,
  tone text not null default 'info',
  created_at timestamptz not null default now(),
  constraint family_report_actions_tone_check check (tone in ('info', 'request', 'response', 'done'))
);

create index if not exists idx_family_reports_family_created on public.family_reports (family_id, created_at desc);
create index if not exists idx_family_report_actions_report_created on public.family_report_actions (family_report_id, created_at asc);

alter table public.family_reports enable row level security;
alter table public.family_report_actions enable row level security;

create or replace function public.current_app_user_id()
returns uuid
language sql
stable
as $$
  select id
  from public.users
  where auth_user_id = auth.uid()
  limit 1
$$;

create or replace function public.is_family_member(target_family_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.family_members fm
    where fm.family_id = target_family_id
      and fm.user_id = public.current_app_user_id()
  )
$$;

create policy "family_reports_select_for_members"
on public.family_reports
for select
using (public.is_family_member(family_id));

create policy "family_reports_insert_for_members"
on public.family_reports
for insert
with check (
  public.is_family_member(family_id)
  and author_id = public.current_app_user_id()
);

create policy "family_reports_update_for_members"
on public.family_reports
for update
using (public.is_family_member(family_id))
with check (public.is_family_member(family_id));

create policy "family_report_actions_select_for_members"
on public.family_report_actions
for select
using (
  exists (
    select 1
    from public.family_reports fr
    where fr.id = family_report_id
      and public.is_family_member(fr.family_id)
  )
);

create policy "family_report_actions_insert_for_members"
on public.family_report_actions
for insert
with check (
  author_id = public.current_app_user_id()
  and exists (
    select 1
    from public.family_reports fr
    where fr.id = family_report_id
      and public.is_family_member(fr.family_id)
  )
);
