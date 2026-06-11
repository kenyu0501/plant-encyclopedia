-- ホワイトサポテ品種に Julia F. Morton / Fruits of Warm Climates の情報を追記します．
-- 既存のけんちゃん記事由来の説明は消さず，品種ごとの果形，果皮色，食味，収穫期，樹勢を補足します．
-- 出典: https://www.growables.org/information/TropicalFruit/SapoteWJuliaMorton.htm

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
  flowering_type,
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
      'coleman',
      'コールマン',
      'Coleman',
      null,
      'Julia Mortonの整理では，カリフォルニアで早くから名付けられた品種の一つです．果実は扁円形でやや裂片があり，果頂部に溝が入り，果皮は黄緑色です．',
      '幅約7.5cmまで．扁円形でやや裂片がある．',
      '糖度22%の記載があり，食味は良いが樹脂様の風味が出ることがあります．',
      '果肉は甘いが，樹脂様のクセを確認したいタイプ．',
      '晩秋から夏まで熟す記載があります．',
      'やや矮性．小葉は小さく，ねじれやすい．',
      '増殖が難しい品種として記載されています．接ぎ木・活着を丁寧に見たいです．',
      '小型樹として面白い一方，樹脂様の風味がどの程度出るかを記録したい品種です．'
    ),
    (
      'dade',
      'デイド',
      'Dade',
      null,
      'フロリダ州ホームステッドの農業研究教育センターで選抜された品種です．1935年に植えられ，1939年に結実した記録があります．果実は丸く，薄い黄金黄色の果皮に緑色を帯びます．',
      '丸形．4〜5個の種子を持つ記載があります．',
      '苦味のない良好な食味として記載されています．',
      '苦味が少ない食味を期待したいタイプ．',
      '6〜7月に熟す記載があります．',
      '低く広がる樹形．小葉は滑らか．',
      '低く広がる樹形なので，家庭園では樹冠管理しやすい可能性があります．',
      '沖縄で梅雨明けから夏に熟すか，苦味の少なさが出るかを見たい品種です．'
    ),
    (
      'gillespie',
      'ギレスピー',
      'Gillespie',
      null,
      'カリフォルニア由来の品種です．果実は丸形で幅約7.5cm，果皮は淡緑色に赤褐色の頬が入り，やや粗く，かなり丈夫な皮を持つとされています．',
      '丸形で幅約7.5cm．',
      '白色果肉で，非常に良い食味と記載されています．',
      '白色果肉．食味重視で比較したい．',
      null,
      '豊産性のある樹として記載されています．',
      '豊産性が期待される一方，果皮の粗さや追熟時の傷み方を観察したいです．',
      '豊産性と食味を両方見たい品種です．'
    ),
    (
      'golden',
      'ゴールデン',
      'Golden / Max Golden',
      null,
      'GoldenまたはMax Goldenとして記載されるウーリーリーフ系の品種です．果実は円錐形で果頂部がくぼみ，黄緑色のやや丈夫な果皮を持ちます．',
      '幅約11.25cmまで．円錐形で果頂部がくぼむ．',
      '強い風味があり，やや苦味を伴う記載があります．種子は少ないとされています．',
      '強い風味と苦味の有無を確認したいタイプ．',
      null,
      'ウーリーリーフ系として扱われます．',
      '苦味が出やすい可能性があるため，完熟度と追熟条件を記録したいです．',
      '大果性と強い風味を見たい品種です．'
    ),
    (
      'harvey',
      'ハーベイ',
      'Harvey',
      null,
      'カリフォルニア由来の品種です．果実は丸形で幅約9cm，滑らかな黄緑色の果皮に明るいオレンジ色の頬が入ります．果肉はクリーム色から淡黄色です．',
      '丸形で幅約9cm．',
      '食味は最高級ではないと記載されています．',
      'クリーム色から淡黄色の果肉．',
      null,
      '豊産性のある樹として記載されています．',
      '豊産性は魅力ですが，食味評価は他品種と比較したいです．',
      '収量重視で比較する候補です．'
    ),
    (
      'maltby',
      'モルツビー',
      'Maltby / Nancy Maltby',
      'タイプ3',
      'MaltbyまたはNancy Maltbyとして記載されるカリフォルニア由来の品種です．果実は丸形で浅い溝があり，果頂部は鈍く尖り，基部はやや細くなります．',
      '大果．丸形で浅い溝があり，基部がやや細くなる．',
      '食味は良いが，わずかに苦味が出る記載があります．',
      '熟度により苦味の出方を確認したいタイプ．',
      null,
      'よく結実する樹として記載されています．',
      '既存情報ではタイプ3で自家結実しやすい候補です．Morton資料ではよく結実する品種としても扱われます．',
      '一本での結実性，苦味の少なさ，枝が低くなる樹形を重点的に記録したい品種です．'
    ),
    (
      'parroquia',
      'パロキア',
      'Parroquia',
      null,
      'カリフォルニア由来の品種です．果実は楕円形で，幅約6.25cm，長さ約7.5cm，黄緑色で薄く滑らかな果皮を持ちます．',
      '楕円形．幅約6.25cm，長さ約7.5cm．',
      '象牙色の果肉で，非常に良い食味と記載されています．',
      '象牙色の果肉．食味重視で比較したい．',
      null,
      '比較的豊産性がある品種として記載されています．',
      '小〜中果で食味が良い候補です．収量性と果実サイズを見たいです．',
      '食味比較用として面白い品種です．'
    ),
    (
      'pike',
      'パイク',
      'Pike',
      'タイプ1',
      'Pikeはカリフォルニアと南アフリカで規則的かつ多収に結実する品種として記載されています．果実は丸形から扁円形でやや5裂し，緑色で非常に傷みやすい果皮を持ちます．',
      '幅約10cmまで．丸形から扁円形でやや5裂する．',
      '白色から黄白色の果肉で，濃厚かつ苦味のない食味と記載されています．',
      '濃厚で苦味が少ない食味を期待したいタイプ．',
      'カリフォルニアでは春と晩夏〜秋に開花し，遅い花の果実は冬にかけて徐々に成熟する記載があります．',
      '規則的で多収に結実する記載があります．Pike実生は台木としても好まれるとされています．',
      '果皮が非常に傷みやすいため，収穫と追熟の扱いが重要です．早採りしすぎると食味が落ちる記載があります．',
      '味は魅力的ですが，収穫適期と果皮の傷みやすさを丁寧に見たい品種です．'
    ),
    (
      'smathers',
      'スマザーズ',
      'Suebelle / Hubbell / Smathers',
      'タイプ1',
      'SuebelleまたはHubbellとして記載されるカリフォルニア由来の品種です．果実は丸形で中〜小果，緑色から黄緑色の果皮を持ちます．',
      '中〜小果．丸形．',
      '糖度22%の記載があり，優れた食味とされています．',
      '甘味が強く，食味重視で見たいタイプ．',
      '春に6〜8週間開花し，真夏にも再度開花します．果実は9〜10月に熟す記載があります．',
      '早くから結実し，周年的に開花・結実する性質があると記載されています．',
      '既存のスマザーズ情報と合わせ，単為結実，種なし果，糖度，香り，開花回数を記録したいです．',
      '濃厚な甘さと結実性の両方を見たい，ホワイトサポテの重要比較品種です．'
    ),
    (
      'wilson',
      'ウィルソン',
      'Wilson',
      null,
      'カリフォルニア由来の品種です．果実は丸形から扁円形で中〜大果，滑らかで中程度の厚さの果皮を持ちます．',
      '中〜大果．丸形から扁円形．',
      '高品質で優れた食味と記載されています．',
      '食味重視で比較したい高品質タイプ．',
      '秋から冬，またはほぼ周年的に熟す記載があります．',
      '多収で，カリフォルニアでは比較的広く植えられた品種です．',
      '多収性と長い収穫期が魅力です．沖縄では開花・成熟の波を記録したいです．',
      '収穫期が長く，食味も期待できる品種として残したいです．'
    ),
    (
      'yellow',
      'イエロー',
      'Yellow',
      'タイプ1',
      'カリフォルニア由来の品種です．果実は楕円形で果頂部が尖り，溝が入り，明るい黄色で比較的丈夫な果皮を持ちます．',
      '楕円形で果頂部が尖る．明るい黄色果皮．',
      '果肉はしっかりしており，果実の日持ちが良いと記載されています．',
      'しっかりした果肉で，日持ちを確認したいタイプ．',
      'Pikeと同様に，遅い花の果実が冬にかけて成熟する記載があります．',
      'カリフォルニアで規則的かつ多収に結実する品種として記載されています．',
      '黄色くなるため収穫判断しやすい可能性があります．果皮の強さと日持ちを重点的に見たいです．',
      '見た目で熟期を判断しやすく，初心者にも比較しやすい候補です．'
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
  flowering_type,
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
  'メキシコから中央アメリカ原産，カリフォルニア・フロリダなどで選抜',
  source_data.description_note,
  source_data.fruit_size,
  source_data.taste,
  source_data.texture,
  source_data.harvest_season,
  source_data.flowering_type,
  source_data.tree_vigor,
  source_data.difficulty,
  '沖縄では排水，台風対策，開花期の観察，果実の傷みやすさを見ながら評価したい品種です．',
  '鉢栽培では樹勢と根詰まりを見ながら，水はけをよくして管理したいです．',
  null,
  source_data.kenyu_comment,
  '出典: Julia F. Morton, Fruits of Warm Climates, White Sapote. Growables掲載版 https://www.growables.org/information/TropicalFruit/SapoteWJuliaMorton.htm',
  'Morton資料から品種特徴を追記．既存のけんちゃん記事由来情報は保持．',
  true,
  false
from source_data
cross join fruit
on conflict (fruit_id, slug) do update set
  name_ja = excluded.name_ja,
  name_en = excluded.name_en,
  description = case
    when coalesce(public.cultivars.description, '') like '%Julia Morton%' then public.cultivars.description
    else concat_ws(E'\n', nullif(public.cultivars.description, ''), 'Julia Morton補足: ' || excluded.description)
  end,
  fruit_size = coalesce(nullif(public.cultivars.fruit_size, ''), excluded.fruit_size),
  taste = case
    when nullif(public.cultivars.taste, '') is null then excluded.taste
    when public.cultivars.taste like '%' || excluded.taste || '%' then public.cultivars.taste
    else concat_ws(E'\n', public.cultivars.taste, excluded.taste)
  end,
  texture = coalesce(nullif(public.cultivars.texture, ''), excluded.texture),
  harvest_season = case
    when nullif(public.cultivars.harvest_season, '') is null then excluded.harvest_season
    when excluded.harvest_season is null then public.cultivars.harvest_season
    when public.cultivars.harvest_season like '%' || excluded.harvest_season || '%' then public.cultivars.harvest_season
    else concat_ws(E'\n', public.cultivars.harvest_season, excluded.harvest_season)
  end,
  flowering_type = coalesce(public.cultivars.flowering_type, excluded.flowering_type),
  tree_vigor = case
    when nullif(public.cultivars.tree_vigor, '') is null then excluded.tree_vigor
    when excluded.tree_vigor is null then public.cultivars.tree_vigor
    when public.cultivars.tree_vigor like '%' || excluded.tree_vigor || '%' then public.cultivars.tree_vigor
    else concat_ws(E'\n', public.cultivars.tree_vigor, excluded.tree_vigor)
  end,
  difficulty = case
    when nullif(public.cultivars.difficulty, '') is null then excluded.difficulty
    when public.cultivars.difficulty like '%Morton補足%' then public.cultivars.difficulty
    else concat_ws(E'\n', public.cultivars.difficulty, 'Morton補足: ' || excluded.difficulty)
  end,
  okinawa_suitability = coalesce(nullif(public.cultivars.okinawa_suitability, ''), excluded.okinawa_suitability),
  container_suitability = coalesce(nullif(public.cultivars.container_suitability, ''), excluded.container_suitability),
  kenyu_comment = case
    when nullif(public.cultivars.kenyu_comment, '') is null then excluded.kenyu_comment
    when public.cultivars.kenyu_comment like '%' || excluded.kenyu_comment || '%' then public.cultivars.kenyu_comment
    else concat_ws(E'\n', public.cultivars.kenyu_comment, excluded.kenyu_comment)
  end,
  public_notes = case
    when coalesce(public.cultivars.public_notes, '') like '%Fruits of Warm Climates%' then public.cultivars.public_notes
    else concat_ws(E'\n', nullif(public.cultivars.public_notes, ''), excluded.public_notes)
  end,
  private_notes = concat_ws(E'\n', nullif(public.cultivars.private_notes, ''), excluded.private_notes),
  is_public = true,
  updated_at = now();

update public.fruits f
set
  description = case
    when coalesce(f.description, '') like '%Julia Morton%' then f.description
    else concat_ws(E'\n', nullif(f.description, ''), 'Julia Morton補足: 白サポテは亜熱帯果樹として扱いやすく，果実は薄い緑〜黄色系の果皮とクリーム色〜黄色系の果肉を持ち，甘味の中に苦味や樹脂様の風味が出る品種もあります．')
  end,
  cultivation_summary = case
    when coalesce(f.cultivation_summary, '') like '%20º F%' then f.cultivation_summary
    else concat_ws(E'\n', nullif(f.cultivation_summary, ''), 'Morton資料では成木がカリフォルニアで20ºF（約-6.7℃），フロリダで26ºF（約-3.3℃）に耐えた記録があり，水はけのよい土壌を好み，比較的乾燥にも耐えるとされています．')
  end,
  public_notes = case
    when coalesce(f.public_notes, '') like '%Fruits of Warm Climates%' then f.public_notes
    else concat_ws(E'\n', nullif(f.public_notes, ''), '出典: Julia F. Morton, Fruits of Warm Climates, White Sapote. Growables掲載版 https://www.growables.org/information/TropicalFruit/SapoteWJuliaMorton.htm')
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
