begin;

do $$
begin
  if not exists (select 1 from public.fruits where slug = 'dragon-fruit') then
    raise exception 'dragon-fruit is not registered in public.fruits';
  end if;
end
$$;

-- 出典: けんゆー「ドラゴンフルーツ記録」（2026年8月）
-- 糖度は元表の「数個体のみ計測」をそのまま採用し，味・酸味・香り・総合評価は5段階評価を転記する．
-- 大紅とちゅら星クィーンは既存レコードを維持し，この実食記録だけを後段で追記する．
with source (
  slug,
  name_ja,
  name_en,
  origin,
  flesh_color,
  fruit_size,
  brix,
  sweetness_rating,
  acidity_rating,
  aroma_rating,
  overall_rating,
  tasting_comment
) as (
  values
    ('okinawa-red', '沖縄レッド', 'Okinawa Red', '沖縄', '赤', '500g程度', '12〜20', '★★★', '★★', '★★', '★★', '生産者および生産地により個体差が激しいが，美味しいものは美味しい．甘み・酸味が強く濃厚なものがある．'),
    ('okinawa-white', '沖縄ホワイト', 'Okinawa White', '沖縄', '白', '500g程度', '10〜18', '★★', '★★★', '★★', '★★', '生産者および生産地により個体差が激しいが，美味しいものは美味しい．甘み・酸味が強く濃厚なものがある．'),
    ('okinawa-pink', '沖縄ピンク', 'Okinawa Pink', '沖縄', '白にピンクがかったような色', '500g程度', '12〜20', '★★★', '★★★', '★★', '★★', '生産者および生産地により個体差が激しいが，美味しいものは美味しい．甘み・酸味が強く濃厚なものがある．'),
    ('golden-dragon', 'ゴールデンドラゴン', 'Golden Dragon', null, '白', '500g程度', '14〜16', '★★', '★★★', '★★', '★★', 'すっきりとした酸味が特徴．甘く美味しいものはかなり良質で美味しいが，これも生産者による．'),
    ('impact-ruby', 'インパクトルビー', 'Impact Ruby', null, '赤', '400g程度', '14程度', '★★', '★★★', '★★', '★', '一般的な沖縄レッドよりも酸味があり，全体的に甘みが低いものが多い．あっさり．トゲがなく栽培上作りやすい．'),
    ('la-verne-red', 'ラ・バーン・レッド', 'La Verne Red', null, '赤紫，血色が良い，悪魔的な色', '431.5g', '17.7〜17.8', '★★★', '★★★★', '★★★★★', '★★★★', '第一印象では，キウイっぽさを感じた．爽やかな酸味をまとった．メロンなどのウリ科を思わせる香りと，後味に，若干キャラメルっぽさを感じた．また，いちじくやクワの実にちょっとレモン汁をかけたような味わいも感じる．フルーツポンチのよう．'),
    ('peruvian-pink', 'ペルビアンピンク', 'Peruvian Pink', null, '濃いピンク', '257.5g', '18.0〜18.1', '★★★★', '★★★★★', '★★★★★', '★★★★★', '柑橘のような爽やかな酸味．パイナップルのような，黄金柑のような味がある．'),
    ('dessert-princess-orange', 'デザートプリンセスオレンジ', 'Dessert Princess Orange', null, '白〜透明', '150.4g', '18.3〜18.5', '★★★★', '★★★★★', '★★★★★', '★★★★★', '見た目が炎のようで可愛い．フィンが黄色〜やや緑色でおしゃれ．レモンティーや紅茶のような華やかな味わい．浅煎りコーヒーのようなキリッとするような甘さがあった．'),
    ('red-majesty', 'レッドマジェスティ', 'Red Majesty', null, '赤〜濃赤', '269.5g', '20.4〜20.5', '★★★★', '★★', '★★★★', '★★★', 'フィンが短くて，丸っこい．沖縄県にあるレッドドラゴンに近いがそれよりもやや硬い食感．メロンっぽさにややベリー感がある．後味にスイカのような風味を感じた．酸味は低い．高い糖度の割には強い甘味は感じにくかった．'),
    ('ocamponis', 'オカンポニス', 'Ocamponis', null, '濃赤〜濃赤紫', '263g', '20.1〜20.3', '★★★★★', '★', '★★', '★★★★★', 'フィンがベタッとくっ付く面白い見た目．高温，乾燥に強い．果肉の粘性があり食感がやや硬い弾力性のあるゼリー．酸味がなく穏やかな甘さ．イチゴ，さくらんぼ，ベリー，ビーツのような感じ．とてもおすすめな品種．'),
    ('worth-variegated', 'ワース・ヴァリエゲイテッド', 'Worth Variegated', null, '白', '362.5g', '15.2〜15.3', '★★', '★★★★', '★★', '★★', '赤果皮に，緑〜黄色の縦線（斑），フィンが黄色．味は比較的穏やかで，甘味よりは酸味が強い．キウイ，パッション，柑橘，メロン，ヨーグルトっぽいような感じ．'),
    ('orange-grenade', 'オレンジグレネード', 'Orange Grenade', null, '赤', '191g', '20.5', '★★★★★', '★★★★★', '★★★★★', '★★★★★', '強い甘味に酸味と花のような香りが加わり，味が立体的．オレンジ果皮系の中でも，見た目だけでなく食味が優れた最上位候補．キウイフルーツやパッションフルーツのようなキリッとした風味に，蜂蜜のような甘味が少しあって美味い．'),
    ('tutti-fruity', 'トゥッティフルーティー', 'Tutti Fruity', null, '赤', '215g', '20.1〜20.4', '★★★★★', '★★★★★', '★★★★★', '★★★★★', '果肉がとても柔らかく，ほろほろと口の中で踊り溶けるような食感．これまで食べたことのない果肉特性．甘味，酸味，香りのバランス型．'),
    ('king-kong', 'キングコング', 'King Kong', null, '赤', '355g', '20.4〜20.6', '★★★★★', '★★★', '★★★', '★★★★', '大果でありながら甘味が強く，スポーツドリンクのような風味がある．酸味は比較的穏やかで，濃い甘味を楽しみやすい．果肉が硬くて食感をくれるのが良い．'),
    ('super-shenron', 'スーパーシェンロン', 'Super Shenron', null, '赤', '293g', '14.6', '★', '★', '★★', '★', '赤肉種としてはやや味が薄くさっぱりとしていた．'),
    ('sophia-red', 'ソフィアレッド', 'Sophia Red', null, '赤', '276g', '18.7', '★★★', '★★★', '★★★★★', '★★★', '赤肉種らしいコクと香りをもち，甘味と酸味のバランスがよい．期待してる赤肉ドラゴンフルーツの味が詰まっている．'),
    ('pink-whisper', 'ピンクウィスパー', 'Pink Whisper', null, 'ピンク', '213g', '19.3', '★★★★★', '★★★★', '★★★★', '★★★★', '桃色果肉の美しさに加え，甘味，酸味，香りがまとまっている．かなり良質な品種．'),
    ('variegata', 'バリエガータ', 'Variegata', 'タイ由来として紹介された系統', '白', '350g', '13.9', '★', '★', '★', '★★', 'タイ由来として紹介された斑入り系統．味は比較的穏やかで，食味よりも果皮や植物体の希少な外観が強く印象に残る．若干スイカのような後味を感じる．'),
    ('white-sapphire', 'ホワイトサファイア', 'White Sapphire', null, '白', '158g', '16.6', '★★', '★★', '★', '★★', '甘味は突出して強くないが，軽い酸味があり，上品で食べやすい白肉種．'),
    ('bahamut', 'バハムート', 'Bahamut', null, '赤', '560g', '19.6', '★★★★', '★★★★', '★★★', '★★★★', '赤肉系らしい濃い果肉色と，はっきりした甘味が特徴．赤色のドラゴンフルーツを裏切らないような味わい．'),
    ('connie-mayer', 'コニーマイヤー', 'Connie Mayer', null, '白〜透明', '238g', '19.9〜20.0', '★★★★★', '★★★★★', '★★★★★', '★★★★★', '果皮が緑っぽくて白肉の縁がピンクでおしゃれ．単なる甘さだけでなく，花やバラ，キウイなどを思わせる芳香があり，一般的な白肉種の印象を覆す．'),
    ('great-red', 'グレートレッド', 'Great Red', null, '赤', '未確認', '17.4〜18.1', '★★★', '★★★', '★★★', '★★★★', '強烈な甘さではないが，甘味は十分．後味がかなり美味しい．'),
    ('pearl-white', 'パールホワイト', 'Pearl White', null, '白', '未確認', '16.6〜17.1', '★★★', '★★★★★', '★★', '★★★', '甘味は比較的控えめだが，キリッとした酸味があり，さらにみずみずしく清涼感がある．軽快な白肉タイプ．'),
    ('bruni', 'ブルーニー', 'Bruni', null, '白〜透明', '81.4g', '20.6', '★★★★★', '★★★★★', '★★★★★', '★★★★★', 'コニーマイヤーに似てかなり美味しい．甘味，酸味，風味が一級品．かなりおすすめな品種．'),
    ('yellow-pitaya', 'イエローピタヤ', 'Yellow Pitaya', null, '白〜透明', '163g', '19.6〜19.8', '★★★★★', '★★★', '★★★★★', '★★★★★', 'はちみつレモンのような風味と強い甘み．ゼリーのようなプルプルの果肉．水飴をとかしてゼリーの中に練り込んだようなしつこい甘さがある（良い意味で）．')
)
insert into public.cultivars (
  fruit_id,
  name_ja,
  name_en,
  slug,
  origin,
  description,
  fruit_size,
  sugar_content,
  sweetness,
  acidity,
  overall_rating,
  taste,
  aroma,
  kenyu_comment,
  public_notes,
  private_notes,
  is_public,
  is_for_sale
)
select
  (select id from public.fruits where slug = 'dragon-fruit'),
  source.name_ja,
  source.name_en,
  source.slug,
  source.origin,
  format('%sはドラゴンフルーツの品種．果肉色は%s．', source.name_ja, source.flesh_color),
  source.fruit_size,
  format('%s°Brix（数個体のみ計測）', source.brix),
  source.sweetness_rating,
  source.acidity_rating,
  source.overall_rating,
  null,
  format('香り%s．', source.aroma_rating),
  source.tasting_comment,
  '出典: けんゆー「ドラゴンフルーツ記録」（2026年8月）．糖度は数個体のみ計測．甘味・酸味・香り・総合評価は筆者による5段階評価．',
  '作業元: ドラゴンフルーツ記録.numbers（2026-08-03）',
  true,
  false
