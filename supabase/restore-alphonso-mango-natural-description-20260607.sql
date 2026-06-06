begin;

with mango as (
  select id
  from public.fruits
  where slug = 'mango'
  limit 1
),
matched as (
  select c.id
  from public.cultivars c
  cross join mango
  where c.fruit_id = mango.id
    and (
      lower(c.slug) = 'alphonso'
      or c.name_ja = 'アルフォンソ'
      or lower(coalesce(c.name_en, '')) = 'alphonso'
    )
)
update public.cultivars c
set
  description = 'アルフォンソは，インドを代表する高品質マンゴーとして世界的に知られる品種です．果実は中小玉で，黄色い果皮と濃い黄色の果肉を持ち，強い甘味，独特の芳香，低繊維でなめらかな食感が魅力です．完熟時の香りと余韻がはっきりしており，食味を重視してマンゴーを比較するときの基準品種の一つになります．',
  fruit_size = '225〜325g程度の中小玉．',
  taste = '濃厚な甘味があり，香りと余韻が強い．酸味は控えめで，完熟時の食味が非常に高い．',
  texture = '低繊維でなめらか．完熟するとやわらかく，口どけがよい．',
  aroma = 'アルフォンソ特有の濃い芳香がある．',
  harvest_season = '中生〜やや晩生の目安．地域や施設条件で前後する．',
  tree_vigor = '樹は中〜やや強めで，樹冠は密になりやすい．日当たりと風通しを意識して作りたい．',
  difficulty = '高品質果を狙うには，開花期の管理，病害対策，収穫適期の見極めが重要です．結実が安定しにくい年もあるため，毎年の着花・着果を記録したい品種です．',
  okinawa_suitability = '沖縄では香りと糖度を出せる可能性がありますが，高温多湿期の病害，開花期の湿度，着果の安定性をよく観察したい品種です．果実品質を重視して少数着果で仕上げると，この品種らしさを確認しやすくなります．',
  container_suitability = '鉢栽培では樹勢を抑えながら，日当たりと風通しのよい枝を残したいです．高品質果を狙う場合は，着果数を少なくして樹勢を保つ管理が向きます．',
  beginner_suitability = '食味は魅力的ですが，安定した結実と高品質果を狙うには観察が必要です．初心者はまず樹づくりと開花記録から始めたい品種です．',
  kenyu_comment = 'アルフォンソは，香りと食味の個性を知るために一度は比較したい品種です．沖縄で育てるなら，糖度だけでなく，香り，果肉のなめらかさ，収穫後の追熟具合まで記録したいです．',
  public_notes = case
    when coalesce(c.public_notes, '') like '%The Mango: Botany，Production and Uses%'
      then c.public_notes
    else concat_ws(
      E'\n',
      nullif(c.public_notes, ''),
      '出典: The Mango: Botany，Production and Uses，Chapter 3 Important Mango Cultivars and their Descriptors，Knight，Campbell and Maguire．'
    )
  end,
  updated_at = now()
from matched
where c.id = matched.id
returning c.name_ja, c.name_en, c.slug;

commit;
