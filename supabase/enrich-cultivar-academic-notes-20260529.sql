-- 品種説明の定型文を整理し、信頼できる公開資料・論文にもとづく補足を追加します。
-- 対象: マンゴー、アボカド、バナナ、ホワイトサポテ
-- 実行場所: Supabase SQL Editor

begin;

-- 1. バナナ: 調査リスト由来の内部的な文言を公開説明から削除
with banana as (
  select id from public.fruits where slug = 'banana' limit 1
)
update public.cultivars c
set
  description = nullif(
    trim(both E'\n ' from
      replace(
        replace(
          replace(
            coalesce(c.description, ''),
            '京都府立大学 板井彰浩教授の沖縄県バナナ調査2025の提供候補リストに記録されている',
            ''
          ),
          'バナナ品種・系統です。',
          'バナナの品種・系統です。'
        ),
        'バナナの品種・系統です。' || E'\n推定遺伝子型:',
        'バナナの品種・系統です。' || E'\nゲノム構成の目安:'
      )
    ),
    ''
  ),
  public_notes = nullif(
    trim(both E'\n ' from
      regexp_replace(
        regexp_replace(
          split_part(coalesce(c.public_notes, ''), E'\n導入に関する来歴:', 1),
          '調査記録:[^\n]*(\n|$)',
          '',
          'g'
        ),
        '提供協力者:[^\n]*(\n|$)',
        '',
        'g'
      )
    ),
    ''
  ),
  private_notes = case
    when coalesce(c.private_notes, '') like '出典: 京都府立大学 板井彰浩 教授の沖縄県バナナ調査 2025.xlsx%' then null
    else c.private_notes
  end,
  updated_at = now()
where c.fruit_id = (select id from banana);

-- 2. マンゴー: 画面に出る説明から「調査対象」などの繰り返し文言を削除
with mango as (
  select id from public.fruits where slug = 'mango' limit 1
)
update public.cultivars c
set
  description = nullif(
    trim(both ' ' from regexp_replace(
      coalesce(c.description, ''),
      'JIRCASマンゴー遺伝資源データベースではJTMG-[0-9]+として整理されています。',
      '',
      'g'
    )),
    ''
  ),
  harvest_season = replace(coalesce(c.harvest_season, ''), '（JIRCAS石垣調査）', ''),
  okinawa_suitability = case
    when coalesce(c.okinawa_suitability, '') like '%JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており%'
      then '沖縄では、糖度・酸度・果実重・成熟日数に加えて、開花期の湿度、炭疽病、台風前後の果実傷みを見ながら比較したい品種です。'
    else c.okinawa_suitability
  end,
  updated_at = now()
where c.fruit_id = (select id from mango);

