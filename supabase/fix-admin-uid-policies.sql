-- 初期MVP用: 指定UIDを管理者としてRLSで直接許可します。
-- profiles登録がうまく読めない場合でも、このUIDで管理操作できるようにします。

drop policy if exists "admins manage fruits" on public.fruits;
create policy "admins manage fruits" on public.fruits
for all using (
  auth.uid() = 'f793fbe1-635c-4dde-9eab-cc33df84bed3'
  or exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
) with check (
  auth.uid() = 'f793fbe1-635c-4dde-9eab-cc33df84bed3'
  or exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

drop policy if exists "admins manage cultivars" on public.cultivars;
create policy "admins manage cultivars" on public.cultivars
for all using (
  auth.uid() = 'f793fbe1-635c-4dde-9eab-cc33df84bed3'
  or exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
) with check (
  auth.uid() = 'f793fbe1-635c-4dde-9eab-cc33df84bed3'
  or exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

drop policy if exists "admins manage photos" on public.photos;
create policy "admins manage photos" on public.photos
for all using (
  auth.uid() = 'f793fbe1-635c-4dde-9eab-cc33df84bed3'
  or exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
) with check (
  auth.uid() = 'f793fbe1-635c-4dde-9eab-cc33df84bed3'
  or exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

drop policy if exists "admins manage videos" on public.videos;
create policy "admins manage videos" on public.videos
for all using (
  auth.uid() = 'f793fbe1-635c-4dde-9eab-cc33df84bed3'
  or exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
) with check (
  auth.uid() = 'f793fbe1-635c-4dde-9eab-cc33df84bed3'
  or exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

drop policy if exists "admins upload fruit photos" on storage.objects;
create policy "admins upload fruit photos" on storage.objects
for insert with check (
  bucket_id = 'fruit-photos'
  and (
    auth.uid() = 'f793fbe1-635c-4dde-9eab-cc33df84bed3'
    or exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  )
);

drop policy if exists "admins update fruit photos" on storage.objects;
create policy "admins update fruit photos" on storage.objects
for update using (
  bucket_id = 'fruit-photos'
  and (
    auth.uid() = 'f793fbe1-635c-4dde-9eab-cc33df84bed3'
    or exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  )
) with check (
  bucket_id = 'fruit-photos'
  and (
    auth.uid() = 'f793fbe1-635c-4dde-9eab-cc33df84bed3'
    or exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  )
);

drop policy if exists "admins delete fruit photos" on storage.objects;
create policy "admins delete fruit photos" on storage.objects
for delete using (
  bucket_id = 'fruit-photos'
  and (
    auth.uid() = 'f793fbe1-635c-4dde-9eab-cc33df84bed3'
    or exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  )
);
