-- バナナ品種で重要な「背丈」「ゲノム構成」「収量」を独立カラムとして管理します。
-- 既存の説明・樹勢・難易度から、可能なものは自動で移します。

alter table public.cultivars
add column if not exists plant_height_type text;

alter table public.cultivars
add column if not exists genome_group text;

alter table public.cultivars
add column if not exists yield_level text;

create index if not exists cultivars_plant_height_type_idx
on public.cultivars (fruit_id, plant_height_type);

create index if not exists cultivars_genome_group_idx
on public.cultivars (fruit_id, genome_group);

create index if not exists cultivars_yield_level_idx
on public.cultivars (fruit_id, yield_level);

with banana_cultivars as (
  select
    c.id,
    concat_ws(E'\n', c.description, c.tree_vigor, c.difficulty, c.public_notes) as source_text
  from public.cultivars c
  join public.fruits f on f.id = c.fruit_id
  where f.slug = 'banana'
)
update public.cultivars c
set
  plant_height_type = coalesce(
    nullif(c.plant_height_type, ''),
    case
      when b.source_text ~ '矮性|ドワーフ|小型' then '矮性'
      when b.source_text ~ '半矮性|中間|中型' then '中間'
      when b.source_text ~ '高性|高木|大型' then '高性'
      else null
    end
  ),
  genome_group = coalesce(
    nullif(c.genome_group, ''),
    substring(b.source_text from '推定遺伝子型:\s*([AＢB？?]{2,4}|不明)'),
    substring(b.source_text from '推定遺伝子型:\s*([A-Z]{2,4}|不明)')
  ),
  yield_level = coalesce(
    nullif(c.yield_level, ''),
    case
      when b.source_text ~ '豊産|多収|収量が多|収量多|よく実る|着果が良' then '多い'
      when b.source_text ~ '低収|収量が少|収量少|着果しにくい|結実せず' then '少ない'
      else null
    end
  ),
  updated_at = now()
from banana_cultivars b
where c.id = b.id
  and (
    c.plant_height_type is null
    or c.genome_group is null
    or c.yield_level is null
  );

update public.cultivars
set genome_group = replace(genome_group, '？', '不明')
where genome_group = '？';

select
  c.name_ja,
  c.plant_height_type,
  c.genome_group,
  c.yield_level
from public.cultivars c
join public.fruits f on f.id = c.fruit_id
where f.slug = 'banana'
order by c.name_ja;
