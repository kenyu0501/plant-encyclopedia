-- マンゴー品種説明 第2弾
-- JIRCASの糖度・酸度・果実重・成熟日数・果皮色などを自然文に整理し、
-- SSR解析で親子関係が確認・推定された品種には系譜情報を追記します。

begin;

with mango as (
  select id from public.fruits where slug = 'mango' limit 1
)
update public.fruits f
set
  description = 'マンゴーはインド周辺から東南アジアにかけて多様化した熱帯果樹で、世界には多数の在来品種・商用品種・育成系統があります。果実品質は糖度、酸度、果実重、果皮色、香り、繊維の多少、成熟日数で大きく変わります。',
  fruit_description = '果実は品種により小果から大果まで幅があり、果皮色は緑、黄、橙、赤、紫を帯びるものがあります。糖度だけでなく、酸度、繊維、香り、収穫後の日持ちが品種評価で重要です。',
  cultivation_summary = '沖縄では開花期の低温・多湿、炭疽病、アザミウマ、台風前後の果実傷みを見ながら品種を選びます。JIRCASの品質特性値は石垣での比較データとして、品種選定のよい目安になります。',
  public_notes = '出典: JIRCASマンゴー遺伝資源サイト https://www.jircas.go.jp/ja/database/mango/mango-database / Yamamoto et al. Genetic diversity and relatedness of mango cultivars assessed by SSR markers, Breeding Science, 2019 / FAO Mango Post-harvest Operations https://www.fao.org/fileadmin/user_upload/inpho/docs/Post_Harvest_Compendium_-_Mango.pdf',
  updated_at = now()
where f.id = (select id from mango);

-- 全マンゴー品種: 既存のJIRCAS数値を読みやすい説明に再構成
with mango as (
  select id from public.fruits where slug = 'mango' limit 1
)
update public.cultivars c
set
  description = concat_ws(
    '',
    c.name_ja,
    'は',
    coalesce(nullif(c.origin, ''), '来歴確認中'),
    'に由来するマンゴー品種です。',
    case
      when c.fruit_size is not null then ' 果実サイズは' || replace(replace(c.fruit_size, '（JIRCAS調査平均）', ''), '。', '') || '。'
      else ''
    end,
    case
      when c.taste is not null then ' 食味は' || replace(replace(c.taste, 'JIRCAS調査値は', 'JIRCAS値では'), 'です。', '。')
      else ''
    end,
    case
      when c.texture is not null then ' 肉質は' || replace(c.texture, '。', '') || '。'
      else ''
    end,
    case
      when c.aroma is not null then ' 香りは' || replace(c.aroma, '。', '') || '。'
      else ''
    end,
    case
      when c.harvest_season is not null then ' 成熟目安は' || replace(replace(c.harvest_season, '成熟日数の中央値は', ''), '（JIRCAS石垣調査）', '') || '。'
      else ''
    end
  ),
  difficulty = concat_ws(
    ' ',
    case
      when coalesce(c.taste, '') like '%糖度は非常に高い%' then '高糖度系なので、完熟時の香りと酸味の残り方を確認したい。'
      when coalesce(c.taste, '') like '%甘さは控えめ%' then '甘味だけでなく、酸味・香り・肉質を含めて評価したい。'
      when coalesce(c.taste, '') like '%酸味は強め%' then '酸味が出やすいため、収穫時期と追熟条件で印象が変わりやすい。'
      when coalesce(c.taste, '') like '%酸味は穏やか%' then '酸味が穏やかなため、甘味主体の品種として比較しやすい。'
      else '糖度、酸度、果実重、成熟日数、香り、肉質を合わせて評価したい。'
    end,
    case
      when coalesce(c.fruit_size, '') like '%かなり大玉%' or coalesce(c.fruit_size, '') like '%大玉%' then '大果系は枝折れ、摘果、台風前後の果実傷に注意。'
      when coalesce(c.fruit_size, '') like '%小ぶり%' then '小果系は家庭利用や食味比較に向きますが、収量性も合わせて見たい。'
      else null
    end
  ),
  okinawa_suitability = concat_ws(
    ' ',
    '沖縄ではJIRCASの品質特性値を目安にしつつ、開花期の湿度、炭疽病、アザミウマ、台風期の果実傷を確認したい品種です。',
    case
      when coalesce(c.harvest_season, '') like '%14%' or coalesce(c.harvest_season, '') like '%15%' then '成熟日数が長めの品種は、樹上期間中の台風・病害リスクも見ます。'
      else null
    end
  ),
  public_notes = case
    when coalesce(c.public_notes, '') like '%JIRCASマンゴー遺伝資源サイト%' then c.public_notes
    else concat_ws(
      E'\n',
      nullif(c.public_notes, ''),
      '出典: JIRCASマンゴー遺伝資源サイト https://www.jircas.go.jp/ja/database/mango/mango-database'
    )
  end,
  updated_at = now()