-- 3. アボカド: UC/UFの品種表にもとづき、主要品種の説明を補強
with source(name_ja, slug, description, fruit_size, taste, harvest_season, cold_hardiness, flowering_type, tree_vigor, difficulty, okinawa_suitability, public_notes) as (
  values
    ('ハス', 'hass',
      'ハスはグアテマラ系を主体とする世界的な標準品種です。粗い黒皮、中〜厚い果皮、小〜中程度の種子が特徴で、カリフォルニアの品種表ではA型・高収量だが隔年結果が強い品種として整理されています。',
      '5〜12 oz（約140〜340g）。国内栽培では200〜300g前後を目安に観察。',
      '油分が高く、濃厚でナッツ感のある食味になりやすい。',
      'カリフォルニアでは春〜夏〜冬にかけて収穫期が長い。沖縄では地域・樹勢・ハウス条件で前後します。',
      '耐寒性は低め。低温よりも排水、根傷み、台風後の枝折れに注意。',
      'A型',
      '開張性で樹冠は中〜大。隔年結果が強く出ることがあります。',
      'A型品種。B型品種を近くに置くと結実が安定しやすい。黒くなる果皮色だけで収穫適期を決めず、乾物率・油分の上がり方を見たい。',
      '沖縄では過湿と台風対策を優先。夏秋の高温期は日焼け・根傷み、冬春は開花時の天候を見ながら管理したい。',
      '出典: UC/California Avocado Society「Avocado Varieties for Commercial Planting in California」 https://www.avocadosource.com/books/AvocadoHandbook/Horticulture_files/varieties.pdf'),
    ('ピンカートン', 'pinkerton',
      'ピンカートンはグアテマラ系主体のA型品種です。洋梨形で種子が小さく、果皮は粗めで濃緑色。カリフォルニアの品種表では収量が高く、風への耐性が高い品種として整理されています。',
      '7〜16 oz（約200〜450g）。国内栽培では300〜500g前後を目安に観察。',
      '濃厚でコクが出やすく、種が小さいため可食部が多い。',
      'カリフォルニアでは冬型。沖縄では露地・ハウス条件で前後します。',
      '耐寒性は低め〜中程度。幼木は寒風と乾燥に注意。',
      'A型',
      '中庸な樹冠で、収量は高めに出やすい。',
      'A型品種。B型のフェルテ、ベーコン、ズタノなどと組み合わせると受粉面で扱いやすい。',
      '沖縄では秋冬の果実肥大期に水切れさせず、過湿は避ける。着果過多の場合は樹勢低下に注意。',
      '出典: UC/California Avocado Society「Avocado Varieties for Commercial Planting in California」 https://www.avocadosource.com/books/AvocadoHandbook/Horticulture_files/varieties.pdf'),
    ('フェルテ', 'fuerte',
      'フェルテはメキシコ系とグアテマラ系の交雑由来で、古くから評価されるB型品種です。滑らかな緑皮、洋梨形、比較的むきやすい果皮を持ち、風への耐性は高めとされています。',
      '6〜14 oz（約170〜400g）。',
      '油分が多く、なめらかでコクが出やすい。',
      'カリフォルニアでは冬型。',
      '中程度。ハスより低温に強い傾向がありますが、幼木は保護したい。',
      'B型',
      '開張性で大きくなりやすく、結実は年により不安定になることがあります。',
      'B型品種。A型品種の受粉樹としても使いやすいが、低温・高温時には開花型の時間帯が乱れることがあります。',
      '沖縄では樹が大きくなりやすいため、防風と剪定で管理。A型との混植で結実安定を狙いたい。',
      '出典: UC/California Avocado Society「Avocado Varieties for Commercial Planting in California」 https://www.avocadosource.com/books/AvocadoHandbook/Horticulture_files/varieties.pdf'),
    ('ベーコン', 'bacon',
      'ベーコンはメキシコ系主体のB型品種です。滑らかな緑皮で、カリフォルニアの品種表では耐寒性が高い品種として整理されています。',
      '6〜12 oz（約170〜340g）。',
      '果肉はなめらかで、軽めの風味になりやすい。',
      'カリフォルニアでは冬型。',
      '比較的強い。耐寒性重視の受粉樹候補。',
      'B型',
      '直立気味で樹冠は比較的小さめ。隔年結果は軽めとされます。',
      'B型品種。A型品種の受粉樹候補として便利。',
      '沖縄では耐寒性よりも防風・排水を重視。大風で枝が傷むと翌年の開花に響きます。',
      '出典: UC/California Avocado Society「Avocado Varieties for Commercial Planting in California」 https://www.avocadosource.com/books/AvocadoHandbook/Horticulture_files/varieties.pdf'),
    ('リード', 'reed',
      'リードはグアテマラ系のA型品種です。丸い大果、緑色の厚めの果皮、夏型の収穫が特徴で、収量は高い品種として整理されています。',
      '8〜18 oz（約225〜510g）。国内栽培では400〜600g級を目安に観察。',
      '濃厚でクリーミー。成熟が進むと油分が乗りやすい。',
      'カリフォルニアでは夏型。',
      '耐寒性は低め。冷え込みより根傷みと風害に注意。',
      'A型',
      '直立性で中程度の樹冠。着果が良い場合は枝折れに注意。',
      'A型品種。大玉で樹上保持期間が長くなりやすいため、収穫適期の見極めが重要。',
      '沖縄では夏場の高温・台風前後の果実傷みを見ながら管理したい。',
      '出典: UC/California Avocado Society「Avocado Varieties for Commercial Planting in California」 https://www.avocadosource.com/books/AvocadoHandbook/Horticulture_files/varieties.pdf'),
    ('チョケテ', 'choquette',
      'チョケテはフロリダ系の大果品種です。UF/IFASの家庭果樹向け資料では、10月ごろから成熟するA型、グアテマラ系×西インド系の品種として扱われています。',
      '大果。フロリダ系では非常に大きくなりやすい。',
      '水分が多めのフロリダ系らしい食味。油分の濃さより大玉性と収量を評価したい。',
      'フロリダでは10月以降。沖縄では12〜1月目安として観察。',
      '中程度。UF/IFASでは25〜30°F程度の中程度耐寒グループに含まれます。',
      'A型',
      '大果・豊産傾向。着果過多と枝折れに注意。',
      'A型品種。大玉を狙えるが、樹勢維持と防風が重要。',
      '沖縄では排水、台風対策、果実肥大期の水管理を重視したい。',
      '出典: UF/IFAS EDIS「Avocado Growing in the Florida Home Landscape」 https://edis.ifas.ufl.edu/publication/MG213'),
    ('モンロー', 'monroe',
      'モンローはフロリダの晩生系品種で、UF/IFAS資料では中程度の耐寒性を持つ品種として整理されています。大果で冬期の収穫候補になります。',
      '大果。500g以上になることがあります。',
      '淡泊〜まろやかなフロリダ系の食味。完熟タイミングで印象が変わりやすい。',
      'フロリダでは晩秋〜冬。沖縄では1月前後を目安に観察。',
      '中程度。UF/IFASでは25〜30°F程度の中程度耐寒グループ。',
      'B型',
      '大きくなりやすく、着果量も期待できる。',
      'B型品種。A型品種との組み合わせで受粉を安定させたい。',
      '沖縄では大果を支える枝づくり、防風、果実肥大期の水管理が重要。',
      '出典: UF/IFAS EDIS「Avocado Growing in the Florida Home Landscape」 https://edis.ifas.ufl.edu/publication/MG213')
)
update public.cultivars c
set
  description = s.description,
  fruit_size = s.fruit_size,
  taste = s.taste,
  harvest_season = s.harvest_season,
  cold_hardiness = s.cold_hardiness,
  flowering_type = s.flowering_type,
  tree_vigor = s.tree_vigor,
  difficulty = s.difficulty,
  okinawa_suitability = s.okinawa_suitability,
  public_notes = s.public_notes,
  updated_at = now()
