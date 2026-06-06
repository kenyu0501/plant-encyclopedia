begin;

with mango as (
  select id
  from public.fruits
  where slug = 'mango'
  limit 1
),
source_data (
  slug,
  name_ja_aliases,
  name_en_aliases,
  description,
  fruit_size,
  taste,
  texture,
  aroma,
  harvest_season,
  tree_vigor,
  difficulty,
  okinawa_suitability,
  container_suitability,
  beginner_suitability,
  kenyu_comment,
  source_note
) as (
  values
    (
      'alphonso',
      array['アルフォンソ']::text[],
      array['Alphonso', 'Appus', 'Badami', 'Haphus']::text[],
      'アルフォンソはインドを代表する高品質マンゴーです．The Mangoでは，225〜325g程度の中小玉，黄色果皮，低繊維で特有香のある果肉，優れた食味を持ち，インド国内外で高値で扱われる品種として説明されています．一方で，結実は不規則になりやすく，地域によって収量が安定しにくい点も重要です．',
      '225〜325g程度．中小玉．',
      '甘味が強く，特有香があり，食味評価が高い．',
      '低繊維で，しっかり〜やわらかい果肉．',
      'アルフォンソらしい特有香が強い．',
      '中生〜やや晩生の目安．',
      '樹はやや大きく，丸く密な樹冠になりやすい．',
      '結実が不規則になりやすく，安定着果の観察が必要．',
      '沖縄では香りと濃厚な食味を狙える可能性があります．ただし湿度が高い年の病害，開花・着果の安定性，収穫適期を丁寧に記録したい品種です．',
      '鉢では樹勢を抑えつつ，開花枝を作る管理が必要です．',
      '食味は非常に魅力的ですが，安定収穫は中級者向けです．',
      '香りと食味の基準品種として残したいマンゴーです．沖縄では糖度だけでなく，香りの立ち方と結実の安定性を記録したいです．',
      '出典: The Mango: Botany，Production and Uses，Chapter 3 Important Mango Cultivars and their Descriptors，Knight，Campbell and Maguire．'
    ),
    (
      'kent',
      array['ケント']::text[],
      array['Kent']::text[],
      'ケントはHaden×Brooks系統のフロリダ品種です．The Mangoでは，600〜750g程度の大果，緑黄色地に赤みが入る果皮，低繊維で濃い黄色〜橙黄色の果肉，豊かな甘味と香り，優れた食味を持つ品種として説明されています．晩生で，貯蔵中の病害や細菌性黒斑病への弱さが課題です．',
      '600〜750g程度．大玉．',
      '甘味があり，豊かな風味．',
      '低繊維で，しっかりしつつ溶けるようなジューシーな肉質．',
      '心地よい香り．',
      '中晩生〜晩生．',
      '樹は大きく強健で，密な直立樹冠になりやすい．',
      '隔年結果の傾向があり，貯蔵病害や細菌性黒斑病に注意．',
      '沖縄では大果・晩生の高品質候補です．湿度の高い時期の病害，樹上保持，台風前後の管理が重要になります．',
      '鉢では大果の負担が大きいため，着果数を絞って栽培記録を取りたいです．',
      '品質は魅力的ですが，病害と樹勢管理を考えると中級者向けです．',
      '味は非常に魅力的です．沖縄では雨と病害の年変動にどこまで耐えられるかを見たい品種です．',
      '出典: The Mango: Botany，Production and Uses，Chapter 3 Important Mango Cultivars and their Descriptors，Knight，Campbell and Maguire．'
    ),
    (
      'ataulfo',
      array['アタウルフォ', 'アタウルフォー']::text[],
      array['Ataulfo', 'Champagne']::text[],
      'アタウルフォはメキシコ・チアパス州タパチュラ由来の多胚性品種で，北米市場ではChampagne Mangoとしても流通します．The Mangoでは，200〜300g程度の小果，細長い黄色果，甘味にわずかな酸味を持ち，果肉はしっかりして輸送性に優れる品種として説明されています．',
      '200〜300g程度．小ぶりで細長い．',
      '甘味があり，わずかな酸味が食味を締める．',
      'しっかりした果肉で，輸送に耐えやすい．',
      '穏やか．',
      '早生〜中生．',
      '樹は強健で直立気味．生産性は中程度．',
      '炭疽病には中程度の抵抗性があるとされるが，環境適応は広くない．',
      '沖縄では黄色小果系として面白い候補です．雨・湿度の中で果皮障害と病害がどう出るかを見たい品種です．',
      '鉢では小果を活かして試しやすい可能性がありますが，直立性を活かした枝作りが必要です．',
      '黄色系を比較したい人には候補になります．',
      '日本ではまだ馴染みが薄いですが，小果で食べやすく，追熟・輸送性も含めて比較したい品種です．',
      '出典: The Mango: Botany，Production and Uses，Chapter 3 Important Mango Cultivars and their Descriptors，Knight，Campbell and Maguire．'
    ),
    (
      'chausa',
      array['チョウサ', 'チャウサ', 'チョーサ']::text[],
      array['Chausa', 'Chaunsa', 'Samar Bahisht Chausa']::text[],
      'チョウサはインドの有名品種で，Samar Bahisht Chausaとも呼ばれます．The Mangoでは，完熟時に黄色〜黄褐色となり，果肉はやわらかく多汁で，とても甘く，豊かな香りと優れた食味を持つ晩生品種として説明されています．一方で，収量は軽めになりやすい品種です．',
      '中玉の目安．',
      '非常に甘く，香りが豊か．',
      'やわらかく多汁で，皮近くに細い繊維が出ることがある．',
      '豊かで魅力的な香り．',
      '晩生．',
      '樹は高く広がりやすい．',
      '良食味だが軽産になりやすく，樹勢管理と着果確認が必要．',
      '沖縄では晩生インド系として食味を見たい品種です．湿度の高い時期の病害と，台風期の果実保持が課題になります．',
      '鉢では樹勢を抑えにくい可能性があり，地植え向きです．',
      '食味重視の中級者向けです．',
      '強い甘味と香りを沖縄で出せるか，比較栽培したい品種です．',
      '出典: The Mango: Botany，Production and Uses，Chapter 3 Important Mango Cultivars and their Descriptors，Knight，Campbell and Maguire．'
    ),
    (
      'goleck',
      array['ゴレック', 'ゴレク']::text[],
      array['Golek', 'Goleck']::text[],
      'ゴレックはインドネシア由来の多胚性品種です．The Mangoでは，200〜365g程度の小〜中果，緑黄色に橙色が乗る細長い果実で，果肉は深黄色，甘味はあるものの繊維が多く，食味評価は高級品種ほどではないと説明されています．中生で，東南アジア系の比較に使いやすい品種です．',
      '200〜365g程度．小〜中玉．',
      '甘味はあるが，やや淡泊に感じることがある．',
      '繊維が多めで，果肉はやわらかく多汁．',
      '穏やか．',
      '中生．',
      '樹は中程度の樹勢で，直立気味の開いた樹冠．',
      '多胚性．繊維量と果実品質の評価が重要．',
      '沖縄では東南アジア系の比較品種として，繊維の出方，糖度，樹勢を記録したい品種です．',
      '鉢では樹勢を見ながら，果実数を絞って食味評価したいです．',
      '食味よりも比較・観察向きの品種です．',
      '繊維が気になる可能性がありますが，系統比較としては面白い品種です．',
      '出典: The Mango: Botany，Production and Uses，Chapter 3 Important Mango Cultivars and their Descriptors，Knight，Campbell and Maguire．'
    ),
    (
      'haden',
      array['ハデン']::text[],
      array['Haden']::text[],
      'ハデンは1910年頃に導入された最初期の重要なフロリダ系マンゴーで，Mulgoba×Turpentine由来とされます．The Mangoでは，510〜680g程度の大果，黄色地に濃赤色の着色，濃黄色で甘く香りのよい果肉を持つ品種として説明されています．多くのフロリダ系品種の親として育種史上きわめて重要です．',
      '510〜680g程度．大玉．',
      '甘味があり，豊かな風味．',
      '果肉はしっかり多汁で，繊維はやや多め．',
      '心地よい香り．',
      '早生〜中生．',
      '樹は強健で，大きく広がる樹冠．',
      '結実は不規則になることがあり，現代品種の親としての比較価値が高い．',
      '沖縄では品種系譜を理解する基準品種です．食味だけでなく，赤色系品種の親としての性質を見たい品種です．',
      '鉢では強樹勢で大きくなりやすいため，観察用・系譜比較向きです．',
      '初心者向けというより，品種理解のために残したい品種です．',
      'アーウィンやトミーアトキンスなどの背景を理解するうえで重要な基準品種です．',
      '出典: The Mango: Botany，Production and Uses，Chapter 3 Important Mango Cultivars and their Descriptors，Knight，Campbell and Maguire．'
    ),
    (
      'kyo-savoy',
      array['キヨ サワイ', 'キヨサワイ']::text[],
      array['Kyo Savoy', 'Keow Savoey', 'Keo Savoy']::text[],
      'キヨサワイはタイ由来の多胚性品種で，未熟果利用でも知られます．The Mangoでは，230〜340g程度の細長い果実で，完熟前は緑色，熟すと緑黄色となり，果肉は繊維がなく，やや硬めで非常に甘い一方，完熟果の食味は淡泊に感じられることがあると説明されています．',
      '230〜340g程度．細長い中玉．',
      '非常に甘いが，完熟果では淡泊に感じることがある．',
      '繊維がなく，やや硬めで多汁すぎない．',
      '穏やかで心地よい香り．',
      '中生の目安．',
      '樹は大きく強健で，開いた長枝を作りやすい．',
      '多胚性．未熟果利用と完熟果利用の両方で評価したい．',
      '沖縄では青マンゴー利用も含めて面白い品種です．完熟果だけでなく，未熟果の食味や加工適性も記録したいです．',
      '鉢では長枝が出やすいため，早めに枝を整理したいです．',
      '用途を決めて育てると面白い品種です．',
      '完熟果だけで判断せず，青果利用も含めて評価したいタイ系品種です．',
      '出典: The Mango: Botany，Production and Uses，Chapter 3 Important Mango Cultivars and their Descriptors，Knight，Campbell and Maguire．'
    ),
    (
      'madame-francis',
      array['マダム フランシス', 'マダムフランシス']::text[],
      array['Madame Francis']::text[],
      'マダムフランシスはハイチ由来の品種で，北米市場へ長期間出荷される実用品種です．The Mangoでは，370〜520g程度の細長い黄色果で，果肉はやわらかく多汁，やや繊維があり，濃厚でスパイシーな甘味と香りを持つと説明されています．早生〜中生で，よく実る品種です．',
      '370〜520g程度．中玉〜大玉．',
      '濃厚でスパイシーな甘味．',
      'やわらかく多汁で，中程度の繊維がある．',
      '心地よい香り．',
      '早生〜中生．',
      '樹は中程度の樹勢で，開いた樹冠．',
      'よく実るが，繊維と追熟具合で食味が変わりやすい．',
      '沖縄では黄色系の濃厚食味として比較したい品種です．果皮色だけでなく香りと軟化で食べ頃を判断したいです．',
      '鉢では着果数を絞り，樹勢を保って果実品質を見たいです．',
      '香りのある黄色系を試したい人に向きます．',
      '繊維が少し出る可能性も含めて，食味の個性を記録したい品種です．',
      '出典: The Mango: Botany，Production and Uses，Chapter 3 Important Mango Cultivars and their Descriptors，Knight，Campbell and Maguire．'
    ),
    (
      'manila',
      array['マニラ']::text[],
      array['Manila']::text[],
      'マニラはメキシコで長く人気のある多胚性品種です．The Mangoでは，180〜260g程度の細長い黄色果で，果肉は深黄色，甘くリッチでスパイシーな味と香りがあり，品質は良好〜非常に良いと説明されています．早めの中生で，比較的安定して収穫しやすい品種です．',
      '180〜260g程度．小ぶりで細長い．',
      '甘くリッチで，スパイシーさがある．',
      '中程度にしっかりした果肉で，繊維は少〜多まで幅がある．',
      '心地よい香り．',
      '早めの中生．',
      '樹は大きく強健で，直立気味の開いた樹冠．',
      '多胚性．メキシコで長く人気のある実用品種．',
      '沖縄では小果黄色系として，比較的扱いやすい可能性があります．甘味と香り，繊維の出方を記録したいです．',
      '鉢では小果を活かして試しやすい可能性がありますが，樹勢は早めに抑えたいです．',
      '小果系を比較したい人に向きます．',
      'メキシコの伝統的な黄色系として，アタウルフォなどと比較したい品種です．',
      '出典: The Mango: Botany，Production and Uses，Chapter 3 Important Mango Cultivars and their Descriptors，Knight，Campbell and Maguire．'
    ),
    (
      'neelum',
      array['ニーラム', 'ニーラムレイト']::text[],
      array['Neelum', 'Neelumlate', 'Neelum Late']::text[],
      'ニーラムはインドの晩生品種で，The Mangoでは，230〜300g程度の黄色果，繊維のないやわらかく溶けるような果肉，穏やかな甘味と非常に良い香りを持ち，晩生で多収になりやすい品種として説明されています．図鑑のニーラムレイトは，ニーラム系の晩生品種として比較したい品種です．',
      '230〜300g程度．小〜中玉．',
      '穏やかな甘味で，香りがよい．',
      '繊維がなく，やわらかく溶けるような多汁の肉質．',
      '非常に心地よい香り．',
      '晩生．',
      '樹は中程度の樹勢で，小さくまとまる樹冠．',
      '晩生で多収になりやすいが，地域での着果安定性を見たい．',
      '沖縄では晩生黄色系として，台風期後の収穫可能性と香りを見たい品種です．',
      '鉢では比較的小さく作れる可能性がありますが，晩生果の樹上保持に注意したいです．',
      '香りを重視する人に面白い品種です．',
      'ニーラムレイトとして登録されている場合も，香りと晩生性を中心に記録したいです．',
      '出典: The Mango: Botany，Production and Uses，Chapter 3 Important Mango Cultivars and their Descriptors，Knight，Campbell and Maguire．'
    ),
    (
      'ok-rong',
      array['オクルン', 'オクロン']::text[],
      array['Okrung', 'Ok Rong']::text[],
      'オクルンはタイの多胚性品種です．The Mangoでは，160〜240g程度の小果，緑〜緑黄色の細長い果実で，果肉はやわらかく多汁，繊維は多め，とても甘く香りがある品種として説明されています．中生で多収になりやすく，一年に複数回実ることもあります．',
      '160〜240g程度．小果．',
      'とても甘く，穏やかな香りがある．',
      'やわらかく多汁だが，繊維は多め．',
      '心地よい香り．',
      '中生．条件により複数回収穫の可能性．',
      '樹は中程度の樹勢で，直立気味の密な樹冠．',
      '多胚性．多収性と繊維量の評価が重要．',
      '沖縄では小果多収系として面白い候補です．甘さは魅力ですが，繊維の多さをどう評価するか見たい品種です．',
      '鉢では小果を活かしやすい可能性があります．',
      '小果で多収を狙うなら候補になります．',
      '完熟果だけでなく，タイ系の利用方法も含めて見たい品種です．',
      '出典: The Mango: Botany，Production and Uses，Chapter 3 Important Mango Cultivars and their Descriptors，Knight，Campbell and Maguire．'
    ),
    (
      'tahar',
      array['タハール']::text[],
      array['Tahar']::text[],
      'タハールはイスラエルの品種で，The Mangoでは，360〜520g程度の中〜大果，黄色地に濃赤色の着色が入り，果肉はやわらかく多汁で繊維が少なく，香りは強めだが好みが分かれることがある品種として説明されています．中晩生でイスラエルではよく実ります．',
      '360〜520g程度．中〜大玉．',
      '穏やかな甘味で，やや淡泊に感じることがある．',
      'やわらかく多汁で，繊維は少なめ．',
      '強めで好みが分かれる香り．',
      '中晩生．',
      '樹は強健な中型で，直立気味の密な樹冠．',
      'よく実る地域がある一方，香りと食味の好みが分かれやすい．',
      '沖縄ではイスラエル系の比較品種として，香り，着色，病害の出方を見たい品種です．',
      '鉢では樹勢を見ながら枝を整理し，着果数を絞りたいです．',
      '食味の好みが分かれるため，比較用に向きます．',
      '香りが個性的な品種として，試食コメントを残したいです．',
      '出典: The Mango: Botany，Production and Uses，Chapter 3 Important Mango Cultivars and their Descriptors，Knight，Campbell and Maguire．'
    ),
    (
      'totapuri',
      array['トタプリ', 'トータプリ']::text[],
      array['Totapuri', 'Bangalora', 'Sandersha']::text[],
      'トタプリはインドの大果品種で，BangaloraやSandershaとも呼ばれます．The Mangoでは，800〜1100g程度の非常に大きい果実，くちばし状の先端，硬めで中程度に多汁の果肉を持つ一方，香りと食味は生食最高級品種ほどではないと説明されています．晩生寄りで多収・規則的に実りますが，成熟期の大雨で裂果しやすい点が重要です．',
      '800〜1100g程度．かなり大玉．',
      '生食最高級というより，加工・比較向きの実用品種．',
      '硬めで中程度に多汁．',
      '弱めで，やや癖を感じることがある．',
      '中晩生．',
      '樹は中型で強健，開いた樹冠．',
      '多収・規則的だが，成熟期の大雨で裂果しやすい．AndersonやBrooks，Kentの系譜理解にも重要．',
      '沖縄では大雨と台風期の裂果リスクが大きな観察点です．加工・系譜比較の視点で見ると面白い品種です．',
      '鉢では果実が大きすぎるため，着果数をかなり制限する必要があります．',
      '初心者向けではなく，品種比較・系譜理解向きです．',
      'Kent系統の背景を理解する上で重要です．食味だけでなく，裂果と収量性を見たい品種です．',
      '出典: The Mango: Botany，Production and Uses，Chapter 3 Important Mango Cultivars and their Descriptors，Knight，Campbell and Maguire．'
    ),
    (
      'turpentine',
      array['ターペンタイン']::text[],
      array['Turpentine']::text[],
      'ターペンタインは西インド諸島系の強健な品種・系統で，Hadenの親にも関わる重要な系譜品種です．The Mangoでは，樹は大きく広がり，果実は小さめで香りに樹脂香・ターペンタイン香を持つ系統として扱われます．生食高品質品種というより，台木・系譜・強健性の理解に重要です．',
      '小果の目安．JIRCAS調査値では175g前後．',
      '甘味は控えめで，樹脂香を感じることがある．',
      '繊維や香りの癖を確認したい．',
      'ターペンタイン香・樹脂香が出ることがある．',
      '中生の目安．',
      '樹は強健で，大きく広がる樹冠．',
      'Hadenの親に関わる系譜品種．生食品質より強健性・台木性・育種史を見たい．',
      '沖縄では食味品種としてではなく，系譜と強健性を理解する比較品種として重要です．',
      '鉢では樹勢が出やすく，観察用に抑えて作る必要があります．',
      '初心者向けの生食品種ではありません．',
      'Haden系統を理解するうえで外せない背景品種です．図鑑では食味より育種史の説明を重視したいです．',
      '出典: The Mango: Botany，Production and Uses，Chapter 3 Important Mango Cultivars and their Descriptors，Knight，Campbell and Maguire．'
    )
),
matched as (
  select distinct on (c.id)
    c.id,
    source_data.*
  from source_data
  cross join mango
  join public.cultivars c
    on c.fruit_id = mango.id
   and (
     lower(c.slug) = lower(source_data.slug)
     or lower(coalesce(c.name_en, '')) = any (
       select lower(alias_value)
       from unnest(source_data.name_en_aliases) as alias_table(alias_value)
     )
     or c.name_ja = any (source_data.name_ja_aliases)
   )
  order by c.id
),
updates as (
  update public.cultivars c
  set
    description = matched.description,
    fruit_size = matched.fruit_size,
    taste = matched.taste,
    texture = matched.texture,
    aroma = matched.aroma,
    harvest_season = matched.harvest_season,
    tree_vigor = matched.tree_vigor,
    difficulty = matched.difficulty,
    okinawa_suitability = matched.okinawa_suitability,
    container_suitability = matched.container_suitability,
    beginner_suitability = matched.beginner_suitability,
    kenyu_comment = matched.kenyu_comment,
    public_notes = case
      when coalesce(c.public_notes, '') like '%The Mango: Botany，Production and Uses%'
        then c.public_notes
      else concat_ws(E'\n', nullif(c.public_notes, ''), matched.source_note)
    end,
    updated_at = now()
  from matched
  where c.id = matched.id
  returning c.name_ja, c.name_en, c.slug
)
select
  count(*) as updated_mango_cultivars,
  string_agg(name_ja || ' (' || slug || ')', ' / ' order by name_ja) as updated_items
from updates;

commit;
