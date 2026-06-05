-- 写真を一覧用thumb，詳細用medium，保管用originalに分けて管理します．
-- 既存写真は従来のimage_url/storage_pathをフォールバックとして使うため，表示は壊れません．

alter table public.photos
add column if not exists thumbnail_url text,
add column if not exists thumbnail_storage_path text,
add column if not exists medium_url text,
add column if not exists medium_storage_path text,
add column if not exists original_url text,
add column if not exists original_storage_path text;

update public.photos
set
  medium_url = coalesce(medium_url, image_url),
  medium_storage_path = coalesce(medium_storage_path, storage_path),
  original_url = coalesce(original_url, image_url),
  original_storage_path = coalesce(original_storage_path, storage_path)
where medium_url is null
   or medium_storage_path is null
   or original_url is null
   or original_storage_path is null;
