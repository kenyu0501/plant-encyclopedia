-- バナナ品種の説明を自然な文章に整え、不要な公開文言を削除し、主要品種を出典付きで補強します。
-- 目的:
-- 1. 「京都府立大学...提供候補リスト」「調査記録」「提供協力者」など、図鑑の公開説明として不要な文言を消す。
-- 2. 既存の品種数・slug・画像・YouTube紐づけは保ったまま、description/public_notes等を更新する。
-- 3. 主要品種はMGIS、CGIAR、UF/IFAS等の公開情報をもとに説明を厚くする。
--
-- 主な参照:
-- - CGIAR Genebanks Banana: https://genebanks.cgiar.org/resources/crops/banana/
-- - Musa Germplasm Information System, Pisang Awak group: https://www.crop-diversity.org/mgis5/cultivar-group-catalogue/pisang-awak
-- - UF/IFAS Banana Growing in the Florida Home Landscape: https://ask.ifas.ufl.edu/publication/MG040
-- - ProMusa / MGIS banana diversity references: https://www.promusa.org/ / https://www.crop-diversity.org/mgis/
-- - けんゆー動画・記事での食味/栽培観察は、kenyu_commentに現地メモとして反映。

begin;

with banana as (
  select id
  from public.fruits
  where slug = 'banana'
  limit 1
), normalized as (
  select
    c.id,
    c.slug,
    c.name_ja,
    c.name_en,
    nullif(replace(replace(coalesce(c.difficulty, ''), '推定遺伝子型: ', ''), '？', '不明'), '') as detected_genome,
    coalesce(c.plant_height_type, '') as current_height,
    coalesce(c.yield_level, '') as current_yield,
    coalesce(c.tree_vigor, '') as vigor,
    coalesce(c.taste, '') as taste_text
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
    when coalesce(c.name_ja, '') ~ 'オルナ|マニラ麻|イトバショウ|芭蕉|sikkimensis|thomsonii|sumatrana|latelita|siamensis|種あり|実生' then
      c.name_ja || 'は、食味評価よりも観賞性、遺伝資源、耐性比較の視点で扱いたいバナナ・Musa系統です。花色、葉色、仮茎色、種子の有無などの形質に特徴が出やすく、食用品種とは別枠で記録しておくと比較しやすい系統です。沖縄では生育はしやすい一方、台風時の倒伏、株の暴れ、実生系統の個体差に注意します。'
    when coalesce(c.genome_group, normalized.detected_genome, '') like '%ABB%' or coalesce(c.genome_group, normalized.detected_genome, '') like '%BBB%' then
      c.name_ja || 'は、Musa balbisiana由来のBゲノムを多く含む系統として扱うと理解しやすい品種です。一般にABB系は樹勢や環境適応性が評価される一方、果実は生食だけでなく調理・追熟の使い分けで印象が変わります。沖縄では露地栽培の候補になりますが、台風対策、排水、ゾウムシ類、バンチートップ病の確認を続けたい品種です。'
    when coalesce(c.genome_group, normalized.detected_genome, '') like '%AAB%' then
      c.name_ja || 'は、AAB系に多い甘味と酸味のバランス、または調理適性を見ながら評価したい品種です。完熟果では香りや酸味が個性として出やすく、未熟果ではでんぷん質を活かした利用も考えられます。沖縄では食味の良さと引き換えに、風害・病害・株の大きさを丁寧に見たい系統です。'
    when coalesce(c.genome_group, normalized.detected_genome, '') like '%AAA%' then
      c.name_ja || 'は、AAA系のデザートバナナとして整理できる品種です。甘味、香り、果肉のなめらかさを評価しやすい一方、品種によってはシガトカ病や低温、強風への弱さが出るため、沖縄では防風と葉の健全性を重視して管理します。'
    when coalesce(c.genome_group, normalized.detected_genome, '') in ('AA', 'AB', 'BB') then
      c.name_ja || 'は、二倍体系または野生種に近い特徴をもつ可能性がある系統です。果実利用だけでなく、花粉、種子、草姿、葉色などの形質を記録する価値があります。沖縄では観賞・育種素材・比較栽培の視点で残したい品種です。'
    else
      c.name_ja || 'は、沖縄での栽培観察をもとに比較していきたいバナナ品種です。食味、背丈、収量、病害虫への強さ、台風後の回復力を分けて記録すると、家庭栽培向きか、収量重視か、観賞向きかを判断しやすくなります。'
  end,
  okinawa_suitability = case
    when coalesce(c.name_ja, '') ~ 'オルナ|マニラ麻|イトバショウ|芭蕉|sikkimensis|種あり|実生' then
      '沖縄では暖かさを活かして維持しやすい一方、食用品種としてではなく観賞・遺伝資源・比較栽培の位置づけで管理したい系統です。台風で葉が傷みやすいため、防風と株元の整理を重視します。'
    else
      '沖縄では露地栽培しやすい候補ですが、品種ごとに台風耐性、排水、ゾウムシ類、バンチートップ病、シガトカ病への反応が異なります。収穫までの期間と株の大きさを記録しながら評価したい品種です。'
  end,
  container_suitability = case
    when coalesce(c.plant_height_type, normalized.current_height) = '矮性' or c.name_ja ~ 'ドワーフ|矮' then
      '大鉢で試しやすい候補です。肥料切れと乾燥で果実品質が落ちやすいため、鉢増し、株分け、潅水を計画的に行います。'
    when coalesce(c.plant_height_type, normalized.current_height) = '高性' then
      '鉢では長期維持が難しく、露地または大鉢で短期更新を前提にしたい品種です。'
    else
      '大鉢でも試せますが、結実までの株の充実、根詰まり、風対策を見ながら判断します。'
  end,
  beginner_suitability = case
    when c.name_ja ~ 'ドワーフナムワ|ナムワ|三尺|グランドナイン|ドワーフ台湾|島バナナ|アイスクリーム' then
      '初心者にも比較的試しやすい候補です。まずは排水のよい場所、防風、株元の清潔さを整えると安定します。'
    when coalesce(c.name_ja, '') ~ 'オルナ|マニラ麻|イトバショウ|芭蕉|種あり|実生' then
      '観賞・収集向きです。果実利用を主目的にすると期待とずれやすいため、形質観察用として扱うのがおすすめです。'
    else
      '中級者向きです。食味だけでなく、株の高さ、収量、病害虫、台風後の回復を見ながら育てたい品種です。'
  end,
  updated_at = now()
from normalized
where c.id = normalized.id;

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
    ),
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

