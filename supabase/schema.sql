create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'viewer' check (role in ('admin', 'viewer')),
  created_at timestamptz not null default now()
);

create table if not exists public.fruits (
  id uuid primary key default gen_random_uuid(),
  name_ja text not null,
  name_en text,
  slug text not null unique,
  scientific_name text,
  family_name text,
  origin text,
  description text,
  growth_habit text,
  flower_description text,
  fruit_description text,
  cultivation_summary text,
  okinawa_suitability text,
  public_notes text,
  private_notes text,
  display_order integer,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cultivars (
  id uuid primary key default gen_random_uuid(),
  fruit_id uuid not null references public.fruits(id) on delete cascade,
  name_ja text not null,
  name_en text,
  slug text not null,
  origin text,
  description text,
  fruit_size text,
  taste text,
  texture text,
  aroma text,
  harvest_season text,
  cold_hardiness text,
  flowering_type text,
  plant_height_type text,
  genome_group text,
  yield_level text,
  tree_vigor text,
  difficulty text,
  okinawa_suitability text,
  container_suitability text,
  beginner_suitability text,
  kenyu_comment text,
  public_notes text,
  private_notes text,
  is_public boolean not null default false,
  is_for_sale boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (fruit_id, slug)
);

create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  fruit_id uuid references public.fruits(id) on delete cascade,
  cultivar_id uuid references public.cultivars(id) on delete cascade,
  image_url text not null,
  storage_path text not null,
  thumbnail_url text,
  thumbnail_storage_path text,
  medium_url text,
  medium_storage_path text,
  original_url text,
  original_storage_path text,
  photo_type text,
  caption text,
  taken_at date,
  uploaded_by uuid references auth.users(id) on delete set null,
  contributor_name text,
  location_name text,
  source_type text not null default 'admin',
  approval_status text not null default 'approved' check (approval_status in ('pending', 'approved', 'rejected')),
  is_main boolean not null default false,
  created_at timestamptz not null default now(),
  check (fruit_id is not null or cultivar_id is not null),
  constraint photos_caption_length_check check (caption is null or char_length(caption) <= 100),
  constraint photos_contributor_name_length_check check (contributor_name is null or char_length(contributor_name) <= 40),
  constraint photos_location_name_length_check check (location_name is null or char_length(location_name) <= 80)
);

create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  fruit_id uuid references public.fruits(id) on delete cascade,
  cultivar_id uuid references public.cultivars(id) on delete cascade,
  youtube_url text not null,
  title text,
  description text,
  thumbnail_url text,
  video_type text,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  check (fruit_id is not null or cultivar_id is not null)
);

create table if not exists public.site_settings (
  id text primary key,
  home_eyebrow text not null default 'スマホでひらく栽培メモ',
  home_title text not null default 'けんゆーの熱帯果樹図鑑',
  home_description text not null default '果樹ページを親にして、品種・写真・YouTubeを整理する熱帯果樹PWAです。 マンゴー、アボカド、バナナなどを現場で見返しやすい形にまとめます。',
  updated_at timestamptz not null default now()
);

create index if not exists fruits_public_slug_idx on public.fruits (is_public, slug);
create index if not exists cultivars_public_slug_idx on public.cultivars (fruit_id, is_public, slug);
create index if not exists photos_fruit_idx on public.photos (fruit_id, approval_status);
create index if not exists photos_cultivar_idx on public.photos (cultivar_id, approval_status);
create index if not exists photos_viewer_pending_idx on public.photos (source_type, approval_status, created_at desc) where source_type = 'viewer';
create index if not exists videos_fruit_idx on public.videos (fruit_id, is_public);
create index if not exists videos_cultivar_idx on public.videos (cultivar_id, is_public);

alter table public.profiles enable row level security;
alter table public.fruits enable row level security;
alter table public.cultivars enable row level security;
alter table public.photos enable row level security;
alter table public.videos enable row level security;
alter table public.site_settings enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

grant select on public.site_settings to anon, authenticated;
grant insert, update, delete on public.site_settings to authenticated;
grant execute on function public.is_admin() to anon, authenticated;
grant select, insert on public.photos to authenticated;

create or replace function public.viewer_photo_submissions_today()
returns integer
language sql
security definer
set search_path = public
as $$
  select count(*)::integer
  from public.photos
  where uploaded_by = auth.uid()
    and source_type = 'viewer'
    and created_at >= date_trunc('day', now());
$$;

grant execute on function public.viewer_photo_submissions_today() to authenticated;

