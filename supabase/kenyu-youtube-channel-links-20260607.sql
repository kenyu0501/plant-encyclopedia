-- けんゆー運営YouTubeチャンネル（@avocado_japan）の動画を，図鑑の果樹ページへ紐づけます。
-- 取得元: https://www.youtube.com/@avocado_japan/videos
-- 2026-06-07時点でチャンネルページから確認できた最新動画を対象にしています。

begin;

with source(
  fruit_slug,
  cultivar_slug,
  youtube_url,
  title,
  description,
  thumbnail_url,
  video_type,
  is_public
) as (
  values
    ('avocado', null, 'https://www.youtube.com/watch?v=UIyOIa8DWmA', '今年のアボカドは凄そう！この時期の管理，袋がけ，挿し木苗がすごい！', 'けんゆーのYouTubeチャンネル @avocado_japan より．アボカド栽培，袋がけ，挿し木苗に関する動画．', 'https://img.youtube.com/vi/UIyOIa8DWmA/hqdefault.jpg', '栽培管理', true),
    ('passion-fruit', null, 'https://www.youtube.com/watch?v=v-vETJXILtc', '【目から鱗！】良質な果実の作り方！人工授粉やその後の管理など！【パッションフルーツの仲間！ミズレモン！！！！】', 'けんゆーのYouTubeチャンネル @avocado_japan より．ミズレモンとパッションフルーツ類の人工授粉，果実品質，栽培管理に関する動画．', 'https://img.youtube.com/vi/v-vETJXILtc/hqdefault.jpg', '栽培管理', true),
    ('water-lemon', null, 'https://www.youtube.com/watch?v=v-vETJXILtc', '【目から鱗！】良質な果実の作り方！人工授粉やその後の管理など！【パッションフルーツの仲間！ミズレモン！！！！】', 'けんゆーのYouTubeチャンネル @avocado_japan より．ミズレモンの人工授粉と果実管理に関する動画．', 'https://img.youtube.com/vi/v-vETJXILtc/hqdefault.jpg', '栽培管理', true),
    ('water-lemon', null, 'https://www.youtube.com/watch?v=F5dtKQLu7BY', '【ガチ凄い!】目から鱗の果樹栽培！国内人気のパッションフルーツ「ミズレモン」栽培現場に驚いた！！！！', 'けんゆーのYouTubeチャンネル @avocado_japan より．ミズレモンの栽培現場紹介動画．', 'https://img.youtube.com/vi/F5dtKQLu7BY/hqdefault.jpg', '栽培現場', true),
    ('water-lemon', null, 'https://www.youtube.com/watch?v=m0N-ZubvAEI', '【神回】超甘いパッションフルーツ!? 衝撃を受ける果樹「ミズレモン」の作り方が本当に感動した【島袋重信さん 沖縄県のパッションフルーツ農家】', 'けんゆーのYouTubeチャンネル @avocado_japan より．ミズレモン農家の栽培方法と果実品質に関する動画．', 'https://img.youtube.com/vi/m0N-ZubvAEI/hqdefault.jpg', '栽培現場', true),
    ('white-sapote', null, 'https://www.youtube.com/watch?v=-AL6TEPgxqA', '今年もスズ成りのホワイトサポテの摘果と袋がけ', 'けんゆーのYouTubeチャンネル @avocado_japan より．ホワイトサポテの摘果と袋がけに関する動画．', 'https://img.youtube.com/vi/-AL6TEPgxqA/hqdefault.jpg', '栽培管理', true),
    ('lychee', null, 'https://www.youtube.com/watch?v=oHmPBMUBBs4', 'ライチ（レイシ）の防虫・袋がけの方法，メリット・デメリットについて', 'けんゆーのYouTubeチャンネル @avocado_japan より．ライチの防虫，袋がけ，果実保護に関する動画．', 'https://img.youtube.com/vi/oHmPBMUBBs4/hqdefault.jpg', '栽培管理', true),
    ('coffee', null, 'https://www.youtube.com/watch?v=R-56yuqM5cQ', '【沖縄移住して農業に！】夢の国産コーヒー栽培！愛知からやんばるに渡った一人の男の物語「舟波康大さん」', 'けんゆーのYouTubeチャンネル @avocado_japan より．沖縄での国産コーヒー栽培者紹介動画．', 'https://img.youtube.com/vi/R-56yuqM5cQ/hqdefault.jpg', '栽培者紹介', true),
    ('coffee', null, 'https://www.youtube.com/watch?v=bd94N74C2bg', '【5万円/kg】2026年 国産コーヒーがアツい！日本で高品質なコーヒーを作るために！なぜ国産はこんなに高いの！？【コーヒー栽培指導者 三本木一夫さん】', 'けんゆーのYouTubeチャンネル @avocado_japan より．国産コーヒーの品質，価格，栽培指導に関する動画．', 'https://img.youtube.com/vi/bd94N74C2bg/hqdefault.jpg', '栽培解説', true),
    ('coffee', null, 'https://www.youtube.com/watch?v=3RGeYtftIro', '元気な苗木を作るためには？【国産コーヒー栽培実践塾】', 'けんゆーのYouTubeチャンネル @avocado_japan より．国産コーヒー苗木作りに関する動画．', 'https://img.youtube.com/vi/3RGeYtftIro/hqdefault.jpg', '苗木管理', true),
    ('mango', null, 'https://www.youtube.com/watch?v=OO9LtpCkroY', '【マンゴー品種更新】木の作り方，接ぎ木方法から剪定，初期の樹形作りを解説する', 'けんゆーのYouTubeチャンネル @avocado_japan より．マンゴーの品種更新，接ぎ木，剪定，樹形作りに関する動画．', 'https://img.youtube.com/vi/OO9LtpCkroY/hqdefault.jpg', '接ぎ木・剪定', true),
    ('mango', null, 'https://www.youtube.com/watch?v=1qdkRkZdVvg', '農薬を一切使わずに，超美味しいマンゴーを作る方法【多品種栽培】', 'けんゆーのYouTubeチャンネル @avocado_japan より．マンゴーの無農薬栽培と多品種栽培に関する動画．', 'https://img.youtube.com/vi/1qdkRkZdVvg/hqdefault.jpg', '栽培管理', true),
    ('mango', null, 'https://www.youtube.com/watch?v=adrNO9cpMqU', '無農薬で最高級マンゴーを作る方法を特別に聞いてきた', 'けんゆーのYouTubeチャンネル @avocado_japan より．マンゴーの無農薬栽培と高品質果実作りに関する動画．', 'https://img.youtube.com/vi/adrNO9cpMqU/hqdefault.jpg', '栽培管理', true),
    ('banana', null, 'https://www.youtube.com/watch?v=_BmWlIMXeB0', 'やっぱりこの人のバナナ園地はすごかった', 'けんゆーのYouTubeチャンネル @avocado_japan より．バナナ園地と栽培現場の紹介動画．', 'https://img.youtube.com/vi/_BmWlIMXeB0/hqdefault.jpg', '栽培現場', true),
    ('banana', null, 'https://www.youtube.com/watch?v=5WlpxCTDpVk', 'イベントにて激レアバナナを沢山販売するぜ', 'けんゆーのYouTubeチャンネル @avocado_japan より．希少バナナ紹介と販売イベントに関する動画．', 'https://img.youtube.com/vi/5WlpxCTDpVk/hqdefault.jpg', '品種紹介', true),
    ('guava', null, 'https://www.youtube.com/watch?v=74A6L-TzW5c', '台湾で超人気の最高グァバ3品種を紹介します！！', 'けんゆーのYouTubeチャンネル @avocado_japan より．台湾で人気のグァバ品種紹介動画．', 'https://img.youtube.com/vi/74A6L-TzW5c/hqdefault.jpg', '品種紹介', true),
    ('guava', null, 'https://www.youtube.com/watch?v=S6p7mzYXqmQ', '台湾でかなり美味しい果実を見つけました', 'けんゆーのYouTubeチャンネル @avocado_japan より．台湾で見つけた果実紹介動画．グァバ関連候補として紐づけ．', 'https://img.youtube.com/vi/S6p7mzYXqmQ/hqdefault.jpg', '果実紹介', true),
    ('wax-apple', null, 'https://www.youtube.com/watch?v=FW5p5J7VblQ', '台湾の衝撃的に美味しい果実は，これから日本でも流行りそう', 'けんゆーのYouTubeチャンネル @avocado_japan より．台湾で注目される熱帯果実の紹介動画．レンブ関連候補として紐づけ．', 'https://img.youtube.com/vi/FW5p5J7VblQ/hqdefault.jpg', '果実紹介', true),
    ('wax-apple', null, 'https://www.youtube.com/watch?v=Kiy0ijaP7gA', '台湾で見つけた超激甘フルーツがすごく美味かった．．．！！！', 'けんゆーのYouTubeチャンネル @avocado_japan より．台湾の甘い熱帯果実紹介動画．レンブ関連候補として紐づけ．', 'https://img.youtube.com/vi/Kiy0ijaP7gA/hqdefault.jpg', '果実紹介', true),
    ('avocado', null, 'https://www.youtube.com/watch?v=QFpSTgJuqNA', '【アボカド詐欺が流行中】こんなの引っかかるやついるの？という低レベルの詐欺にご注意を', 'けんゆーのYouTubeチャンネル @avocado_japan より．アボカド苗や果実購入時の注意喚起動画．', 'https://img.youtube.com/vi/QFpSTgJuqNA/hqdefault.jpg', '注意喚起', true),
    ('avocado', null, 'https://www.youtube.com/watch?v=0wBShtvsvRk', '接木が難しい樹種は「タネ接ぎ」をやると成功します', 'けんゆーのYouTubeチャンネル @avocado_japan より．接ぎ木技術に関する動画．アボカドなど接ぎ木が難しい果樹の参考として紐づけ．', 'https://img.youtube.com/vi/0wBShtvsvRk/hqdefault.jpg', '接ぎ木', true),
    ('mango', null, 'https://www.youtube.com/watch?v=0wBShtvsvRk', '接木が難しい樹種は「タネ接ぎ」をやると成功します', 'けんゆーのYouTubeチャンネル @avocado_japan より．接ぎ木技術に関する動画．マンゴーなど果樹の品種更新の参考として紐づけ．', 'https://img.youtube.com/vi/0wBShtvsvRk/hqdefault.jpg', '接ぎ木', true)
), resolved as (
  select
    f.id as fruit_id,
    c.id as cultivar_id,
    source.youtube_url,
    source.title,
    source.description,
    source.thumbnail_url,
    source.video_type,
    source.is_public
  from source
  join public.fruits f on f.slug = source.fruit_slug
  left join public.cultivars c on c.fruit_id = f.id and c.slug = source.cultivar_slug
  where source.cultivar_slug is null or c.id is not null
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
  resolved.fruit_id,
  resolved.cultivar_id,
  resolved.youtube_url,
  resolved.title,
  resolved.description,
  resolved.thumbnail_url,
  resolved.video_type,
  resolved.is_public
from resolved
where not exists (
  select 1
  from public.videos existing
  where existing.youtube_url = resolved.youtube_url
    and existing.fruit_id = resolved.fruit_id
    and (
      existing.cultivar_id is not distinct from resolved.cultivar_id
    )
);

select
  f.name_ja as fruit_name,
  count(v.id) filter (where v.cultivar_id is null) as fruit_level_youtube_count
from public.fruits f
left join public.videos v on v.fruit_id = f.id
where f.slug in (
  'avocado',
  'passion-fruit',
  'water-lemon',
  'white-sapote',
  'lychee',
  'coffee',
  'mango',
  'banana',
  'guava',
  'wax-apple'
)
group by f.name_ja
order by f.name_ja;

commit;
