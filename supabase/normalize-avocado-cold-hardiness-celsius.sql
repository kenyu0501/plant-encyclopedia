begin;

-- アボカド品種の耐寒性表記を℃へ統一します．
-- 25〜30°F = 約-3.9〜-1.1℃ のため，図鑑では「約-4〜-1℃」として表示します．

with avocado as (
  select id from public.fruits where slug = 'avocado'
),
source (slug, cold_hardiness) as (
  values
    ('monroe', '中程度．UF/IFASでは約-4〜-1℃程度の中程度耐寒グループ．'),
    ('choquette', '中程度．UF/IFASでは約-4〜-1℃程度の中程度耐寒グループに含まれます．')
)
update public.cultivars c
set
  cold_hardiness = s.cold_hardiness,
  difficulty = replace(replace(replace(coalesce(c.difficulty, ''), '25〜30°F', '約-4〜-1℃'), '25-30°F', '約-4〜-1℃'), '25–30°F', '約-4〜-1℃'),
  okinawa_suitability = replace(replace(replace(coalesce(c.okinawa_suitability, ''), '25〜30°F', '約-4〜-1℃'), '25-30°F', '約-4〜-1℃'), '25–30°F', '約-4〜-1℃'),
  container_suitability = replace(replace(replace(coalesce(c.container_suitability, ''), '25〜30°F', '約-4〜-1℃'), '25-30°F', '約-4〜-1℃'), '25–30°F', '約-4〜-1℃'),
  updated_at = now()
from source s, avocado a
where c.fruit_id = a.id
  and c.slug = s.slug;

-- ほかのアボカド品種に華氏表記が残っていないか確認します．
select
  c.name_ja,
  c.slug,
  c.cold_hardiness,
  c.difficulty
from public.cultivars c
join public.fruits f on f.id = c.fruit_id
where f.slug = 'avocado'
  and (
    coalesce(c.cold_hardiness, '') ilike '%F%'
    or coalesce(c.difficulty, '') ilike '%F%'
    or coalesce(c.okinawa_suitability, '') ilike '%F%'
    or coalesce(c.container_suitability, '') ilike '%F%'
  )
order by c.name_ja;

commit;
