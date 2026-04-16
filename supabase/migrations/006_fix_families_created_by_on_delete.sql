alter table public.families
  drop constraint if exists families_created_by_fkey;

alter table public.families
  add constraint families_created_by_fkey
  foreign key (created_by)
  references public.users(id)
  on delete set null;
