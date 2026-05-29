-- バナナ品種の説明自然化 Part 2/3
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
      'banana-001',
      '島バナナは、沖縄で古くから親しまれてきた小果系のバナナとして扱いたい品種です。AAB系に近い食味として、完熟すると甘味に加えてリンゴ酸由来のさわやかな酸味が出やすく、香りの良さが魅力です。果指は短めで家庭用には扱いやすい一方、台風、ゾウムシ類、バンチートップ病などには注意が必要です。',
      '小果で短め。房は大きすぎず、家庭利用向き。',
      '甘味に酸味が重なる。完熟時は香りが出やすい。',
      'ややしっかり。追熟でなめらかになる。',
      '沖縄では株の充実後に開花・収穫。作型と冬越し条件で変動。',
      '短果指系統。風で葉が傷みやすいため防風が重要。',
      'AAB系の可能性。病害虫と風害への観察が必要。',
      '沖縄向きだが、台風対策と病害虫管理で結果が大きく変わります。庭植えでは株間と排水を確保します。',
      '大鉢でも試せるが、収量を狙うなら露地が安定します。',
      '沖縄らしい食味を楽しみたい人に向きます。病害虫チェックは必須です。',
      '島バナナは「香りと酸味」を楽しむ品種として残したいです。小さめでも味の満足度が高く、沖縄の図鑑では基準品種として比較しやすい存在です。',
      '出典: CGIAR Genebanks Banana overview（AAB等の分類体系） / 沖縄での栽培観察メモ。',
      '中間',
      'AAB',
      '中'
    ),
    (
      'banana-002',
      'ドワーフナムワは、Pisang Awak/Namwa系に近いABB系の矮性タイプとして扱いやすい品種です。果肉は水分が少なめで甘味が濃く、追熟が合うとねっとりした食感になります。草丈を抑えやすく、家庭栽培でも比較しやすい一方、ナムワ系は地域や系統名の揺れが多いため、果実形・草姿・収量をセットで記録したい品種です。',
      '中小果。房付きはよく、家庭利用では十分な収量を狙える。',
      '高糖度でねっとり。酸味も少し出る。',
      'ねっとり、やや粉質感。',
      '沖縄では露地で周年生育しやすく、株が充実すると安定して収穫を狙える。',
      '矮性で豊産性があり、風対策しやすい。',
      'ABB / Pisang Awak系。Panama病感受性の報告もあるため健全苗と土壌管理を重視。',
      '沖縄の家庭栽培では有望。矮性で管理しやすいが、排水とゾウムシ類の確認は欠かせません。',
      '大鉢でも試しやすい。根詰まりと肥料切れに注意。',
      '初心者にもすすめやすい候補です。',
      '味、収量、管理のしやすさのバランスが良いので、庭バナナの基準品種として比較したいです。',
      '出典: MGIS Pisang Awak group（ABB/ABBB、用途、強健性） / UF/IFAS MG040（Kluai namwa khom, ABB） / 沖縄での栽培観察メモ。',
      '矮性',
      'ABB',
      '多い'
    ),
    (
      'banana-003',
      '謎ナムワは、ナムワ系に近い果肉の締まりと高糖度傾向をもつ系統として記録します。正確な系統名が未確定のため、Pisang Awak/Namwa系との比較対象として、果指の形、仮茎の色、房の大きさ、病害虫への反応を継続観察したい品種です。',
      null,
      '水分少なめで甘味が濃い傾向。',
      'ねっとり、やや締まる。',
      null,
      'ナムワ系として草姿・房型の確認が必要。',
      'ABB系の可能性。品種同定は継続確認。',
      '沖縄では露地候補。ナムワ系として強健さを期待できるが、同定が必要です。',
      '大鉢でも比較栽培可能。',
      '食味確認と品種同定を楽しむ中級者向き。',
      '「謎」のままでも、食味と草姿を記録していく価値があります。写真を増やして他のナムワ系と比較したいです。',
      '出典: MGIS Pisang Awak group / 沖縄での栽培観察メモ。',
      null,
      'ABB',
      null
    ),
    (
      'banana-007',
      'ナムワアイスは、ナムワ系の強健さに、さわやかな甘味とやわらかい果肉を期待して比較したい品種です。Blue Java/Ice Creamと呼ばれる流通名は地域で混同が多いため、果皮の粉、果肉色、香り、房型を写真で残しながら確認するのが大切です。',
      null,
      'さわやかな甘さ。追熟で香りが出る。',
      'やわらかめ。',
      null,
      '高性。防風と株間が必要。',
      'ABB系の可能性。Ice Cream/Blue Java名は混同に注意。',
      '沖縄では露地向きだが、高性なので台風対策が重要です。',
      '鉢では長期維持が難しい。',
      '栽培は可能だが、品種確認をしながら育てたい中級者向き。',
      '名前の魅力が強い品種ですが、沖縄では「本当にどの系統か」を写真と食味で丁寧に残したいです。',
      '出典: UF/IFAS MG040（Pisang Awak/Blue JavaをABB欄に掲載） / MGIS Pisang Awak group / 沖縄での栽培観察メモ。',
      '高性',
      'ABB',
      '中'
    ),
    (
      'banana-010',
      'マイソールは、Mysore subgroupに属するAAB系のデザートバナナとして知られ、甘味と酸味のバランスが良い品種です。香りがあり、完熟時に酸味が心地よく出るため、単に甘いだけでない食味を評価したい品種です。高性になりやすいため、沖縄では防風と株元管理が重要です。',
      '小から中果。',
      '甘味と酸味のバランスがよい。',
      'しっかりからなめらか。',
      null,
      '高性。風害対策を重視。',
      'AAB / Mysore subgroup。',
      '沖縄では味の個性を楽しめる候補。高性のため台風時の葉傷みと倒伏に注意します。',
      '鉢では難しめ。露地向き。',
      '食味重視の中級者向き。',
      '酸味のあるバナナが好きな人には面白い品種。島バナナとの比較にも使いやすいです。',
      '出典: CGIAR Genebanks Banana overview（Mysore subgroup AAB） / UF/IFAS MG040（Mysore AAB） / 沖縄での栽培観察メモ。',
      '高性',
      'AAB',
      '中'
    ),
    (
      'banana-017',
      '台蕉2号は、キャベンディッシュ系に近いAAA系として整理できる台湾系の品種です。食味は一般的なキャベンディッシュより香りや甘味を感じる場合がありますが、シガトカ病など葉の病気が出ると収量が落ちやすいため、葉を健康に保つ管理が大切です。',
      '中果。',
      '甘味と香りがあり、キャベンディッシュ系の食味。',
      'なめらか。',
      null,
      '3m程度。シガトカ病の観察が必要。',
      'AAA / Cavendish系の可能性。',
      '沖縄では栽培可能だが、湿度が高い時期の葉病害に注意します。',
      '大鉢では短期栽培向き。',
      '葉病害を見られる中級者向き。',
      '収量よりも、台湾系キャベンディッシュとして味と病害の出方を比較したい品種です。',
      '出典: CGIAR Genebanks Banana overview（Cavendish AAA） / UF/IFAS MG040（Cavendish group） / 沖縄での栽培観察メモ。',
      '中間',
      'AAA',
      '中'
    ),
    (
      'banana-020',
      'ハクムックアイスクリームは、銀色がかった果指と甘くねっとりした食味を観察したいABB系の可能性が高い品種です。高性で株が大きくなるため、沖縄では味の評価と同時に台風への倒れやすさ、収穫までの期間、房の大きさを記録すると価値があります。',
      '中果。果皮に銀色がかった印象が出る。',
      '甘くねっとり。',
      'ねっとり。',
      null,
      '高性。大株化しやすい。',
      'ABB系の可能性。',
      '露地向き。防風と株間を確保したい品種です。',
      '鉢では難しめ。',
      '中級者向き。',
      '食味が良いので、写真と糖度メモを増やしたい品種です。',
      '出典: MGIS Pisang Awak group / 沖縄での栽培観察メモ。',
      '高性',
      'ABB',
      '中'
    ),
    (
      'banana-021',
      '合掌バナナは、果房や果指が独特に密着して見えることがあり、形の面白さも含めて記録したい品種です。調理・生食兼用として扱われることがあり、完熟時の甘味だけでなく未熟果の使い方も比較したい系統です。',
      '果指が密着しやすく、房姿に特徴が出る。',
      '完熟で甘味。調理利用も検討できる。',
      'しっかり。',
      null,
      '高性。花粉が確認されることがある。',
      'BBB系またはBゲノムが強い系統として継続確認。',
      '沖縄では露地候補。風で倒れないよう支柱・防風を検討します。',
      '鉢では難しめ。',
      '形の面白さも楽しむ中級者向き。',
      '食味だけでなく、房の形を写真で残すと図鑑らしさが出る品種です。',
      '出典: CGIAR Genebanks Banana overview（Bゲノム系・調理用分類） / けんゆー動画・沖縄での栽培観察メモ。',
      '高性',
      'BBB',
      '中'
    ),
    (
      'banana-031',
      'アイスクリームは、Blue Java/Ice Cream名で流通することが多い品種群です。一般にABB系として扱われ、果肉が白くやわらかく、酸味を含むさっぱりした食味が特徴とされます。ただし日本国内ではナムワ系や別系統が同名で流通することも多いため、果皮色、果肉、房型を写真で比較して記録したい品種です。',
      '中果。',
      '白い果肉で、やわらかく酸味を含む。',
      'やわらかい。',
      null,
      '県内で見かけるタイプ。果実に茶色い傷が出ることがある。',
      'ABB系として扱われることが多いが、流通名の混同に注意。',
      '沖縄では露地候補。高性の場合は防風を重視します。',
      '大鉢では短期栽培向き。',
      '品種同定を楽しむ中級者向き。',
      'アイスクリーム名は魅力的ですが、同名異品種が多いので、写真・食味・草姿をセットで残したいです。',
      '出典: UF/IFAS MG040（Ice cream/Blue JavaをABB欄に掲載） / MGIS Pisang Awak group / 沖縄での栽培観察メモ。',
      null,
      'ABB',
      '中'
    ),
    (
      'banana-032',
      'ナムワ系は、Pisang Awak/Namwa系の強健さと甘味を比較するための基準系統です。成長が早く病害虫に比較的強い印象があり、完熟時は芳香と甘味がはっきり出ます。系統差が大きいため、草丈、房型、果皮のシミ、食感を分けて記録すると見分けやすくなります。',
      '中果。',
      '芳香があり、熟すと強い甘味。酸味とのバランスもよい。',
      'ねっとり、やや締まる。',
      null,
      '成長が早く、3m程度になることがある。',
      'ABB / Pisang Awak系。',
      '沖縄ではかなり有望。防風と排水を整えると家庭栽培でも楽しみやすい品種群です。',
      '大鉢でも試せるが、収量は露地が安定。',
      '初心者にも比較的おすすめ。',
      '沖縄の庭バナナではナムワ系の比較がとても大切。味と強さのバランスを見たいです。',
      '出典: MGIS Pisang Awak group / UF/IFAS MG040（Kluai namwa） / 沖縄での栽培観察メモ。',
      '中間',
      'ABB',
      '多い'
    ),
    (
      'banana-036',
      'アップルは、Silk/Manzano系に近いAAB系のデザートバナナとして整理したい品種です。完熟すると甘味に明るい酸味が重なり、りんごのような印象で語られることがあります。病害に弱い系統もあるため、沖縄では健全苗、防風、排水を重視します。',
      '中果。',
      '甘味と酸味のバランスがよい。',
      'なめらか。',
      null,
      '成長が早く病害虫に強い観察あり。系統差に注意。',
      'AAB / Silk・Manzano系の可能性。',
      '沖縄では食味評価の価値が高い品種。病害と風害に注意します。',
      '大鉢でも試せるが、収量は露地向き。',
      '食味重視の中級者向き。',
      '酸味のあるバナナとして、島バナナやマイソールとの比較が面白いです。',
      '出典: UF/IFAS MG040（Apple/Silk/Manzano AAB） / CGIAR Genebanks Banana overview / 沖縄での栽培観察メモ。',
      '中間',
      'AAB',
      '中'
    ),
    (
      'banana-037',
      'ドワーフアップルは、アップル系の食味をより低い草丈で楽しむ候補です。甘味と酸味のバランスが良く、家庭栽培では管理しやすさが魅力になります。系統名の確認が必要なため、果実写真、草丈、開花までの期間を残したい品種です。',
      '中小果。',
      '甘味と酸味のバランスがよい。',
      'なめらか。',
      null,
      '矮性。成長は早め。',
      'AAB系の可能性。',
      '沖縄の小さめの庭でも候補になります。防風と排水を重視します。',
      '大鉢で試しやすい。',
      '初心者から中級者向き。',
      'アップル系の味をコンパクトに楽しめるなら、とても価値があります。',
      '出典: UF/IFAS MG040（Apple/Silk/Manzano AAB） / 沖縄での栽培観察メモ。',
      '矮性',
      'AAB',
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
