-- YouTube新着の試験記事を公開します。
-- Supabase SQL Editor で一度実行してください。

insert into public.articles (
  title,
  slug,
  category,
  excerpt,
  content,
  hero_image_url,
  source_name,
  source_url,
  source_published_at,
  youtube_url,
  author_name,
  status,
  is_featured,
  seo_title,
  seo_description,
  review_notes,
  approved_at,
  published_at,
  updated_at
)
values (
  '台湾の熱帯果樹園を歩く。多品種接ぎ木と果実の食味を動画で紹介',
  'youtube-taiwan-tropical-fruit-orchard-20260922',
  'youtube',
  '台湾の熱帯果樹園で、種なしパラミツ、白肉品種、パラミツとコパラミツの交雑、多品種接ぎ木、アチャチャイルやマクディールの食味を取材しました。中国語・日本語の正式字幕をもとに見どころを紹介します。',
  $article$2026年9月22日にYouTubeで公開した「【後半 本日限定】台湾のすごい園地に来た【#台湾17】」では、台湾の熱帯果樹園を歩きながら、珍しい品種と栽培の工夫を紹介しています。今回は中国語・日本語の正式字幕を確認し、約29分の動画から重要な場面を整理しました。

## 種なしパラミツと白肉品種「珍珠白」

冒頭で紹介されるのは、ほとんど種がない[パラミツ](/fruits/jackfruit)です。果実は小ぶりで、梨のような感覚で食べられると説明されています。白い果肉を持つ[珍珠白](/fruits/jackfruit/cultivars/zhen-zhu-bai)も登場します。甘みはある一方、粉を帯びたように白い外観が消費者に好まれず、園主は一部を切って赤肉品種を接いだそうです。

園内には大きなマメイサポテが鈴なりになり、[アボカド](/fruits/avocado)や[ホワイトサポテ](/fruits/white-sapote)も多数植えられています。根が2本ある樹を見ながら「根接ぎ」の可能性を話す場面や、台湾でも立ち枯れのような症状があることを観察する場面もあります。

## パラミツとコパラミツの交雑

動画の大きな見どころが、[パラミツ](/fruits/jackfruit)と[コパラミツ](/fruits/chempedak)のハイブリッド[モンチェン](/fruits/chempedak/cultivars/mong-chen)です。枝葉の細かな毛はコパラミツの特徴を示す一方、果実はパラミツに似ています。[南港蕉](/fruits/chempedak/cultivars/nangang-jiao)は、ほとんど種がないコパラミツとして紹介されます。白肉のパラミツ、交雑種、種なしコパラミツが同じ園地に集まる様子から、台湾の品種の幅広さが伝わります。

コパラミツでは青龍金、盤龍の名も挙がります。昔からある赤肉品種[台東紅](/fruits/chempedak/cultivars/taitung-red)と、台湾東部の系統[小紫蜜](/fruits/chempedak/cultivars/xiao-zi-mi)も紹介されました。小紫蜜は餅のようにねっとりした食感で、保存しにくく、寒さにも弱いと説明されています。南港蕉も低温に弱く、動画では台中より北で育てるのは難しいと語られています。

## 一本の木に多品種を接ぐ「カクテルツリー」

園主は一本の木へ複数品種を接ぐ「カクテルツリー」を数多く育てています。[アビウ](/fruits/abiu)には[白金](/fruits/abiu/cultivars/bai-jin)や「冬蜜」など4〜5品種があり、[アボカド](/fruits/avocado)では[黒宝](/fruits/avocado/cultivars/hei-bao)が特においしい品種として紹介されます。黒金剛、黒金環、[麻豆2号](/fruits/avocado/cultivars/madou-no-2)という名前も登場します。麻豆2号は、台湾農業部の資料ではアボカドの「嘉選2号」の別名として確認できます。[ブラックサポテ](/fruits/black-sapote)では、種なしの「正檀香系」と、雄木と雌木を一つの木に接ぐ工夫も確認できます。

[アボカドのハス](/fruits/avocado/cultivars/hass)や、タイのマンゴー品種[マハチャノック](/fruits/mango/cultivars/maha-chanok)も登場します。別の木では約15果を収穫したことが語られ、その後、ホワイトサポテの[マクディール](/fruits/white-sapote/cultivars/mcdill)を台に複数品種を接いだ木も紹介されます。

## アチャチャイルは完熟すると糖度15〜16度以上

[アチャチャイル](/fruits/achachairu)は、十分に熟していない状態ではレモンのように酸っぱく、果肉に歯ごたえがあります。字幕では、完熟するまで置くと糖度15〜16度以上になると説明されています。収穫時期だけでなく、追熟の見極めが食味を大きく左右する果実です。

## 赤肉パラミツの強い香りと甘さ

後半では赤肉のパラミツを実食します。香りは強く、パイナップル、バナナ、少しドリアン、さらにコパラミツを思わせる複雑さがあります。食べると強い甘みがあり、刺激的なにおいは感じにくく、「パラミツの最高峰のような味」と表現しています。また、[筍山](/fruits/jackfruit/cultivars/sun-shan)は、おいしく、油分や脂質が多い品種として紹介されます。

## マクディールはカスタードプリンのような食味

最後に食べたのが、ホワイトサポテの[マクディール](/fruits/white-sapote/cultivars/mcdill)です。果肉は鮮やかな黄色で、とてもやわらかく、甘みが強い果実でした。苦みや渋みがなく、カスタードプリンのような印象です。初めて食べたうえで「この品種が栽培される理由が分かった」「おすすめ」と評価しています。

熱帯果樹は、名前だけでなく、樹姿、接ぎ木の仕方、着果、追熟、香り、食感まで一緒に見ることで理解が深まります。動画と[熱帯果樹図鑑](/fruits)を行き来しながら、気になった果樹や品種を探してみてください。

## 参照した資料

・[YouTube「【後半 本日限定】台湾のすごい園地に来た【#台湾17】」](https://www.youtube.com/watch?v=DTmz_5rnTyk)
・同動画の中国語・日本語正式字幕（2026年9月18日版）
・[台湾農業部農糧署「嘉選二號（麻豆二號）」を含むアボカド品種資料](https://www.afa.gov.tw/cht/index.php?a_id=572&code=list&ids=353&mod_code=view)
・[台湾農業部「創造幸福的幸福果―展覧特輯（上）」](https://kmweb.moa.gov.tw/subject/subject.php?id=25923)

## 関連する図鑑ページ

・[パラミツ](/fruits/jackfruit)
・[コパラミツ](/fruits/chempedak)
・[珍珠白](/fruits/jackfruit/cultivars/zhen-zhu-bai)／[筍山](/fruits/jackfruit/cultivars/sun-shan)
・[台東紅](/fruits/chempedak/cultivars/taitung-red)／[小紫蜜](/fruits/chempedak/cultivars/xiao-zi-mi)／[南港蕉](/fruits/chempedak/cultivars/nangang-jiao)
・[アビウ](/fruits/abiu)
・[アチャチャイル](/fruits/achachairu)
・[アボカド](/fruits/avocado)／[ハス](/fruits/avocado/cultivars/hass)／[黒宝](/fruits/avocado/cultivars/hei-bao)
・[麻豆2号（嘉選2号）](/fruits/avocado/cultivars/madou-no-2)
・[ホワイトサポテ](/fruits/white-sapote)／[マクディール](/fruits/white-sapote/cultivars/mcdill)
・[ブラックサポテ](/fruits/black-sapote)
・[マンゴー](/fruits/mango)／[マハチャノック](/fruits/mango/cultivars/maha-chanok)$article$,
  'https://img.youtube.com/vi/DTmz_5rnTyk/maxresdefault.jpg',
  'けんゆー YouTube',
  'https://www.youtube.com/watch?v=DTmz_5rnTyk',
  '2026-09-22T11:49:10Z'::timestamptz,
  'https://www.youtube.com/watch?v=DTmz_5rnTyk',
  'けんゆー',
  'published',
  true,
  '台湾の熱帯果樹園を動画で紹介｜多品種接ぎ木と果実の食味',
  '台湾の熱帯果樹園で見た種なしパラミツ、交雑種、多品種接ぎ木、アチャチャイルとマクディールの食味を、正式な日中字幕をもとに紹介します。',
  'YouTube動画と提供された中国語・日本語の正式字幕を確認して作成した試験記事。',
  now(),
  now(),
  now()
)
on conflict (slug) do update set
  title = excluded.title,
  category = excluded.category,
  excerpt = excluded.excerpt,
  content = excluded.content,
  hero_image_url = excluded.hero_image_url,
  source_name = excluded.source_name,
  source_url = excluded.source_url,
  source_published_at = excluded.source_published_at,
  youtube_url = excluded.youtube_url,
  author_name = excluded.author_name,
  status = excluded.status,
  is_featured = excluded.is_featured,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description,
  review_notes = excluded.review_notes,
  approved_at = excluded.approved_at,
  published_at = excluded.published_at,
  updated_at = excluded.updated_at;

-- この動画で紹介した追加品種の詳細ページにも、同じYouTube動画を表示します。
-- URL・果樹・品種の組み合わせを確認してから追加するため、何度実行しても重複しません。
with target_cultivars(fruit_slug, cultivar_slug) as (
  values
    ('jackfruit', 'zhen-zhu-bai'),
    ('jackfruit', 'sun-shan'),
    ('chempedak', 'mong-chen'),
    ('chempedak', 'qing-long-jin'),
    ('chempedak', 'pan-long'),
    ('chempedak', 'taitung-red'),
    ('chempedak', 'xiao-zi-mi'),
    ('chempedak', 'nangang-jiao'),
    ('avocado', 'hei-bao'),
    ('avocado', 'hei-jin-gang'),
    ('avocado', 'hei-jin-huan'),
    ('avocado', 'madou-no-2'),
    ('abiu', 'bai-jin'),
    ('black-sapote', 'zheng-tan-xiang-line'),
    ('mango', 'maha-chanok')
), resolved as (
  select
    f.id as fruit_id,
    c.id as cultivar_id,
    c.name_ja as cultivar_name
  from target_cultivars target
  join public.fruits f on f.slug = target.fruit_slug
  join public.cultivars c
    on c.fruit_id = f.id
   and c.slug = target.cultivar_slug
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
  'https://www.youtube.com/watch?v=DTmz_5rnTyk',
  '【後半 本日限定】台湾のすごい園地に来た【#台湾17】',
  resolved.cultivar_name || 'が登場する台湾の熱帯果樹園の取材動画です。樹姿、果実、接ぎ木や園主による品種説明を確認できます。',
  'https://img.youtube.com/vi/DTmz_5rnTyk/hqdefault.jpg',
  '園地・品種紹介',
  true
from resolved
where not exists (
  select 1
  from public.videos existing
  where existing.fruit_id = resolved.fruit_id
    and existing.cultivar_id = resolved.cultivar_id
    and existing.youtube_url = 'https://www.youtube.com/watch?v=DTmz_5rnTyk'
);

-- 実行確認：15品種すべてに動画が1件ずつ表示されれば成功です。
select
  f.name_ja as fruit_name,
  c.name_ja as cultivar_name,
  count(v.id) as linked_video_count
from public.cultivars c
join public.fruits f on f.id = c.fruit_id
left join public.videos v
  on v.cultivar_id = c.id
 and v.youtube_url = 'https://www.youtube.com/watch?v=DTmz_5rnTyk'
where c.slug in (
  'zhen-zhu-bai',
  'sun-shan',
  'mong-chen',
  'qing-long-jin',
  'pan-long',
  'taitung-red',
  'xiao-zi-mi',
  'nangang-jiao',
  'hei-bao',
  'hei-jin-gang',
  'hei-jin-huan',
  'madou-no-2',
  'bai-jin',
  'zheng-tan-xiang-line',
  'maha-chanok'
)
group by f.name_ja, c.name_ja
order by f.name_ja, c.name_ja;
