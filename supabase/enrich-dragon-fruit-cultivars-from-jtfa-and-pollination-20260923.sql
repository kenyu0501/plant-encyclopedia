-- ドラゴンフルーツ品種資料（2026年寄稿文・Rooh & Nene Farm 2025）に基づく追記。
-- 実食記録の糖度・果肉色は既存値を優先し、資料間に差がある値では上書きしない。

alter table public.cultivars
  add column if not exists cultivar_lineage text,
  add column if not exists pollination_compatibility text,
  add column if not exists fruit_cracking_tendency text;

with fruit_target as (
  select id from public.fruits where slug = 'dragon-fruit'
)
update public.fruits
set
  cultivation_summary = case
    when coalesce(public_notes, '') like '%JTFA寄稿（2026年）%' then cultivation_summary
    else concat_ws(E'\n\n', nullif(cultivation_summary, ''), '肉厚な茎でCAM型光合成を行うため比較的乾燥に強いが、安定収量と品質のためには適度な灌水が必要。極端な高温・過湿を避け、強固な支柱、防風網、排水対策を組み合わせる。平地では垣根仕立て、省スペースではパラソル仕立てが利用できる。')
  end,
  public_notes = case
    when coalesce(public_notes, '') like '%JTFA寄稿（2026年）%' then public_notes
    else concat_ws(E'\n', nullif(public_notes, ''), '出典：上原賢祐「冷笑されるアイツは，実はすごいフルーツだった」JTFA寄稿（2026年）。収穫期の目安は5〜6月から11月頃。')
  end,
  updated_at = now()
where id in (select id from fruit_target);

with source(slug, cultivar_lineage, pollination_compatibility, fruit_cracking_tendency) as (
  values
    ('bahamut', 'S. guatemalensis 系統', '◎', '大'),
    ('bruni', 'S. stenopterus × S. undatus', '×', '小'),
    ('connie-mayer', 'S. stenopterus × S. undatus', '×', '小'),
    ('dessert-princess-orange', 'S. megalanthus × S. guatemalensis（推定）', '○', '小'),
    ('great-red', 'S. guatemalensis × S. undatus', '○', '大'),
    ('golden-dragon', 'S. undatus 変異型', '○', '大'),
    ('king-kong', 'S. guatemalensis × S. undatus', '○', '大'),
    ('la-verne-red', 'S. guatemalensis × S. undatus', '×', '中'),
    ('ocamponis', 'S. ocamponis 純系', '×', '小'),
    ('orange-grenade', 'S. guatemalensis × S. costaricensis（推定）', '×', '小'),
    ('pearl-white', 'S. undatus × S. guatemalensis', '◎', '大'),
    ('peruvian-pink', '南米系統', '×', '中'),
    ('red-majesty', null, '×', '中'),
    ('sophia-red', 'S. guatemalensis × S. costaricensis', '○', '大'),
    ('super-shenron', 'S. guatemalensis × S. undatus', '○', '大'),
    ('tutti-fruity', null, '×', '小'),
    ('white-sapphire', 'S. undatus × S. guatemalensis', '○', '大'),
    ('worth-variegated', 'S. undatus 変異型', '○', '中')
), fruit_target as (
  select id from public.fruits where slug = 'dragon-fruit'
)
update public.cultivars c
set
  cultivar_lineage = coalesce(s.cultivar_lineage, c.cultivar_lineage),
  pollination_compatibility = s.pollination_compatibility,
  fruit_cracking_tendency = s.fruit_cracking_tendency,
  public_notes = case
    when coalesce(c.public_notes, '') like '%Rooh & Nene Farm（2025）%' then c.public_notes
    else concat_ws(E'\n', nullif(c.public_notes, ''), '品種系統・受粉適性・裂果傾向の出典：Rooh & Nene Farm（2025）。栽培観察、形態比較、交配記録に基づく研究資料であり、系統の一部は推定を含む。受粉適性は資料表記（◎・○・×）をそのまま掲載。')
  end,
  updated_at = now()
from source s
where c.slug = s.slug
  and c.fruit_id in (select id from fruit_target);

