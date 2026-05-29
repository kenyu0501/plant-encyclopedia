-- 糸満フルーツ園けんちゃんの記事・動画を元に、既存の品種データへ特徴を追記します。
-- 既存品種は削除しません。既存の文章も消さず、けんちゃんサイト由来の補足を追記します。
-- 同じ出典URLが public_notes に入っている品種には再追記しません。

begin;

with source_data(fruit_slug, names, fruit_size, taste, texture, aroma, harvest_season, difficulty, okinawa_suitability, kenyu_comment, public_note, source_url) as (
  values
    (
      'avocado',
      array['メキシコーラ', 'Mexicola'],
      '100g前後',
      '小玉で皮ごと食べられるタイプ。メキシコ系らしいアニス香が特徴。',
      null,
      'アニス香',
      '10〜11月目安',
      '開花型: A型。メキシコ系で耐寒性が強い。',
      '温帯寄りでも育てやすい系統。沖縄では耐寒性よりも排水と台風対策を重視したい。',
      'けんちゃんサイトでは、メキシコ系の代表的な小玉品種として紹介。皮や香りまで含めて個性を楽しむ品種。',
      'けんちゃん補足: メキシコーラはA型、100g前後、アニス香が特徴と紹介。',
      'https://okinawan-avocado.com/2019/12/30/avocado_variety/'
    ),
    (
      'avocado',
      array['スチュワート', 'Stewart'],
      '170〜360g',
      '高品質でナッツのような香り。',
      null,
      'ナッツ香',
      '10〜11月目安',
      '開花型: A型。メキシコ系。',
      'メキシコ系で耐寒性が比較的強い。沖縄では風対策と着果管理を見たい。',
      '高品質・香り系として比較したい品種。',
      'けんちゃん補足: スチュワートはA型、170〜360g、高品質でナッツのような香りと紹介。',
      'https://okinawan-avocado.com/2019/12/30/avocado_variety/'
    ),
    (
      'avocado',
      array['メキシコーラグランデ', 'Mexicola Grande'],
      '170〜200g',
      'ナッツのような香りがあり、クリーミー。',
      'クリーミー',
      'ナッツ香',
      '10〜11月目安',
      '開花型: A型。メキシコ系。',
      '耐寒性を重視する地域で候補にしやすい。沖縄では過湿と台風に注意。',
      '小〜中玉で香りとクリーミーさを見たい品種。',
      'けんちゃん補足: メキシコーラグランデはA型、170〜200g、ナッツ香とクリーミーさが特徴と紹介。',
      'https://okinawan-avocado.com/2019/12/30/avocado_variety/'
    ),
    (
      'avocado',
      array['ピンカートン', 'Pinkerton'],
      '300〜500g',
      '油分が多く濃厚。優良品種としておすすめ度が高い。',
      '滑らか',
      null,
      '12〜1月目安',
      '開花型: A型。グアテマラ系交雑種。',
      '沖縄では問題なく栽培しやすいグアテマラ系の候補。排水と防風、A型・B型の混植を意識したい。',
      '洋ナシ型で種が小さく、食べ応えと濃厚さを両立する品種として見たい。',
      'けんちゃん補足: ピンカートンはカリフォルニア生まれのグアテマラ系交雑種。洋ナシ型、300〜500g、油分が多く濃厚と紹介。',
      'https://okinawan-avocado.com/2020/04/14/avocado_pinkerton/'
    ),
    (
      'avocado',
      array['ハス', 'Hass'],
      '200〜300g',
      '油分が多く食味が秀逸。完熟すると果皮が黒くなる。',
      null,
      null,
      '4月目安',
      '開花型: A型。グアテマラ系。',
      '沖縄では栽培可能。市場流通の基準品種として、他品種との比較軸にしやすい。',
      '世界標準の味として比較に使いたい品種。小〜中玉でも油分と香りのまとまりを評価したい。',
      'けんちゃん補足: ハスは日本市場でよく見る品種で、収量が多く、完熟すると黒くなり、食味が秀でると紹介。',
      'https://okinawan-avocado.com/2020/09/11/avocado_hass-2/'
    ),
    (
      'avocado',
      array['エドラノール', 'Edranol'],
      '300〜400g',
      'ナッツ風味で味が良く、食味評価が高い。',
      null,
      'ナッツ香',
      '3月目安',
      '開花型: B型。グアテマラ系。',
      'B型の組み合わせ候補。沖縄では排水性、防風、収穫時期の見極めを重視したい。',
      'ナッツ風味を軸に、国産アボカドらしい濃厚さを比較したい品種。',
      'けんちゃん補足: エドラノールはB型、300〜400g、ナッツ風味で味が良く食味が秀でると紹介。',
      'https://okinawan-avocado.com/2021/11/23/edranol/'
    ),
    (
      'avocado',
      array['リード', 'Reed'],
      '400〜600g',
      '着果が良く、味も秀でている。',
      null,
      null,
      '4〜6月目安',
      '開花型: A型。グアテマラ系。木は矮小傾向。',
      '木が比較的管理しやすく、庭植え・鉢管理の比較候補。沖縄では風対策が重要。',
      '丸みのある大玉で、着果性と味を両方見たい品種。',
      'けんちゃん補足: リードはA型、400〜600g、木が矮小で着果が良く、味も秀でると紹介。',
      'https://okinawan-avocado.com/2021/04/16/avocado_reed/'
    ),
    (
      'avocado',
      array['カビラミドリ', 'Kabira Midori'],
      '500〜800g',
      '油分は少なめだが、しつこくなく食味良好。光沢ある緑色の果皮が特徴。',
      'みずみずしい',
      null,
      '9月目安',
      '開花型: A型。西インド諸島系。沖縄県石垣島の川平で栽培される大型品種。',
      '沖縄・石垣で栽培実績のある早生大型品種。台風前の収穫性や大玉性を見たい。',
      '沖縄らしい大型アボカドとして、油分の濃さよりも瑞々しさと食べやすさを評価したい。',
      'けんちゃん補足: カビラミドリは石垣島川平で栽培される大型品種。900g近い果実例、光沢ある緑色、食味良好と紹介。',
      'https://okinawan-avocado.com/2020/08/29/kabira_green/'
    ),
    (
      'avocado',
      array['カビラムラサキ', 'Kabira Murasaki'],
      '500〜800g',
      '油分は低めだが食味は良い。',
      null,
      null,
      '9月目安',
      '西インド諸島系。大型品種。',
      '沖縄で比較しやすい大型・早生系。台風時期との兼ね合いを見たい。',
      '大玉性と沖縄適性を比較したいカビラ系。',
      'けんちゃん補足: カビラムラサキは大型の西インド諸島系品種で、油分は低めだが食味は良いと紹介。',
      'https://okinawan-avocado.com/2020/08/26/kabira_purple/'
    ),
    (
      'avocado',
      array['エッティンガー', 'Ettinger'],
      '300〜400g',
      'フェルテに似るが、より早い収穫期。食味濃厚。',
      null,
      null,
      '11〜12月目安',
      '開花型: B型。メキシコ系とグアテマラ系の交雑種。',
      '早めのB型品種として混植候補。沖縄では早採り・追熟の見極めをしたい。',
      'フェルテ系の雰囲気を早い時期に楽しめる候補として記録したい。',
      'けんちゃん補足: エッティンガーはB型、300〜400g、フェルテに似るがフェルテより前の収穫期と紹介。',
      'https://okinawan-avocado.com/2021/11/17/avocado_ettinger/'
    ),
    (
      'avocado',
      array['モンロー', 'Monroe'],
      '500〜900g',
      '大玉で着果が良く、良い香り。',
      null,
      '良い香り',
      '1月目安',
      '開花型: B型。グアテマラ系と西インド諸島系の交雑種。',
      '沖縄では大玉系として魅力がある。樹勢・台風・着果負担の管理を見たい。',
      '大玉でも香りと食味を狙える品種として比較したい。',
      'けんちゃん補足: モンローはB型、500〜900g、フロリダ発、着果が良く良い香りと紹介。',
      'https://okinawan-avocado.com/2020/09/26/monroe/'
    ),
    (
      'avocado',
      array['リンダ', 'Linda'],
      '800g前後',
      '可食部が多く、油分が少なめの大型品種。',
      null,
      null,
      '1〜3月目安',
      '開花型: A型。グアテマラ系と西インド諸島系の交雑種。',
      '大玉で樹への負担が出やすい可能性があるため、着果量調整と防風を重視したい。',
      '油分が少ない大型アボカドとして、重さ・可食部・食べやすさを見たい。',
      'けんちゃん補足: リンダはA型、800g、可食部が多く、油分が少ないダイエットアボカドとして紹介。',
      'https://okinawan-avocado.com/2022/06/07/avocado_linda/'
    ),
    (
      'mango',
      array['アーウィン', 'Irwin'],
      '350g程度',
      'あっさりして癖が少ない。甘い香りがあり、マンゴー特有のテルペン臭は少なめ。',
      '繊維は中程度で型崩れしにくい',
      '甘い香り',
      null,
      '糖度目安14〜16%。赤果皮のインド系、単胚種子。炭疽病に弱い。',
      '沖縄の代表的な栽培品種。品質を安定させるには病害対策と収穫後の扱いが重要。',
      '日本でマンゴーと言えばまず比較軸になる品種。濃厚さより、香り・色・食べやすさの安定感を見たい。',
      'けんちゃん補足: アーウィンは日本市場で最も有名な品種。アップルマンゴーとも呼ばれ、鮮紅色の果皮、黄色〜橙色の果肉、糖度は比較的低めと紹介。',
      'https://okinawan-avocado.com/2020/08/25/mango_variety/'
    ),
    (
      'mango',
      array['トミーアトキンス', 'Tommy Atkins'],
      '500g程度',
      'あっさりして癖が少ない。',
      '繊維は中程度',
      null,
      null,
      '糖度目安14〜16%。',
      '沖縄では食味だけでなく、外観・日持ち・病害への強さも比較したい。',
      '海外流通でよく見るタイプとして、アーウィンとの違いを記録したい。',
      'けんちゃん補足: トミーアトキンスは500g程度、糖度14〜16%、あっさり癖なし、繊維中程度と比較表で紹介。',
      'https://okinawan-avocado.com/2020/08/25/mango_variety/'
    ),
    (
      'mango',
      array['玉文', '玉文6号', 'Gyokubun'],
      '600g〜2kg',
      '滑らかで甘く濃厚。',
      '滑らか。繊維は少ない。',
      null,
      null,
      '糖度目安15〜19%。大型品種。',
      '沖縄では大玉化しやすい品種として、玉吊り・袋がけ・樹勢管理を重視したい。',
      '大玉で濃厚、贈答性も含めて評価したい品種。',
      'けんちゃん補足: 玉文は600g〜2kg、糖度15〜19%、滑らかで甘く濃厚、繊維が少ないと紹介。',
      'https://okinawan-avocado.com/2020/08/25/mango_variety/'
    ),
    (
      'mango',
      array['ナムドクマイ', 'ナンドクマイ', 'Nam Dok Mai'],
      '350g程度',
      '未熟果で収穫しても甘みが強い。強い甘さでお手頃価格の候補。',
      '柔らかく滑らか。繊維は少ない。',
      null,
      'アーウィンより早く市場に出ることが多い',
      '糖度目安20度程度。タイの主要早生品種。多胚種子。',
      '沖縄では早生の黄色系マンゴーとして比較しやすい。黒点病抵抗性の記述あり。',
      '黄色系で甘さを分かりやすく楽しめる品種。早い時期の食味比較に向く。',
      'けんちゃん補足: ナムドクマイはタイの主要早生品種。花の雫という意味で、繊維が少なく滑らか、果皮と果肉は黄色、黒点病抵抗性があると紹介。',
      'https://okinawan-avocado.com/2020/08/25/mango_variety/'
    ),
    (
      'mango',
      array['金蜜', 'キンミツ', 'Jin Mi'],
      '350g程度',
      'アーウィンに蜂蜜をかけたような、とにかく甘い味わい。',
      '繊維は強め',
      null,
      null,
      '糖度20%以上、酸度0.18%、糖酸比118の記述あり。炭疽病に強く、アーウィンより長持ち。',
      '沖縄では甘さと日持ち、病害への強さを評価したい。黄色系なので収穫適期の見極めも記録したい。',
      '甘さ特化で分かりやすい品種。繊維の強さも含めて好き嫌いを記録したい。',
      'けんちゃん補足: 金蜜は台湾生まれで、果皮・果肉が黄色。濃蜜な味わい、糖度20%以上、炭疽病に強いと紹介。',
      'https://okinawan-avocado.com/2020/08/25/mango_variety/'
    ),
    (
      'mango',
      array['キーツ', 'Keitt'],
      '500g〜2kg',
      '濃甘で濃厚。糖度目安12〜19程度。',
      '繊維は少なく、濃厚な舌触り。',
      null,
      '8月中旬〜9月初旬目安',
      '晩生。追熟型。フロリダ生まれでムルゴバ実生由来。',
      '沖縄では晩生の代表候補。緑果皮で収穫適期が難しいため、ブルームや追熟状態をよく観察したい。',
      '大玉・晩生・追熟型として、収穫の見極めまで含めて記録したい品種。',
      'けんちゃん補足: キーツは晩生で、幻のマンゴーとも呼ばれる大型品種。果皮は黄緑〜緑色で、収穫が早いと糖が乗りにくく、遅いと苦味や果皮の萎みが出ると紹介。',
      'https://okinawan-avocado.com/2020/08/25/mango_variety/'
    ),
    (
      'mango',
      array['レッドキーツ', 'Red Keitt'],
      '1〜2kg',
      '糖度計の値以上においしく、多汁で濃厚。',
      '滑らか。繊維は少ない。',
      null,
      null,
      '追熟型の大型マンゴー。糖度10.3%、糖酸比38.3の記述あり。',
      '沖縄では大玉追熟型として、玉吊り・袋がけ・追熟の記録を取りたい。',
      '糖度だけでは評価しきれない濃厚さを記録したい品種。',
      'けんちゃん補足: レッドキーツは追熟型で大型。台湾台南市玉井区の玉文5号説があり、種が小さく可食部が多いと紹介。',
      'https://okinawan-avocado.com/2020/08/25/mango_variety/'
    ),
    (
      'mango',
      array['金煌', 'キンコウ', 'Kinh Koh', 'Jin Huang'],
      '1〜2kg',
      '繊維が少なく滑らかで食味良好。',
      '滑らか。繊維は少ない。',
      null,
      null,
      '糖度15〜20%、酸度0.24%、糖酸比73の記述あり。台湾生まれの大型品種。',
      '沖縄では雨避けなしで収穫できる可能性や炭疽病への強さを比較したい。',
      '大型で病害に強い可能性がある品種として、栽培性まで含めて評価したい。',
      'けんちゃん補足: 金煌は台湾高雄の黄金煌さんがキーツ種の改良で作った大型品種。追熟型、果皮は緑から黄色、炭疽病に強いと紹介。',
      'https://okinawan-avocado.com/2020/08/25/mango_variety/'
    ),
    (
      'mango',
      array['てぃらら', 'ティララ', 'バレンシア プライド', 'Valencia Pride'],
      '300〜500g',
      '細長く甘酸っぱい。食味は濃厚寄りで、個体によって酸味が少なく甘く感じることもある。',
      null,
      null,
      '晩生',
      'バレンシアプライド。1941年にHadenの実生として南フロリダで誕生。',
      '沖縄では晩生の比較候補。細長い果形と甘酸っぱさを記録したい。',
      '沖縄名・商標名と原品種名の両方で管理しておきたい品種。',
      'けんちゃん補足: てぃららはバレンシアプライドで、沖縄県が米国農務省から導入。細長く甘酸っぱい晩生品種と紹介。',
      'https://okinawan-avocado.com/2020/08/25/mango_variety/'
    ),
    (
      'mango',
      array['夏雪', '高雄3号'],
      '400〜700g',
      'あっさり気味で、すっきりした甘さ。多汁。',
      '繊維は強め',
      null,
      null,
      '台湾生まれの新品種、高雄3号。糖度目安13〜14度。',
      '沖縄では黄色系・台湾系の比較候補。繊維の強さと多汁性を記録したい。',
      '濃厚一辺倒ではなく、すっきり感を評価したい品種。',
      'けんちゃん補足: 夏雪は台湾生まれの新品種「高雄3号」。土マンゴーの改良で、あっさりした甘さ、多汁、繊維が強めと紹介。',
      'https://okinawan-avocado.com/2020/08/25/mango_variety/'
    ),
    (
      'banana',
      array['銀バナナ', 'ぐしちゃん銀バナナ', 'Kauai Namwa Nuan'],
      null,
      '白っぽいブルームがかかるナムワ系として記録。食味評価を追加で観察したい。',
      null,
      null,
      null,
      'ナムワ系。栽培記録・食レポあり。',
      '沖縄ではナムワ系として露地候補。防風、バンチートップ、バナナセセリに注意。',
      '銀バナナは名前が似た系統が複数あり得るので、由来・株元・果実写真を残して比較したい。',
      'けんちゃん補足: 銀バナナの食レポ記事・動画あり。既存の調査記録と合わせ、同名・近縁系統の整理が必要。',
      'https://okinawan-avocado.com/2025/01/25/kauai_namwa_nuan/'
    ),
    (
      'banana',
      array['合掌バナナ', 'リンキットバナナ', 'Praying Hands', 'Lingkit'],
      null,
      '花粉あり、甘い。房が合掌したように密着する形が特徴。',
      'しっかり',
      null,
      null,
      'BBBの記録あり。高性。',
      '沖縄では露地候補だが、高性なので台風対策が重要。',
      '形の面白さだけでなく、食味と調理適性を分けて記録したい。',
      'けんちゃん補足: 合掌バナナ（リンキットバナナ）の食レポ記事・動画あり。',
      'https://okinawan-avocado.com/2021/10/31/lingkit/'
    ),
    (
      'banana',
      array['ミャンマーバナナ', 'ミャンマーバナナ実生', 'Musa Phama Haek Kuk'],
      null,
      '甘さ控えめ。授粉すると種が入る記録あり。',
      null,
      null,
      null,
      '花粉あり。種あり果実になる可能性。',
      '沖縄では食味だけでなく、種子形成や交配材料としての価値も記録したい。',
      '食用評価と育種・観察材料としての評価を分けて残したい品種。',
      'けんちゃん補足: ミャンマーバナナ Musa Phama Haek Kuk の食レポ記事・動画あり。',
      'https://okinawan-avocado.com/2021/10/31/musa_phama_haek_kuk/'
    ),
    (
      'banana',
      array['ナムワアイス', 'ナムワアイスクリーム', 'ナムワ系アイスクリームバナナ実生', 'Namwah Ice Cream'],
      null,
      'さわやかな甘さ。ナムワ系として比較したい。',
      null,
      null,
      null,
      '高性。ABB系の記録あり。',
      '沖縄では露地候補。高性の場合は台風対策と株間を意識したい。',
      'ナムワアイス系は由来違い・実生・斑入りなどが混ざりやすいので、写真と導入元をセットで記録したい。',
      'けんちゃん補足: ナムワアイスクリームバナナを食べに行った記事・動画あり。',
      'https://okinawan-avocado.com/2021/10/08/banana_ikehara_san/'
    )
),
matched as (
  select
    c.id,
    c.fruit_id,
    c.name_ja,
    s.*
  from source_data s
  join public.fruits f on f.slug = s.fruit_slug
  join public.cultivars c on c.fruit_id = f.id
  where c.name_ja = any(s.names)
    or coalesce(c.name_en, '') = any(s.names)
)
update public.cultivars c
set
  fruit_size = coalesce(nullif(c.fruit_size, ''), matched.fruit_size),
  taste = case
    when matched.taste is null then c.taste
    when coalesce(c.taste, '') like '%' || matched.source_url || '%' then c.taste
    when coalesce(c.taste, '') = '' then matched.taste
    when c.taste like '%' || matched.taste || '%' then c.taste
    else c.taste || E'\n\n' || matched.taste
  end,
  texture = coalesce(nullif(c.texture, ''), matched.texture),
  aroma = coalesce(nullif(c.aroma, ''), matched.aroma),
  harvest_season = case
    when matched.harvest_season is null then c.harvest_season
    when coalesce(c.harvest_season, '') = '' then matched.harvest_season
    when c.harvest_season like '%' || matched.harvest_season || '%' then c.harvest_season
    else c.harvest_season || E'\n' || matched.harvest_season
  end,
  difficulty = case
    when matched.difficulty is null then c.difficulty
    when coalesce(c.difficulty, '') like '%' || matched.difficulty || '%' then c.difficulty
    when coalesce(c.difficulty, '') = '' then matched.difficulty
    else c.difficulty || E'\n' || matched.difficulty
  end,
  okinawa_suitability = case
    when matched.okinawa_suitability is null then c.okinawa_suitability
    when coalesce(c.okinawa_suitability, '') like '%' || matched.source_url || '%' then c.okinawa_suitability
    when coalesce(c.okinawa_suitability, '') = '' then matched.okinawa_suitability
    else c.okinawa_suitability || E'\n\n' || matched.okinawa_suitability
  end,
  kenyu_comment = case
    when matched.kenyu_comment is null then c.kenyu_comment
    when coalesce(c.kenyu_comment, '') like '%' || matched.source_url || '%' then c.kenyu_comment
    when coalesce(c.kenyu_comment, '') = '' then matched.kenyu_comment
    else c.kenyu_comment || E'\n\n' || matched.kenyu_comment
  end,
  public_notes = case
    when coalesce(c.public_notes, '') like '%' || matched.source_url || '%' then c.public_notes
    when coalesce(c.public_notes, '') = '' then matched.public_note || E'\n出典: ' || matched.source_url
    else c.public_notes || E'\n\n' || matched.public_note || E'\n出典: ' || matched.source_url
  end,
  updated_at = now()
