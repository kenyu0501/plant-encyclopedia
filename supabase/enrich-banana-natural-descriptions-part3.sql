-- バナナ品種の説明自然化 Part 3/3
-- Part 1実行後に実行してください。既存の画像・YouTube・slugは保持し、主要品種だけ説明を厚くします。

begin;

with banana as (
  select id
  from public.fruits
  where slug = 'banana'
  limit 1
), source as (
  select *
  from (values
    (
      'applebanana',
      'AppleBanana(ラツンダン-タイプ)は、ラツンダン/Silk系に近いAAB系として、甘味と酸味のバランスを評価したい品種です。完熟時の香りと酸味が魅力で、沖縄では島バナナ、アップル、マイソールとの食味比較に向きます。',
      '中果。',
      '甘酸っぱい食味を期待。',
      'なめらか。',
      null,
      '中高性。',
      'AAB / Silk・Latundan系。',
      '沖縄では露地候補。高温多湿期の病害と風害に注意します。',
      '大鉢でも試せるが露地向き。',
      '食味比較をしたい中級者向き。',
      '酸味系バナナの比較品種として大事にしたいです。',
      '出典: UF/IFAS MG040（Apple/Silk/Manzano AAB） / CGIAR Genebanks Banana overview / 沖縄での栽培観察メモ。',
      '中間',
      'AAB',
      '中'
    ),
    (
      'banana-048',
      '仙人蕉（台湾バナナ）は、台湾系のAAAデザートバナナとして整理したい品種です。もっちりした甘味があり、キャベンディッシュ系に近い扱いやすさを持つ一方、葉の病害や強風で品質・収量が変わります。',
      '中果。',
      'もっちり甘い。',
      'なめらかでもっちり。',
      null,
      '2.7m程度。',
      'AAA系。',
      '沖縄では露地候補。葉病害と防風を重視します。',
      '大鉢では短期栽培向き。',
      '比較的育てやすいが、病害観察は必要。',
      '台湾系の食味を比較する基準にしたい品種です。',
      '出典: CGIAR Genebanks Banana overview（AAA dessert groups） / UF/IFAS MG040（Cavendish系） / 沖縄での栽培観察メモ。',
      '中間',
      'AAA',
      '中'
    ),
    (
      'banana-052',
      'グランドナインは、Grand Nainとして知られるキャベンディッシュ系AAA品種です。商業栽培でも重要な系統で、果実はそろいやすく、甘味と食感が安定します。沖縄では葉病害、台風、低温期の生育停滞に注意します。',
      '中果でそろいやすい。',
      '標準的なデザートバナナの甘味。',
      'なめらか。',
      null,
      '矮性から中間。管理しやすい。',
      'AAA / Cavendish subgroup。',
      '沖縄では露地候補。防風と葉病害管理で結果が変わります。',
      '大鉢でも試しやすい。',
      '初心者にも比較的試しやすい。',
      'スーパーのバナナに近い方向の基準品種として比較しやすいです。',
      '出典: UF/IFAS MG040（Grand Nain, Cavendish AAA） / CGIAR Genebanks Banana overview。',
      '矮性',
      'AAA',
      '多い'
    ),
    (
      'musa-dwarf-orinoco',
      'Musa Dwarf Orinocoは、Orinoco/Burro系に近いABB系の調理・兼用品種として扱いたい品種です。未熟果は調理向きで、完熟果は酸味と甘味が出ます。矮性で管理しやすい反面、果実利用では追熟の見極めが大切です。',
      '太めの中果。',
      '完熟で酸味と甘味。未熟果は調理向き。',
      'しっかり。',
      null,
      '矮性。',
      'ABB / Bluggoe・Orinoco系。',
      '沖縄では庭植え候補。矮性なので防風しやすいです。',
      '大鉢でも試しやすい。',
      '調理利用も楽しむ人向き。',
      '完熟生食だけでなく、調理用として考えると評価しやすい品種です。',
      '出典: UF/IFAS MG040（Bluggoe/Burro/Orinoco ABB） / CGIAR Genebanks Banana overview。',
      '矮性',
      'ABB',
      '中'
    ),
    (
      'musa-hua-moa',
      'Musa Hua Moaは、Maoli-Popoulu系に近いAABの太い果指をもつ品種として知られます。未熟果は調理、完熟果は生食にも使え、特にフライや調理利用で価値が高い品種です。暖かく風の少ない場所で、健全苗を使って管理したい品種です。',
      '太く大きな果指。',
      '完熟で甘味。未熟果は調理向き。',
      'しっかり。',
      null,
      '中高性で大きな果指。',
      'AAB / Maoli-Popoulu系。',
      '沖縄では暖かい場所で候補。風と病害に注意します。',
      '鉢では難しめ。',
      '調理利用もしたい中級者向き。',
      '太い果指は写真映えするので、果実写真を増やしたい品種です。',
      '出典: UF/IFAS MG040（Hua moa AAB） / CGIAR Genebanks Banana overview。',
      '中間',
      'AAB',
      '中'
    ),
    (
      'fhih-01-goldfinger',
      'FHIA-01 Goldfingerは、ホンジュラスFHIA育成のAAAB系デザートバナナとして知られ、Panama病やシガトカ病への抵抗性が評価される改良品種です。家庭栽培では病害抵抗性と食味の両方を比較できる重要品種として扱えます。',
      '中果。',
      '甘味がありデザート向き。',
      'なめらか。',
      null,
      'ゾウムシ類の観察が必要。',
      'AAAB / FHIA hybrid。',
      '沖縄では病害比較に向く候補。防風と害虫確認を行います。',
      '大鉢でも試せるが露地が安定。',
      '病害抵抗性を重視する人に向きます。',
      '病害に強い方向の品種として、沖縄での実力をしっかり見たいです。',
      '出典: UF/IFAS MG040（FHIA-01 Goldfinger, disease resistance） / CGIAR Genebanks Banana overview。',
      null,
      'AAAB',
      '多い'
    ),
    (
      'pisang-raja',
      'Pisang Rajaは、東南アジアで高く評価される食味系バナナとして知られます。系統によりゲノム構成や草姿の情報に揺れがあるため、沖縄では香り、果肉色、酸味、房型を記録しながら比較したい品種です。',
      null,
      '甘味と香りを評価したい。',
      'なめらか。',
      null,
      '高性。',
      '系統により要確認。',
      '沖縄では露地候補。高性なので防風を重視します。',
      '鉢では難しめ。',
      '食味比較を楽しむ中級者向き。',
      '名前だけで期待値が上がる品種なので、実際の食味を丁寧に記録したいです。',
      '出典: ProMusa/MGIS banana diversity references / 沖縄での栽培観察メモ。',
      '高性',
      null,
      '中'
    ),
    (
      'kluai-khai',
      'Kluai Khaiは、タイで親しまれる小果系のAA品種として扱われることが多いデザートバナナです。小ぶりで甘味があり、果皮が薄く、完熟果を生食で楽しむ方向の品種です。沖縄では株の細さ、ゾウムシ類、風害を確認します。',
      '小果。',
      '甘味があり、酸味も少し感じる。',
      'なめらか。',
      null,
      'ゾウムシ類に弱い観察あり。',
      'AA系。',
      '沖縄では暖かさは合うが、害虫と風害に注意します。',
      '大鉢でも試しやすい。',
      '小果系を楽しむ中級者向き。',
      '小さい果実の品質を見たい品種。食味写真と糖度メモがあると良いです。',
      '出典: CGIAR Genebanks Banana overview（Sucrier/AA等の小果デザート分類） / 沖縄での栽培観察メモ。',
      null,
      'AA',
      '中'
    ),
    (
      'banana-097',
      'セニョリータバナナは、小果で甘味が強いデザートバナナとして流通する系統です。AA系に近い小果タイプとして、果実の小ささ、甘味、皮の薄さを評価します。仮茎が細めなので、沖縄では風と乾燥に注意します。',
      '小果。',
      '甘い。',
      'なめらか。',
      null,
      '偽茎が細い。',
      'AA系の可能性。',
      '沖縄では栽培候補だが、細い株は風で傷みやすいので保護します。',
      '大鉢でも試しやすい。',
      '小果を楽しむ人向き。',
      '小さいけれど味の満足度を見たい品種です。',
      '出典: CGIAR Genebanks Banana overview（AA dessert groups） / 沖縄での栽培観察メモ。',
      null,
      'AA',
      '中'
    ),
    (
      'kluai-phama-hae-kuk',
      'Kluai Phama Hae Kukは、ハクムック系に似た酸味と甘味をもつABB系候補として記録したい品種です。高性で大株になりやすいため、沖縄では食味だけでなく、台風後の回復、房の大きさ、収穫までの期間を観察します。',
      null,
      '酸味と甘味があり、ハクムック系に似る。',
      'ややねっとり。',
      null,
      '高性。',
      'ABB系。',
      '沖縄では露地候補。高性なので防風と支柱を検討します。',
      '鉢では難しめ。',
      '中級者向き。',
      'けんゆー動画とあわせて、食味の記録を増やしたい品種です。',
      '出典: MGIS Pisang Awak group / けんゆー動画・沖縄での栽培観察メモ。',
      '高性',
      'ABB',
      '中'
    ),
    (
      'kluai-teparod',
      'Kluai Teparodは、ABBB系として記録されることがある調理向きの大型系統です。大きな果指が特徴で、完熟生食よりも調理・加工を前提に評価すると理解しやすい品種です。',
      '大きな果指。',
      '調理向き。完熟時の甘味は系統差を確認。',
      'しっかり。',
      null,
      '高性。',
      'ABBB系。',
      '沖縄では露地向き。大株化と台風対策が重要です。',
      '鉢では難しい。',
      '調理利用を目的にする中級者向き。',
      '迫力のある果指を写真で残したい品種です。',
      '出典: MGIS Pisang Awak group（ABB/ABBB） / CGIAR Genebanks Banana overview / 沖縄での栽培観察メモ。',
      '高性',
      'ABBB',
      '中'
    )
  ) as v (
    slug,
    description,
    fruit_size,
    taste,
    texture,
    harvest_season,
    tree_vigor,
    difficulty,
    okinawa_suitability,
    container_suitability,
    beginner_suitability,
    kenyu_comment,
    public_notes,
    plant_height_type,
    genome_group,
    yield_level
  )

)
update public.cultivars c
set
  description = source.description,
  fruit_size = coalesce(source.fruit_size, c.fruit_size),
  taste = coalesce(source.taste, c.taste),
  texture = coalesce(source.texture, c.texture),
  harvest_season = coalesce(source.harvest_season, c.harvest_season),
  tree_vigor = coalesce(source.tree_vigor, c.tree_vigor),
  difficulty = coalesce(source.difficulty, c.difficulty),
  okinawa_suitability = coalesce(source.okinawa_suitability, c.okinawa_suitability),
  container_suitability = coalesce(source.container_suitability, c.container_suitability),
  beginner_suitability = coalesce(source.beginner_suitability, c.beginner_suitability),
  kenyu_comment = coalesce(source.kenyu_comment, c.kenyu_comment),
  public_notes = source.public_notes,
  plant_height_type = coalesce(source.plant_height_type, c.plant_height_type),
  genome_group = coalesce(source.genome_group, c.genome_group),
  yield_level = coalesce(source.yield_level, c.yield_level),
  updated_at = now()
from source
join banana on true
where c.fruit_id = banana.id
  and c.slug = source.slug;

commit;

with banana as (
  select id
  from public.fruits
  where slug = 'banana'
  limit 1
)
select
  count(*) filter (where public_notes is not null and public_notes like '%出典:%') as cultivars_with_sources,
  count(*) filter (where description like '%京都府立大学%' or public_notes like '%調査記録%' or public_notes like '%提供協力者%') as remaining_unwanted_public_text
from public.cultivars c
join banana on banana.id = c.fruit_id;
