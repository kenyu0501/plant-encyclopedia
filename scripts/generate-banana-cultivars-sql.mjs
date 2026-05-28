import fs from "node:fs";

const outDir = new URL("../supabase/", import.meta.url);
const outPath = new URL("../supabase/banana-cultivars.sql", import.meta.url);

const sources = {
  kenyuCategory: "https://okinawan-avocado.com/category/%e6%9e%9c%e6%a8%b9/%e3%83%90%e3%83%8a%e3%83%8a/",
  kenyuNamwaNuan: "https://okinawan-avocado.com/2025/01/25/kauai_namwa_nuan/",
  kenyuLingkit: "https://okinawan-avocado.com/2021/10/31/lingkit/",
  kenyuMyanmar: "https://okinawan-avocado.com/2021/10/31/musa_phama_haek_kuk/",
  kenyuNamwaIcecream: "https://okinawan-avocado.com/2021/10/08/banana_ikehara_san/",
  kenyuVegetable: "https://okinawan-avocado.com/2022/04/27/vegetable_banana/",
  promusaDiversity: "https://www.promusa.org/Diversity+of+banana+cultivars+portal",
  promusaPisangAwak: "https://www.promusa.org/Pisang+Awak",
  plantUseMusa: "https://plantuse.plantnet.org/en/Musa_(PROSEA_Fruits)",
};

