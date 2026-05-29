-- ホワイトサポテ（シロサポテ）の果樹ページと品種ページを追加します。
-- 主な参照: 糸満フルーツ園けんちゃん
-- https://okinawan-avocado.com/2021/12/29/white_sapote/

begin;

insert into public.fruits (
  name_ja,
  name_en,
  slug,
  scientific_name,
  family_name,
  origin,
  description,
  growth_habit,
  flower_description,
  fruit_description,
  cultivation_summary,
  okinawa_suitability,
  public_notes,
  private_notes,
  display_order,
  is_public
) values (
  'ホワイトサポテ',
  'White Sapote',
  'white-sapote',
  'Casimiroa edulis',
  'ミカン科',
  'メキシコから中央アメリカの比較的高地',
  'ホワイトサポテは、ミカン科カシミロア属の常緑果樹です。果肉はクリーム色でとても柔らかく、プリンのような食感になりやすい果樹です。甘味が強く酸味は少ない一方、品種によっては皮に近い部分に渋みや独特の苦味が出ることがあります。',
  '常緑で生育は旺盛。環境がよいと大きくなり、品種によって直立しやすいもの、枝が低く曲がるものがあります。',
  '葉腋に短い花序をつけ、小さな花を多数つけます。品種により花粉の有無や子房・柱頭の大きさが異なり、タイプ1、タイプ2、タイプ3に分けられます。',
  '果実は丸形から果頂部がやや尖る形で、果皮は薄く、果肉は薄黄色からクリーム色。繊維が少なく柔らかい食感が特徴です。',
  '水はけのよい場所を好み、過湿には弱いです。耐寒性は比較的強く、成木では-5度程度まで耐えると言われますが、幼木や花芽・果実は寒害に注意が必要です。接ぎ木での増殖が基本です。',
  '沖縄では冬でも最低気温が高いため、秋から冬に花芽が動き、12月から翌1月ごろに開花、7月から8月ごろに収穫する流れが期待できます。湿度と排水、台風対策を重視したい果樹です。',
  '品種により結実性が異なるため、タイプ1とタイプ2の混植、またはタイプ3のような自家結実しやすい品種の利用が重要です。出典: https://okinawan-avocado.com/2021/12/29/white_sapote/',
  '糸満フルーツ園けんちゃんの記事をもとに初期データ作成。',
  40,
  true
) on conflict (slug) do update set
  name_ja = excluded.name_ja,
  name_en = excluded.name_en,
  scientific_name = excluded.scientific_name,
  family_name = excluded.family_name,
  origin = excluded.origin,
  description = excluded.description,
  growth_habit = excluded.growth_habit,
  flower_description = excluded.flower_description,
  fruit_description = excluded.fruit_description,
  cultivation_summary = excluded.cultivation_summary,
  okinawa_suitability = excluded.okinawa_suitability,
  public_notes = excluded.public_notes,
  private_notes = excluded.private_notes,
  display_order = coalesce(public.fruits.display_order, excluded.display_order),
  is_public = excluded.is_public,
  updated_at = now();

