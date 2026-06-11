-- ホワイトサポテ品種に C. A. Schroeder「White Sapote Varieties in California」の情報を追記します．
-- 既存情報は消さず，カリフォルニアでの品種観察，果形，果皮，収穫期，樹勢，取り扱い性を補足します．
-- 出典: Journal of the American Pomological Society 掲載PDF
-- https://journal.americanpomological.org/index.php/jofaps/article/view/1618/1622

begin;

with fruit as (
  select id
  from public.fruits
  where slug = 'white-sapote'
  limit 1
),
source_data (
  slug,
  name_ja,
  name_en,
  description_note,
  fruit_size,
  taste,
  texture,
  harvest_season,
  tree_vigor,
  difficulty,
  kenyu_comment
) as (
  values
    (
      'pike',
      'パイク',
      'Pike',
      'Schroederは，Pikeをカリフォルニアで栽培される重要品種として扱い，果実は丸形〜やや扁円形で，緑色の非常にやわらかく傷みやすい果皮を持つと説明しています．家庭利用向きで，品質と結実性が評価されています．',
      '直径約8.9cmまで，重さ約10オンス（約280g）の記載があります．丸形〜やや扁円形．',
      '品質が高く，家庭利用に向く良食味品種として扱われています．',
      '果皮は非常にやわらかく傷みやすい．果肉品質は高い．',
      '秋の比較的短い時期に熟す品種として説明されています．',
      '結実性がよく，生産性と品質の両方が評価されています．',
      '果皮が傷みやすく輸送性は弱いため，収穫時の扱いと追熟管理が重要です．',
      '味は期待できますが，果皮の弱さを考えると，家庭園で丁寧に収穫して食べる品種として見たいです．'
    ),
    (
      'smathers',
      'スマザーズ',
      'Suebelle / Hubbell / Smathers',
      'SchroederはSuebelleをEncinitasで発見された実生由来の品種として紹介しています．果実は球形で表面は滑らか，目立つ模様は少なく，黄緑色の中程度の厚さの果皮を持ちます．',
      '直径約7.5cmまで．中〜小果で球形．',
      '優れた食味として記載されています．',
      '中〜小粒の種子を持ち，果皮は中程度の厚さ．',
      '多くの地域で周年的に開花・成熟する性質があると説明されています．',
      '樹は大きく直立性で，早くから結実しやすい傾向があります．',
      '周年的に開花・結実するため，沖縄では開花期と収穫期が分散する可能性があります．収穫記録を細かく残したい品種です．',
      'スマザーズとして管理している既存情報と合わせ，糖度，香り，種なし果の出方，周年的な結実性を重点的に見たい品種です．'
    ),
    (
      'wilson',
      'ウィルソン',
      'Wilson',
      'SchroederはWilsonをMonrovia由来で比較的広く植えられた品種として扱っています．果実は球形〜やや扁円形で，表面は滑らか，目立つ模様は少ないとされています．',
      '中〜大果．球形〜やや扁円形．',
      '高品質な果実として記載されています．',
      '滑らかな果皮を持つ高品質タイプ．',
      '秋〜冬に熟す重産品種として説明されています．',
      '多収性が強く，カリフォルニアで比較的広く植えられた品種です．',
      '短めの季節にまとまって熟す可能性があるため，収穫期の集中と追熟管理を見たいです．',
      '多収性と品質の両立を見たい品種です．沖縄で秋冬にどう動くかを記録したいです．'
    ),
    (
      'coleman',
      'コールマン',
      'Coleman',
      'SchroederはColemanをMonrovia由来の品種として紹介しています．果実は球形で裂片が出やすく，果頂部がややくぼみ，放射状の溝が入ります．果皮は黄緑色です．',
      '直径約7.5cmまで．球形で裂片が出やすい．',
      '果実品質は良いとされています．',
      '果頂部に溝が入り，黄緑色果皮．',
      '晩秋から夏にかけての比較的長い収穫期が記載されています．',
      '多くの条件で樹勢は強くなく，やや弱めの生育とされています．',
      '増殖が難しいとされるため，接ぎ木活着と樹勢維持を丁寧に見たいです．',
      '長い収穫期は魅力ですが，樹勢と増殖性が栽培上の見どころになりそうです．'
    ),
    (
      'yellow',
      'イエロー',
      'Yellow',
      'SchroederはYellowを，果頂部が鋭く尖る楕円形の黄果品種として説明しています．果面には果頂部から基部へ伸びる縦溝があり，果皮は黄色で比較的丈夫です．',
      '楕円形で果頂部が尖る．黄色果皮．',
      '食味は良いとされています．',
      '果肉はしっかりし，果皮は比較的丈夫．',
      '樹上でよく保持され，収穫後の日持ちもよいと説明されています．',
      '規則的に結実し，多収性がある品種として扱われています．',
      '黄色果皮で収穫判断がしやすく，果皮が丈夫で日持ちしやすい点を確認したいです．',
      '初心者向け候補として，色づき，果皮の強さ，日持ちを記録したい品種です．'
    ),
    (
      'maltby',
      'モルツビー',
      'Maltby / Nancy Maltby',
      'SchroederはMaltbyをCarlsbad由来の大果品種として紹介しています．果実は球形で果頂部が短く鈍く尖り，基部はゆるく細まり，表面は滑らかで黄緑色です．',
      '大果．球形で果頂部が短く鈍く尖る．',
      '食味は良いが，やや苦味があるとされています．',
      '滑らかな黄緑色果皮．熟度による苦味を確認したい．',
      null,
      '大果をよく結実する品種として説明されています．',
      '既存情報のタイプ3・自家結実性に加え，大果性と苦味の出方を記録したいです．',
      '一本での結実性だけでなく，大果時の味，苦味，樹形を観察したい品種です．'
    ),
    (
      'golden',
      'ゴールデン',
      'Max Golden',
      'SchroederはMax GoldenをC. tetrameria系，つまりウーリーリーフ系の品種として扱っています．果実は円錐形で，果頂部が非常に平らでややくぼむと説明されています．',
      '長さ約11.4cmまで．円錐形で果頂部が平たい．',
      '風味は強いが，冷涼地ではやや苦味が強く出ることがあるとされています．',
      '種子は少なめでやや尖る．果皮は黄緑色で中程度に丈夫．',
      null,
      'ウーリーリーフ系で，葉や若い枝の毛茸を観察したい品種です．',
      '冷涼条件で苦味が出やすい可能性があるため，沖縄での食味変化を確認したいです．',
      'ウーリーリーフ系として，C. edulis系品種との葉・花・果実品質の違いを比較したい品種です．'
    )
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
  harvest_season,
  tree_vigor,
  difficulty,
  okinawa_suitability,
  container_suitability,
  beginner_suitability,
  kenyu_comment,
  public_notes,
  private_notes,
  is_public,
  is_for_sale
)
select
  fruit.id,
  source_data.name_ja,
  source_data.name_en,
  source_data.slug,
  'カリフォルニアで選抜・栽培されたホワイトサポテ品種',
  source_data.description_note,
  source_data.fruit_size,
  source_data.taste,
  source_data.texture,
  source_data.harvest_season,
  source_data.tree_vigor,
  source_data.difficulty,
  '沖縄では排水，台風対策，開花期，収穫期，果皮の傷みやすさを見ながら評価したい品種です．',
  '鉢栽培では樹勢を見ながら剪定し，水はけと根詰まりに注意したいです．',
  null,
  source_data.kenyu_comment,
  '出典: C. A. Schroeder, White Sapote Varieties in California, Journal of the American Pomological Society. https://journal.americanpomological.org/index.php/jofaps/article/view/1618/1622',
  'Schroeder論文からカリフォルニア品種の特徴を追記．',
  true,
  false