const cultivars = [
  c("島バナナ", "Okinawan island banana", "沖縄", "デザート", "小ぶり", "甘みと酸味のバランスがよい", "ややもっちり", "華やか", "中型", "中", "強め", sources.kenyuCategory),
  c("ナムワ", "Kluai Nam Wa", "タイ", "デザート・調理兼用", "中ぶり", "甘みが濃く加熱にも向く", "もっちり", "穏やか", "中型", "中", "強め", sources.promusaPisangAwak),
  c("ドワーフナムワ", "Dwarf Namwah", "タイ系", "デザート・調理兼用", "中ぶり", "甘く家庭栽培で扱いやすい", "もっちり", "穏やか", "小型", "低", "強め", sources.promusaPisangAwak),
  c("銀バナナ", "Kluai Namwa Nuan", "タイ系", "デザート", "中ぶり", "濃厚で食味評価が高い", "なめらか", "甘い香り", "中型", "中", "強め", sources.kenyuNamwaNuan),
  c("ナムワアイスクリーム", "Namwah Ice Cream", "タイ系", "デザート", "中ぶり", "クリーミーで甘みが強い", "ねっとり", "バニラ様", "中型", "中", "強め", sources.kenyuNamwaIcecream),
  c("アイスクリームバナナ", "Blue Java", "東南アジア", "デザート", "太め", "甘くクリーミー", "アイスクリーム状", "バニラ様", "大型", "高", "強め", sources.promusaDiversity),
  c("合掌バナナ", "Praying Hands", "太平洋地域", "デザート・調理兼用", "密着した房", "やさしい甘み", "しっかり", "穏やか", "中型", "中", "普通", sources.kenyuLingkit),
  c("リンキット", "Lingkit", "タイ系", "デザート・調理兼用", "密着した房", "加熱でも生食でも楽しめる", "しっかり", "穏やか", "中型", "中", "普通", sources.kenyuLingkit),
  c("クルアイテパノム", "Kluai Thepanom", "タイ", "デザート・調理兼用", "密着した房", "甘みがあり個性的", "しっかり", "穏やか", "中型", "中", "普通", sources.kenyuLingkit),
  c("ミャンマーバナナ", "Musa Phama Haek Kuk", "ミャンマー", "デザート", "中ぶり", "癖が少なくすっきり", "なめらか", "軽い香り", "中型", "中", "強め", sources.kenyuMyanmar),
  c("野菜バナナ", "Vegetable banana", "東南アジア系", "調理用", "太め", "加熱で甘みと香りが出る", "ほくほく", "穏やか", "大型", "高", "普通", sources.kenyuVegetable),
  c("三尺バナナ", "Dwarf Cavendish", "キャベンディッシュ系", "デザート", "中ぶり", "なじみ深い甘さ", "なめらか", "軽い", "小型", "低", "弱め", sources.promusaDiversity),
  c("キャベンディッシュ", "Cavendish", "東南アジア起源の商用品種群", "デザート", "中ぶり", "穏やかな甘さで流通向き", "なめらか", "軽い", "中型", "中", "弱め", sources.promusaDiversity),
  c("グランドナイン", "Grande Naine", "キャベンディッシュ系", "デザート", "中ぶり", "安定した甘み", "なめらか", "軽い", "中型", "中", "弱め", sources.promusaDiversity),
  c("ウィリアムス", "Williams", "キャベンディッシュ系", "デザート", "中ぶり", "流通向きの素直な甘さ", "なめらか", "軽い", "中型", "中", "弱め", sources.promusaDiversity),
  c("ジャイアントキャベンディッシュ", "Giant Cavendish", "キャベンディッシュ系", "デザート", "中ぶり", "甘みが安定し大株になる", "なめらか", "軽い", "大型", "高", "弱め", sources.promusaDiversity),
  c("ロブスタ", "Robusta", "キャベンディッシュ系", "デザート", "中ぶり", "商用品種群の標準的な甘み", "なめらか", "軽い", "中型", "中", "弱め", sources.promusaDiversity),
  c("バレリー", "Valery", "キャベンディッシュ系", "デザート", "中ぶり", "甘さと扱いやすさのバランス型", "なめらか", "軽い", "中型", "中", "弱め", sources.promusaDiversity),
  c("ポヨ", "Poyo", "キャベンディッシュ系", "デザート", "中ぶり", "流通向きで食味は穏やか", "なめらか", "軽い", "中型", "中", "弱め", sources.promusaDiversity),
  c("ダブルマホイ", "Double Mahoi", "キャベンディッシュ系", "デザート・観賞", "中ぶり", "甘く房姿が面白い", "なめらか", "軽い", "小型", "低", "弱め", sources.promusaDiversity),
  c("トゥルーリータイニー", "Truly Tiny", "キャベンディッシュ系", "デザート・鉢向き", "小ぶり", "小型株で甘い実を狙える", "なめらか", "軽い", "超小型", "低", "弱め", sources.promusaDiversity),
  c("リトルプリンス", "Little Prince", "キャベンディッシュ系", "鉢向き", "小ぶり", "鉢で観察しやすい", "なめらか", "軽い", "超小型", "低", "弱め", sources.promusaDiversity),
  c("グロスミッシェル", "Gros Michel", "中南米で普及した商用品種", "デザート", "中ぶり", "香りが強く濃い甘さ", "なめらか", "強いバナナ香", "大型", "高", "弱め", sources.promusaDiversity),
  c("ハイゲート", "Highgate", "グロスミッシェル系", "デザート", "中ぶり", "グロスミッシェル系の濃い甘み", "なめらか", "強い", "中型", "中", "弱め", sources.promusaDiversity),
  c("ラカタン", "Lacatan", "フィリピン・東南アジア", "デザート", "中ぶり", "甘みと香りが濃い", "やや締まる", "芳香", "中型", "中", "普通", sources.promusaDiversity),
  c("ピサンマサックヒジャウ", "Pisang Masak Hijau", "東南アジア", "デザート", "中ぶり", "甘みが穏やかで食べやすい", "なめらか", "軽い", "中型", "中", "普通", sources.promusaDiversity),
  c("アップルバナナ", "Manzano", "中南米", "デザート", "小ぶり", "りんごのような酸味を感じる", "やや締まる", "フルーティー", "中型", "中", "普通", sources.plantUseMusa),
  c("マンザーノ", "Manzano", "中南米", "デザート", "小ぶり", "甘酸っぱく香りがある", "やや締まる", "フルーティー", "中型", "中", "普通", sources.plantUseMusa),
  c("シルク", "Silk", "インド・中南米", "デザート", "小ぶり", "酸味と甘みがはっきり", "やや締まる", "フルーティー", "中型", "中", "普通", sources.promusaDiversity),
  c("ラツンダン", "Latundan", "フィリピン", "デザート", "小ぶり", "甘酸っぱく家庭向き", "やや締まる", "フルーティー", "中型", "中", "普通", sources.plantUseMusa),
  c("セニョリータ", "Señorita", "フィリピン", "デザート", "小ぶり", "強い甘みで香りがよい", "やわらかい", "甘い香り", "小型", "低", "普通", sources.plantUseMusa),
  c("ピサンマス", "Pisang Mas", "マレーシア・インドネシア", "デザート", "小ぶり", "濃い甘みで香りがよい", "なめらか", "芳香", "小型", "低", "普通", sources.plantUseMusa),
  c("スクリエ", "Sucrier", "東南アジア", "デザート", "小ぶり", "砂糖のような甘さ", "なめらか", "甘い香り", "小型", "低", "普通", sources.promusaDiversity),
  c("レディフィンガー", "Lady Finger", "オーストラリア・東南アジア", "デザート", "小ぶり", "上品な甘み", "なめらか", "軽い芳香", "小型", "低", "普通", sources.plantUseMusa),
  c("ブラジリアン", "Brazilian", "ブラジル・ハワイ", "デザート", "中ぶり", "甘酸っぱく香りがよい", "やや締まる", "フルーティー", "中型", "中", "普通", sources.promusaDiversity),
  c("ドワーフブラジリアン", "Dwarf Brazilian", "ブラジル・ハワイ", "デザート", "中ぶり", "甘酸っぱく家庭栽培向き", "やや締まる", "フルーティー", "小型", "低", "普通", sources.promusaDiversity),
  c("ハワイアンアップル", "Hawaiian Apple", "ハワイ", "デザート", "中ぶり", "甘酸っぱい香りが特徴", "やや締まる", "フルーティー", "中型", "中", "普通", sources.promusaDiversity),
  c("ミソール", "Mysore", "インド", "デザート", "小ぶり", "甘酸っぱく香りが強い", "やや締まる", "芳香", "中型", "中", "強め", sources.promusaDiversity),
  c("ピサンセイロン", "Pisang Ceylan", "スリランカ", "デザート", "小ぶり", "酸味のある甘さ", "やや締まる", "芳香", "中型", "中", "強め", sources.promusaDiversity),
  c("ネイポーバン", "Ney Poovan", "インド", "デザート", "小ぶり", "甘みと酸味があり香る", "やや締まる", "芳香", "中型", "中", "普通", sources.plantUseMusa),
  c("プーバン", "Poovan", "インド", "デザート", "小ぶり", "香りのよい甘さ", "やや締まる", "芳香", "中型", "中", "普通", sources.plantUseMusa),
  c("ラジャプリ", "Raja Puri", "インド", "デザート・調理兼用", "中ぶり", "甘みが強く育てやすい", "しっかり", "穏やか", "中型", "低", "強め", sources.promusaDiversity),
  c("ピサンラジャ", "Pisang Raja", "インドネシア", "デザート・調理兼用", "中ぶり", "濃厚で加熱菓子にも向く", "しっかり", "芳香", "中型", "中", "普通", sources.plantUseMusa),
  c("ラジャブル", "Pisang Raja Bulu", "インドネシア", "デザート", "中ぶり", "甘みと香りが濃い", "しっかり", "芳香", "中型", "中", "普通", sources.plantUseMusa),
  c("バランガン", "Barangan", "インドネシア", "デザート", "中ぶり", "甘く香りがよい", "なめらか", "芳香", "中型", "中", "普通", sources.plantUseMusa),
  c("アンボン", "Pisang Ambon", "インドネシア", "デザート", "中ぶり", "香りのよい甘さ", "なめらか", "芳香", "中型", "中", "普通", sources.plantUseMusa),
  c("カープラバリ", "Karpuravalli", "インド", "デザート・調理兼用", "中ぶり", "甘みが濃く利用幅が広い", "もっちり", "穏やか", "中型", "中", "強め", sources.promusaPisangAwak),
  c("ドゥカス", "Ducasse", "オーストラリア", "デザート・調理兼用", "中ぶり", "ナムワ系の甘み", "もっちり", "穏やか", "中型", "中", "強め", sources.promusaPisangAwak),
  c("ピサンアワック", "Pisang Awak", "マレーシア", "デザート・調理兼用", "中ぶり", "甘く加熱にも向く", "もっちり", "穏やか", "中型", "中", "強め", sources.promusaPisangAwak),
  c("カインジャ", "Kayinja", "東アフリカ", "デザート・醸造", "中ぶり", "加工にも向く甘み", "もっちり", "穏やか", "大型", "中", "強め", sources.promusaPisangAwak),
  c("チュオイタイ", "Chuoi Tay", "ベトナム", "デザート・調理兼用", "中ぶり", "ナムワ系の素朴な甘さ", "もっちり", "穏やか", "中型", "中", "強め", sources.promusaPisangAwak),
  c("クルアイカイ", "Kluai Khai", "タイ", "デザート", "小ぶり", "濃い甘みで香りがよい", "なめらか", "甘い香り", "小型", "低", "普通", sources.plantUseMusa),
  c("クルアイホームトーン", "Kluai Hom Thong", "タイ", "デザート", "中ぶり", "香りのよい甘さ", "なめらか", "芳香", "中型", "中", "普通", sources.plantUseMusa),
  c("クルアイレップムーナン", "Kluai Leb Mu Nang", "タイ", "デザート", "小ぶり", "甘みが強く香る", "なめらか", "甘い香り", "小型", "低", "普通", sources.plantUseMusa),
  c("クルアイハクムック", "Kluai Hak Muk", "タイ", "調理用", "太め", "加熱で甘みが出る", "ほくほく", "穏やか", "大型", "中", "普通", sources.plantUseMusa),
  c("クルアイヒン", "Kluai Hin", "タイ", "調理用", "太め", "加熱向きで腹持ちがよい", "ほくほく", "穏やか", "大型", "高", "普通", sources.plantUseMusa),
  c("クルアイナムワコム", "Kluai Nam Wa Khom", "タイ", "デザート・調理兼用", "中ぶり", "ナムワ系で小さく扱いやすい", "もっちり", "穏やか", "小型", "低", "強め", sources.promusaPisangAwak),
  c("クルアイナムワダム", "Kluai Nam Wa Dam", "タイ", "デザート・調理兼用", "中ぶり", "ナムワ系の濃い甘さ", "もっちり", "穏やか", "中型", "中", "強め", sources.promusaPisangAwak),
  c("クルアイナムワマリオン", "Kluai Nam Wa Mali-Ong", "タイ", "デザート・調理兼用", "中ぶり", "香りを楽しむナムワ系", "もっちり", "甘い香り", "中型", "中", "強め", sources.promusaPisangAwak),
  c("サバ", "Saba", "フィリピン", "調理用", "太め", "加熱で甘みが増す", "ほくほく", "穏やか", "大型", "高", "強め", sources.plantUseMusa),
  c("カルダバ", "Cardaba", "フィリピン", "調理用", "太め", "加熱向きで食べ応えがある", "ほくほく", "穏やか", "大型", "高", "強め", sources.plantUseMusa),
  c("カンダリアン", "Kandrian", "パプアニューギニア", "調理用", "大型", "主食利用向き", "ほくほく", "穏やか", "大型", "高", "普通", sources.promusaDiversity),
  c("モンタン", "Monthan", "インド・東南アジア", "調理用", "太め", "加熱向きででんぷん質", "ほくほく", "穏やか", "大型", "高", "普通", sources.plantUseMusa),
  c("ブルゴー", "Bluggoe", "東南アジア", "調理用", "太め", "加熱・加工向き", "ほくほく", "穏やか", "大型", "高", "強め", sources.plantUseMusa),
  c("オリノコ", "Orinoco", "中南米", "調理・デザート兼用", "太め", "完熟で甘く未熟果は調理向き", "しっかり", "穏やか", "大型", "中", "強め", sources.promusaDiversity),
  c("ドワーフオリノコ", "Dwarf Orinoco", "中南米", "調理・デザート兼用", "太め", "完熟で甘く鉢でも狙える", "しっかり", "穏やか", "中型", "低", "強め", sources.promusaDiversity),
  c("バーロ", "Burro", "中南米", "調理・デザート兼用", "太め", "レモン様の酸味を感じる", "しっかり", "軽い酸香", "中型", "中", "強め", sources.promusaDiversity),
  c("ペリピタ", "Pelipita", "中南米", "調理用", "太め", "病害に強く調理向き", "ほくほく", "穏やか", "大型", "高", "強め", sources.promusaDiversity),
  c("ポポウル", "Popoulu", "太平洋諸島", "調理用", "太め", "加熱向きで香りが穏やか", "ほくほく", "穏やか", "大型", "中", "普通", sources.promusaDiversity),
  c("マオリ", "Maoli", "太平洋諸島", "調理用", "太め", "主食利用向き", "ほくほく", "穏やか", "大型", "中", "普通", sources.promusaDiversity),
  c("イホレナ", "Iholena", "ハワイ・太平洋諸島", "デザート・調理兼用", "中ぶり", "オレンジ色の果肉で香りがよい", "しっかり", "芳香", "大型", "中", "普通", sources.promusaDiversity),
  c("ホワイトイホレナ", "White Iholena", "ハワイ", "デザート・調理兼用", "中ぶり", "穏やかな甘み", "しっかり", "軽い", "大型", "中", "普通", sources.promusaDiversity),
  c("ポポウルハワイアン", "Hawaiian Popoulu", "ハワイ", "調理用", "太め", "加熱向きで食べ応えがある", "ほくほく", "穏やか", "大型", "中", "普通", sources.promusaDiversity),
  c("フェイ", "Fehi", "太平洋諸島", "調理用", "太め", "加熱向きで色づきが個性的", "ほくほく", "穏やか", "大型", "高", "普通", sources.promusaDiversity),
  c("プランテン", "French Plantain", "西アフリカ・中南米", "調理用", "大型", "主食・揚げ物向き", "ほくほく", "穏やか", "大型", "高", "普通", sources.promusaDiversity),
  c("ホーンプランテン", "Horn Plantain", "西アフリカ・中南米", "調理用", "大型", "大きな果実で加熱向き", "ほくほく", "穏やか", "大型", "高", "普通", sources.promusaDiversity),
  c("マリコンゴ", "Maricongo", "プエルトリコ", "調理用", "大型", "プランテン系で揚げ物向き", "ほくほく", "穏やか", "大型", "高", "普通", sources.promusaDiversity),
  c("ドワーフプエルトリカン", "Dwarf Puerto Rican", "プエルトリコ", "調理用", "大型", "低めの株で調理用果を狙う", "ほくほく", "穏やか", "中型", "低", "普通", sources.promusaDiversity),
  c("アフリカンライノホーン", "African Rhino Horn", "アフリカ", "調理用", "非常に大型", "長い果実で加熱向き", "ほくほく", "穏やか", "大型", "高", "普通", sources.promusaDiversity),
  c("ネンドラン", "Nendran", "インド", "調理・デザート兼用", "中ぶり", "加熱菓子やチップス向き", "しっかり", "穏やか", "中型", "中", "普通", sources.plantUseMusa),
  c("タンドック", "Tanduk", "インドネシア", "調理用", "大型", "長い果実で加熱向き", "ほくほく", "穏やか", "大型", "高", "普通", sources.plantUseMusa),
  c("ピサンケポック", "Pisang Kepok", "インドネシア", "調理用", "太め", "蒸し・揚げ物向き", "ほくほく", "穏やか", "大型", "中", "普通", sources.plantUseMusa),
  c("ピサンアブ", "Pisang Abu", "マレーシア", "調理用", "太め", "加熱で甘みが出る", "ほくほく", "穏やか", "大型", "中", "普通", sources.plantUseMusa),
  c("フアモア", "Hua Moa", "ポリネシア", "調理・デザート兼用", "太め", "完熟で甘く未熟果は調理向き", "しっかり", "穏やか", "大型", "中", "普通", sources.promusaDiversity),
  c("ゴールドフィンガー", "FHIA-01 Goldfinger", "ホンジュラス育成", "デザート", "中ぶり", "甘酸っぱく病害に比較的強い", "しっかり", "フルーティー", "中型", "中", "強め", sources.promusaDiversity),
  c("モナリザ", "FHIA-02 Mona Lisa", "ホンジュラス育成", "デザート", "中ぶり", "甘みがあり病害耐性を意識した系統", "なめらか", "軽い", "中型", "中", "強め", sources.promusaDiversity),
  c("スイートハート", "FHIA-03 Sweetheart", "ホンジュラス育成", "デザート・調理兼用", "中ぶり", "甘みと耐病性のバランス型", "しっかり", "軽い", "中型", "中", "強め", sources.promusaDiversity),
  c("FHIA-17", "FHIA-17", "ホンジュラス育成", "デザート", "中ぶり", "甘みがあり耐病性を狙った品種", "なめらか", "軽い", "大型", "中", "強め", sources.promusaDiversity),
  c("FHIA-18", "FHIA-18", "ホンジュラス育成", "デザート", "中ぶり", "甘酸っぱく家庭向き", "なめらか", "軽い芳香", "中型", "中", "強め", sources.promusaDiversity),
  c("ヤンガンビKm5", "Yangambi Km5", "コンゴ民主共和国", "デザート", "小ぶり", "甘みがあり耐病性で知られる", "なめらか", "軽い", "中型", "中", "強め", sources.promusaDiversity),
  c("ローズバナナ", "Rose", "東南アジア", "デザート", "小ぶり", "香りのよい甘さ", "なめらか", "芳香", "小型", "低", "普通", sources.promusaDiversity),
  c("レッドバナナ", "Red banana", "東南アジア・中南米", "デザート", "中ぶり", "濃い甘みと独特の香り", "ねっとり", "芳香", "中型", "中", "普通", sources.promusaDiversity),
  c("ドワーフレッド", "Dwarf Red", "レッド系", "デザート", "中ぶり", "赤皮系の濃い甘み", "ねっとり", "芳香", "小型", "低", "普通", sources.promusaDiversity),
  c("モラード", "Morado", "レッド系", "デザート", "中ぶり", "濃厚で香りがある", "ねっとり", "芳香", "中型", "中", "普通", sources.promusaDiversity),
  c("グリーンレッド", "Green Red", "レッド系", "デザート", "中ぶり", "甘みが濃く個性的", "ねっとり", "芳香", "中型", "中", "普通", sources.promusaDiversity),
  c("ピサンジャリブアヤ", "Pisang Jari Buaya", "インドネシア", "デザート", "細め", "小型で甘い", "なめらか", "軽い", "小型", "低", "普通", sources.promusaDiversity),
  c("ピサンケリング", "Pisang Keling", "東南アジア", "デザート", "小ぶり", "甘みと香りがある", "やや締まる", "芳香", "中型", "中", "普通", sources.plantUseMusa),
  c("カラプア", "Kalapua", "太平洋諸島", "調理・デザート兼用", "中ぶり", "地域利用の幅が広い", "しっかり", "穏やか", "中型", "中", "普通", sources.promusaPisangAwak),
  c("マンザナ", "Manzana", "中南米", "デザート", "小ぶり", "甘酸っぱいりんご風味", "やや締まる", "フルーティー", "中型", "中", "普通", sources.plantUseMusa),
  c("テキサススター", "Texas Star", "アメリカ", "デザート", "中ぶり", "家庭栽培向きの甘さ", "なめらか", "軽い", "中型", "中", "強め", sources.promusaDiversity),
  c("ベインテコホール", "Veinte Cohol", "フィリピン", "デザート", "小ぶり", "早生で甘みがある", "なめらか", "軽い", "小型", "低", "普通", sources.promusaDiversity),
  c("ブラックタイ", "Black Thai", "タイ", "観賞・デザート", "中ぶり", "黒みのある茎が美しく果実も利用可能", "なめらか", "軽い", "大型", "高", "普通", sources.promusaDiversity),
  c("タイブラック", "Thai Black", "タイ", "観賞・デザート", "中ぶり", "観賞性が高く実も楽しめる", "なめらか", "軽い", "大型", "高", "普通", sources.promusaDiversity),
  c("アエアエ", "Ae Ae", "ハワイ・太平洋地域", "観賞・調理", "太め", "斑入り葉と果皮が美しい希少系統", "しっかり", "穏やか", "大型", "中", "弱め", sources.promusaDiversity),
  c("マニニ", "Manini", "ハワイ", "観賞・調理", "太め", "斑入りで観賞性が高い", "しっかり", "穏やか", "大型", "中", "弱め", sources.promusaDiversity),
  c("ムサバショウ", "Musa basjoo", "日本・中国", "観賞", "基本は食用向きでない", "繊維質で種が多い", "繊維質", "弱い", "大型", "高", "非常に強い", sources.promusaDiversity),
  c("ピンクバナナ", "Musa velutina", "インド・ヒマラヤ周辺", "観賞", "小ぶり", "果実は種が多く観賞向き", "種が多い", "軽い", "小型", "低", "強め", sources.promusaDiversity),
  c("ムサオルナータ", "Musa ornata", "東南アジア", "観賞", "小ぶり", "花が美しく観賞向き", "種が多い", "軽い", "小型", "低", "普通", sources.promusaDiversity),
  c("ムサシッキメンシス", "Musa sikkimensis", "ヒマラヤ周辺", "観賞", "基本は食用向きでない", "観賞・耐寒性重視", "繊維質", "弱い", "大型", "高", "強め", sources.promusaDiversity),
  c("ムサイチネランス", "Musa itinerans", "東南アジア", "観賞", "基本は食用向きでない", "観賞・育種素材向き", "繊維質", "弱い", "大型", "高", "普通", sources.promusaDiversity),
];

