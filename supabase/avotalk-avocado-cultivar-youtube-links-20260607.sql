begin;

with avocado as (
  select id
  from public.fruits
  where slug = 'avocado'
  limit 1
),
source_videos (
  cultivar_slug,
  youtube_url,
  title,
  description,
  thumbnail_url,
  video_type,
  is_public
) as (
  values
    (
      'mexicola',
      'https://www.youtube.com/watch?v=EhD8IVea2Pw',
      '【アボカド】メキシコ系品種「メキシコーラ」と「メキシコーラグランデ」の食べ比べと解説',
      'アボトークより．メキシコーラとメキシコーラグランデを食べ比べながら，果実の大きさ，食味，メキシコ系品種としての特徴を確認できる動画です．',
      'https://img.youtube.com/vi/EhD8IVea2Pw/hqdefault.jpg',
      '品種解説',
      true
    ),
    (
      'mexicola-grande',
      'https://www.youtube.com/watch?v=EhD8IVea2Pw',
      '【アボカド】メキシコ系品種「メキシコーラ」と「メキシコーラグランデ」の食べ比べと解説',
      'アボトークより．メキシコーラとメキシコーラグランデを食べ比べながら，果実の大きさ，食味，メキシコ系品種としての特徴を確認できる動画です．',
      'https://img.youtube.com/vi/EhD8IVea2Pw/hqdefault.jpg',
      '品種解説',
      true
    ),
    (
      'kabira-midori',
      'https://www.youtube.com/watch?v=6AV9G3B_Vqw',
      '【国産アボカド】まるでフルーツ！？沖縄県産「カビラグリーン」食レポ！！',
      'アボトークより．沖縄県産カビラグリーンの食レポ動画です．図鑑ではカビラミドリの関連動画として登録します．',
      'https://img.youtube.com/vi/6AV9G3B_Vqw/hqdefault.jpg',
      '食レポ',
      true
    ),
    (
      'mexicola',
      'https://www.youtube.com/watch?v=LDzTw3Oall0',
      '【鉢植えアボカド】実生メキシコーラとシャーウィル種，残数は！？',
      'アボトークより．鉢植え栽培中の実生メキシコーラとシャーウィルの果実肥大，落果，栽培管理の様子を確認できる動画です．',
      'https://img.youtube.com/vi/LDzTw3Oall0/hqdefault.jpg',
      '鉢栽培',
      true
    ),
    (
      'sharwil',
      'https://www.youtube.com/watch?v=LDzTw3Oall0',
      '【鉢植えアボカド】実生メキシコーラとシャーウィル種，残数は！？',
      'アボトークより．鉢植え栽培中の実生メキシコーラとシャーウィルの果実肥大，落果，栽培管理の様子を確認できる動画です．',
      'https://img.youtube.com/vi/LDzTw3Oall0/hqdefault.jpg',
      '鉢栽培',
      true
    ),
    (
      'reed',
      'https://www.youtube.com/watch?v=d2X7P3m47JE',
      'アボカドの晩生品種「リード種」の品種解説&食レポ！',
      'アボトークより．晩生品種リードの果実の特徴，食味，栽培上の見どころを確認できる品種解説と食レポ動画です．',
      'https://img.youtube.com/vi/d2X7P3m47JE/hqdefault.jpg',
      '品種解説',
      true
    )
),
resolved_videos as (
  select
    avocado.id as fruit_id,
    cultivars.id as cultivar_id,
    source_videos.youtube_url,
    source_videos.title,
    source_videos.description,
    source_videos.thumbnail_url,
    source_videos.video_type,
    source_videos.is_public
  from source_videos
  cross join avocado
  join public.cultivars
    on cultivars.fruit_id = avocado.id
   and cultivars.slug = source_videos.cultivar_slug
)
insert into public.videos (
  fruit_id,
  cultivar_id,
  youtube_url,
  title,
  description,
  thumbnail_url,
  video_type,
  is_public
)
select
  resolved_videos.fruit_id,
  resolved_videos.cultivar_id,
  resolved_videos.youtube_url,
  resolved_videos.title,
  resolved_videos.description,
  resolved_videos.thumbnail_url,
  resolved_videos.video_type,
  resolved_videos.is_public
from resolved_videos
where not exists (
  select 1
  from public.videos existing
  where existing.youtube_url = resolved_videos.youtube_url
    and existing.fruit_id = resolved_videos.fruit_id
    and existing.cultivar_id is not distinct from resolved_videos.cultivar_id
);

select
  cultivars.name_ja as cultivar_name,
  count(videos.id) as linked_video_count
from public.fruits
join public.cultivars
  on cultivars.fruit_id = fruits.id
left join public.videos
  on videos.cultivar_id = cultivars.id
where fruits.slug = 'avocado'
  and cultivars.slug in (
    'mexicola',
    'mexicola-grande',
    'kabira-midori',
    'sharwil',
    'reed'
  )
group by cultivars.name_ja
order by cultivars.name_ja;

commit;