with fruit as (
  select id from public.fruits where slug = 'white-sapote'
), cultivar_source as (
  select * from (values
    ('フロリダ', 'Florida', 'florida', 'タイプ1', null, 'タイプ1の代表的なホワイトサポテ品種。タイプ2品種を近くに置くと結実が安定しやすい。'),
    ('クシオ', 'Cuccio', 'cuccio', 'タイプ1', null, 'タイプ1の有名品種。熟しても緑色のままで収穫時期が分かりにくいことがあるため、果実の軟化や香りを確認したい。'),
    ('パイク', 'Pike', 'pike', 'タイプ1', null, 'タイプ1品種。受粉樹との組み合わせを意識して管理したい。'),
    ('キャンディ', 'Candy', 'candy', 'タイプ1', null, 'タイプ1品種。甘味を期待して比較したいホワイトサポテ。'),
    ('ニース', 'Nies', 'nies', 'タイプ1', null, 'タイプ1品種。タイプ2品種との混植候補として整理したい。'),
    ('スマザーズ', 'Suebelle / Smathers', 'smathers', 'タイプ1', '800g級の大玉になる記述があり、花と果実にバラの香りがある。2025年の糸満フルーツ園けんちゃんの収穫では、単為結実した種なし112gの果実で糖度28%を記録。', 'C. edulisではなくC. tetrameria系の可能性があり、葉に毛茸があるウーリーリーフ系として扱われることがあります。非常に濃厚な甘さを記録したい品種。'),
    ('レモンゴールド', 'Lemon Gold', 'lemon-gold', 'タイプ1', '熟すと黄色くなり、日持ちが長いと紹介されている。', '初心者にも扱いやすい候補。黄色くなるため収穫判断がしやすい可能性があります。'),
    ('ラムジーラージ', 'Ramsey Large', 'ramsey-large', 'タイプ1', null, 'タイプ1品種。大玉系として比較したい。'),
    ('ブルメンソール', 'Blumenthal', 'blumenthal', 'タイプ1', null, 'タイプ1品種。結実にはタイプ2品種との組み合わせを意識したい。'),
    ('ラマーツ', 'Lammertz', 'lammertz', 'タイプ1', null, 'タイプ1品種。タイプ2品種との混植候補。'),
    ('チェストナット', 'Chestnut', 'chestnut', 'タイプ1', '熟すと黄色くなり、渋みが少ないと紹介されている。', 'ホワイトサポテの弱点である渋みを避けたい場合に比較したい品種。'),
    ('マクディール', 'McDill', 'mcdill', 'タイプ1', null, '熟しても緑色のままになりやすく、収穫時期の見極めがやや難しい有名品種。'),
    ('チャールズアーリー', 'Charles Early', 'charles-early', 'タイプ1', null, 'タイプ1品種。早生性の有無を観察したい。'),
    ('ゴールデングローブ', 'Golden Globe', 'golden-globe', 'タイプ1', null, 'タイプ1品種。果皮色・果形・食味を記録したい。'),
    ('ライニキコマーシャル', 'Reinike Commercial', 'reinike-commercial', 'タイプ1', '熟すと黄色くなり、糖度が高いと紹介されている。', '甘味を重視して比較したい品種。黄色化により収穫判断もしやすい可能性があります。'),
    ('スナイダー', 'Snyder', 'snyder', 'タイプ1', null, 'タイプ1品種。受粉樹との組み合わせを確認したい。'),
    ('ラムソーラージ', 'Ramso Large', 'ramso-large', 'タイプ1', null, 'タイプ1品種。大玉性を観察したい。'),
    ('イエロー', 'Yellow', 'yellow', 'タイプ1', '熟すと果皮が黄色くなる品種として紹介されている。', '緑色品種より収穫判断がしやすく、初心者向け候補として比較したい。'),
    ('サラダ', 'Saldah', 'saldah', 'タイプ1', null, 'タイプ1品種。タイプ2品種との混植で結実を確認したい。'),
    ('グエン', 'Gwen', 'gwen-white-sapote', 'タイプ1', null, 'タイプ1品種。アボカドのGwenとは別にホワイトサポテ品種として管理。'),
    ('バーノン', 'Vernon', 'vernon', 'タイプ2', '比較的果実が大きく、糖度が高いことから人気があるタイプ2品種。', 'タイプ1品種の受粉樹としても重要。栽培品種と受粉樹の組み合わせで使いやすい。'),
    ('ミッシェル', 'Michele', 'michele', 'タイプ2', null, 'タイプ2品種。花粉を持つため、タイプ1品種との混植候補。'),
    ('ホワイト', 'White', 'white-sapote-white', 'タイプ2', null, 'タイプ2品種。花粉を持つ受粉樹候補として整理。'),
    ('セルク', 'Salk', 'salk', 'タイプ2', null, 'タイプ2品種。タイプ1品種との混植候補。'),
    ('フォーノイ', 'Fournoy', 'fournoy', 'タイプ2', null, 'タイプ2品種。花粉を持つ品種として管理。'),
    ('フィエスタ', 'Fiesta', 'fiesta', 'タイプ2', null, 'タイプ2品種。タイプ1品種との混植で結実性を見たい。'),
    ('プリチャード', 'Pike / Pritchard', 'pritchard', 'タイプ2', null, 'タイプ2品種。花粉を持つ受粉樹候補。'),
    ('青島', 'Aoshima', 'aoshima', 'タイプ2', null, 'タイプ2品種。国内導入・栽培で比較したい。'),
    ('カフェテリアA', 'Cafeteria A', 'cafeteria-a', 'タイプ2', null, 'タイプ2品種。花粉を持つ受粉樹候補。'),
    ('カフェテリアB', 'Cafeteria B', 'cafeteria-b', 'タイプ2', null, 'タイプ2品種。花粉を持つ受粉樹候補。'),
    ('リロイブロック', 'Leroy Brock', 'leroy-brock', 'タイプ2', null, 'タイプ2品種。タイプ1品種との混植候補。'),
    ('オルテガ', 'Ortega', 'ortega', 'タイプ2', null, 'タイプ2品種。花粉を持つ品種として管理。'),
    ('エッジヒル', 'Edgehill', 'edgehill', 'タイプ2', null, 'タイプ2品種。受粉樹としての役割も見たい。'),
    ('スティックツリー', 'Stick Tree', 'stick-tree', 'タイプ2', null, 'タイプ2品種。樹形や着果性を観察したい。'),
    ('モルツビー', 'Maltby', 'maltby', 'タイプ3', 'タイプ3品種。子房と柱頭が大きく、花粉も持つ。一本で自家結実しやすく便利と紹介され、果実はとても美味しかったとの記録がある。', '枝が曲がり低くなるような木になるタイプとして紹介。自家結実性を重視するなら特に注目したい品種。')
  ) as v(name_ja, name_en, slug, flower_type, feature, comment)
)
insert into public.cultivars (
  fruit_id,
  name_ja,
  name_en,
  slug,
  origin,
  description,
  fruit_size,
  taste,
  texture,
  aroma,
  harvest_season,
  cold_hardiness,
  flowering_type,
  tree_vigor,
  difficulty,
  okinawa_suitability,
  container_suitability,
  beginner_suitability,
  kenyu_comment,
  public_notes,
  private_notes,
  is_public,
  is_for_sale
)
select
  fruit.id,
  source.name_ja,
  source.name_en,
  source.slug,
  'メキシコから中央アメリカ原産、カリフォルニアなどで品種選抜',
  source.name_ja || 'はホワイトサポテの品種です。' || case when source.feature is not null then source.feature else source.comment end,
  case
    when source.name_ja = 'スマザーズ' then '800g級の大玉記録あり。単為結実果112gの記録あり。'
    else null
  end,
  case
    when source.name_ja = 'スマザーズ' then '糖度28%の記録があり、とても濃厚。'
    when source.name_ja = 'バーノン' then '糖度が高い人気品種。'
    when source.name_ja = 'ライニキコマーシャル' then '糖度が高い品種として紹介。'
    else '甘味が強く酸味は少ない傾向。品種により渋みや苦味が出ることがある。'
  end,
  'プリンのように柔らかい食感になりやすい',
  case
    when source.name_ja = 'スマザーズ' then '花と果実にバラの香り'
    else null
  end,
  '沖縄では12月〜翌1月ごろ開花、7月〜8月ごろ収穫目安。本土露地では3〜4月開花、9〜10月収穫目安。',
  '-5℃程度（成木目安。幼木や花芽・果実は寒害に注意）',
  source.flower_type,
  case
    when source.name_ja = 'モルツビー' then '枝が曲がり低くなるタイプ'
    else '旺盛。品種により直立性や樹形が異なる。'
  end,
  case source.flower_type
    when 'タイプ1' then 'タイプ1: 子房と柱頭が大きく、雄しべが退化して花粉がない。タイプ2品種との混植で結実を安定させたい。'
    when 'タイプ2' then 'タイプ2: 子房と柱頭が小さく、花粉を持つ。タイプ1品種の受粉樹候補。'
    when 'タイプ3' then 'タイプ3: 子房と柱頭が大きく、花粉を持つ。自家結実しやすい候補。'
    else null
  end,
  '沖縄では過湿を避け、水はけのよい場所で管理したい。台風対策と枝管理、タイプ違いの混植が重要。',
  '鉢栽培も試せるが、過湿を避け、根詰まりと水切れに注意。',
  case
    when source.name_ja in ('イエロー', 'チェストナット', 'レモンゴールド', 'ライニキコマーシャル', 'モルツビー', 'バーノン') then '初心者にも比較しやすい候補。'
    else null
  end,
  source.comment,
  '出典: 糸満フルーツ園けんちゃん「ホワイトサポテ（シロサポテ）についての育て方，品種など徹底解説！」 https://okinawan-avocado.com/2021/12/29/white_sapote/',
  '初期登録: けんちゃん記事をもとに品種タイプと特徴を整理。',
  true,
  false
