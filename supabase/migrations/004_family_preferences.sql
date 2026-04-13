alter table public.families
  add column if not exists menu_item_ids text[] not null default '{"reports","messages","calendar","locations","profile"}',
  add column if not exists shortcut_item_ids text[] not null default '{"reports","calendar","messages","locations"}',
  add column if not exists favorite_item_ids text[] not null default '{"meal","report","schedule","location"}';