where c.fruit_id = (select id from mango);

-- SSR解析で親子関係が確認・推定された品種
with source(slug, parentage, pedigree_note) as (
  values
    ('irwin', 'Lippens × Haden', 'SSR解析でLippens-JIRCASとHaden-JIRCASの子であることが確認されています。Haden系の赤色系統として、日本・沖縄の栽培で重要な位置づけです。'),
    ('dot', 'Carrie × Spirit of ''76', 'SSR解析ではCarrieとSpirit of ''76-JIRCASの子と推定されています。'),
    ('jubilee', 'Sensation × Irwin', 'SSR解析でSensationとIrwinの子であることが確認されています。Irwinの赤色系形質を引く系統として見たい品種です。'),
    ('lily', 'Springfels × Sensation', 'SSR解析でSpringfels-JIRCASとSensationの子であることが確認されています。'),
    ('manzanillo', 'Haden × Kent', 'SSR解析でHaden-JIRCASとKentの子であることが確認されています。Haden系統の大果・赤色系の流れを見たい品種です。'),
    ('r2e2', 'Kensington × Kent', 'SSR解析でKensingtonとKentの子であることが確認されています。オーストラリア系の大果品種として、樹勢と果実品質を合わせて評価したい品種です。'),
    ('rapoza', 'Irwin × Kent、またはHaden系後代', 'SSR解析ではIrwin × Kent、またはHaden-JIRCASの後代として解釈されています。ハワイ系の赤色果として、着色、肉質、収穫適期を見たい品種です。')
)
update public.cultivars c
set
  difficulty = concat_ws(E'\n', c.difficulty, '系譜: ' || s.parentage || '。' || s.pedigree_note),
  public_notes = concat_ws(
    E'\n',
    c.public_notes,
    '系譜出典: Yamamoto et al. Genetic diversity and relatedness of mango cultivars assessed by SSR markers, Breeding Science, 2019. 親子関係: ' || s.parentage
  ),
  updated_at = now()
from source s
join public.fruits f on f.slug = 'mango'
where c.fruit_id = f.id
  and c.slug = s.slug;

-- 代表的な海外商用品種: FAO等の流通・収穫後情報を補足
with source(slug, add_note) as (
  values
    ('tommy-atkins', 'Tommy Atkinsは外観・輸送性・収穫後の扱いやすさから国際流通で重要な品種です。JIRCAS値では糖度15.2度、酸度0.10%で、外観と日持ちを重視して評価したい品種です。'),
    ('kent', 'Kentは大果で肉質がよく、国際流通でも重要な品種です。緑色が残ることがあり、果皮色だけでなく熟度と果肉色で収穫・追熟を判断したい品種です。'),
    ('keitt', 'Keittは晩生・大果系として国際流通で重要です。樹上期間が長いため、沖縄では台風期の果実傷、袋掛け、炭疽病管理を重視したい品種です。'),
    ('haden', 'Hadenはフロリダ系マンゴーの祖先として非常に重要です。多くの赤色系・商用品種の系譜に関わるため、果実品質だけでなく育種史の基準品種として見たい品種です。')
)
update public.cultivars c
set
  description = concat_ws(' ', c.description, s.add_note),
  public_notes = concat_ws(
    E'\n',
    c.public_notes,
    '補足出典: FAO Mango Post-harvest Operations https://www.fao.org/fileadmin/user_upload/inpho/docs/Post_Harvest_Compendium_-_Mango.pdf'
  ),
  updated_at = now()
from source s
join public.fruits f on f.slug = 'mango'
where c.fruit_id = f.id
  and c.slug = s.slug;

commit;

select
  count(*) as updated_mango_cultivars
from public.cultivars c
join public.fruits f on f.id = c.fruit_id
where f.slug = 'mango';