create or replace function public.update_own_pending_photo_submission(
  p_photo_id uuid,
  p_caption text,
  p_taken_at date,
  p_contributor_name text,
  p_location_name text,
  p_photo_type text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.photos
  set
    caption = nullif(btrim(p_caption), ''),
    taken_at = p_taken_at,
    contributor_name = nullif(btrim(p_contributor_name), ''),
    location_name = nullif(btrim(p_location_name), ''),
    photo_type = nullif(btrim(p_photo_type), '')
  where id = p_photo_id
    and uploaded_by = auth.uid()
    and source_type = 'viewer'
    and approval_status = 'pending'
    and char_length(coalesce(btrim(p_contributor_name), '')) between 1 and 40
    and (p_caption is null or char_length(p_caption) <= 100)
    and (p_location_name is null or char_length(p_location_name) <= 80);

  return found;
end;
$$;

create or replace function public.withdraw_own_pending_photo_submission(p_photo_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.photos
  set approval_status = 'rejected'
  where id = p_photo_id
    and uploaded_by = auth.uid()
    and source_type = 'viewer'
    and approval_status = 'pending';

  return found;
end;
$$;

grant execute on function public.update_own_pending_photo_submission(uuid, text, date, text, text, text) to authenticated;
grant execute on function public.withdraw_own_pending_photo_submission(uuid) to authenticated;

drop policy if exists "profiles own read" on public.profiles;
create policy "profiles own read" on public.profiles
for select using (id = auth.uid());

drop policy if exists "public fruits are readable" on public.fruits;
create policy "public fruits are readable" on public.fruits
for select using (is_public = true);

drop policy if exists "admins manage fruits" on public.fruits;
create policy "admins manage fruits" on public.fruits
for all using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
) with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

drop policy if exists "public cultivars are readable" on public.cultivars;
create policy "public cultivars are readable" on public.cultivars
for select using (
  is_public = true
  and exists (
    select 1 from public.fruits
    where fruits.id = cultivars.fruit_id
      and fruits.is_public = true
  )
);

drop policy if exists "admins manage cultivars" on public.cultivars;
create policy "admins manage cultivars" on public.cultivars
for all using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
) with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

drop policy if exists "approved photos are readable" on public.photos;
create policy "approved photos are readable" on public.photos
for select using (
  approval_status = 'approved'
  and (
    exists (
      select 1 from public.fruits
      where fruits.id = photos.fruit_id
        and fruits.is_public = true
    )
    or exists (
      select 1
      from public.cultivars
      join public.fruits on fruits.id = cultivars.fruit_id
      where cultivars.id = photos.cultivar_id
        and cultivars.is_public = true
        and fruits.is_public = true
    )
  )
);

drop policy if exists "admins manage photos" on public.photos;
create policy "admins manage photos" on public.photos
for all using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
) with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

drop policy if exists "viewers read own photo submissions" on public.photos;
create policy "viewers read own photo submissions" on public.photos
for select using (
  auth.uid() is not null
  and uploaded_by = auth.uid()
  and source_type = 'viewer'
);

drop policy if exists "viewers create pending photo submissions" on public.photos;
create policy "viewers create pending photo submissions" on public.photos
for insert with check (
  auth.uid() is not null
  and uploaded_by = auth.uid()
  and source_type = 'viewer'
  and approval_status = 'pending'
  and is_main = false
  and contributor_name is not null
  and char_length(btrim(contributor_name)) between 1 and 40
  and (caption is null or char_length(caption) <= 100)
  and (location_name is null or char_length(location_name) <= 80)
  and public.viewer_photo_submissions_today() < 20
  and exists (
    select 1
    from public.fruits
    where fruits.id = photos.fruit_id
      and fruits.is_public = true
  )
  and (
    cultivar_id is null
    or exists (
      select 1
      from public.cultivars
      where cultivars.id = photos.cultivar_id
        and cultivars.fruit_id = photos.fruit_id
        and cultivars.is_public = true
    )
  )
);

drop policy if exists "public videos are readable" on public.videos;
create policy "public videos are readable" on public.videos
for select using (
  is_public = true
  and (
    exists (
      select 1 from public.fruits
      where fruits.id = videos.fruit_id
        and fruits.is_public = true
    )
    or exists (
      select 1
      from public.cultivars
      join public.fruits on fruits.id = cultivars.fruit_id
      where cultivars.id = videos.cultivar_id
        and cultivars.is_public = true
        and fruits.is_public = true
    )
  )
);

drop policy if exists "admins manage videos" on public.videos;
create policy "admins manage videos" on public.videos
for all using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
) with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

drop policy if exists "public site settings are readable" on public.site_settings;
create policy "public site settings are readable" on public.site_settings
for select using (true);

drop policy if exists "admins manage site settings" on public.site_settings;
create policy "admins manage site settings" on public.site_settings
for all using (public.is_admin())
with check (public.is_admin());

insert into public.site_settings (id)
values ('home')
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('fruit-photos', 'fruit-photos', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "public read fruit photos" on storage.objects;
create policy "public read fruit photos" on storage.objects
for select using (bucket_id = 'fruit-photos');

drop policy if exists "admins upload fruit photos" on storage.objects;
create policy "admins upload fruit photos" on storage.objects
for insert with check (
  bucket_id = 'fruit-photos'
  and exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

drop policy if exists "viewers upload own pending fruit photos" on storage.objects;
create policy "viewers upload own pending fruit photos" on storage.objects
for insert with check (
  bucket_id = 'fruit-photos'
  and auth.uid() is not null
  and (storage.foldername(name))[1] = 'viewer-submissions'
  and (storage.foldername(name))[2] = auth.uid()::text
);

drop policy if exists "admins update fruit photos" on storage.objects;
create policy "admins update fruit photos" on storage.objects
for update using (
  bucket_id = 'fruit-photos'
  and exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
) with check (
  bucket_id = 'fruit-photos'
  and exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

drop policy if exists "admins delete fruit photos" on storage.objects;
create policy "admins delete fruit photos" on storage.objects
for delete using (
  bucket_id = 'fruit-photos'
  and exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);