with banana as (
  select id
  from public.fruits
  where slug = 'banana'
  limit 1
)
update public.cultivars c
set
  public_notes = coalesce(
    c.public_notes,
    case
      when c.genome_group like '%ABB%' then '出典: MGIS Pisang Awak group / CGIAR Genebanks Banana overview / UF/IFAS MG040。個別の味・草姿は沖縄での栽培観察メモを反映。'
      when c.genome_group like '%AAB%' then '出典: CGIAR Genebanks Banana overview / UF/IFAS MG040。個別の味・草姿は沖縄での栽培観察メモを反映。'
      when c.genome_group like '%AAA%' then '出典: CGIAR Genebanks Banana overview / UF/IFAS MG040。個別の味・草姿は沖縄での栽培観察メモを反映。'
      when c.genome_group in ('AA', 'AB', 'BB') then '出典: CGIAR Genebanks Banana overview / ProMusa・MGIS banana diversity references。個別の形質は沖縄での栽培観察メモを反映。'
      else '出典: CGIAR Genebanks Banana overview / ProMusa・MGIS banana diversity references。品種同定・食味は継続確認。'
    end
  ),
  difficulty = regexp_replace(coalesce(c.difficulty, ''), '^推定遺伝子型: ', ''),
  updated_at = now()
from banana
where c.fruit_id = banana.id;

commit;

with banana as (
  select id
  from public.fruits
  where slug = 'banana'
  limit 1
)
select
  count(*) as updated_banana_cultivars,
  count(*) filter (where description like '%京都府立大学%' or public_notes like '%調査記録%' or public_notes like '%提供協力者%') as remaining_unwanted_public_text,
  count(*) filter (where public_notes is not null and public_notes like '%出典:%') as cultivars_with_sources
from public.cultivars c
join banana on banana.id = c.fruit_id;
