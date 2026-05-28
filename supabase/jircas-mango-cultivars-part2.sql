-- JIRCASマンゴー品種データ 2/4
-- Supabase SQL Editorで part1 から順番に実行してください。

with mango as (
  select id from public.fruits where slug = 'mango'
),
source (name_ja, name_en, slug, origin, description, fruit_size, taste, texture, aroma, harvest_season, difficulty, okinawa_suitability, container_suitability, beginner_suitability, kenyu_comment, public_notes, is_public) as (
  values
  ('ゴウベイア', 'Gouveia', 'gouveia', 'アメリカ（ハワイ）', 'アメリカ（ハワイ）に由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-023として整理されています。', '367g（JIRCAS調査平均）。中玉。', '糖度は中程度、酸味は中程度。JIRCAS調査値は糖度15.5度、酸度0.15%です。', null, null, '成熟日数の中央値は121日（JIRCAS石垣調査）。', null, 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', '食味のまとまりがあり試しやすい', 'ゴウベイアはアメリカ（ハワイ）のマンゴーで、中玉の果実です。糖度は中程度で酸味は中程度。果皮色は黄と赤。食味のまとまりがあり試しやすい。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-023）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-023.pdf', true),
  ('ハッチャー', 'Hatcher', 'hatcher', 'アメリカ（フロリダ）', 'アメリカ（フロリダ）に由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-028として整理されています。', '628g（JIRCAS調査平均）。大玉寄り。', '糖度は中程度、酸味は中程度。JIRCAS調査値は糖度15.5度、酸度0.18%です。', 'みずみずしい肉質', 'マンゴーらしい香り', '成熟日数の中央値は156日（JIRCAS石垣調査）。', null, 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', null, 'ハッチャーはアメリカ（フロリダ）のマンゴーで、大玉寄りの果実です。糖度は中程度で酸味は中程度。果皮色は黄と赤。肉質はみずみずしい肉質。マンゴーらしい香り。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-028）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-028.pdf', true),
  ('ハドソン', 'Hodson', 'hodson', 'アメリカ（フロリダ）', 'アメリカ（フロリダ）に由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-029として整理されています。', '436g（JIRCAS調査平均）。中玉。', '糖度は中程度、酸味は中程度。JIRCAS調査値は糖度16.3度、酸度0.18%です。', 'みずみずしい肉質', null, '成熟日数の中央値は133日（JIRCAS石垣調査）。', null, 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', '食味のまとまりがあり試しやすい', 'ハドソンはアメリカ（フロリダ）のマンゴーで、中玉の果実です。糖度は中程度で酸味は中程度。果皮色は橙と赤。肉質はみずみずしい肉質。食味のまとまりがあり試しやすい。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-029）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-029.pdf', true),
  ('アーウィン', 'Irwin', 'irwin', 'アメリカ（フロリダ）', 'アメリカ（フロリダ）に由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-030として整理されています。', '470g（JIRCAS調査平均）。中玉。', '糖度は中程度、酸味は中程度。JIRCAS調査値は糖度15.0度、酸度0.16%です。', null, '華やかな香り', '成熟日数の中央値は132日（JIRCAS石垣調査）。', null, 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', '食味のまとまりがあり試しやすい', 'アーウィンはアメリカ（フロリダ）のマンゴーで、中玉の果実です。糖度は中程度で酸味は中程度。果皮色は橙と赤。華やかな香り。食味のまとまりがあり試しやすい。国内でよく知られる代表的な赤色系品種として扱いやすい情報です。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-030）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-030.pdf', true),
  ('ジュエル', 'Jewel', 'jewel', 'アメリカ（フロリダ）', 'アメリカ（フロリダ）に由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-033として整理されています。', '464g（JIRCAS調査平均）。中玉。', '糖度は中程度、酸味は中程度。JIRCAS調査値は糖度17.8度、酸度0.15%です。', null, '香りは穏やか', '成熟日数の中央値は136日（JIRCAS石垣調査）。', null, 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', '甘味主体で受け入れられやすい', 'ジュエルはアメリカ（フロリダ）のマンゴーで、中玉の果実です。糖度は中程度で酸味は中程度。果皮色は橙と赤。香りは穏やか。甘味主体で受け入れられやすい。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-033）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-033.pdf', true),
  ('ジュビリー', 'Jubilee', 'jubilee', 'アメリカ（フロリダ）', 'アメリカ（フロリダ）に由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-034として整理されています。', '478g（JIRCAS調査平均）。中玉。', '甘さは控えめ、酸味は中程度。JIRCAS調査値は糖度12.9度、酸度0.19%です。', 'なめらかで口当たりがよいタイプ', null, '成熟日数の中央値は142日（JIRCAS石垣調査）。', null, 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', null, 'ジュビリーはアメリカ（フロリダ）のマンゴーで、中玉の果実です。甘さは控えめで酸味は中程度。果皮色は赤。肉質はなめらかで口当たりがよいタイプ。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-034）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-034.pdf', true),
  ('ケンジントン', 'Kensington', 'kensington', 'オーストラリア', 'オーストラリアに由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-037として整理されています。', '385g（JIRCAS調査平均）。中玉。', '糖度は中程度、酸味は中程度。JIRCAS調査値は糖度16.2度、酸度0.18%です。', 'なめらかで口当たりがよいタイプ', 'マンゴーらしい香り', '成熟日数の中央値は129日（JIRCAS石垣調査）。', null, 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', null, 'ケンジントンはオーストラリアのマンゴーで、中玉の果実です。糖度は中程度で酸味は中程度。果皮色は黄と橙。肉質はなめらかで口当たりがよいタイプ。マンゴーらしい香り。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-037）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-037.pdf', true),
  ('キンコウ', 'Kinkou', 'kinkou', '台湾', '台湾に由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-040として整理されています。', '759g（JIRCAS調査平均）。大玉寄り。', '糖度は中程度、酸味は穏やか。JIRCAS調査値は糖度17.0度、酸度0.11%です。', null, null, '成熟日数の中央値は121日（JIRCAS石垣調査）。', '収穫タイミングと品質管理に注意', 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', '食味のまとまりがあり試しやすい', 'キンコウは台湾のマンゴーで、大玉寄りの果実です。糖度は中程度で酸味は穏やか。果皮色は黄と橙。収穫タイミングと品質管理に注意。食味のまとまりがあり試しやすい。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-040）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-040.pdf', true),
  ('コウリュウ', 'Kouryu', 'kouryu', '台湾', '台湾に由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-041として整理されています。', '686g（JIRCAS調査平均）。大玉寄り。', '糖度は中程度、酸味は中程度。JIRCAS調査値は糖度15.5度、酸度0.18%です。', 'なめらかで口当たりがよいタイプ', 'マンゴーらしい香り', '成熟日数の中央値は111日（JIRCAS石垣調査）。', null, 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', null, 'コウリュウは台湾のマンゴーで、大玉寄りの果実です。糖度は中程度で酸味は中程度。果皮色は黄。肉質はなめらかで口当たりがよいタイプ。マンゴーらしい香り。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-041）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-041.pdf', true),
  ('キヨ サワイ', 'Kyo Savoy', 'kyo-savoy', 'タイ', 'タイに由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-042として整理されています。', '392g（JIRCAS調査平均）。中玉。', '糖度は高め、酸味は中程度。JIRCAS調査値は糖度18.4度、酸度0.15%です。', null, null, '成熟日数の中央値は137日（JIRCAS石垣調査）。', null, 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', '個性が強く好みが分かれやすい', 'キヨ サワイはタイのマンゴーで、中玉の果実です。糖度が高めで酸味は中程度。果皮色は黄緑。個性が強く好みが分かれやすい。完熟果だけでなく未熟果利用の文脈でも比較したい品種です。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-042）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-042.pdf', true),
  ('ランセティーラ', 'Lancetilla', 'lancetilla', 'ホンジュラス', 'ホンジュラスに由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-043として整理されています。', '1095g（JIRCAS調査平均）。かなり大玉の部類。', '甘さは控えめ、酸味は強め。JIRCAS調査値は糖度14.9度、酸度0.61%です。', 'なめらかで口当たりがよいタイプ', '香りは穏やか', '成熟日数の中央値は144日（JIRCAS石垣調査）。', null, 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', null, 'ランセティーラはホンジュラスのマンゴーで、かなり大玉の部類の果実です。甘さは控えめで酸味は強め。果皮色は黄と橙。肉質はなめらかで口当たりがよいタイプ。香りは穏やか。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-043）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-043.pdf', true),
  ('リリー', 'Lily', 'lily', 'アメリカ（フロリダ）', 'アメリカ（フロリダ）に由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-044として整理されています。', '564g（JIRCAS調査平均）。大玉寄り。', '甘さは控えめ、酸味は中程度。JIRCAS調査値は糖度14.6度、酸度0.20%です。', 'ややしっかりした肉質', null, '成熟日数の中央値は137日（JIRCAS石垣調査）。', null, 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', '食味のまとまりがあり試しやすい', 'リリーはアメリカ（フロリダ）のマンゴーで、大玉寄りの果実です。甘さは控えめで酸味は中程度。果皮色は橙と紫。肉質はややしっかりした肉質。食味のまとまりがあり試しやすい。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-044）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-044.pdf', true),
  ('リペンス', 'Lippens', 'lippens', 'アメリカ（フロリダ）', 'アメリカ（フロリダ）に由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-045として整理されています。', '516g（JIRCAS調査平均）。中玉。', '糖度は中程度、酸味は中程度。JIRCAS調査値は糖度15.5度、酸度0.16%です。', 'なめらかで口当たりがよいタイプ', null, '成熟日数の中央値は145日（JIRCAS石垣調査）。', null, 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', '食味のまとまりがあり試しやすい', 'リペンスはアメリカ（フロリダ）のマンゴーで、中玉の果実です。糖度は中程度で酸味は中程度。果皮色は橙。肉質はなめらかで口当たりがよいタイプ。食味のまとまりがあり試しやすい。沖縄では夏小紅の名前でも知られます。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-045）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-045.pdf', true),
  ('マダム フランシス', 'Madame Francis', 'madame-francis', 'ハイチ', 'ハイチに由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-046として整理されています。', '663g（JIRCAS調査平均）。大玉寄り。', '糖度は高め、酸味は中程度。JIRCAS調査値は糖度19.3度、酸度0.20%です。', 'ややざらつきを感じる肉質', 'マンゴーらしい香り', '成熟日数の中央値は151日（JIRCAS石垣調査）。', null, 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', '個性が強く好みが分かれやすい', 'マダム フランシスはハイチのマンゴーで、大玉寄りの果実です。糖度が高めで酸味は中程度。果皮色は黄。肉質はややざらつきを感じる肉質。マンゴーらしい香り。個性が強く好みが分かれやすい。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-046）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-046.pdf', true),
  ('マグシャミン', 'Magshamim', 'magshamim', 'イスラエル', 'イスラエルに由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-047として整理されています。', '414g（JIRCAS調査平均）。中玉。', '糖度は中程度、酸味はやや強め。JIRCAS調査値は糖度16.9度、酸度0.25%です。', 'なめらかで口当たりがよいタイプ', null, '成熟日数の中央値は130日（JIRCAS石垣調査）。', null, 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', null, 'マグシャミンはイスラエルのマンゴーで、中玉の果実です。糖度は中程度で酸味はやや強め。果皮色は橙と紫。肉質はなめらかで口当たりがよいタイプ。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-047）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-047.pdf', true),
  ('マリカ', 'Mallika', 'mallika', 'インド', 'インドに由来するマンゴー品種。JIRCASマンゴー遺伝資源データベースではJTMG-049として整理されています。', '547g（JIRCAS調査平均）。中玉。', '糖度は中程度、酸味は中程度。JIRCAS調査値は糖度15.6度、酸度0.24%です。', 'ややざらつきを感じる肉質', '個性的な香り', '成熟日数の中央値は123日（JIRCAS石垣調査）。', null, 'JIRCAS熱帯・島嶼研究拠点（石垣）で調査対象になっており、沖縄での比較検討に使いやすい品種情報です。', '鉢栽培調査のデータを含むため、鉢管理での比較候補になります。', '個性が強く好みが分かれやすい', 'マリカはインドのマンゴーで、中玉の果実です。糖度は中程度で酸味は中程度。果皮色は黄。肉質はややざらつきを感じる肉質。個性的な香り。個性が強く好みが分かれやすい。', '出典: JIRCASマンゴー遺伝資源サイト（JTMG-049）。データベース: https://www.jircas.go.jp/ja/database/mango/mango-database / 品種早わかり: https://www.jircas.go.jp/ja/database/mango/catalogue / 品質特性情報シートPDF: https://www.jircas.go.jp/themes/custom/mango/data/pdf/JTMG-049.pdf', true)
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