with source(slug, description_addition) as (
  values
    ('Chura-boshi-Queen', '中央が白、周囲がピンクになる二色の果肉。果汁が多く、スポーツドリンクのような爽快感と白桃を思わせる風味がある。中央糖度18.8°Brixで、部位によって20°Brixを超えた。'),
    ('impact-ruby', '自家結実性があり、とげが短い栽培特性をもつ。果汁は多くみずみずしい一方、寄稿者の実食では淡泊で穏やかな味わいと評価された。'),
    ('Daikou', '台湾で普及する自家和合性の赤肉品種。柱頭と葯の距離が短く自然受粉しやすい。平均果重は400g以上で、丸い果形と短い鱗片により箱詰め・輸送に向く。着色後も比較的樹上に置け、下垂しやすい枝は強風時に折れにくいとされる。'),
    ('dessert-princess-orange', 'オレンジ色の果皮と黄緑色の鱗片をもつ。白肉で、レモンティーや紅茶、浅煎りコーヒーを思わせる華やかで切れのある甘さが特徴。'),
    ('ocamponis', '高温・乾燥に強い原種系。果肉は粘りと弾力があり、酸味が少なく穏やかな甘さ。イチゴやサクランボのようなベリー感に、ビーツを思わせる風味が重なる。'),
    ('peruvian-pink', '鮮やかなピンク果肉。柑橘を思わせる爽やかな酸味と、パイナップルや黄金柑のような風味をもつ。'),
    ('connie-mayer', 'ドイツの育種家Eckhard Meier氏による交配品種。白から半透明の果肉の縁にピンク色が入り、花・バラ・キウイを思わせる上品な芳香が特徴。花もピンク色。')
), fruit_target as (
  select id from public.fruits where slug = 'dragon-fruit'
)
update public.cultivars c
set
  description = case
    when coalesce(c.description, '') like '%【JTFA寄稿資料追記】%' then c.description
    else concat_ws(E'\n\n', nullif(c.description, ''), '【JTFA寄稿資料追記】' || E'\n' || s.description_addition)
  end,
  public_notes = case
    when coalesce(c.public_notes, '') like '%上原賢祐「冷笑されるアイツは%' then c.public_notes
    else concat_ws(E'\n', nullif(c.public_notes, ''), '出典：上原賢祐「冷笑されるアイツは，実はすごいフルーツだった」JTFA寄稿（2026年）。')
  end,
  updated_at = now()
from source s
where c.slug = s.slug
  and c.fruit_id in (select id from fruit_target);

