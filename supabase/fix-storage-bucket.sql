insert into storage.buckets (id, name, public)
values ('fruit-photos', 'fruit-photos', true)
on conflict (id) do update set
  name = excluded.name,
  public = true;

drop policy if exists "public read fruit photos" on storage.objects;
create policy "public read fruit photos" on storage.objects
for select using (bucket_id = 'fruit-photos');

drop policy if exists "admins upload fruit photos" on storage.objects;
create policy "admins upload fruit photos" on storage.objects
for insert with check (
  bucket_id = 'fruit-photos'
  and auth.uid() = 'f793fbe1-635c-4dde-9eab-cc33df84bed3'
);

drop policy if exists "admins update fruit photos" on storage.objects;
create policy "admins update fruit photos" on storage.objects
for update using (
  bucket_id = 'fruit-photos'
  and auth.uid() = 'f793fbe1-635c-4dde-9eab-cc33df84bed3'
) with check (
  bucket_id = 'fruit-photos'
  and auth.uid() = 'f793fbe1-635c-4dde-9eab-cc33df84bed3'
);

drop policy if exists "admins delete fruit photos" on storage.objects;
create policy "admins delete fruit photos" on storage.objects
for delete using (
  bucket_id = 'fruit-photos'
  and auth.uid() = 'f793fbe1-635c-4dde-9eab-cc33df84bed3'
);

select id, name, public
from storage.buckets
where id = 'fruit-photos';
