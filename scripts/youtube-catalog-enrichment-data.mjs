const watch = (id) => `https://www.youtube.com/watch?v=${id}`;

const video = (id, title, observed) => ({
  youtubeUrl: watch(id),
  title,
  observed,
  thumbnailUrl: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
});

export const youtubeCatalogEnrichments = [
  {
    fruitSlug: "dragon-fruit",
    cultivarSlug: "Chura-boshi-Queen",
    ...video("YFloxmKBRpM", "沖縄生まれ「ちゅら星クィーン」を食べてみた", "実食果は水分が非常に多く、すっきりした甘さと白桃を思わせる香りが感じられた。酸味はほぼ感じず、測定したBrixは17.0、18.4、18.8％だった。中心部の方が甘く感じられ、同じ果実内でも部位差が見られた。"),
  },
  {
    fruitSlug: "durian",
    ensureCultivar: { slug: "musang-king", nameJa: "ムサンキング", nameEn: "Musang King" },
    ...video("ya3nCMDSXVc", "ムサンキング・ドリアンの食レポ", "実食では非常に濃厚でクリーミーな食味、強い香り、わずかな酸味と舌に感じる刺激が記録された。動画内ではモントーンより風味の癖が強いと評価している。これは当該果実を食べた際の栽培者個人の観察である。"),
  },
  {
    fruitSlug: "apple",
    ensureFruit: { slug: "apple", nameJa: "リンゴ", nameEn: "Apple", scientificName: "Malus domestica", familyName: "バラ科" },
    ...video("plf0bi5ABRg", "主要リンゴ12品種の糖度検査と食べ比べ", "サンふじ、わせふじ、ジョナゴールド、世界一、秋映、シナノスイート、シナノゴールド、ぐんま名月、王林、トキ、紅玉、紅あかりを比較した。実食者はジョナゴールドの食感と甘酸のバランス、ぐんま名月の濃い風味を特に高く評価し、サンふじも強い甘さを持つ王道品種として挙げた。"),
  },
  {
    fruitSlug: "avocado",
    ...video("V0pzcIQZoic", "追熟すると黄色くなるアボカドの食レポ", "品種名未確認のため品種ページは作成していない。追熟に伴って果皮が緑から黄色へ変化した果実を実食し、滑らかで柔らかい食感、強い油分、クリーミーさ、卵黄やナッツを思わせる後味を記録した。系統についての発言は推測であり、確定情報ではない。"),
  },
  {
    fruitSlug: "avocado",
    ensureCultivar: { slug: "kenchan-original-7", nameJa: "けんちゃんオリジナル7号", nameEn: "Kenchan Original No. 7" },
    ...video("X1ZSiv-Oitc", "けんちゃんオリジナル7号の初実食", "種子から育成した実生選抜系統の初実食記録。果皮、果肉、種子の状態と食味を動画内で確認している。親品種や遺伝的系統は確定していないため、動画で確認できる実生由来という情報のみを記録する。"),
  },
  {
    fruitSlug: "rambutan",
    ...video("gIKc4WTXYYE", "「髪の毛」と呼ばれるランブータンの食レポ", "果肉と種子の離れがあまり良くない果実を実食した。動画では、ランブータンには果肉と種子が離れやすい系統もあること、実生では雄株・雌株など性表現が分かれる可能性があることにも触れている。"),
  },
  {
    fruitSlug: "soursop",
    ...video("ku2kA6kGDdU", "トゲバンレイシ（サワーソップ）の食レポ", "実食果はとろみがあり、甘味よりもまろやかな酸味が目立った。Brixは16.4％と16.9％を記録したが、官能上の甘さとは一致しなかった。生食よりジュース加工に向くのではないか、という栽培者の所感が示された。"),
  },
  {
    fruitSlug: "red-rambai",
    ...video("Ie6H3PKtJGI", "レッドランバイの食レポ", "実食では既知の果物だけでは表しにくい独特の風味があると評価した。同時に食べたリュウガンと比べると、水分が少なめで、サクッとしたスナックのような食感という感想が得られた。"),
  },
  {
    fruitSlug: "setoka",
    ensureFruit: { slug: "setoka", nameJa: "せとか", nameEn: "Setoka", scientificName: "Citrus hybrid", familyName: "ミカン科" },
    ...video("GFpRLzGBYkE", "高級柑橘「せとか」の食レポ", "実食ではオレンジ様の香りが強く、鋭すぎない酸味と甘味のバランスが良いと評価した。動画では果実保護資材による袋掛け、日焼けや鳥害への対策など、生産者から聞いた管理例も紹介している。"),
  },
  {
    fruitSlug: "avocado",
    ensureCultivar: { slug: "kenchan-original-3", nameJa: "けんちゃんオリジナル3号", nameEn: "Kenchan Original No. 3" },
    ...video("rRgEOxawhOA", "けんちゃんオリジナル3号の食レポ", "実生から得られたオリジナル系統。実食果は水分が極めて少なく、油分や甘味が突出するタイプではなかった。栗、サツマイモ、卵黄を思わせる密でまとわりつく食感があり、一般的なアボカドとは異なる個性として評価した。"),
  },
  {
    fruitSlug: "avocado", cultivarSlug: "Egami_3",
    ...video("wMl3s1V5vKw", "大果で濃厚なアボカド「エガミ3号」の食レポ", "実食では大果でありながら水っぽさが少なく、濃厚でクリーミーな食味と評価した。果皮にはややざらつきがあり、果肉の食感と油分を栽培者が動画内で確認している。"),
  },
  {
    fruitSlug: "grape",
    ensureFruit: { slug: "grape", nameJa: "ブドウ", nameEn: "Grape", scientificName: "Vitis spp.", familyName: "ブドウ科" },
    ...video("T0wsjjT-m4E", "ブドウ19品種の食べ比べ", "天山、翠峰、瀬戸ジャイアンツ、天晴、雄宝、シャインマスカット、ロザリオビアンコ、黄玉、シナノスマイル、マイハート、ベニバラオー、クイーンニーナ、ゴルビー、オーロラブラック、ピオーネ、ナガノパープル、高妻、ベリーA、鈴香を比較した。実食者はピオーネ、マイハート、シャインマスカットを特に高く評価し、オーロラブラックと高妻にも良好な所感を示した。"),
  },
  {
    fruitSlug: "achachairu",
    ...video("CBfaFwzEZss", "アチャチャイルの食レポ", "複数果実を実食し、強い甘味を示す個体とシークヮーサーを思わせる酸味の強い個体があり、個体差が大きかった。測定例ではBrix 12.8％と18.6％が記録され、甘酸の幅広さが観察された。"),
  },
  {
    fruitSlug: "mango", cultivarSlug: "ruby",
    ...video("2PqZl_e9kpQ", "マンゴー「ルビー」の食レポ", "小果ながら非常に強い甘味があり、シロップや砂糖を思わせる濃い甘さと独特の風味を記録した。動画内の測定ではBrixが20％を超え、約22％の値も確認された。"),
  },
  {
    fruitSlug: "mango",
    ensureCultivar: { slug: "van-dyke", nameJa: "バンデイク", nameEn: "Van Dyke" },
    ...video("HxomtMeJ2Is", "マンゴー「バンデイク」の食レポ", "実食では甘味が強く、測定したBrixは17.1％だった。動画では果実品質だけでなく、海外の樹冠内着果と、日本で着色を促すため果実を吊り上げて日光に当てる栽培法の違いも紹介している。"),
  },
  {
    fruitSlug: "mango", cultivarSlug: "keitt",
    ...video("Km2PGdpFrAI", "キーツと玉文6号の食べ比べ", "実食果は繊維感がほぼなく、強い甘味と少ない酸味を示した。玉文6号と比べると果肉のきめ細かさではやや劣るという所感もあったが、濃厚で良好な食味と評価した。測定値はおおむねBrix 15～18％台だった。"),
  },
  {
    fruitSlug: "mango", cultivarSlug: "Gyokubun",
    ...video("Km2PGdpFrAI", "キーツと玉文6号の食べ比べ", "実食では繊維感がほぼなく、緻密できめ細かな果肉と強い甘味、ほとんど感じない酸味が記録された。キーツより雑味が少なく洗練された味という所感があり、測定値はおおむねBrix 17％台だった。"),
  },
  {
    fruitSlug: "banana", cultivarSlug: "banana-010",
    ...video("vkSaF-M9Lao", "マイソールバナナの食レポ", "果房は約12段、全体で30kg前後と推定された。果皮は薄く、果肉には強い甘味と少量の酸味、蜂蜜やカカオを思わせる香り、わずかに独特な芳香があった。島バナナとキャベンディッシュの双方を思わせる食味と評価した。"),
  },
  {
    fruitSlug: "banana",
    ensureCultivar: { slug: "musa-florida-variegated", nameJa: "ムサ・フロリダ斑入り", nameEn: "Musa Florida Variegated" },
    ...video("ZgMXB3xI6_o", "斑入りバナナ「ムサ・フロリダ」の食レポ", "果肉は橙色がかり、柔らかく崩れやすい。ねっとり感にほろほろした質感が加わり、バナナ特有の強い香りは比較的弱く、わずかにリンゴを思わせる風味が感じられた。酸味はほぼ感じなかった。"),
  },
  {
    fruitSlug: "pond-apple",
    ...video("knyJc9N8xkE", "イヌバンレイシの食レポ", "実食果は種子が非常に多く、中心部より果皮付近に酸味があった。十分に軟化していない部分は硬く、甘味は弱かった。測定したBrixは約6.3％。食用品質より、湿地に適応するバンレイシ属台木としての利用価値に注目している。"),
  },
  {
    fruitSlug: "banana",
    ensureCultivar: { slug: "kiwina", nameJa: "キウィーナ", nameEn: "Kiwina" },
    ...video("hkdlxV6_fVg", "キウイ風味のバナナ「キウィーナ」の食レポ", "実食ではフルーティーな香りと、キウイを思わせる風味が強く感じられた。果実中央部で測定したBrixは23.9％。甘く感じた一方、香りの強さほど測定値は高くなかったという所感を記録している。"),
  },
  {
    fruitSlug: "banana", cultivarSlug: "mlp",
    ...video("SGL3TeoaA6A", "バナナ「MLP」の食レポ", "実食では品種名の通り酸味が非常に強く、一般的な甘いバナナとは異なる食味が確認された。果実の成熟程度による影響もあり得るため、この動画の個体における観察として扱う。"),
  },
  {
    fruitSlug: "banana", cultivarSlug: "banana-011",
    ...video("OH2yCjnOAZI", "ボリビアバナナの食レポ", "実食では果皮、果肉の色、硬さ、甘味と酸味を確認した。一般的なキャベンディッシュとは異なる個性を持つ希少バナナとして紹介されている。数値や系統が字幕から確定できない点は推測していない。"),
  },
  {
    fruitSlug: "mango", cultivarSlug: "natsuyuki",
    ...video("wMPI5LfnVcU", "マンゴー「夏雪」の食レポ", "動画は会員限定となっており、公開字幕を確認できなかったため、動画の関連付けのみを行い、食味情報は追記していない。"),
  },
  {
    fruitSlug: "mango",
    ensureCultivar: { slug: "tirara", nameJa: "てぃらら", nameEn: "Tirara" },
    ...video("_Rh0B_YRmCU", "マンゴー「てぃらら」の食レポと糖度測定", "実食では酸味がほぼなく、癖の少ない甘さを確認した。Brixは12.1～13.8％（13.8％を含む）で、比較したアーウィンは約10.4～10.5％だった。果実ごとの個体差があるため、この動画での測定例として記録する。"),
  },
  {
    fruitSlug: "pineapple",
    ...video("2kRKUWOGLuU", "パイナップル8品種の糖度比較", "デルモンテゴールド、スウィーティオ、Nパイン、スナックパイン、金鑚パイン、ピーチパイン、サンドルチェ、ゴールドバレルを同条件で比較した。測定値だけでなく、糖度と酸度のバランスによって官能上の甘さが変わる点を実食で確認している。"),
  },
  {
    fruitSlug: "lemon-drop-mangosteen",
    ...video("TZ13Vd6jGX4", "レモンドロップマンゴスチンの食レポ", "小果を実食し、レモンを思わせる酸味と香り、ライチに近いと感じる食感を記録した。測定したBrixは8.6％。酸味はパッションフルーツほど強くなく、砂糖漬けなど加工利用の可能性にも言及している。"),
  },
  {
    fruitSlug: "giant-granadilla",
    ...video("ZiM1dxOC8hc", "1kgを超えるオオミノトケイソウの食レポ", "1kgを超える大型果を切って、果肉、種衣、果皮の構造と食味を確認した。一般的なパッションフルーツとは大きさと可食部の構成が異なるため、動画内で切り方と食べ方も紹介している。"),
  },
  {
    fruitSlug: "ponkan",
    ensureFruit: { slug: "ponkan", nameJa: "ポンカン", nameEn: "Ponkan", scientificName: "Citrus reticulata", familyName: "ミカン科" },
    ...video("7YsfP7irihE", "ポンカンの特徴・食レポ・糖度測定", "果皮のむきやすさ、じょうのう膜、果汁量、香り、甘味と酸味を実食で確認し、糖度計でも測定した。測定値は収穫時期や個体で変動するため、動画で扱った果実の実測例として参照する。"),
  },
  {
    fruitSlug: "pomelo",
    ensureFruit: { slug: "pomelo", nameJa: "ブンタン", nameEn: "Pomelo", scientificName: "Citrus maxima", familyName: "ミカン科" },
    ensureCultivar: { slug: "chandler", nameJa: "チャンドラーポメロ", nameEn: "Chandler" },
    ...video("Mlxnhe4niUs", "チャンドラーポメロの解説・食レポ", "大型果の切り方と食べ方を示し、果肉の色、果汁、甘味、酸味、じょうのう膜の状態を実食で確認した。糖度計による測定も行っており、動画の個体における参考値として紹介している。"),
  },
  {
    fruitSlug: "avocado",
    ensureCultivar: { slug: "kakazu-b", nameJa: "カカズB", nameEn: "Kakazu B" },
    ...video("ezeWOe-2zpA", "アボカド「カカズB」の食レポ", "ナスを思わせる黒く大型の果実を実食し、果皮の剥離性、種子の大きさ、果肉色、油分、食感を確認した。沖縄で維持される地域系統として、動画で確認できた特徴を記録する。"),
  },
  {
    fruitSlug: "avocado", cultivarSlug: "monroe",
    ...video("gB_TaoD7I1o", "アボカド「モンロー」の解説と食レポ", "大型で、切った果肉は黄色みが強い。実食では油分と食味が良好で、滑らかな果肉として評価した。動画で扱った果実の状態に基づく栽培者の観察である。"),
  },
  {
    fruitSlug: "abiu",
    ...video("4nj7PRqOD1c", "アビウの解説と食レポ", "完熟果を切り、半透明の果肉、乳液、種子の状態を確認した。実食では甘く、ゼリー状で滑らかな食感を持つ熱帯果樹として高く評価した。未熟部や果皮付近の乳液には注意が必要としている。"),
  },
  {
    fruitSlug: "atemoya",
    ...video("ln4kWmaMIJE", "夏（秋）アテモヤの食レポと糖度測定", "通常期と異なる時期の果実を実食し、強い甘味、香り、種子量、果肉の状態を確認した。糖度計による測定値も紹介しており、季節や成熟条件による品質差を考える参考例となる。"),
  },
  {
    fruitSlug: "water-lemon",
    ...video("I-IxqcLHeCE", "ミズレモン（スウィートパッション）の食レポ", "夏に収穫した果実を実食し、甘味、酸味、香りと果汁量を確認した。動画では、期待した品質に届かなかった点も含め、収穫時期や成熟条件で食味が変わり得る観察例として紹介している。"),
  },
  {
    fruitSlug: "red-sugar-apple",
    ...video("Ng2UORXZQeU", "レッドアテスの解説と食レポ", "赤色果を実食し、非常に強い甘味、適度な酸味、石細胞によるざらつき、多い種子を確認した。測定したBrixは約23％。自然果実として非常に強い甘さだが、種子が多く食べにくい面もあると評価した。"),
  },
  {
    fruitSlug: "avocado", cultivarSlug: "kabira-murasaki",
    ...video("EowYgHobiGs", "約800gの巨大アボカド「カビラムラサキ」の食レポ", "動画で扱った果実は約800gの大果。果皮、種子、果肉割合を確認し、沖縄の地域系統として食感と油分を実食評価した。果実重は個体・栽培条件で変動するため実測例として扱う。"),
  },
  {
    fruitSlug: "dragon-fruit",
    ...video("ADuRzmbL7d4", "白・赤・ピンク果肉ドラゴンフルーツの食べ比べ", "白肉、赤肉、淡いピンク肉の3タイプを同時に食べ比べ、果肉色だけでなく甘味、酸味、水分、香りの違いを確認した。果肉色だけで食味を一括りにできず、品種・個体差があることを示す実食記録である。"),
  },
  {
    fruitSlug: "mango", cultivarSlug: "kinkou",
    ...video("kmbbXmQF8PI", "マンゴー「金煌」の食レポ", "実食では味が濃く、甘味と香りが凝縮した印象を記録した。果実の食べ頃、切り方、果肉の繊維感も動画内で確認している。"),
  },
  {
    fruitSlug: "banana", cultivarSlug: "banana-001",
    ...video("CuHdar8XzTQ", "島バナナ系の追熟と食べ頃", "果皮が黒くなるまで追熟した果実は非常に柔らかく、とろりとした食感になった。未熟時に感じた酸味が弱まり、蜜や発酵を思わせる甘い香りが強まった。動画内では、この段階を投稿者の好む食べ頃としている。"),
  },
  {
    fruitSlug: "melon",
    ensureFruit: { slug: "melon", nameJa: "メロン", nameEn: "Melon", scientificName: "Cucumis melo", familyName: "ウリ科" },
    ensureCultivar: { slug: "new-melon", nameJa: "ニューメロン", nameEn: "New Melon" },
    ...video("5Pj2akTPtMY", "ニューメロンの特徴と食レポ", "小型メロンの外観、果肉、種子、香り、甘味と食感を実食で確認し、糖度計による測定も行った。動画で扱った個体の品質記録として参照する。"),
  },
  {
    fruitSlug: "noni",
    ensureFruit: { slug: "noni", nameJa: "ノニ", nameEn: "Noni", scientificName: "Morinda citrifolia", familyName: "アカネ科" },
    ...video("XmyJPmlv7xY", "ノニの果実を食べてみた", "完熟果を実食し、強い独特臭、柔らかな果肉、渋味を確認した。一般的な生食向き果実としてではなく、強い香味を持つ果実の実食記録として扱う。"),
  },
  {
    fruitSlug: "inca-peanut",
    ensureFruit: { slug: "inca-peanut", nameJa: "インカナッツ", nameEn: "Sacha inchi", scientificName: "Plukenetia volubilis", familyName: "トウダイグサ科" },
    ...video("EnIjZZ_3MLA", "インカナッツを収穫・焙煎して食べる", "圃場で得た果実から種子を取り出し、焙煎して食べるまでを記録した。生の種子ではなく、加熱処理した種子を食用とする作物として紹介している。動画内の栽培・加工手順は投稿者の実践例である。"),
  },
  {
    fruitSlug: "mango",
    ...video("JKsbYQ5c0Oo", "台湾マンゴー18種の紹介と4種の食レポ", "台湾で扱われる18種類のマンゴーを外観と名称で紹介し、そのうち4種類を実食比較した。字幕で品種名を一意に判定できない箇所があるため、誤った品種ページを作らず、マンゴー品目ページへの関連付けとして記録する。"),
  },
  {
    fruitSlug: "mango",
    ...video("mgeF2Cm9uXE", "マンゴー8品種の食べ比べ", "アーウィン、トミーアトキンス、玉文6号、ナムドクマイ、金蜜、キーツ、レッドキーツ、金煌を食べ比べた。果皮色、果肉の緻密さ、繊維、甘味、酸味、香り、切り方の違いを、生産者の実食所感として比較している。"),
  },
  {
    fruitSlug: "avocado",
    ...video("AsUOf0uYogc", "アボカド10品種の食べ比べ", "ハス、カビラムラサキ、品種不明の小型果、プーラビーダ、メキシコーラ、モンロー、カカズB、エガミ3号、カビラミドリ、ベーコンを比較した。品種ごとの果実サイズ、果皮、種子、果肉色、油分、食感と食味の差をまとめている。"),
  },
  {
    fruitSlug: "grape",
    ensureCultivar: { slug: "fuji-no-kagayaki", nameJa: "富士の輝き", nameEn: "Fuji no Kagayaki" },
    ...video("GwyIIWozQvk", "ブドウ「富士の輝き」の食レポ", "シャインマスカットとウインクを親に持つ品種として紹介。実食では強い甘味、シャインマスカットに似た風味と巨峰系を思わせる風味、弾力のある果肉、皮ごと食べやすい食感を記録した。果皮にはわずかな酸味とリンゴを思わせる風味が感じられた。"),
  },
  {
    fruitSlug: "avocado", cultivarSlug: "bacon",
    ...video("m9O2bVykc10", "アボカド「ベーコン」の食レポ", "実食果は果皮が薄く、果肉は淡い黄緑色で、油分が多く滑らかだった。ハスに油由来の穏やかな甘味を加えたような食味と評価した。動画ではB型の開花型、直立性、耐寒性に関する資料値にも触れている。"),
  },
  {
    fruitSlug: "avocado", cultivarSlug: "Egami_3",
    ...video("xjqMKl8Jq4A", "アボカド「エガミ3号」の食レポ（品種シリーズ）", "大型果を実食し、アボカド特有の濃厚さに加えて、投稿者が『カニ味噌感』と表現する独特のコクを記録した。別年の食レポと併せ、果実ごとの品質差を確認できる資料として関連付ける。"),
  },
  {
    fruitSlug: "mango", cultivarSlug: "RedKeitt",
    ...video("NPLVd8fOtcU", "マンゴー「レッドキーツ」の食レポ", "大型で果汁が非常に多く、種子は果実サイズに対して小さく薄かった。果肉は繊維が少なく、まろやかでマンゴーらしい香りがあり、玉文6号に似るという所感を記録。測定したBrixは約12％だったが、官能上は良好な食味と評価した。"),
  },
  {
    fruitSlug: "mango", cultivarSlug: "keitt",
    ...video("WRt7SNqbd_g", "マンゴー「キーツ」の解説と食レポ", "動画で扱った果実は約500gで、緑色の果皮と緻密な果肉を持ち、酸味が少なく濃いマンゴー香があった。Brixは11～12％と予想より低かったが、実食では十分に甘くおいしいと評価しており、糖度だけでは食味を表せない例となった。"),
  },
  {
    fruitSlug: "pineapple",
    ensureCultivar: { slug: "bogor", nameJa: "ボゴール（スナックパイン）", nameEn: "Bogor" },
    ...video("z0ulz3NNt70", "ボゴール（スナックパイン）の食べ方と食レポ", "手で小果をちぎって食べられる小型品種。実食では果汁が非常に多く、甘味が強く、酸味と舌の刺激は比較的弱かった。果肉は適度に噛み応えがあり、中心へ進むほど小果を外しやすくなった。"),
  },
  {
    fruitSlug: "avocado", cultivarSlug: "yamagata",
    ...video("QBCrtUlf9gQ", "アボカド「ヤマガタ」初結実果の食レポ", "この動画は現在会員限定で公開字幕を確認できないため、品種と動画の関連付けのみを行った。食味・数値は推測で追記していない。"),
  },
  {
    fruitSlug: "avocado",
    ensureCultivar: { slug: "linda", nameJa: "リンダ", nameEn: "Linda" },
    ...video("s4fXjG7AO5o", "アボカド「リンダ」の食レポ", "この動画は現在会員限定で公開字幕を確認できないため、品種と動画の関連付けのみを行った。タイトルで確認できる品種名以外の食味・数値は推測で追記していない。"),
  },
  {
    fruitSlug: "pineapple",
    ensureCultivar: { slug: "momoka", nameJa: "桃香", nameEn: "Momoka" },
    ...video("fAE-pDCeIqc", "パイナップル「桃香」の食レポ", "この動画は現在会員限定で公開字幕を確認できないため、品種と動画の関連付けのみを行った。タイトルで確認できる品種名以外の食味・糖度は推測で追記していない。"),
  },
  {
    fruitSlug: "passion-fruit",
    ...video("HEBShM1zjhE", "黄色果皮パッションフルーツの食レポ", "この動画は現在会員限定で公開字幕を確認できないため、黄色果皮タイプを扱う動画として品目ページへ関連付けた。品種実体を確定できないため新規品種は作成していない。"),
  },
  {
    fruitSlug: "avocado", cultivarSlug: "hass",
    ...video("LeOkbkaHibg", "アボカド「ハス」の解説と食レポ", "この動画は現在会員限定で公開字幕を確認できないため、既存のハス品種ページと動画の関連付けのみを行った。タイトル以外の情報は推測で追記していない。"),
  },
  {
    fruitSlug: "grape",
    ...video("KsPGGrTDFjQ", "巨峰とシャインマスカットの歴史と食レポ", "この動画は現在会員限定で公開字幕を確認できないため、ブドウ品目ページと動画の関連付けのみを行った。品種別の食味・糖度は推測で追記していない。"),
  },
  {
    fruitSlug: "pomelo",
    ...video("uvumLlCxEMc", "文旦のむき方・食レポ・糖度測定", "文旦の厚い果皮とじょうのう膜を外す手順を実演し、果肉の甘味、酸味、果汁、香りを確認した。糖度計による測定も行い、果実の構造と食べやすいむき方を合わせて解説している。"),
  },
];