from source s
join public.fruits f on f.slug = 'avocado'
where c.fruit_id = f.id
  and (c.slug = s.slug or c.name_ja = s.name_ja);

-- 4. バナナ: MGIS/ProMusa等にもとづき、主要グループの説明を補強
with source(name_ja, slug, description, taste, tree_vigor, difficulty, genome_group, plant_height_type, yield_level, okinawa_suitability, public_notes) as (
  values
    ('ナムワ', 'kluai-nam-wa',
      'ナムワはPisang Awak系に近いデザート・調理兼用品種として扱います。MGISではPisang Awak群がABB/ABBB、三倍体または四倍体系、用途は生食・未熟果調理・醸造向けと整理されています。',
      '完熟では甘味が強く、ややもっちりした食感。未熟果は調理にも使いやすい。',
      'Pisang Awak系は非常に旺盛なグループとされます。株が太りやすく、吸芽管理と防風が重要。',
      'ABB系は一般に病害・乾燥への強さを期待されますが、沖縄ではバンチートップ、ゾウムシ、台風倒伏を優先して確認したい。',
      'ABB/ABBB', '中間', '多い',
      '沖縄では露地候補。強い風で葉が裂けやすいため、防風と株元の排水を整えたい。',
      '出典: MGIS「Pisang Awak (Cultivar group)」 https://www.crop-diversity.org/mgis5/cultivar-group-catalogue/pisang-awak'),
    ('ドワーフナムワ', 'dwarf-namwah',
      'ドワーフナムワはPisang Awak系の矮性選抜として扱います。Pisang Awak群はABB/ABBBで、生食と調理の両方に使われるグループです。',
      '甘味が強く、果肉はやや締まり、家庭栽培でも食味を評価しやすい。',
      '矮性で管理しやすいが、収量を出すには肥培管理が必要。',
      '矮性で観察しやすい一方、過湿と根詰まりで品質が落ちやすい。',
      'ABB/ABBB', '矮性', '多い',
      '沖縄の家庭栽培では、草丈を抑えながら収穫を狙いやすい候補。台風前の葉整理と支柱が有効。',
      '出典: MGIS「Pisang Awak (Cultivar group)」 https://www.crop-diversity.org/mgis5/cultivar-group-catalogue/pisang-awak'),
    ('島バナナ', 'banana-001',
      '島バナナは沖縄で流通・栽培される小果系バナナの総称として使われることがあります。名前だけで単一クローンとは断定せず、果実サイズ、酸味、株姿、病害虫への反応を記録して系統整理したい品種群です。',
      '小果で甘味と酸味のバランスが出やすく、香りが立ちやすい。',
      '中型。系統により樹勢と耐風性に差が出ます。',
      '同名異系統の可能性があるため、ゲノム構成・果房形・食味を写真付きで記録したい。',
      'AAB目安', '中間', '普通',
      '沖縄では栽培しやすい一方、台風、バナナセセリ、バンチートップ、ゾウムシへの対策が重要。',
      '出典: ProMusa/MGISのバナナ品種群情報を参照。島バナナは地域名・流通名として幅があるため園内観察で補正。 https://www.promusa.org/Diversity+of+banana+cultivars+portal'),
    ('グロスミッシェル', 'gros-michel',
      'グロスミッシェルはAAAゲノムの生食用バナナで、かつて国際流通の主力だった品種群です。MGISではGros Michel群はAAA、用途は生食、Fusarium wilt Race 1に極めて弱いと整理されています。',
      '香りが強く、濃い甘味を期待しやすい。',
      '大型。しっかりした株づくりと防風が必要。',
      'Panama病 Race 1への感受性が大きな弱点。土壌病害の履歴がある場所では注意。',
      'AAA', '高性', '普通',
      '沖縄では味の魅力は大きいが、病害履歴、防風、排水を確認して導入したい。',
      '出典: MGIS「Gros Michel (Cultivar group)」 https://www.crop-diversity.org/mgis5/cultivar-group-catalogue/gros-michel'),
    ('ハイゲート', 'highgate',
      'ハイゲートはGros Michel群に含まれるAAA系品種です。MGISではHighgateがGros Michel群のアクセッションとして整理されています。',
      'Gros Michel系らしい濃い甘味と香りを期待する品種。',
      'Gros Michelより管理しやすい可能性はありますが、樹勢と病害への反応を記録したい。',
      'Gros Michel群としてFusarium wilt Race 1への弱さに注意。',
      'AAA', '中間', '普通',
      '沖縄では土壌病害と台風倒伏を確認しながら、味のよい生食品種として評価したい。',
      '出典: MGIS「Gros Michel (Cultivar group)」 https://www.crop-diversity.org/mgis5/cultivar-group-catalogue/gros-michel'),
    ('グランドナイン', 'grande-naine',
      'グランドナインはCavendish群のAAA系生食品種です。Cavendish群は国際流通で重要なクローン群ですが、同系統内の品種識別は外観だけでは難しいことがあります。',
      'なめらかで安定した甘味。商用品種群らしい食味。',
      '中型。肥培管理で収量が大きく変わります。',
      'Cavendish群としてPanama病TR4など土壌病害への注意が必要。',
      'AAA', '中間', '多い',
      '沖縄では防風、排水、病害履歴の確認が重要。家庭栽培では食味よりも株の健全性を優先したい。',
      '出典: MGIS「Cultivar Group Catalogue」Cavendish AAA https://www.crop-diversity.org/mgis5/cultivar-group-catalogue'),
    ('ジャイアントキャベンディッシュ', 'giant-cavendish',
      'ジャイアントキャベンディッシュはCavendish群のAAA系生食品種として扱います。大型化しやすく、商用品種群としての安定した果実品質を評価したい品種です。',
      'なめらかで標準的な甘味。',
      '大型。防風と株間確保が重要。',
      'Cavendish群として土壌病害、特にFusarium wiltへの警戒が必要。',
      'AAA', '高性', '多い',
      '沖縄では台風時の倒伏と葉傷みが収量に直結します。防風帯や支柱を前提にしたい。',
      '出典: MGIS「Cultivar Group Catalogue」Cavendish AAA https://www.crop-diversity.org/mgis5/cultivar-group-catalogue'),
    ('レディフィンガー', 'lady-finger',
      'レディフィンガーという名称は地域により異なるクローンに使われます。MGISではPome群にLady Fingerが含まれ、AAB系として整理される例があります。',
      '小果で香りがよく、上品な甘味を狙う品種名として流通します。',
      '小〜中型。系統差があるため株姿と果房を記録したい。',
      '同名異系統に注意。ゲノム構成と食味は導入元ごとに確認したい。',
      'AAB目安', '小型', '普通',
      '沖縄では小果系として家庭栽培に向きますが、名札だけで判断せず写真と果実記録を残したい。',
      '出典: MGIS「Cultivar Group Catalogue」Pome AAB / Lady Finger https://www.crop-diversity.org/mgis5/cultivar-group-catalogue')
)
update public.cultivars c
set
  description = s.description,
  taste = s.taste,
  tree_vigor = s.tree_vigor,
  difficulty = s.difficulty,
  genome_group = s.genome_group,
  plant_height_type = s.plant_height_type,
  yield_level = s.yield_level,
  okinawa_suitability = s.okinawa_suitability,
  public_notes = s.public_notes,
  updated_at = now()