from matched
where c.id = matched.id
  and coalesce(c.public_notes, '') not like '%' || matched.source_url || '%';

with video_data(fruit_slug, names, youtube_url, title, source_url) as (
  values
    ('avocado', array['ピンカートン', 'Pinkerton'], 'https://youtu.be/UlZnRe2GbH0', 'ピンカートンの特徴・食味紹介', 'https://okinawan-avocado.com/2020/04/14/avocado_pinkerton/'),
    ('avocado', array['カビラムラサキ', 'Kabira Murasaki'], 'https://youtu.be/MoCtmiDtKks', 'カビラムラサキの特徴紹介', 'https://okinawan-avocado.com/2020/08/26/kabira_purple/'),
    ('avocado', array['リード', 'Reed'], 'https://youtu.be/edksNVQDYaM', 'リードの特徴・食レポ', 'https://okinawan-avocado.com/2021/04/16/avocado_reed/'),
    ('avocado', array['エッティンガー', 'Ettinger'], 'https://youtu.be/EWBbNI0QVfc', 'エッティンガーの特徴・食レポ', 'https://okinawan-avocado.com/2021/11/17/avocado_ettinger/'),
    ('avocado', array['エドラノール', 'Edranol'], 'https://youtu.be/RVGGwPFCix4', 'エドラノールの特徴・食レポ', 'https://okinawan-avocado.com/2021/11/23/edranol/'),
    ('mango', array['アーウィン', 'Irwin'], 'https://youtu.be/pIWiELKA6Kk', 'アーウィン紹介・食レポ', 'https://okinawan-avocado.com/2020/08/25/mango_variety/'),
    ('mango', array['トミーアトキンス', 'Tommy Atkins'], 'https://youtu.be/WjKxPD6Ubdw', 'トミーアトキンス紹介・食レポ', 'https://okinawan-avocado.com/2020/08/25/mango_variety/'),
    ('mango', array['玉文', '玉文6号', 'Gyokubun'], 'https://youtu.be/2Id6Nz8Z7sw', '玉文6号紹介・食レポ', 'https://okinawan-avocado.com/2020/08/25/mango_variety/'),
    ('mango', array['ナムドクマイ', 'ナンドクマイ', 'Nam Dok Mai'], 'https://youtu.be/JOZw8Mr485w', 'ナムドクマイ紹介・食レポ', 'https://okinawan-avocado.com/2020/08/25/mango_variety/'),
    ('mango', array['金蜜', 'キンミツ', 'Jin Mi'], 'https://youtu.be/9I5wV8AsLHs', '金蜜紹介・食レポ', 'https://okinawan-avocado.com/2020/08/25/mango_variety/'),
    ('mango', array['キーツ', 'Keitt'], 'https://youtu.be/WRt7SNqbd_g', 'キーツ紹介・食レポ', 'https://okinawan-avocado.com/2020/08/25/mango_variety/'),
    ('mango', array['レッドキーツ', 'Red Keitt'], 'https://youtu.be/NPLVd8fOtcU', 'レッドキーツ紹介・食レポ', 'https://okinawan-avocado.com/2020/08/25/mango_variety/'),
    ('mango', array['金煌', 'キンコウ', 'Kinh Koh', 'Jin Huang'], 'https://youtu.be/kmbbXmQF8PI', '金煌紹介・食レポ', 'https://okinawan-avocado.com/2020/08/25/mango_variety/'),
    ('mango', array['てぃらら', 'ティララ', 'バレンシア プライド', 'Valencia Pride'], 'https://youtu.be/_Rh0B_YRmCU', 'てぃらら紹介・食レポ', 'https://okinawan-avocado.com/2020/08/25/mango_variety/'),
    ('mango', array['夏雪', '高雄3号'], 'https://youtu.be/wMPI5LfnVcU', '夏雪紹介・食レポ', 'https://okinawan-avocado.com/2020/08/25/mango_variety/'),
    ('banana', array['銀バナナ', 'ぐしちゃん銀バナナ', 'Kauai Namwa Nuan'], 'https://youtu.be/aQd6Nn2hUV0', '銀バナナ食レポ', 'https://okinawan-avocado.com/2025/01/25/kauai_namwa_nuan/'),
    ('banana', array['合掌バナナ', 'リンキットバナナ', 'Praying Hands', 'Lingkit'], 'https://youtu.be/9EfghRiFrYk', '合掌バナナ・リンキットバナナ食レポ', 'https://okinawan-avocado.com/2021/10/31/lingkit/'),
    ('banana', array['ミャンマーバナナ', 'ミャンマーバナナ実生', 'Musa Phama Haek Kuk'], 'https://youtu.be/FnB_9YaPv-Q', 'ミャンマーバナナ食レポ', 'https://okinawan-avocado.com/2021/10/31/musa_phama_haek_kuk/'),
    ('banana', array['ナムワアイス', 'ナムワアイスクリーム', 'ナムワ系アイスクリームバナナ実生', 'Namwah Ice Cream'], 'https://youtu.be/zA0rhOaFX8Q', 'ナムワアイスクリームバナナを食べに', 'https://okinawan-avocado.com/2021/10/08/banana_ikehara_san/')
),
matched_videos as (
  select
    c.id as cultivar_id,
    c.fruit_id,
    v.youtube_url,
    v.title,
    'https://img.youtube.com/vi/' || regexp_replace(v.youtube_url, '^https://youtu\.be/', '') || '/hqdefault.jpg' as thumbnail_url
  from video_data v
  join public.fruits f on f.slug = v.fruit_slug
  join public.cultivars c on c.fruit_id = f.id
  where c.name_ja = any(v.names)
    or coalesce(c.name_en, '') = any(v.names)
)
insert into public.videos (fruit_id, cultivar_id, youtube_url, title, description, thumbnail_url, video_type, is_public)
select
  fruit_id,
  cultivar_id,
  youtube_url,
  title,
  '糸満フルーツ園けんちゃんの記事・YouTubeより紐づけ',
  thumbnail_url,
  'cultivar',
  true
from matched_videos mv
where not exists (
  select 1
  from public.videos existing
  where existing.cultivar_id = mv.cultivar_id
    and existing.youtube_url = mv.youtube_url
);

commit;

select 'kenchan cultivar enrichment complete' as result;
