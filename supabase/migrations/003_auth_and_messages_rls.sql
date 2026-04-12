alter table public.users enable row level security;
alter table public.families enable row level security;
alter table public.family_members enable row level security;
alter table public.profiles enable row level security;
alter table public.messages enable row level security;
alter table public.message_reads enable row level security;

drop policy if exists "users can read own or family users" on public.users;
create policy "users can read own or family users"
on public.users for select
using (
  id = public.current_app_user_id()
  or exists (
    select 1
    from public.family_members mine
    join public.family_members other
      on mine.family_id = other.family_id
    where mine.user_id = public.current_app_user_id()
      and other.user_id = public.users.id
  )
);

drop policy if exists "users can update self" on public.users;
create policy "users can update self"
on public.users for update
using (id = public.current_app_user_id())
with check (id = public.current_app_user_id());

drop policy if exists "users can insert self" on public.users;
create policy "users can insert self"
on public.users for insert
with check (auth_user_id = auth.uid());

drop policy if exists "members can read families" on public.families;
create policy "members can read families"
on public.families for select
using (
  public.is_family_member(id)
  or created_by = public.current_app_user_id()
);

drop policy if exists "users can create families" on public.families;
create policy "users can create families"
on public.families for insert
with check (created_by = public.current_app_user_id());

drop policy if exists "creators can update families" on public.families;
create policy "creators can update families"
on public.families for update
using (created_by = public.current_app_user_id())
with check (created_by = public.current_app_user_id());

drop policy if exists "members can read family members" on public.family_members;
create policy "members can read family members"
on public.family_members for select
using (
  public.is_family_member(family_id)
  or user_id = public.current_app_user_id()
);

drop policy if exists "users can join themselves" on public.family_members;
create policy "users can join themselves"
on public.family_members for insert
with check (
  user_id = public.current_app_user_id()
);

drop policy if exists "users can update own membership" on public.family_members;
create policy "users can update own membership"
on public.family_members for update
using (user_id = public.current_app_user_id())
with check (user_id = public.current_app_user_id());

drop policy if exists "family can read profiles" on public.profiles;
create policy "family can read profiles"
on public.profiles for select
using (
  user_id = public.current_app_user_id()
  or exists (
    select 1
    from public.family_members mine
    join public.family_members other
      on mine.family_id = other.family_id
    where mine.user_id = public.current_app_user_id()
      and other.user_id = public.profiles.user_id
  )
);

drop policy if exists "users can insert own profile" on public.profiles;
create policy "users can insert own profile"
on public.profiles for insert
with check (user_id = public.current_app_user_id());

drop policy if exists "users can update own profile" on public.profiles;
create policy "users can update own profile"
on public.profiles for update
using (user_id = public.current_app_user_id())
with check (user_id = public.current_app_user_id());

drop policy if exists "family can read messages" on public.messages;
create policy "family can read messages"
on public.messages for select
using (public.is_family_member(family_id));

drop policy if exists "members can insert messages" on public.messages;
create policy "members can insert messages"
on public.messages for insert
with check (
  public.is_family_member(family_id)
  and author_id = public.current_app_user_id()
);

drop policy if exists "authors can update messages" on public.messages;
create policy "authors can update messages"
on public.messages for update
using (author_id = public.current_app_user_id())
with check (author_id = public.current_app_user_id());

drop policy if exists "family can read message reads" on public.message_reads;
create policy "family can read message reads"
on public.message_reads for select
using (
  exists (
    select 1
    from public.messages
    where messages.id = message_reads.message_id
      and public.is_family_member(messages.family_id)
  )
);

drop policy if exists "users can insert own message reads" on public.message_reads;
create policy "users can insert own message reads"
on public.message_reads for insert
with check (
  user_id = public.current_app_user_id()
  and exists (
    select 1
    from public.messages
    where messages.id = message_reads.message_id
      and public.is_family_member(messages.family_id)
  )
);