function c(nameJa, nameEn, origin, useType, fruitSize, taste, texture, aroma, plantSize, height, cold, source) {
  return { nameJa, nameEn, origin, useType, fruitSize, taste, texture, aroma, plantSize, height, cold, source };
}

function sql(value) {
  if (value === null || value === undefined || value === "") return "null";
  if (typeof value === "boolean") return value ? "true" : "false";
  return `'${String(value).replaceAll("'", "''")}'`;
}

function slugify(value) {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/ñ/g, "n")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function okinawa(cultivar) {
  const notes = ["沖縄では露地・庭植えの候補になりますが、台風対策、排水、株元の保護が重要です"];
  if (cultivar.height === "低") notes.push("低めの株なので家庭菜園や鉢でも管理しやすい");
  if (cultivar.height === "高") notes.push("大株になりやすく、防風と十分な株間を確保したい");
  if (cultivar.cold.includes("弱")) notes.push("冬よりも病害と風害に注意したい");
  if (cultivar.cold.includes("強")) notes.push("比較的作りやすい候補として試しやすい");
  return `${notes.join("。")}。`;
}

function container(cultivar) {
  if (cultivar.height === "低") return "鉢栽培でも検討しやすい。根詰まりと水切れに注意し、毎年の株分け候補を見ておく。";
  if (cultivar.height === "高") return "鉢では長期維持が難しいため、露地または大鉢で短期更新を前提にしたい。";
  return "大鉢なら試せるが、肥料切れと乾燥で果実品質が落ちやすい。";
}

