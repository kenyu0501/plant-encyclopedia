-- JIRCASマンゴー品種データ 1/4
-- Supabase SQL Editorで part1 から順番に実行してください。

insert into public.fruits (
  name_ja,
  name_en,
  slug,
  scientific_name,
  family_name,
  origin,
  description,
  cultivation_summary,
  okinawa_suitability,
  is_public
) values (
  'マンゴー',
  'Mango',
  'mango',
  'Mangifera indica',
  'ウルシ科',
  'インド周辺',
  '濃厚な甘みと香りが魅力の代表的な熱帯果樹です。',
  '日当たりと排水を好み、開花期の湿度管理が重要です。',
  '沖縄では品種ごとの開花・着果・病害管理を見ながら導入を検討します。',
  true
) on conflict (slug) do update set
  name_ja = excluded.name_ja,
  name_en = excluded.name_en,
  scientific_name = excluded.scientific_name,
  family_name = excluded.family_name,
  origin = excluded.origin,
  description = excluded.description,
  cultivation_summary = excluded.cultivation_summary,
  okinawa_suitability = excluded.okinawa_suitability,
  is_public = true,
  updated_at = now();

with mango as (
  select id from public.fruits where slug = 'mango'
),
source (name_ja, name_en, slug, origin, description, fruit_size, taste, texture, aroma, harvest_season, difficulty, okinawa_suitability, container_suitability, beginner_suitability, kenyu_comment, public_notes, is_public) as (
  values
  ('アーピン', 'Ah Ping', 'ah-ping', 'アメリカ（ハワイ）', 'アメリカ（ハワイ）に由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-001として整理されています。', '423g（JIRCAS調査平均）。中玉。', '糖度は中程度、酸味は中程度。JIRCAS調査値は糖度16.5度、酸度0.18%です。', null, '個性的な香り', '成熟日数の中央値は132日（JIRCAS石垣調査）。', null, 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', '個性が強く好みが分かれやすい', 'アーピンはアメリカ（ハワイ）のマンゴーで、中玉の果実です。糖度は中程度で酸味は中程度。果皮色は赤。個性的な香り。個性が強く好みが分かれやすい。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-001）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-001.pdf', true),
  ('アンダーソン', 'Anderson', 'anderson', 'アメリカ（フロリダ）', 'アメリカ（フロリダ）に由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-004として整理されています。', '931g（JIRCAS調査平均）。かなり大玉の部類。', '糖度は中程度、酸味はやや強め。JIRCAS調査値は糖度17.3度、酸度0.33%です。', null, null, '成熟日数の中央値は138日（JIRCAS石垣調査）。', '果皮表面のヤニに注意', 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', null, 'アンダーソンはアメリカ（フロリダ）のマンゴーで、かなり大玉の部類の果実です。糖度は中程度で酸味はやや強め。果皮色は黄と橙。果皮表面のヤニに注意。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-004）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-004.pdf', true),
  ('ベイリーズ マーベル', 'Bailey''s Marvel', 'baileys-marvel', 'アメリカ（フロリダ）', 'アメリカ（フロリダ）に由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-005として整理されています。', '482g（JIRCAS調査平均）。中玉。', '糖度は非常に高い、酸味は強め。JIRCAS調査値は糖度21.0度、酸度0.40%です。', null, null, '成熟日数の中央値は144日（JIRCAS石垣調査）。', null, 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', null, 'ベイリーズ マーベルはアメリカ（フロリダ）のマンゴーで、中玉の果実です。糖度が非常に高く酸味は強め。果皮色は緑と黄。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-005）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-005.pdf', true),
  ('ベッキー', 'Becky', 'becky', 'アメリカ（フロリダ）', 'アメリカ（フロリダ）に由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-006として整理されています。', '582g（JIRCAS調査平均）。大玉寄り。', '甘さは控えめ、酸味はやや強め。JIRCAS調査値は糖度13.9度、酸度0.29%です。', null, null, '成熟日数の中央値は148日（JIRCAS石垣調査）。', null, 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', null, 'ベッキーはアメリカ（フロリダ）のマンゴーで、大玉寄りの果実です。甘さは控えめで酸味はやや強め。果皮色は黄と橙。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-006）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-006.pdf', true),
  ('ベバリー', 'Beverly', 'beverly', 'アメリカ（フロリダ）', 'アメリカ（フロリダ）に由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-007として整理されています。', '423g（JIRCAS調査平均）。中玉。', '糖度は高め、酸味は強め。JIRCAS調査値は糖度18.0度、酸度0.45%です。', null, null, '成熟日数の中央値は132日（JIRCAS石垣調査）。', null, 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', '個性が強く好みが分かれやすい', 'ベバリーはアメリカ（フロリダ）のマンゴーで、中玉の果実です。糖度が高めで酸味は強め。果皮色は緑と黄。個性が強く好みが分かれやすい。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-007）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-007.pdf', true),
  ('カラバオ', 'Carabao', 'carabao', 'フィリピン', 'フィリピンに由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-008として整理されています。', '325g（JIRCAS調査平均）。小ぶり。', '糖度は中程度、酸味はやや強め。JIRCAS調査値は糖度15.9度、酸度0.27%です。', null, null, '成熟日数の中央値は132日（JIRCAS石垣調査）。', null, 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', null, 'カラバオはフィリピンのマンゴーで、小ぶりの果実です。糖度は中程度で酸味はやや強め。果皮色は黄橙。ペリカンマンゴーとして紹介されることがあります。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-008）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-008.pdf', true),
  ('チョカナン', 'Choke Anan', 'choke-anan', 'タイ', 'タイに由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-011として整理されています。', '275g（JIRCAS調査平均）。小ぶり。', '糖度は高め、酸味は中程度。JIRCAS調査値は糖度19.1度、酸度0.16%です。', null, '個性的な香り', '成熟日数の中央値は130日（JIRCAS石垣調査）。', null, 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', '食味のまとまりがあり試しやすい', 'チョカナンはタイのマンゴーで、小ぶりの果実です。糖度が高めで酸味は中程度。果皮色は黄橙。個性的な香り。食味のまとまりがあり試しやすい。JIRCASの試食会で評価された記録があります。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-011）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-011.pdf', true),
  ('クッシュマン', 'Cushman', 'cushman', 'アメリカ（フロリダ）', 'アメリカ（フロリダ）に由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-012として整理されています。', '319g（JIRCAS調査平均）。小ぶり。', '糖度は高め、酸味はやや強め。JIRCAS調査値は糖度18.6度、酸度0.29%です。', null, null, '成熟日数の中央値は129日（JIRCAS石垣調査）。', null, 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', null, 'クッシュマンはアメリカ（フロリダ）のマンゴーで、小ぶりの果実です。糖度が高めで酸味はやや強め。果皮色は黄橙。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-012）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-012.pdf', true),
  ('ドット', 'Dot', 'dot', 'アメリカ（フロリダ）', 'アメリカ（フロリダ）に由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-013として整理されています。', '379g（JIRCAS調査平均）。中玉。', '糖度は高め、酸味はやや強め。JIRCAS調査値は糖度19.3度、酸度0.25%です。', null, null, '成熟日数の中央値は130日（JIRCAS石垣調査）。', null, 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', '個性が強く好みが分かれやすい', 'ドットはアメリカ（フロリダ）のマンゴーで、中玉の果実です。糖度が高めで酸味はやや強め。果皮色は黄と橙。個性が強く好みが分かれやすい。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-013）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-013.pdf', true),
  ('ダンカン', 'Duncan', 'duncan', 'アメリカ（フロリダ）', 'アメリカ（フロリダ）に由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-014として整理されています。', '598g（JIRCAS調査平均）。大玉寄り。', '糖度は中程度、酸味は中程度。JIRCAS調査値は糖度17.4度、酸度0.15%です。', null, null, '成熟日数の中央値は149日（JIRCAS石垣調査）。', null, 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', '甘味主体で受け入れられやすい', 'ダンカンはアメリカ（フロリダ）のマンゴーで、大玉寄りの果実です。糖度は中程度で酸味は中程度。果皮色は黄。甘味主体で受け入れられやすい。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-014）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-014.pdf', true),
  ('エドワード', 'Edward', 'edward', 'アメリカ（フロリダ）', 'アメリカ（フロリダ）に由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-015として整理されています。', '422g（JIRCAS調査平均）。中玉。', '糖度は中程度、酸味は中程度。JIRCAS調査値は糖度16.7度、酸度0.22%です。', null, '香りが良い', '成熟日数の中央値は124日（JIRCAS石垣調査）。', null, 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', '食味のまとまりがあり試しやすい', 'エドワードはアメリカ（フロリダ）のマンゴーで、中玉の果実です。糖度は中程度で酸味は中程度。果皮色は黄橙。香りが良い。食味のまとまりがあり試しやすい。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-015）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-015.pdf', true),
  ('ファッシル', 'Fascell', 'fascell', 'アメリカ（フロリダ）', 'アメリカ（フロリダ）に由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-017として整理されています。', '549g（JIRCAS調査平均）。中玉。', '糖度は中程度、酸味は強め。JIRCAS調査値は糖度15.3度、酸度0.44%です。', 'ややしっかりした肉質', null, '成熟日数の中央値は129日（JIRCAS石垣調査）。', null, 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', null, 'ファッシルはアメリカ（フロリダ）のマンゴーで、中玉の果実です。糖度は中程度で酸味は強め。果皮色は橙と赤。肉質はややしっかりした肉質。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-017）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-017.pdf', true),
  ('フクダ', 'Fukuda', 'fukuda', 'アメリカ（ハワイ）', 'アメリカ（ハワイ）に由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-018として整理されています。', '516g（JIRCAS調査平均）。中玉。', '糖度は非常に高い、酸味はやや強め。JIRCAS調査値は糖度20.4度、酸度0.26%です。', null, '香りは強め', '成熟日数の中央値は139日（JIRCAS石垣調査）。', null, 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', null, 'フクダはアメリカ（ハワイ）のマンゴーで、中玉の果実です。糖度が非常に高く酸味はやや強め。果皮色は黄と橙。香りは強め。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-018）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-018.pdf', true),
  ('グレン', 'Glenn', 'glenn', 'アメリカ（フロリダ）', 'アメリカ（フロリダ）に由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-019として整理されています。', '489g（JIRCAS調査平均）。中玉。', '糖度は中程度、酸味は穏やか。JIRCAS調査値は糖度15.9度、酸度0.11%です。', null, null, '成熟日数の中央値は123日（JIRCAS石垣調査）。', null, 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', '食味のまとまりがあり試しやすい', 'グレンはアメリカ（フロリダ）のマンゴーで、中玉の果実です。糖度は中程度で酸味は穏やか。果皮色は橙と赤。食味のまとまりがあり試しやすい。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-019）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-019.pdf', true),
  ('ゴールデン ナゲット', 'Golden Nugget', 'golden-nugget', 'アメリカ（フロリダ）', 'アメリカ（フロリダ）に由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-021として整理されています。', '425g（JIRCAS調査平均）。中玉。', '糖度は中程度、酸味はやや強め。JIRCAS調査値は糖度17.2度、酸度0.31%です。', 'なめらかで口当たりがよいタイプ', null, '成熟日数の中央値は141日（JIRCAS石垣調査）。', null, 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', '食味のまとまりがあり試しやすい', 'ゴールデン ナゲットはアメリカ（フロリダ）のマンゴーで、中玉の果実です。糖度は中程度で酸味はやや強め。果皮色は黄橙。肉質はなめらかで口当たりがよいタイプ。食味のまとまりがあり試しやすい。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-021）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-021.pdf', true),
  ('ゴレック', 'Goleck', 'goleck', 'インドネシア', 'インドネシアに由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-022として整理されています。', '191g（JIRCAS調査平均）。小ぶり。', '糖度は高め、酸味はやや強め。JIRCAS調査値は糖度18.8度、酸度0.26%です。', '繊維をはっきり感じやすい', null, '成熟日数の中央値は125日（JIRCAS石垣調査）。', null, 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', '個性が強く好みが分かれやすい', 'ゴレックはインドネシアのマンゴーで、小ぶりの果実です。糖度が高めで酸味はやや強め。果皮色は黄橙。肉質は繊維をはっきり感じやすい。個性が強く好みが分かれやすい。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-022）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-022.pdf', true)
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