from source s
join public.fruits f on f.slug = 'banana'
where c.fruit_id = f.id
  and (c.slug = s.slug or c.name_ja = s.name_ja);

-- 5. ホワイトサポテ: 花器形態にもとづくタイプ分類の出典を明確化
with white_sapote as (
  select id from public.fruits where slug = 'white-sapote' limit 1
)
update public.cultivars c
set
  difficulty = case c.flowering_type
    when 'タイプ1' then 'タイプ1: 子房・柱頭が大きく、花粉を持たない機能的雌花型。大果生産には有利だが、結実安定にはタイプ2またはタイプ3の受粉樹を近くに置きたい。'
    when 'タイプ2' then 'タイプ2: 子房・柱頭が小さく、大きな葯に花粉を持つ花型。タイプ1品種の受粉樹として重要。'
    when 'タイプ3' then 'タイプ3: 子房・柱頭が大きく、花粉も持つ花型。論文ではMaltbyがタイプ3として報告され、自家結実性を期待しやすい。'
    else c.difficulty
  end,
  public_notes = '出典: Yonemoto et al.「Analysis of Varietal Differences in Floral and Fruit Morphology in White Sapote」Japanese Journal of Tropical Agriculture 45(1), 38-44, 2001. CiNii: https://cir.nii.ac.jp/crid/1390282681337597696 / UF/IFAS「White Sapote Growing in the Home Landscape」 https://edis.ifas.ufl.edu/publication/HS304',
  updated_at = now()
