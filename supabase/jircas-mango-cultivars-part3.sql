-- JIRCASマンゴー品種データ 3/4
-- Supabase SQL Editorで part1 から順番に実行してください。

with mango as (
  select id from public.fruits where slug = 'mango'
),
source (name_ja, name_en, slug, origin, description, fruit_size, taste, texture, aroma, harvest_season, difficulty, okinawa_suitability, container_suitability, beginner_suitability, kenyu_comment, public_notes, is_public) as (
  values
  ('マニリタ', 'Manilita', 'manilita', 'メキシコ', 'メキシコに由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-050として整理されています。', '281g（JIRCAS調査平均）。小ぶり。', '糖度は中程度、酸味はやや強め。JIRCAS調査値は糖度17.8度、酸度0.29%です。', null, 'マンゴーらしい香り', '成熟日数の中央値は115日（JIRCAS石垣調査）。', null, 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', null, 'マニリタはメキシコのマンゴーで、小ぶりの果実です。糖度は中程度で酸味はやや強め。果皮色は黄と橙。マンゴーらしい香り。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-050）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-050.pdf', true),
  ('マンザニーロ', 'Manzanillo', 'manzanillo', 'メキシコ', 'メキシコに由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-051として整理されています。', '662g（JIRCAS調査平均）。大玉寄り。', '糖度は高め、酸味は強め。JIRCAS調査値は糖度18.5度、酸度0.42%です。', null, null, '成熟日数の中央値は154日（JIRCAS石垣調査）。', 'JIRCASで着果性の記録があり観察向き', 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', null, 'マンザニーロはメキシコのマンゴーで、大玉寄りの果実です。糖度が高めで酸味は強め。果皮色は橙と赤。JIRCASで着果性の記録があり観察向き。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-051）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-051.pdf', true),
  ('マプレフ', 'Mapulehu', 'mapulehu', '不明', '不明に由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-052として整理されています。', '495g（JIRCAS調査平均）。中玉。', '甘さは控えめ、酸味は中程度。JIRCAS調査値は糖度14.8度、酸度0.22%です。', null, '個性的な香り', '成熟日数の中央値は135日（JIRCAS石垣調査）。', 'JIRCASで着果性の記録があり観察向き', 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', '個性が強く好みが分かれやすい', 'マプレフは不明のマンゴーで、中玉の果実です。甘さは控えめで酸味は中程度。果皮色は黄と橙。個性的な香り。JIRCASで着果性の記録があり観察向き。個性が強く好みが分かれやすい。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-052）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-052.pdf', true),
  ('マイヤー', 'Mayer', 'mayer', '不明', '不明に由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-053として整理されています。', '410g（JIRCAS調査平均）。中玉。', '糖度は中程度、酸味は中程度。JIRCAS調査値は糖度16.0度、酸度0.15%です。', 'なめらかで口当たりがよいタイプ', null, '成熟日数の中央値は125日（JIRCAS石垣調査）。', null, 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', '個性が強く好みが分かれやすい', 'マイヤーは不明のマンゴーで、中玉の果実です。糖度は中程度で酸味は中程度。果皮色は橙と赤。肉質はなめらかで口当たりがよいタイプ。個性が強く好みが分かれやすい。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-053）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-053.pdf', true),
  ('モミーケイ', 'Momi-K', 'momi-k', 'アメリカ（ハワイ）', 'アメリカ（ハワイ）に由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-054として整理されています。', '227g（JIRCAS調査平均）。小ぶり。', '甘さは控えめ、酸味は中程度。JIRCAS調査値は糖度14.1度、酸度0.22%です。', 'なめらかで口当たりがよいタイプ', null, '成熟日数の中央値は111日（JIRCAS石垣調査）。', null, 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', null, 'モミーケイはアメリカ（ハワイ）のマンゴーで、小ぶりの果実です。甘さは控えめで酸味は中程度。果皮色は橙と赤。肉質はなめらかで口当たりがよいタイプ。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-054）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-054.pdf', true),
  ('ナム ドク マイ', 'Nam Doc Mai', 'nam-doc-mai', 'タイ', 'タイに由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-055として整理されています。', '440g（JIRCAS調査平均）。中玉。', '糖度は中程度、酸味は穏やか。JIRCAS調査値は糖度15.9度、酸度0.09%です。', 'なめらかで口当たりがよいタイプ', 'マンゴーらしい香り', '成熟日数の中央値は126日（JIRCAS石垣調査）。', null, 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', null, 'ナム ドク マイはタイのマンゴーで、中玉の果実です。糖度は中程度で酸味は穏やか。果皮色は黄。肉質はなめらかで口当たりがよいタイプ。マンゴーらしい香り。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-055）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-055.pdf', true),
  ('ナム ドク マイ ニゴウ', 'Nam Doc Mai #2', 'nam-doc-mai-2', '不明', '不明に由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-056として整理されています。', '518g（JIRCAS調査平均）。中玉。', '甘さは控えめ、酸味は穏やか。JIRCAS調査値は糖度14.1度、酸度0.13%です。', 'みずみずしい肉質', '個性的な香り', '成熟日数の中央値は137日（JIRCAS石垣調査）。', null, 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', '個性が強く好みが分かれやすい', 'ナム ドク マイ ニゴウは不明のマンゴーで、中玉の果実です。甘さは控えめで酸味は穏やか。果皮色は黄。肉質はみずみずしい肉質。個性的な香り。個性が強く好みが分かれやすい。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-056）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-056.pdf', true),
  ('ナム ドク マイ ヨンゴウ', 'Nam Doc Mai #4', 'nam-doc-mai-4', 'タイ', 'タイに由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-057として整理されています。', '482g（JIRCAS調査平均）。中玉。', '糖度は高め、酸味は穏やか。JIRCAS調査値は糖度19.3度、酸度0.12%です。', 'なめらかで口当たりがよいタイプ', 'マンゴーらしい香り', '成熟日数の中央値は135日（JIRCAS石垣調査）。', null, 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', '甘味主体で受け入れられやすい', 'ナム ドク マイ ヨンゴウはタイのマンゴーで、中玉の果実です。糖度が高めで酸味は穏やか。果皮色は黄。肉質はなめらかで口当たりがよいタイプ。マンゴーらしい香り。甘味主体で受け入れられやすい。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-057）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-057.pdf', true),
  ('ナオミ', 'Naomi', 'naomi', 'イスラエル', 'イスラエルに由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-058として整理されています。', '614g（JIRCAS調査平均）。大玉寄り。', '糖度は中程度、酸味は強め。JIRCAS調査値は糖度17.3度、酸度0.35%です。', null, null, '成熟日数の中央値は147日（JIRCAS石垣調査）。', null, 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', '食味のまとまりがあり試しやすい', 'ナオミはイスラエルのマンゴーで、大玉寄りの果実です。糖度は中程度で酸味は強め。果皮色は赤。食味のまとまりがあり試しやすい。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-058）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-058.pdf', true),
  ('ニーラムレイト', 'Neelumlate', 'neelumlate', 'インド', 'インドに由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-059として整理されています。', '344g（JIRCAS調査平均）。小ぶり。', '糖度は中程度、酸味は強め。JIRCAS調査値は糖度16.0度、酸度0.43%です。', '繊維をはっきり感じやすい', '香りは強め', '成熟日数の中央値は146日（JIRCAS石垣調査）。', null, 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', null, 'ニーラムレイトはインドのマンゴーで、小ぶりの果実です。糖度は中程度で酸味は強め。果皮色は黄と橙。肉質は繊維をはっきり感じやすい。香りは強め。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-059）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-059.pdf', true),
  ('オスティーン', 'Osteen', 'osteen', 'アメリカ（フロリダ）', 'アメリカ（フロリダ）に由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-062として整理されています。', '662g（JIRCAS調査平均）。大玉寄り。', '糖度は中程度、酸味はやや強め。JIRCAS調査値は糖度16.8度、酸度0.25%です。', '繊維は少なめ', 'マンゴーらしい香り', '成熟日数の中央値は134日（JIRCAS石垣調査）。', null, 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', '食味のまとまりがあり試しやすい', 'オスティーンはアメリカ（フロリダ）のマンゴーで、大玉寄りの果実です。糖度は中程度で酸味はやや強め。果皮色は橙と赤。肉質は繊維は少なめ。マンゴーらしい香り。食味のまとまりがあり試しやすい。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-062）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-062.pdf', true),
  ('パーマー', 'Palmer', 'palmer', 'アメリカ（フロリダ）', 'アメリカ（フロリダ）に由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-063として整理されています。', '625g（JIRCAS調査平均）。大玉寄り。', '甘さは控えめ、酸味はやや強め。JIRCAS調査値は糖度14.7度、酸度0.25%です。', 'ややしっかりした肉質', '香りが良い', '成熟日数の中央値は145日（JIRCAS石垣調査）。', null, 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', null, 'パーマーはアメリカ（フロリダ）のマンゴーで、大玉寄りの果実です。甘さは控えめで酸味はやや強め。果皮色は橙と赤。肉質はややしっかりした肉質。香りが良い。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-063）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-063.pdf', true),
  ('ピーバ', 'Piva', 'piva', '不明', '不明に由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-065として整理されています。', '519g（JIRCAS調査平均）。中玉。', '糖度は中程度、酸味は強め。JIRCAS調査値は糖度15.4度、酸度0.37%です。', 'ややしっかりした肉質', null, '成熟日数の中央値は128日（JIRCAS石垣調査）。', null, 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', null, 'ピーバは不明のマンゴーで、中玉の果実です。糖度は中程度で酸味は強め。果皮色は赤。肉質はややしっかりした肉質。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-065）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-065.pdf', true),
  ('アールトゥーイートゥー', 'R2E2', 'r2e2', 'オーストラリア', 'オーストラリアに由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-067として整理されています。', '595g（JIRCAS調査平均）。大玉寄り。', '甘さは控えめ、酸味は中程度。JIRCAS調査値は糖度12.1度、酸度0.15%です。', null, '個性的な香り', '成熟日数の中央値は135日（JIRCAS石垣調査）。', 'JIRCASで着果性の記録があり観察向き', 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', '個性が強く好みが分かれやすい', 'アールトゥーイートゥーはオーストラリアのマンゴーで、大玉寄りの果実です。甘さは控えめで酸味は中程度。果皮色は橙。個性的な香り。JIRCASで着果性の記録があり観察向き。個性が強く好みが分かれやすい。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-067）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-067.pdf', true),
  ('ラッド', 'Rad', 'rad', 'タイ', 'タイに由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-068として整理されています。', '423g（JIRCAS調査平均）。中玉。', '糖度は高め、酸味は中程度。JIRCAS調査値は糖度19.6度、酸度0.19%です。', null, 'マンゴーらしい香り', '成熟日数の中央値は131日（JIRCAS石垣調査）。', null, 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', '甘味主体で受け入れられやすい', 'ラッドはタイのマンゴーで、中玉の果実です。糖度が高めで酸味は中程度。果皮色は黄。マンゴーらしい香り。甘味主体で受け入れられやすい。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-068）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-068.pdf', true),
  ('ラポザ', 'Rapoza', 'rapoza', 'アメリカ（ハワイ）', 'アメリカ（ハワイ）に由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-069として整理されています。', '535g（JIRCAS調査平均）。中玉。', '糖度は中程度、酸味は中程度。JIRCAS調査値は糖度15.3度、酸度0.17%です。', 'なめらかで口当たりがよいタイプ', null, '成熟日数の中央値は147日（JIRCAS石垣調査）。', null, 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', '食味のまとまりがあり試しやすい', 'ラポザはアメリカ（ハワイ）のマンゴーで、中玉の果実です。糖度は中程度で酸味は中程度。果皮色は赤。肉質はなめらかで口当たりがよいタイプ。食味のまとまりがあり試しやすい。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-069）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-069.pdf', true)
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
