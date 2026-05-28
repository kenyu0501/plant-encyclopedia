drop policy if exists "public fruits are readable" on public.fruits;
create policy "public fruits are readable" on public.fruits
for select using (is_public = true);

drop policy if exists "public cultivars are readable" on public.cultivars;
create policy "public cultivars are readable" on public.cultivars
for select using (
  is_public = true
  and exists (
    select 1
    from public.fruits
    where fruits.id = cultivars.fruit_id
      and fruits.is_public = true
  )
);

drop policy if exists "approved photos are readable" on public.photos;
create policy "approved photos are readable" on public.photos
for select using (
  approval_status = 'approved'
  and (
    exists (
      select 1
      from public.fruits
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

drop policy if exists "public videos are readable" on public.videos;
create policy "public videos are readable" on public.videos
for select using (
  is_public = true
  and (
    exists (
      select 1
      from public.fruits
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