where c.fruit_id = (select id from white_sapote)
  and c.flowering_type in ('タイプ1', 'タイプ2', 'タイプ3');

-- 6. マンゴー: 出典欄は残しつつ、説明欄を読みやすくするため主要な有名品種だけ補足
with source(name_ja, slug, description, difficulty, okinawa_suitability, public_notes) as (
  values
    ('アーウィン', 'irwin',
      'アーウィンはフロリダ由来の赤色系マンゴーで、日本・沖縄の施設栽培でも代表的に扱われる品種です。果実は中玉で着色がよく、食味評価では甘味・酸味・香りのバランスを見たい品種です。',
      '果皮着色がよいため商品性を出しやすい一方、開花期の低温・多湿、炭疽病、ミナミキイロアザミウマ等の管理が重要。',
      '沖縄では施設・露地条件で開花期の湿度と着果安定を見たい。果皮色が評価されやすく、収穫適期の見極めが大切。',
      '出典: JIRCASマンゴー遺伝資源サイト https://www.jircas.go.jp/ja/database/mango/mango-database / Genetic diversity and relatedness of mango cultivars assessed by SSR markers, Breeding Science 2019 https://pmc.ncbi.nlm.nih.gov/articles/PMC6711724/'),
    ('キーツ', 'keitt',
      'キーツはフロリダ由来の晩生・大果系マンゴーです。果実が大きく、緑色が残りやすいため、果皮色だけでなく熟度・香り・軟化を合わせて判断したい品種です。',
      '大果・晩生性が魅力。樹上期間が長くなるため、台風、果実傷、炭疽病への注意が必要。',
      '沖縄では晩生の収穫候補として有用ですが、台風期に果実を持つ可能性があるため防風と袋掛けを含めて検討したい。',
      '出典: JIRCASマンゴー遺伝資源サイト https://www.jircas.go.jp/ja/database/mango/mango-database / FAO Mango Post-harvest Operations https://www.fao.org/fileadmin/user_upload/inpho/docs/Post_Harvest_Compendium_-_Mango.pdf'),
    ('ケント', 'kent',
      'ケントはフロリダ由来の大果系マンゴーで、繊維が少なく食味がよい商用品種として広く扱われます。糖度だけでなく、肉質のなめらかさと収穫後品質を見たい品種です。',
      '大果で食味がよい一方、着果量と樹勢維持のバランスが重要。',
      '沖縄では大果を安定させるため、摘果、防風、炭疽病管理を重視したい。',
      '出典: JIRCASマンゴー遺伝資源サイト https://www.jircas.go.jp/ja/database/mango/mango-database / FAO Mango Post-harvest Operations https://www.fao.org/fileadmin/user_upload/inpho/docs/Post_Harvest_Compendium_-_Mango.pdf'),
    ('トミーアトキンス', 'tommy-atkins',
      'トミーアトキンスはフロリダ由来で、輸送性・外観に優れる商用品種として世界的に普及しました。食味だけでなく果皮の強さ、収穫後の扱いやすさを評価したい品種です。',
      '外観と輸送性は強み。食味は品種比較で好みが分かれることがあります。',
      '沖縄では販売向けなら外観・日持ち、家庭向けなら食味を分けて評価したい。',
      '出典: JIRCASマンゴー遺伝資源サイト https://www.jircas.go.jp/ja/database/mango/mango-database / FAO Mango Post-harvest Operations https://www.fao.org/fileadmin/user_upload/inpho/docs/Post_Harvest_Compendium_-_Mango.pdf')
)
update public.cultivars c
set
  description = s.description,
  difficulty = s.difficulty,
  okinawa_suitability = s.okinawa_suitability,
  public_notes = s.public_notes,
  updated_at = now()
from source s
join public.fruits f on f.slug = 'mango'
where c.fruit_id = f.id
  and (c.slug = s.slug or c.name_ja = s.name_ja);

commit;

select
  f.name_ja as fruit,
  count(*) filter (where c.updated_at > now() - interval '5 minutes') as recently_touched,
  count(*) as cultivar_count
from public.fruits f
join public.cultivars c on c.fruit_id = f.id
where f.slug in ('mango', 'avocado', 'banana', 'white-sapote')
group by f.name_ja
order by f.name_ja;