from cultivar_source source
cross join fruit
on conflict (fruit_id, slug) do update set
  name_ja = excluded.name_ja,
  name_en = excluded.name_en,
  origin = excluded.origin,
  description = excluded.description,
  fruit_size = excluded.fruit_size,
  taste = excluded.taste,
  texture = excluded.texture,
  aroma = excluded.aroma,
  harvest_season = excluded.harvest_season,
  cold_hardiness = excluded.cold_hardiness,
  flowering_type = excluded.flowering_type,
  tree_vigor = excluded.tree_vigor,
  difficulty = excluded.difficulty,
  okinawa_suitability = excluded.okinawa_suitability,
  container_suitability = excluded.container_suitability,
  beginner_suitability = excluded.beginner_suitability,
  kenyu_comment = excluded.kenyu_comment,
  public_notes = excluded.public_notes,
  private_notes = excluded.private_notes,
  is_public = excluded.is_public,
  updated_at = now();

with fruit as (
  select id from public.fruits where slug = 'white-sapote'
), video_source(youtube_url, title) as (
  values
    ('https://youtu.be/cpklHfDjHZA', 'ホワイトサポテ解説'),
    ('https://youtu.be/mVVDYs40qmc', 'ホワイトサポテ参考動画'),
    ('https://youtu.be/pU6BSkiYHm8', 'ホワイトサポテ参考動画'),
    ('https://youtu.be/goTBeIqqXc8', 'ホワイトサポテ参考動画')
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
  fruit.id,
  null,
  video_source.youtube_url,
  video_source.title,
  '糸満フルーツ園けんちゃんの記事より登録',
  'https://img.youtube.com/vi/' || replace(video_source.youtube_url, 'https://youtu.be/', '') || '/hqdefault.jpg',
  'fruit',
  true
from video_source
cross join fruit
where not exists (
  select 1
  from public.videos existing
  where existing.fruit_id = fruit.id
    and existing.youtube_url = video_source.youtube_url
);

commit;

select
  f.name_ja as fruit,
  count(c.id) as cultivar_count
from public.fruits f
left join public.cultivars c on c.fruit_id = f.id
where f.slug = 'white-sapote'
group by f.name_ja;
