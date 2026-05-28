-- JIRCASマンゴー品種データ 4/4
-- Supabase SQL Editorで part1 から順番に実行してください。

with mango as (
  select id from public.fruits where slug = 'mango'
),
source (name_ja, name_en, slug, origin, description, fruit_size, taste, texture, aroma, harvest_season, difficulty, okinawa_suitability, container_suitability, beginner_suitability, kenyu_comment, public_notes, is_public) as (
  values
  ('ルビー', 'Ruby', 'ruby', 'アメリカ（フロリダ）', 'アメリカ（フロリダ）に由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-070として整理されています。', '312g（JIRCAS調査平均）。小ぶり。', '糖度は高め、酸味は中程度。JIRCAS調査値は糖度18.6度、酸度0.21%です。', null, null, '成熟日数の中央値は133日（JIRCAS石垣調査）。', null, 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', '食味のまとまりがあり試しやすい', 'ルビーはアメリカ（フロリダ）のマンゴーで、小ぶりの果実です。糖度が高めで酸味は中程度。果皮色は赤。食味のまとまりがあり試しやすい。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-070）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-070.pdf', true),
  ('センセーション', 'Sensation', 'sensation', 'アメリカ（フロリダ）', 'アメリカ（フロリダ）に由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-071として整理されています。', '333g（JIRCAS調査平均）。小ぶり。', '糖度は中程度、酸味は中程度。JIRCAS調査値は糖度16.7度、酸度0.16%です。', null, 'マンゴーらしい香り', '成熟日数の中央値は131日（JIRCAS石垣調査）。', null, 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', null, 'センセーションはアメリカ（フロリダ）のマンゴーで、小ぶりの果実です。糖度は中程度で酸味は中程度。果皮色は黄と赤。マンゴーらしい香り。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-071）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-071.pdf', true),
  ('スピリット オブ セブンティシックス', 'Spirit of ''76', 'spirit-of-76', 'アメリカ（フロリダ）', 'アメリカ（フロリダ）に由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-074として整理されています。', '451g（JIRCAS調査平均）。中玉。', '糖度は高め、酸味は中程度。JIRCAS調査値は糖度19.3度、酸度0.21%です。', null, null, '成熟日数の中央値は140日（JIRCAS石垣調査）。', null, 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', '食味のまとまりがあり試しやすい', 'スピリット オブ セブンティシックスはアメリカ（フロリダ）のマンゴーで、中玉の果実です。糖度が高めで酸味は中程度。果皮色は橙。食味のまとまりがあり試しやすい。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-074）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-074.pdf', true),
  ('スプリングフェルズ', 'Springfels', 'springfels', 'アメリカ（フロリダ）', 'アメリカ（フロリダ）に由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-075として整理されています。', '735g（JIRCAS調査平均）。大玉寄り。', '糖度は中程度、酸味は強め。JIRCAS調査値は糖度17.2度、酸度0.68%です。', '繊維は少なめ', null, '成熟日数の中央値は134日（JIRCAS石垣調査）。', null, 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', '食味のまとまりがあり試しやすい', 'スプリングフェルズはアメリカ（フロリダ）のマンゴーで、大玉寄りの果実です。糖度は中程度で酸味は強め。果皮色は黄と橙。肉質は繊維は少なめ。食味のまとまりがあり試しやすい。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-075）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-075.pdf', true),
  ('タハール', 'Tahar', 'tahar', 'イスラエル', 'イスラエルに由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-076として整理されています。', '405g（JIRCAS調査平均）。中玉。', '甘さは控えめ、酸味は中程度。JIRCAS調査値は糖度14.2度、酸度0.19%です。', '繊維は少なめ', null, '成熟日数の中央値は126日（JIRCAS石垣調査）。', null, 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', null, 'タハールはイスラエルのマンゴーで、中玉の果実です。甘さは控えめで酸味は中程度。果皮色は赤。肉質は繊維は少なめ。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-076）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-076.pdf', true),
  ('タイノウ イチゴウ', 'Tainoung-1', 'tainoung-1', '台湾', '台湾に由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-077として整理されています。', '301g（JIRCAS調査平均）。小ぶり。', '糖度は非常に高い、酸味は中程度。JIRCAS調査値は糖度20.2度、酸度0.17%です。', null, '個性的な香り', '成熟日数の中央値は131日（JIRCAS石垣調査）。', null, 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', '個性が強く好みが分かれやすい', 'タイノウ イチゴウは台湾のマンゴーで、小ぶりの果実です。糖度が非常に高く酸味は中程度。果皮色は橙と赤。個性的な香り。個性が強く好みが分かれやすい。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-077）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-077.pdf', true),
  ('トミー アトキンス', 'Tommy Atkins', 'tommy-atkins', 'アメリカ（フロリダ）', 'アメリカ（フロリダ）に由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-079として整理されています。', '597g（JIRCAS調査平均）。大玉寄り。', '糖度は中程度、酸味は穏やか。JIRCAS調査値は糖度15.2度、酸度0.10%です。', 'ややしっかりした肉質', '個性的な香り', '成熟日数の中央値は135日（JIRCAS石垣調査）。', null, 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', '個性が強く好みが分かれやすい', 'トミー アトキンスはアメリカ（フロリダ）のマンゴーで、大玉寄りの果実です。糖度は中程度で酸味は穏やか。果皮色は黄と赤。肉質はややしっかりした肉質。個性的な香り。個性が強く好みが分かれやすい。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-079）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-079.pdf', true),
  ('トルベット', 'Torbet', 'torbet', 'アメリカ（フロリダ）', 'アメリカ（フロリダ）に由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-080として整理されています。', '417g（JIRCAS調査平均）。中玉。', '糖度は中程度、酸味は中程度。JIRCAS調査値は糖度16.6度、酸度0.22%です。', '弾力のある肉質', null, '成熟日数の中央値は121日（JIRCAS石垣調査）。', null, 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', '個性が強く好みが分かれやすい', 'トルベットはアメリカ（フロリダ）のマンゴーで、中玉の果実です。糖度は中程度で酸味は中程度。果皮色は橙と赤。肉質は弾力のある肉質。個性が強く好みが分かれやすい。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-080）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-080.pdf', true),
  ('ターペンタイン', 'Turpentine', 'turpentine', '中南米（詳細不明）', '中南米（詳細不明）に由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-081として整理されています。', '175g（JIRCAS調査平均）。小ぶり。', '甘さは控えめ、酸味は穏やか。JIRCAS調査値は糖度14.1度、酸度0.13%です。', null, null, '成熟日数の中央値は128日（JIRCAS石垣調査）。', 'JIRCASで着果性の記録があり観察向き', 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', null, 'ターペンタインは中南米（詳細不明）のマンゴーで、小ぶりの果実です。甘さは控えめで酸味は穏やか。果皮色は黄。JIRCASで着果性の記録があり観察向き。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-081）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-081.pdf', true),
  ('バレンシア プライド', 'Valencia Pride', 'valencia-pride', 'アメリカ（フロリダ）', 'アメリカ（フロリダ）に由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-082として整理されています。', '565g（JIRCAS調査平均）。大玉寄り。', '糖度は中程度、酸味はやや強め。JIRCAS調査値は糖度16.8度、酸度0.30%です。', null, null, '成熟日数の中央値は144日（JIRCAS石垣調査）。', null, 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', '食味のまとまりがあり試しやすい', 'バレンシア プライドはアメリカ（フロリダ）のマンゴーで、大玉寄りの果実です。糖度は中程度で酸味はやや強め。果皮色は黄と赤。食味のまとまりがあり試しやすい。沖縄ではてぃららの名前でも知られます。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-082）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-082.pdf', true),
  ('バン ダイク', 'Van Dyke', 'van-dyke', 'アメリカ（フロリダ）', 'アメリカ（フロリダ）に由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-084として整理されています。', '407g（JIRCAS調査平均）。中玉。', '糖度は高め、酸味は中程度。JIRCAS調査値は糖度18.1度、酸度0.24%です。', null, 'マンゴーらしい香り', '成熟日数の中央値は133日（JIRCAS石垣調査）。', null, 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', '甘味主体で受け入れられやすい', 'バン ダイクはアメリカ（フロリダ）のマンゴーで、中玉の果実です。糖度が高めで酸味は中程度。果皮色は橙と赤。マンゴーらしい香り。甘味主体で受け入れられやすい。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-084）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-084.pdf', true),
  ('ホワイト', 'White', 'white', '不明', '不明に由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-085として整理されています。', '464g（JIRCAS調査平均）。中玉。', '糖度は高め、酸味は穏やか。JIRCAS調査値は糖度18.8度、酸度0.12%です。', null, null, '成熟日数の中央値は143日（JIRCAS石垣調査）。', null, 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', '甘味主体で受け入れられやすい', 'ホワイトは不明のマンゴーで、中玉の果実です。糖度が高めで酸味は穏やか。果皮色は黄。甘味主体で受け入れられやすい。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-085）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-085.pdf', true),
  ('ホワイト ピリー', 'White Pirie', 'white-pirie', 'アメリカ（ハワイ）', 'アメリカ（ハワイ）に由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-086として整理されています。', '289g（JIRCAS調査平均）。小ぶり。', '糖度は高め、酸味は中程度。JIRCAS調査値は糖度18.9度、酸度0.22%です。', null, '華やかな香り', '成熟日数の中央値は141日（JIRCAS石垣調査）。', null, 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', '甘味主体で受け入れられやすい', 'ホワイト ピリーはアメリカ（ハワイ）のマンゴーで、小ぶりの果実です。糖度が高めで酸味は中程度。果皮色は黄橙。華やかな香り。甘味主体で受け入れられやすい。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-086）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-086.pdf', true),
  ('ジレイト', 'Zillate', 'zillate', 'アメリカ（フロリダ）', 'アメリカ（フロリダ）に由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-088として整理されています。', '652g（JIRCAS調査平均）。大玉寄り。', '糖度は中程度、酸味は強め。JIRCAS調査値は糖度17.9度、酸度0.35%です。', null, null, '成熟日数の中央値は146日（JIRCAS石垣調査）。', null, 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', null, 'ジレイトはアメリカ（フロリダ）のマンゴーで、大玉寄りの果実です。糖度は中程度で酸味は強め。果皮色は橙と紫。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-088）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-088.pdf', true)
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
  difficulty,
  okinawa_suitability,
  container_suitability,
  beginner_suitability,
  kenyu_comment,
  public_notes,
  is_public
)
select
  mango.id,
  source.name_ja,
  source.name_en,
  source.slug,
  source.origin,
  source.description,
  source.fruit_size,
  source.taste,
  source.texture,
  source.aroma,
  source.harvest_season,
  source.difficulty,
  source.okinawa_suitability,
  source.container_suitability,
  source.beginner_suitability,
  source.kenyu_comment,
  source.public_notes,
  source.is_public
from source
cross join mango
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
  difficulty = excluded.difficulty,
  okinawa_suitability = excluded.okinawa_suitability,
  container_suitability = excluded.container_suitability,
  beginner_suitability = excluded.beginner_suitability,
  kenyu_comment = excluded.kenyu_comment,
  public_notes = excluded.public_notes,
  is_public = true,
  updated_at = now();