function beginner(cultivar) {
  if (cultivar.height === "低" && cultivar.cold.includes("強")) return "初心者にも試しやすい候補。まずは排水のよい場所と防風を整える。";
  if (cultivar.useType.includes("調理")) return "調理用品種として目的を決めて育てたい。完熟生食だけを期待すると印象が変わる。";
  if (cultivar.useType.includes("観賞")) return "観賞目的なら楽しいが、食用品種としては期待値を調整したい。";
  return "家庭栽培では防風・肥培管理・収穫後の追熟を意識すると楽しみやすい。";
}

function record(cultivar) {
  const sourceNote = `${cultivar.source} / 補助: ${sources.promusaDiversity}`;
  return [
    cultivar.nameJa,
    cultivar.nameEn,
    slugify(cultivar.nameEn || cultivar.nameJa),
    cultivar.origin,
    `${cultivar.nameJa}は${cultivar.origin}に関連する${cultivar.useType}タイプのバナナです。${cultivar.taste}の品種として、家庭栽培では株の大きさ、風対策、病害への注意を見ながら比較したい品種です。`,
    `${cultivar.fruitSize}。草姿: ${cultivar.plantSize}。`,
    `${cultivar.taste}。`,
    cultivar.texture,
    cultivar.aroma,
    "沖縄では加温なしでも周年的に生育しやすいが、収穫時期は植え付け時期・株の充実・冬越し条件で変動。",
    `${cultivar.plantSize}。家庭栽培での管理サイズ: ${cultivar.height}。`,
    `用途: ${cultivar.useType}。耐寒性目安: ${cultivar.cold}。バナナセセリ、バンチートップ、パナマ病、台風による倒伏に注意。`,
    okinawa(cultivar),
    container(cultivar),
    beginner(cultivar),
    `${cultivar.nameJa}は「${cultivar.useType}」として見比べたい品種。沖縄では味だけでなく、株の大きさ、風への強さ、収穫後の追熟まで含めて評価したいです。`,
    null,
    sourceNote,
    true,
    false,
  ];
}

