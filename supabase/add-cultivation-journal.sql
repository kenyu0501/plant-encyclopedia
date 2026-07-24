-- 読者ごとの非公開栽培記録を追加します。
-- Supabase SQL Editorで、このファイル全体を1回実行してください。

create extension if not exists pgcrypto;

create table if not exists public.user_plants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  cultivar_id uuid references public.cultivars(id) on delete set null,
  nickname text not null,
  planted_at date,
  cultivation_method text not null default 'pot'
    check (cultivation_method in ('pot', 'ground', 'other')),
  pot_size text,
  region text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_plants_nickname_length check (char_length(btrim(nickname)) between 1 and 80),
  constraint user_plants_pot_size_length check (pot_size is null or char_length(pot_size) <= 40),
  constraint user_plants_region_length check (region is null or char_length(region) <= 80),
  constraint user_plants_notes_length check (notes is null or char_length(notes) <= 1000)
);

create table if not exists public.cultivation_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plant_id uuid not null references public.user_plants(id) on delete cascade,
  event_type text not null
    check (event_type in (
      'planting',
      'repotting',
      'flowering',
      'fruiting',
      'fertilizing',
      'pruning',
      'watering',
      'pest',
      'harvest',
      'observation',
      'other'
    )),
  occurred_at date not null default current_date,
  title text,
  notes text,
  photo_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint cultivation_logs_title_length check (title is null or char_length(title) <= 100),
  constraint cultivation_logs_notes_length check (notes is null or char_length(notes) <= 2000),
  constraint cultivation_logs_photo_path_owner check (
    photo_path is null or split_part(photo_path, '/', 1) = user_id::text
  )
);

create index if not exists user_plants_user_id_idx
  on public.user_plants (user_id, updated_at desc);

create index if not exists user_plants_cultivar_id_idx
  on public.user_plants (cultivar_id);

create index if not exists cultivation_logs_user_plant_date_idx
  on public.cultivation_logs (user_id, plant_id, occurred_at desc, created_at desc);

create or replace function public.enforce_user_plants_limit()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  perform pg_advisory_xact_lock(hashtextextended(new.user_id::text, 0));

  if (
    select count(*)
    from public.user_plants
    where user_id = new.user_id
  ) >= 10 then
    raise exception using
      errcode = 'P0001',
      message = 'user_plants_limit_exceeded';
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_user_plants_limit_trigger on public.user_plants;
create trigger enforce_user_plants_limit_trigger
before insert on public.user_plants
for each row
execute function public.enforce_user_plants_limit();

revoke all on function public.enforce_user_plants_limit() from public;

alter table public.user_plants enable row level security;
alter table public.cultivation_logs enable row level security;

grant select, insert, update, delete on public.user_plants to authenticated;
grant select, insert, update, delete on public.cultivation_logs to authenticated;

drop policy if exists "users read own plants" on public.user_plants;
create policy "users read own plants"
on public.user_plants for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "users create own plants" on public.user_plants;
create policy "users create own plants"
on public.user_plants for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "users update own plants" on public.user_plants;
create policy "users update own plants"
on public.user_plants for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "users delete own plants" on public.user_plants;
create policy "users delete own plants"
on public.user_plants for delete
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "users read own cultivation logs" on public.cultivation_logs;
create policy "users read own cultivation logs"
on public.cultivation_logs for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "users create own cultivation logs" on public.cultivation_logs;
create policy "users create own cultivation logs"
on public.cultivation_logs for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1
    from public.user_plants
    where user_plants.id = plant_id
      and user_plants.user_id = (select auth.uid())
  )
);

drop policy if exists "users update own cultivation logs" on public.cultivation_logs;
create policy "users update own cultivation logs"
on public.cultivation_logs for update
to authenticated
using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1
    from public.user_plants
    where user_plants.id = plant_id
      and user_plants.user_id = (select auth.uid())
  )
);

drop policy if exists "users delete own cultivation logs" on public.cultivation_logs;
create policy "users delete own cultivation logs"
on public.cultivation_logs for delete
to authenticated
using ((select auth.uid()) = user_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'cultivation-records',
  'cultivation-records',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "users read own cultivation photos" on storage.objects;
create policy "users read own cultivation photos"
on storage.objects for select
to authenticated
using (
  bucket_id = 'cultivation-records'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists "users upload own cultivation photos" on storage.objects;
create policy "users upload own cultivation photos"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'cultivation-records'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists "users update own cultivation photos" on storage.objects;
create policy "users update own cultivation photos"
on storage.objects for update
to authenticated
using (
  bucket_id = 'cultivation-records'
  and (storage.foldername(name))[1] = (select auth.uid())::text
)
with check (
  bucket_id = 'cultivation-records'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists "users delete own cultivation photos" on storage.objects;
create policy "users delete own cultivation photos"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'cultivation-records'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);
