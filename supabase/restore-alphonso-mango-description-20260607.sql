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
  description = 'アルフォンソはインドを代表する高品質マンゴーです．果実は225〜325g程度の中小玉で，黄色果皮，低繊維の果肉，特有の香りと濃い甘味が評価され，インド国内外で高値で扱われる品種です．一方で，結実は不規則になりやすく，地域によって収量差が出やすい点を見たい品種です．',
  fruit_size = '225〜325g程度．中小玉で，JIRCAS調査値と合わせて比較したい．',
  taste = '甘味が強く，特有香があり，食味評価が非常に高い．',
  texture = '低繊維で，しっかり〜やわらかい果肉．',
  aroma = 'アルフォンソらしい特有香が強い．',
  harvest_season = '中生〜やや晩生の目安．',
  tree_vigor = '樹はやや大きく，丸く密な樹冠になりやすい．',
  difficulty = '結実が不規則になりやすく，開花・着果の安定性を観察したい．',
  okinawa_suitability = '沖縄では高温条件で香りと糖度を出せる可能性がありますが，湿度が高い年の病害，着果の安定性，収穫適期を丁寧に見たい品種です．',
  container_suitability = '鉢では樹勢を抑えながら開花枝を作る管理が必要です．高品質果を狙うなら水分と樹勢の振れを小さくしたいです．',
  beginner_suitability = '食味は魅力的ですが，安定着果を考えると中級者向けです．',
  kenyu_comment = '香りと食味の基準品種として残したいマンゴーです．沖縄で栽培するなら，糖度だけでなく香りの立ち方と結実の安定性を記録したいです．',
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
