-- バナナ品種の説明自然化 Part 1/3
-- まず全体の不要文言を消し、全品種に自然な説明・沖縄適性・鉢適性・初心者向けメモを入れます。
-- Part 1が成功したら、主要品種を出典付きで厚くするPart 2以降を実行してください。

begin;

with banana as (
  select id
  from public.fruits
  where slug = 'banana'
  limit 1
), normalized as (
  select
    c.id,
    c.name_ja,
    nullif(replace(replace(coalesce(c.difficulty, ''), '推定遺伝子型: ', ''), '？', '不明'), '') as detected_genome,
    coalesce(c.plant_height_type, '') as current_height,
    coalesce(c.tree_vigor, '') as vigor
  from public.cultivars c
  join banana on banana.id = c.fruit_id
)
update public.cultivars c
set
  genome_group = coalesce(nullif(c.genome_group, ''), normalized.detected_genome),
  plant_height_type = coalesce(
    nullif(c.plant_height_type, ''),
    case
      when normalized.vigor ~ '矮性|ドワーフ|極太矮性' then '矮性'
      when normalized.vigor ~ '中高性|2\\.7|3m|3ｍ' then '中間'
      when normalized.vigor ~ '高性|高木|大型' then '高性'
      when normalized.name_ja ~ 'ドワーフ|矮' then '矮性'
      else null
    end
  ),
  yield_level = coalesce(
    nullif(c.yield_level, ''),
    case
      when normalized.vigor ~ '豊産|大房' then '多い'
      when normalized.vigor ~ '収穫実績なし|結実せず|成長がとても遅い' then '少ない'
      when normalized.name_ja ~ '観賞|オルナ|芭蕉|イトバショウ|実生|種あり|マニラ麻' then '少ない'
      else null
    end
  ),
  public_notes = null,
  private_notes = nullif(
    regexp_replace(
      regexp_replace(
        coalesce(c.private_notes, ''),
        '出典: 京都府立大学 板井彰浩 教授の沖縄県バナナ調査 2025\.xlsx',
        '内部メモ: 沖縄県内の導入・栽培観察データを含む。',
        'g'
      ),
      '調査記録:[^\n]*(\n|$)|提供協力者:[^\n]*(\n|$)',
      '',
      'g'
    ),
    ''
  ),
  description = case
    when normalized.name_ja ~ 'オルナ|マニラ麻|イトバショウ|芭蕉|sikkimensis|thomsonii|sumatrana|latelita|siamensis|種あり|実生' then
      normalized.name_ja || 'は、食味評価よりも観賞性、遺伝資源、耐性比較の視点で扱いたいバナナ・Musa系統です。花色、葉色、仮茎色、種子の有無などの形質に特徴が出やすく、食用品種とは別枠で記録しておくと比較しやすい系統です。沖縄では生育はしやすい一方、台風時の倒伏、株の暴れ、実生系統の個体差に注意します。'
    when coalesce(c.genome_group, normalized.detected_genome, '') like '%ABB%' or coalesce(c.genome_group, normalized.detected_genome, '') like '%BBB%' then
      normalized.name_ja || 'は、Musa balbisiana由来のBゲノムを多く含む系統として扱うと理解しやすい品種です。一般にABB系は樹勢や環境適応性が評価される一方、果実は生食だけでなく調理・追熟の使い分けで印象が変わります。沖縄では露地栽培の候補になりますが、台風対策、排水、ゾウムシ類、バンチートップ病の確認を続けたい品種です。'
    when coalesce(c.genome_group, normalized.detected_genome, '') like '%AAB%' then
      normalized.name_ja || 'は、AAB系に多い甘味と酸味のバランス、または調理適性を見ながら評価したい品種です。完熟果では香りや酸味が個性として出やすく、未熟果ではでんぷん質を活かした利用も考えられます。沖縄では食味の良さと引き換えに、風害・病害・株の大きさを丁寧に見たい系統です。'
    when coalesce(c.genome_group, normalized.detected_genome, '') like '%AAA%' then
      normalized.name_ja || 'は、AAA系のデザートバナナとして整理できる品種です。甘味、香り、果肉のなめらかさを評価しやすい一方、品種によってはシガトカ病や低温、強風への弱さが出るため、沖縄では防風と葉の健全性を重視して管理します。'
    when coalesce(c.genome_group, normalized.detected_genome, '') in ('AA', 'AB', 'BB') then
      normalized.name_ja || 'は、二倍体系または野生種に近い特徴をもつ可能性がある系統です。果実利用だけでなく、花粉、種子、草姿、葉色などの形質を記録する価値があります。沖縄では観賞・育種素材・比較栽培の視点で残したい品種です。'
    else
      normalized.name_ja || 'は、沖縄での栽培観察をもとに比較していきたいバナナ品種です。食味、背丈、収量、病害虫への強さ、台風後の回復力を分けて記録すると、家庭栽培向きか、収量重視か、観賞向きかを判断しやすくなります。'
  end,
  okinawa_suitability = case
    when normalized.name_ja ~ 'オルナ|マニラ麻|イトバショウ|芭蕉|sikkimensis|種あり|実生' then
      '沖縄では暖かさを活かして維持しやすい一方、食用品種としてではなく観賞・遺伝資源・比較栽培の位置づけで管理したい系統です。台風で葉が傷みやすいため、防風と株元の整理を重視します。'
    else
      '沖縄では露地栽培しやすい候補ですが、品種ごとに台風耐性、排水、ゾウムシ類、バンチートップ病、シガトカ病への反応が異なります。収穫までの期間と株の大きさを記録しながら評価したい品種です。'
  end,
  container_suitability = case
    when coalesce(c.plant_height_type, normalized.current_height) = '矮性' or normalized.name_ja ~ 'ドワーフ|矮' then
      '大鉢で試しやすい候補です。肥料切れと乾燥で果実品質が落ちやすいため、鉢増し、株分け、潅水を計画的に行います。'
    when coalesce(c.plant_height_type, normalized.current_height) = '高性' then
      '鉢では長期維持が難しく、露地または大鉢で短期更新を前提にしたい品種です。'
    else
      '大鉢でも試せますが、結実までの株の充実、根詰まり、風対策を見ながら判断します。'
  end,
  beginner_suitability = case
    when normalized.name_ja ~ 'ドワーフナムワ|ナムワ|三尺|グランドナイン|ドワーフ台湾|島バナナ|アイスクリーム' then
      '初心者にも比較的試しやすい候補です。まずは排水のよい場所、防風、株元の清潔さを整えると安定します。'
    when normalized.name_ja ~ 'オルナ|マニラ麻|イトバショウ|芭蕉|種あり|実生' then
      '観賞・収集向きです。果実利用を主目的にすると期待とずれやすいため、形質観察用として扱うのがおすすめです。'
    else
      '中級者向きです。食味だけでなく、株の高さ、収量、病害虫、台風後の回復を見ながら育てたい品種です。'
  end,
  difficulty = regexp_replace(coalesce(c.difficulty, ''), '^推定遺伝子型: ', ''),
  updated_at = now()
from normalized
where c.id = normalized.id;

commit;

with banana as (
  select id
  from public.fruits
  where slug = 'banana'
  limit 1
)
select
  count(*) as updated_banana_cultivars,
  count(*) filter (
    where description like '%京都府立大学%'
       or public_notes like '%調査記録%'
       or public_notes like '%提供協力者%'
  ) as remaining_unwanted_public_text
from public.cultivars c
join banana on banana.id = c.fruit_id;
