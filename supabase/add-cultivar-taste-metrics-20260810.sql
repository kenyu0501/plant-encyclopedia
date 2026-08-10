begin;

-- 全果樹の品種で共通利用する食味項目．
alter table public.cultivars
  add column if not exists sugar_content text,
  add column if not exists sweetness text,
  add column if not exists acidity text,
  add column if not exists overall_rating text;

-- 2026年8月に登録したドラゴンフルーツ27品種の複合「味」データを分割する．
-- 味の説明文や，それ以前からある情報は削除しない．
with source (
  slug,
  brix,
  sweetness,
  acidity,
  overall_rating,
  is_existing
) as (
  values
    ('okinawa-red', '12〜20', '★★★', '★★', '★★', false),
    ('okinawa-white', '10〜18', '★★', '★★★', '★★', false),
    ('okinawa-pink', '12〜20', '★★★', '★★★', '★★', false),
    ('golden-dragon', '14〜16', '★★', '★★★', '★★', false),
    ('impact-ruby', '14程度', '★★', '★★★', '★', false),
    ('la-verne-red', '17.7〜17.8', '★★★', '★★★★', '★★★★', false),
    ('peruvian-pink', '18.0〜18.1', '★★★★', '★★★★★', '★★★★★', false),
    ('dessert-princess-orange', '18.3〜18.5', '★★★★', '★★★★★', '★★★★★', false),
    ('red-majesty', '20.4〜20.5', '★★★★', '★★', '★★★', false),
    ('ocamponis', '20.1〜20.3', '★★★★★', '★', '★★★★★', false),
    ('worth-variegated', '15.2〜15.3', '★★', '★★★★', '★★', false),
    ('orange-grenade', '20.5', '★★★★★', '★★★★★', '★★★★★', false),
    ('tutti-fruity', '20.1〜20.4', '★★★★★', '★★★★★', '★★★★★', false),
    ('king-kong', '20.4〜20.6', '★★★★★', '★★★', '★★★★', false),
    ('super-shenron', '14.6', '★', '★', '★', false),
    ('sophia-red', '18.7', '★★★', '★★★', '★★★', false),
    ('pink-whisper', '19.3', '★★★★★', '★★★★', '★★★★', false),
    ('variegata', '13.9', '★', '★', '★★', false),
    ('white-sapphire', '16.6', '★★', '★★', '★★', false),
    ('bahamut', '19.6', '★★★★', '★★★★', '★★★★', false),
    ('connie-mayer', '19.9〜20.0', '★★★★★', '★★★★★', '★★★★★', false),
    ('great-red', '17.4〜18.1', '★★★', '★★★', '★★★★', false),
    ('pearl-white', '16.6〜17.1', '★★★', '★★★★★', '★★★', false),
    ('bruni', '20.6', '★★★★★', '★★★★★', '★★★★★', false),
    ('yellow-pitaya', '19.6〜19.8', '★★★★★', '★★★', '★★★★★', false),
    ('Daikou', '15〜20', '★★★', '★★★', '★★★', true),
    ('Chura-boshi-Queen', '18.8', '★★★★★', '★★★', '★★★★', true)
),
target as (
  select
    cultivars.id,
    cultivars.taste,
    source.*
  from public.cultivars as cultivars
  join public.fruits as fruits on fruits.id = cultivars.fruit_id
  join source on lower(source.slug) = lower(cultivars.slug)
  where fruits.slug = 'dragon-fruit'
)
update public.cultivars as cultivars
set
  sugar_content = format('%s°Brix（数個体のみ計測）', target.brix),
  sweetness = target.sweetness,
  acidity = target.acidity,
  overall_rating = target.overall_rating,
  taste = nullif(
    btrim(
      case
        when target.is_existing then replace(
          coalesce(cultivars.taste, ''),
          format(
            '【けんゆー実食記録 2026年8月】糖度%s°Brix（数個体のみ計測）．甘味%s，酸味%s，総合評価%s．',
            target.brix,
            target.sweetness,
            target.acidity,
            target.overall_rating
          ),
          ''
        )
        else replace(
          coalesce(cultivars.taste, ''),
          format(
            '糖度%s°Brix（数個体のみ計測）．甘味%s，酸味%s，総合評価%s．',
            target.brix,
            target.sweetness,
            target.acidity,
            target.overall_rating
          ),
          ''
        )
      end
    ),
    ''
  ),
  updated_at = now()
from target
where cultivars.id = target.id;

commit;

select
  cultivars.name_ja,
  cultivars.sugar_content as 糖度,
  cultivars.sweetness as 甘味,
  cultivars.acidity as 酸味,
  cultivars.overall_rating as 総合評価,
  cultivars.taste as 味
from public.cultivars as cultivars
join public.fruits as fruits on fruits.id = cultivars.fruit_id
where fruits.slug = 'dragon-fruit'
order by cultivars.name_ja;