const columns = [
  "name_ja",
  "name_en",
  "slug",
  "origin",
  "description",
  "fruit_size",
  "taste",
  "texture",
  "aroma",
  "harvest_season",
  "tree_vigor",
  "difficulty",
  "okinawa_suitability",
  "container_suitability",
  "beginner_suitability",
  "kenyu_comment",
  "public_notes",
  "private_notes",
  "is_public",
  "is_for_sale",
];

const fruitUpsert = `insert into public.fruits (
  name_ja, name_en, slug, scientific_name, family_name, origin, description,
  growth_habit, flower_description, fruit_description, cultivation_summary,
  okinawa_suitability, public_notes, private_notes, is_public
) values (
  'バナナ',
  'Banana',
  'banana',
  'Musa spp.',
  'バショウ科',
  '東南アジアから太平洋地域を中心に多様化',
  'バナナはデザート用、調理用、観賞用まで非常に多様な品種群をもつ熱帯果樹です。果樹図鑑では食味だけでなく、草丈、用途、沖縄での風対策や病害リスクも見比べられるように整理します。',
  '多年草。偽茎は結実後に枯れ、吸芽で更新する。',
  '花序は苞に包まれて下垂し、雌花が果房を形成する。',
  '品種により小型から大型、デザート向きから調理向きまで幅広い。',
  '沖縄では生育しやすい一方、台風、バナナセセリ、バンチートップ、パナマ病への注意が重要。',
  '沖縄向き。防風、排水、株分け更新、病害虫確認を栽培の中心にする。',
  null,
  '初期バナナ品種${cultivars.length}件はけんゆー公開記事とProMusa/PROSEA等の公開情報を参照して作成。',
  true
)
on conflict (slug) do update set
  name_ja = excluded.name_ja,
  name_en = excluded.name_en,
  scientific_name = excluded.scientific_name,
  family_name = excluded.family_name,
  origin = excluded.origin,
  description = excluded.description,
  growth_habit = excluded.growth_habit,
  flower_description = excluded.flower_description,
  fruit_description = excluded.fruit_description,
  cultivation_summary = excluded.cultivation_summary,
  okinawa_suitability = excluded.okinawa_suitability,
  private_notes = excluded.private_notes,
  is_public = excluded.is_public,
  updated_at = now();`;

