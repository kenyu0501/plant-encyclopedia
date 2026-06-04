-- エガミ3号が保存済みか確認し，保存済みなら公開します。

update public.cultivars
set
  is_public = true,
  updated_at = now()
where
  replace(replace(lower(name_ja), ' ', ''), '　', '') in ('エガミ3号', 'エガミ３号')
  or replace(replace(lower(coalesce(name_en, '')), ' ', ''), '　', '') in ('egami3', 'egamino.3', 'egamino3')
  or lower(slug) in ('egami-3', 'egami3');

select
  c.id,
  c.name_ja,
  c.name_en,
  c.slug,
  c.is_public,
  f.name_ja as fruit_name,
  f.slug as fruit_slug,
  c.created_at,
  c.updated_at
from public.cultivars c
join public.fruits f on f.id = c.fruit_id
where
  replace(replace(lower(c.name_ja), ' ', ''), '　', '') in ('エガミ3号', 'エガミ３号')
  or replace(replace(lower(coalesce(c.name_en, '')), ' ', ''), '　', '') in ('egami3', 'egamino.3', 'egamino3')
  or lower(c.slug) in ('egami-3', 'egami3');
