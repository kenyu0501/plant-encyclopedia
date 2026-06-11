-- 閲覧者の写真投稿を承認制で受け付けるためのSQLです．
-- 投稿者は pending の写真だけ作成できます．公開・却下・削除は管理者だけが行います．

begin;

alter table public.photos
  add column if not exists contributor_name text,
  add column if not exists location_name text;

alter table public.photos
  drop constraint if exists photos_caption_length_check,
  add constraint photos_caption_length_check check (caption is null or char_length(caption) <= 100);

alter table public.photos
  drop constraint if exists photos_contributor_name_length_check,
  add constraint photos_contributor_name_length_check check (contributor_name is null or char_length(contributor_name) <= 40);

alter table public.photos
  drop constraint if exists photos_location_name_length_check,
  add constraint photos_location_name_length_check check (location_name is null or char_length(location_name) <= 80);

create index if not exists photos_viewer_pending_idx
on public.photos (source_type, approval_status, created_at desc)
where source_type = 'viewer';

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
grant select, insert on public.photos to authenticated;

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

drop policy if exists "viewers upload own pending fruit photos" on storage.objects;
create policy "viewers upload own pending fruit photos" on storage.objects
for insert with check (
  bucket_id = 'fruit-photos'
  and auth.uid() is not null
  and (storage.foldername(name))[1] = 'viewer-submissions'
  and (storage.foldername(name))[2] = auth.uid()::text
);

select
  'viewer_photo_submissions_ready' as status,
  count(*) filter (where source_type = 'viewer' and approval_status = 'pending') as pending_viewer_photos
from public.photos;

commit;