from source_data
cross join fruit
on conflict (fruit_id, slug) do update set
  name_ja = excluded.name_ja,
  name_en = excluded.name_en,
  origin = coalesce(nullif(public.cultivars.origin, ''), excluded.origin),
  description = case
    when coalesce(public.cultivars.description, '') like '%Schroeder補足%' then public.cultivars.description
    else concat_ws(E'\n', nullif(public.cultivars.description, ''), 'Schroeder補足: ' || excluded.description)
  end,
  fruit_size = case
    when nullif(public.cultivars.fruit_size, '') is null then excluded.fruit_size
    when public.cultivars.fruit_size like '%' || excluded.fruit_size || '%' then public.cultivars.fruit_size
    else concat_ws(E'\n', public.cultivars.fruit_size, excluded.fruit_size)
  end,
  taste = case
    when nullif(public.cultivars.taste, '') is null then excluded.taste
    when public.cultivars.taste like '%' || excluded.taste || '%' then public.cultivars.taste
    else concat_ws(E'\n', public.cultivars.taste, excluded.taste)
  end,
  texture = case
    when nullif(public.cultivars.texture, '') is null then excluded.texture
    when excluded.texture is null then public.cultivars.texture
    when public.cultivars.texture like '%' || excluded.texture || '%' then public.cultivars.texture
    else concat_ws(E'\n', public.cultivars.texture, excluded.texture)
  end,
  harvest_season = case
    when nullif(public.cultivars.harvest_season, '') is null then excluded.harvest_season
    when excluded.harvest_season is null then public.cultivars.harvest_season
    when public.cultivars.harvest_season like '%' || excluded.harvest_season || '%' then public.cultivars.harvest_season
    else concat_ws(E'\n', public.cultivars.harvest_season, excluded.harvest_season)
  end,
  tree_vigor = case
    when nullif(public.cultivars.tree_vigor, '') is null then excluded.tree_vigor
    when excluded.tree_vigor is null then public.cultivars.tree_vigor
    when public.cultivars.tree_vigor like '%' || excluded.tree_vigor || '%' then public.cultivars.tree_vigor
    else concat_ws(E'\n', public.cultivars.tree_vigor, excluded.tree_vigor)
  end,
  difficulty = case
    when nullif(public.cultivars.difficulty, '') is null then excluded.difficulty
    when public.cultivars.difficulty like '%Schroeder補足%' then public.cultivars.difficulty
    else concat_ws(E'\n', public.cultivars.difficulty, 'Schroeder補足: ' || excluded.difficulty)
  end,
  okinawa_suitability = coalesce(nullif(public.cultivars.okinawa_suitability, ''), excluded.okinawa_suitability),
  container_suitability = coalesce(nullif(public.cultivars.container_suitability, ''), excluded.container_suitability),
  kenyu_comment = case
    when nullif(public.cultivars.kenyu_comment, '') is null then excluded.kenyu_comment
    when public.cultivars.kenyu_comment like '%' || excluded.kenyu_comment || '%' then public.cultivars.kenyu_comment
    else concat_ws(E'\n', public.cultivars.kenyu_comment, excluded.kenyu_comment)
  end,
  public_notes = case
    when coalesce(public.cultivars.public_notes, '') like '%White Sapote Varieties in California%' then public.cultivars.public_notes
    else concat_ws(E'\n', nullif(public.cultivars.public_notes, ''), excluded.public_notes)
  end,
  private_notes = concat_ws(E'\n', nullif(public.cultivars.private_notes, ''), excluded.private_notes),
  is_public = true,
  updated_at = now();

update public.fruits f
set
  description = case
    when coalesce(f.description, '') like '%Schroeder補足%' then f.description
    else concat_ws(E'\n', nullif(f.description, ''), 'Schroeder補足: カリフォルニアではホワイトサポテ品種を，周年的に開花・結実するタイプと季節的にまとまって結実するタイプ，また黄果皮系と緑果皮系に分けて整理できます．黄色果皮の品種は比較的果皮が丈夫で扱いやすい傾向があります．')
  end,
  public_notes = case
    when coalesce(f.public_notes, '') like '%White Sapote Varieties in California%' then f.public_notes
    else concat_ws(E'\n', nullif(f.public_notes, ''), '出典: C. A. Schroeder, White Sapote Varieties in California, Journal of the American Pomological Society. https://journal.americanpomological.org/index.php/jofaps/article/view/1618/1622')
  end,
  updated_at = now()
where f.slug = 'white-sapote';

select
  f.name_ja as fruit_name,
  count(c.id) as white_sapote_cultivar_count
from public.fruits f
left join public.cultivars c on c.fruit_id = f.id
where f.slug = 'white-sapote'
group by f.name_ja;

commit;