function cultivarSql(rows) {
  const values = rows.map((cultivar) => `  (${record(cultivar).map(sql).join(", ")})`).join(",\n");
  return `with banana as (
  select id from public.fruits where slug = 'banana'
)
insert into public.cultivars (
  fruit_id,
  ${columns.join(",\n  ")}
)
select
  banana.id,
  ${columns.map((_, index) => `v.column${index + 1}`).join(",\n  ")}
from banana
cross join (values
${values}
) as v
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
  tree_vigor = excluded.tree_vigor,
  difficulty = excluded.difficulty,
  okinawa_suitability = excluded.okinawa_suitability,
  container_suitability = excluded.container_suitability,
  beginner_suitability = excluded.beginner_suitability,
  kenyu_comment = excluded.kenyu_comment,
  public_notes = excluded.public_notes,
  private_notes = excluded.private_notes,
  is_public = excluded.is_public,
  is_for_sale = excluded.is_for_sale,
  updated_at = now();`;
}

const videoRows = [
  ["銀バナナ", "https://www.youtube.com/watch?v=aQd6Nn2hUV0", "銀バナナがとってもおいしかった！！！！！"],
  ["合掌バナナ", "https://www.youtube.com/watch?v=9EfghRiFrYk", "合掌バナナ(リンキットバナナ) 食レポ"],
  ["ミャンマーバナナ", "https://www.youtube.com/watch?v=FnB_9YaPv-Q", "ミャンマーバナナ Musa Phama Haek Kuk 食レポ"],
  ["ナムワアイスクリーム", "https://www.youtube.com/watch?v=zA0rhOaFX8Q", "ナムワアイスクリームバナナを食べに"],
  ["野菜バナナ", "https://www.youtube.com/watch?v=vwn1M1gzljQ", "珍しいバナナをいただきました"],
];