with photo_source(slug, file_name, photo_type, caption, sort_order) as (
  values
    ('yellow-pitaya', 'yellow-pitaya-cross-section.jpg', '果実断面', 'イエローピタヤの果実断面', 1),
    ('yellow-pitaya', 'yellow-pitaya-fruit.jpg', '果実', 'イエローピタヤの果実', 2),
    ('impact-ruby', 'impact-ruby-cross-section.jpg', '果実断面', 'インパクトルビーの果実断面', 1),
    ('impact-ruby', 'impact-ruby-fruit.jpg', '果実', 'インパクトルビーの果実', 2),
    ('ocamponis', 'ocamponis-fruit.jpg', '果実', 'オカンポニスの果実と断面', 1),
    ('ocamponis', 'ocamponis-cross-section.jpg', '果実断面', 'オカンポニスの果実断面', 2),
    ('orange-grenade', 'orange-grenade-cross-section.jpg', '果実断面', 'オレンジグレネードの果実断面', 1),
    ('king-kong', 'king-kong-cross-section.jpg', '果実断面', 'キングコングの果実断面', 1),
    ('great-red', 'great-red-cross-section.jpg', '果実断面', 'グレートレッドの果実断面', 1),
    ('golden-dragon', 'golden-dragon-fruit.jpg', '果実', 'ゴールデンドラゴンの果実', 1),
    ('golden-dragon', 'golden-dragon-cross-section.jpg', '果実断面', 'ゴールデンドラゴンの果実と断面', 2),
    ('connie-mayer', 'connie-mayer-cross-section.jpg', '果実断面', 'コニーマイヤーの果実断面', 1),
    ('connie-mayer', 'connie-mayer-fruit.jpg', '果実', 'コニーマイヤーの果実と断面', 2),
    ('super-shenron', 'super-shenron-cross-section.jpg', '果実断面', 'スーパーシェンロンの果実断面', 1),
    ('sophia-red', 'sophia-red-cross-section.jpg', '果実断面', 'ソフィアレッドの果実断面', 1),
    ('dessert-princess-orange', 'dessert-princess-orange-fruit.jpg', '果実', 'デザートプリンセスオレンジの果実', 1),
    ('dessert-princess-orange', 'dessert-princess-orange-cross-section.jpg', '果実断面', 'デザートプリンセスオレンジの果実断面', 2),
    ('dessert-princess-orange', 'dessert-princess-orange-fruit-2.jpg', '果実', 'デザートプリンセスオレンジの果実', 3),
    ('dessert-princess-orange', 'dessert-princess-orange-cross-section-2.jpg', '果実断面', 'デザートプリンセスオレンジの果実と断面', 4),
    ('tutti-fruity', 'tutti-fruity-cross-section.jpg', '果実断面', 'トゥッティフルーティーの果実断面', 1),
    ('pearl-white', 'pearl-white-cross-section.jpg', '果実断面', 'パールホワイトの果実断面', 1),
    ('bahamut', 'bahamut-cross-section.jpg', '果実断面', 'バハムートの果実断面', 1),
    ('variegata', 'variegata-cross-section.jpg', '果実断面', 'バリエガータの果実断面', 1),
    ('pink-whisper', 'pink-whisper-cross-section.jpg', '果実断面', 'ピンクウィスパーの果実断面', 1),
    ('bruni', 'bruni-cross-section.jpg', '果実断面', 'ブルーニーの果実断面', 1),
    ('peruvian-pink', 'peruvian-pink-cross-section.jpg', '果実断面', 'ペルビアンピンクの果実断面', 1),
    ('peruvian-pink', 'peruvian-pink-fruit.jpg', '果実', 'ペルビアンピンクの果実', 2),
    ('la-verne-red', 'la-verne-red-cross-section.jpg', '果実断面', 'ラ・バーン・レッドの果実断面', 1),
    ('la-verne-red', 'la-verne-red-brix.jpg', '糖度計', 'ラ・バーン・レッドの糖度測定', 2),
    ('red-majesty', 'red-majesty-cross-section.jpg', '果実断面', 'レッドマジェスティの果実断面', 1),
    ('worth-variegated', 'worth-variegated-cross-section.jpg', '果実断面', 'ワース・ヴァリエゲイテッドの果実断面', 1),
    ('okinawa-pink', 'okinawa-pink-cross-section.jpg', '果実断面', '沖縄ピンクの果実断面', 1),
    ('okinawa-white', 'okinawa-white-cross-section.jpg', '果実断面', '沖縄ホワイトの果実断面', 1),
    ('okinawa-red', 'okinawa-red-cross-section.jpg', '果実断面', '沖縄レッドの果実断面', 1),
    ('Daikou', 'Daikou-cultivation-and-fruit.jpg', '栽培記録', '台湾の大紅栽培園と収穫果実', 1),
    ('Chura-boshi-Queen', 'Chura-boshi-Queen-fruit-cross-section-brix.jpg', '果実断面', 'ちゅら星クィーンの果実、果肉断面、糖度', 1)
), fruit_target as (
  select id from public.fruits where slug = 'dragon-fruit'
), resolved as (
  select
    c.id as cultivar_id,
    c.fruit_id,
    p.*,
    not exists (select 1 from public.photos existing where existing.cultivar_id = c.id) as has_no_photo
  from photo_source p
  join public.cultivars c on c.slug = p.slug
  where c.fruit_id in (select id from fruit_target)
)
insert into public.photos (
  fruit_id,
  cultivar_id,
  image_url,
  storage_path,
  thumbnail_url,
  thumbnail_storage_path,
  medium_url,
  medium_storage_path,
  original_url,
  original_storage_path,
  photo_type,
  caption,
  source_type,
  approval_status,
  is_main
)
select
  fruit_id,
  cultivar_id,
  '/media/dragon-fruit-cultivars/' || file_name,
  'static:media/dragon-fruit-cultivars/' || file_name,
  '/media/dragon-fruit-cultivars/' || file_name,
  'static:media/dragon-fruit-cultivars/' || file_name,
  '/media/dragon-fruit-cultivars/' || file_name,
  'static:media/dragon-fruit-cultivars/' || file_name,
  '/media/dragon-fruit-cultivars/' || file_name,
  'static:media/dragon-fruit-cultivars/' || file_name,
  photo_type,
  caption,
  'admin',
  'approved',
  has_no_photo and sort_order = 1
from resolved r
where not exists (
  select 1 from public.photos existing
  where existing.storage_path = 'static:media/dragon-fruit-cultivars/' || r.file_name
);
