-- アボカド品種で重要な「耐寒温度目安」と「開花型」を独立カラムとして管理します。
-- 既存の difficulty に入っている値から、可能なものは自動で移します。

alter table public.cultivars
add column if not exists cold_hardiness text;

alter table public.cultivars
add column if not exists flowering_type text;

create index if not exists cultivars_cold_hardiness_idx
on public.cultivars (fruit_id, cold_hardiness);

create index if not exists cultivars_flowering_type_idx
on public.cultivars (fruit_id, flowering_type);

update public.cultivars c
set
  cold_hardiness = coalesce(
    nullif(c.cold_hardiness, ''),
    substring(c.difficulty from '耐寒温度:\s*([^。]+)。')
  ),
  flowering_type = coalesce(
    nullif(c.flowering_type, ''),
    substring(c.difficulty from '開花型:\s*([ABＡＢ]型)')
  ),
  updated_at = now()
from public.fruits f
where f.id = c.fruit_id
  and f.slug = 'avocado'
  and (
    c.cold_hardiness is null
    or c.flowering_type is null
  );

select
  c.name_ja,
  c.cold_hardiness,
  c.flowering_type
from public.cultivars c
join public.fruits f on f.id = c.fruit_id
where f.slug = 'avocado'
order by c.name_ja;