from source
on conflict (fruit_id, slug) do nothing;

-- 既存品種には今回の記録だけを追記し，既存の説明・原産地・果実サイズ・コメント等は変更しない．
with existing_source (
  slug,
  brix,
  sweetness_rating,
  acidity_rating,
  aroma_rating,
  overall_rating,
  tasting_comment
) as (
  values
    ('Daikou', '15〜20', '★★★', '★★★', '★★★', '★★★', '台湾で現在大流行り中の大型赤系品種，人工授粉が不要とされ，安定生産できる．こちらも美味しいのは美味しい．果汁が多く，食べ応えがある．沖縄県のレッド系に近い味わい'),
    ('Chura-boshi-Queen', '18.8', '★★★★★', '★★★', '★★★★', '★★★★', '甘みが強くさらに果汁もある．かなり高評価．スポーツドリンクや桃のような風味がありかなり美味しかった．')
),
target as (
  select
    cultivars.id,
    cultivars.taste,
    cultivars.aroma,
    existing_source.*
  from public.cultivars
  join public.fruits on fruits.id = cultivars.fruit_id
  join existing_source on lower(existing_source.slug) = lower(cultivars.slug)
  where fruits.slug = 'dragon-fruit'
)
update public.cultivars as cultivars
set
  sugar_content = format('%s°Brix（数個体のみ計測）', target.brix),
  sweetness = target.sweetness_rating,
  acidity = target.acidity_rating,
  overall_rating = target.overall_rating,
  taste = case
    when coalesce(cultivars.taste, '') like '%（出典: けんゆー「ドラゴンフルーツ記録」）%'
      then cultivars.taste
    else concat_ws(
      E'\n\n',
      nullif(cultivars.taste, ''),
      format(
        '【けんゆー実食記録 2026年8月】%s（出典: けんゆー「ドラゴンフルーツ記録」）',
        target.tasting_comment
      )
    )
  end,
  aroma = case
    when coalesce(cultivars.aroma, '') like '%【けんゆー実食評価 2026年8月】%'
      then cultivars.aroma
    else concat_ws(
      E'\n',
      nullif(cultivars.aroma, ''),
      format('【けんゆー実食評価 2026年8月】香り%s．', target.aroma_rating)
    )
  end,
  updated_at = now()
from target
where cultivars.id = target.id;

commit;

select
  cultivars.name_ja,
  cultivars.slug,
  cultivars.fruit_size,
  cultivars.sugar_content,
  cultivars.sweetness,
  cultivars.acidity,
  cultivars.overall_rating,
  cultivars.taste,
  cultivars.aroma,
  cultivars.is_public
from public.cultivars as cultivars
join public.fruits as fruits on fruits.id = cultivars.fruit_id
where fruits.slug = 'dragon-fruit'
order by cultivars.name_ja;