const videoSql = `with banana as (
  select id from public.fruits where slug = 'banana'
), video_source(name_ja, youtube_url, title) as (
  values
${videoRows.map((row) => `    (${row.map(sql).join(", ")})`).join(",\n")}
)
insert into public.videos (fruit_id, cultivar_id, youtube_url, title, description, thumbnail_url, video_type, is_public)
select
  banana.id,
  cultivars.id,
  video_source.youtube_url,
  video_source.title,
  'けんゆー公開動画を品種ページに紐づけ。',
  null,
  'review',
  true
from video_source
cross join banana
join public.cultivars on cultivars.fruit_id = banana.id and cultivars.name_ja = video_source.name_ja
where not exists (
  select 1 from public.videos
  where videos.cultivar_id = cultivars.id
    and videos.youtube_url = video_source.youtube_url
);`;

const header = `-- バナナ品種データ ${cultivars.length}件
-- けんゆー公開記事を優先し、ProMusa/PROSEA等の公開情報を補助して作成。
-- Supabase SQL Editorで part1 から順番に実行してください。
`;

const full = `${header}
begin;

${fruitUpsert}

${cultivarSql(cultivars)}

${videoSql}

commit;
`;

fs.writeFileSync(outPath, full);

const partSize = 25;
for (let i = 0; i < Math.ceil(cultivars.length / partSize); i += 1) {
  const rows = cultivars.slice(i * partSize, (i + 1) * partSize);
  const part = `${header}
begin;

${i === 0 ? `${fruitUpsert}\n\n` : ""}${cultivarSql(rows)}

${i === Math.ceil(cultivars.length / partSize) - 1 ? `\n${videoSql}\n` : ""}
commit;
`;
  fs.writeFileSync(new URL(`banana-cultivars-part${i + 1}.sql`, outDir), part);
}

fs.writeFileSync(
  new URL("banana-cultivars-check.sql", outDir),
  `select
  fruits.name_ja as fruit,
  count(cultivars.id) as cultivar_count
from public.fruits
left join public.cultivars on cultivars.fruit_id = fruits.id
where fruits.slug = 'banana'
group by fruits.name_ja;
`
);

console.log(`Generated ${cultivars.length} banana cultivars.`);
