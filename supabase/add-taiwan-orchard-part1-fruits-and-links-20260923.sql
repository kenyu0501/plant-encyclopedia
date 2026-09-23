-- 台湾園地・前編の記事から、未登録の果樹・品種を図鑑へ追加し、相互リンクします。
-- Supabase SQL Editor で一度実行してください。再実行しても重複登録しません。

-- ミルクフルーツは既存の /fruits/milkfruit を利用します。
-- 未登録だったワンピとマメイサポテだけを新規追加します。
insert into public.fruits (
  name_ja,
  name_en,
  slug,
  scientific_name,
  family_name,
  origin,
  description,
  growth_habit,
  flower_description,
  fruit_description,
  cultivation_summary,
  okinawa_suitability,
  public_notes,
  private_notes,
  display_order,
  is_public
)
values (
  'ワンピ',
  'Wampee / Wampi',
  'wampee',
  'Clausena lansium',
  'ミカン科',
  'インドから中国南部、東南アジアに分布',
  'ワンピ（ワンピー、黄皮）は、黄色い小果を房状につけるミカン科の常緑小高木です。台湾の園地動画では、柑橘の爽やかさに桃のような香りが重なる複雑な風味として紹介されました。',
  '常緑の低木から小高木。日当たりのよい環境を好む。',
  '小さな白色の花を円錐状につける。',
  '黄色から黄褐色の小果。果肉は甘酸っぱく、果実内に種を含む。',
  '日当たりと排水のよい場所で育てる。乾燥させすぎず、幼木は低温と強風から保護する。種子、挿し木、取り木などで繁殖される。',
  '沖縄の温暖な地域では栽培候補になるが、耐風性や冬季の反応は株ごとに記録して確認したい。',
  '動画での食味は、柑橘を思わせる爽やかさ、桃のような香り、果皮付近のぬめりとわずかな辛み・渋み。一般情報はシンガポール国立公園局（NParks）の植物データベースを参照。',
  '出典: https://www.nparks.gov.sg/florafaunaweb/flora/6/8/6835 / 分類確認: https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A772147-1/general-information / 動画: https://www.youtube.com/watch?v=4mGf1-t60FY',
  (select coalesce(max(display_order), 0) + 10 from public.fruits),
  true
)
on conflict (slug) do nothing;

insert into public.fruits (
  name_ja,
  name_en,
  slug,
  scientific_name,
  family_name,
  origin,
  description,
  growth_habit,
  flower_description,
  fruit_description,
  cultivation_summary,
  okinawa_suitability,
  public_notes,
  private_notes,
  display_order,
  is_public
)
values (
  'マメイサポテ',
  'Mamey sapote',
  'mamey-sapote',
  'Pouteria sapota',
  'アカテツ科',
  'メキシコ南部から中央アメリカ',
  'マメイサポテは、ざらついた褐色の果皮と、サーモン色から赤色の果肉を持つ大型の熱帯果樹です。果実は樹上で長期間かけて成熟します。',
  '常緑の中高木。樹冠が大きくなるため、十分な植栽空間が必要。',
  '枝に小さな花を多数つける。',
  '果皮は厚く褐色で、果肉はサーモン色、橙色から赤色。甘く、アーモンドを思わせる風味とされる。',
  '日当たりと排水のよい場所で育てる。滞水を避け、幼木は低温から保護する。開花から成熟まで13〜24か月かかることがある。',
  '沖縄では暖地向けの果樹として試せるが、冬の低温、台風、樹冠の大きさに注意する。果実が長く樹上にあるため、年間を通した着果管理が必要。',
  '台湾の園地動画では、果実が約1年半かけて育つこと、果皮を浅くこすって内部が赤ければ収穫候補、白ければまだ早いという現場の判定法が紹介された。',
  '一般情報: UF/IFAS Extension https://edis.ifas.ufl.edu/publication/MG331/pdf / 動画: https://www.youtube.com/watch?v=4mGf1-t60FY',
  (select coalesce(max(display_order), 0) + 10 from public.fruits),
  true
)
on conflict (slug) do nothing;

-- 字幕で果樹と品種名の対応を確認できた2品種を追加します。
insert into public.cultivars (
  fruit_id,
  name_ja,
  name_en,
  slug,
  origin,
  description,
  taste,
  harvest_season,
  tree_vigor,
  difficulty,
  okinawa_suitability,
  kenyu_comment,
  public_notes,
  private_notes,
  is_public,
  is_for_sale
)
select
  f.id,
  '白玉',
  'Bai Yu',
  'bai-yu',
  '台湾',
  '台湾の園地で栽培されているコパラミツの品種。動画では、果柄側が赤くなることを収穫の目印として紹介している。',
  '動画前編では収穫前のため、食味評価は未確認。',
  '園地では果柄側の赤みを適熟判断の目安としている。地域・樹勢・気象条件で変わる可能性がある。',
  null,
  '適熟判定は園地固有の経験を含むため、色、香り、果柄、着果からの日数を合わせて記録したい。',
  '沖縄での栽培実績、耐寒性、耐風性は今後の確認が必要。',
  '果柄側が赤くなる収穫サインが印象的な品種です。実際の食味と沖縄での反応を今後記録したいです。',
  '情報は台湾園地の動画と正式字幕に基づく。',
  '動画: https://www.youtube.com/watch?v=4mGf1-t60FY / 字幕: 2026年9月18日版',
  true,
  false
from public.fruits f
where f.slug = 'chempedak'
on conflict (fruit_id, slug) do nothing;

insert into public.cultivars (
  fruit_id,
  name_ja,
  name_en,
  slug,
  origin,
  description,
  taste,
  tree_vigor,
  difficulty,
  okinawa_suitability,
  kenyu_comment,
  public_notes,
  private_notes,
  is_public,
  is_for_sale
)
select
  f.id,
  'W4',
  'W4',
  'w4',
  null,
  '台湾の園地でマクディールと同じ木に接がれていたホワイトサポテの品種。枝の由来をたどりながら品種を確認する様子が動画で紹介された。',
  '動画前編では食味評価は未確認。',
  '同じ木に接がれたマクディールより樹勢が弱いという園主の観察が紹介された。',
  '来歴、収穫期、食味、耐寒性は今後の確認が必要。',
  '沖縄での栽培実績と台風後の反応を記録したい。',
  '同じ台木上でマクディールとの樹勢差を比較できる点が興味深い品種です。',
  '現時点の情報は動画内の園主の観察に基づく。',
  '動画: https://www.youtube.com/watch?v=4mGf1-t60FY / 字幕: 2026年9月18日版',
  true,
  false
from public.fruits f
where f.slug = 'white-sapote'
on conflict (fruit_id, slug) do nothing;

-- 記事本文の未リンク語を、既存または今回追加した図鑑ページへつなぎます。
update public.articles
set content = replace(content, 'ミルクフルーツ（スターアップル）', '[ミルクフルーツ（スターアップル）](/fruits/milkfruit)'),
    updated_at = now()
where slug = 'youtube-taiwan-21-cultivar-graft-orchard-part1-20260919'
  and content not like '%/fruits/milkfruit%';

update public.articles
set content = replace(content, '白玉', '[白玉](/fruits/chempedak/cultivars/bai-yu)'),
    updated_at = now()
where slug = 'youtube-taiwan-21-cultivar-graft-orchard-part1-20260919'
  and content not like '%/fruits/chempedak/cultivars/bai-yu%';

update public.articles
set content = replace(content, 'ワンピ', '[ワンピ](/fruits/wampee)'),
    updated_at = now()
where slug = 'youtube-taiwan-21-cultivar-graft-orchard-part1-20260919'
  and content not like '%/fruits/wampee%';

update public.articles
set content = replace(content, 'W4', '[W4](/fruits/white-sapote/cultivars/w4)'),
    updated_at = now()
where slug = 'youtube-taiwan-21-cultivar-graft-orchard-part1-20260919'
  and content not like '%/fruits/white-sapote/cultivars/w4%';

update public.articles
set content = replace(content, 'マメイサポテ', '[マメイサポテ](/fruits/mamey-sapote)'),
    updated_at = now()
where slug = 'youtube-taiwan-21-cultivar-graft-orchard-part1-20260919'
  and content not like '%/fruits/mamey-sapote%';

-- 関連図鑑一覧にも明示的に追加します。
update public.articles
set content = content || E'\n・[白玉](/fruits/chempedak/cultivars/bai-yu)', updated_at = now()
where slug = 'youtube-taiwan-21-cultivar-graft-orchard-part1-20260919'
  and content not like '%・[白玉](/fruits/chempedak/cultivars/bai-yu)%';

update public.articles
set content = content || E'\n・[ミルクフルーツ（スターアップル）](/fruits/milkfruit)', updated_at = now()
where slug = 'youtube-taiwan-21-cultivar-graft-orchard-part1-20260919'
  and content not like '%・[ミルクフルーツ（スターアップル）](/fruits/milkfruit)%';

update public.articles
set content = content || E'\n・[ワンピ](/fruits/wampee)', updated_at = now()
where slug = 'youtube-taiwan-21-cultivar-graft-orchard-part1-20260919'
  and content not like '%・[ワンピ](/fruits/wampee)%';

update public.articles
set content = content || E'\n・[W4](/fruits/white-sapote/cultivars/w4)', updated_at = now()
where slug = 'youtube-taiwan-21-cultivar-graft-orchard-part1-20260919'
  and content not like '%・[W4](/fruits/white-sapote/cultivars/w4)%';

update public.articles
set content = content || E'\n・[マメイサポテ](/fruits/mamey-sapote)',
    review_notes = '提供された中国語・日本語正式字幕と概要欄を照合して執筆。ミルクフルーツは既存ページへ接続し、ワンピ、マメイサポテ、白玉、W4を図鑑へ追加して相互リンクを設定。包豐は字幕だけでは果樹の種類を断定できないため、誤登録を避けて保留。',
    updated_at = now()
where slug = 'youtube-taiwan-21-cultivar-graft-orchard-part1-20260919'
  and content not like '%・[マメイサポテ](/fruits/mamey-sapote)%';

-- 記事で紹介した各図鑑ページにも元動画を表示します。
with target_fruits(slug) as (
  values ('milkfruit'), ('wampee'), ('mamey-sapote')
)
insert into public.videos (fruit_id, youtube_url, title, description, thumbnail_url, video_type, is_public)
select
  f.id,
  'https://www.youtube.com/watch?v=4mGf1-t60FY',
  '台湾でもっとも衝撃を受けた場所はここです【#台湾16】',
  '台湾の熱帯果樹園で、21品種接ぎの大木や珍しい果樹を紹介する動画前編。',
  'https://img.youtube.com/vi/4mGf1-t60FY/hqdefault.jpg',
  '紹介動画',
  true
from target_fruits target
join public.fruits f on f.slug = target.slug
where not exists (
  select 1 from public.videos v
  where v.fruit_id = f.id
    and v.cultivar_id is null
    and v.youtube_url = 'https://www.youtube.com/watch?v=4mGf1-t60FY'
);

with target_cultivars(fruit_slug, cultivar_slug) as (
  values
    ('chempedak', 'bai-yu'),
    ('white-sapote', 'w4')
)
insert into public.videos (fruit_id, cultivar_id, youtube_url, title, description, thumbnail_url, video_type, is_public)
select
  c.fruit_id,
  c.id,
  'https://www.youtube.com/watch?v=4mGf1-t60FY',
  '台湾でもっとも衝撃を受けた場所はここです【#台湾16】',
  '台湾の熱帯果樹園で、21品種接ぎの大木や珍しい果樹を紹介する動画前編。',
  'https://img.youtube.com/vi/4mGf1-t60FY/hqdefault.jpg',
  '紹介動画',
  true
from target_cultivars target
join public.fruits f on f.slug = target.fruit_slug
join public.cultivars c on c.fruit_id = f.id and c.slug = target.cultivar_slug
where not exists (
  select 1 from public.videos v
  where v.cultivar_id = c.id
    and v.youtube_url = 'https://www.youtube.com/watch?v=4mGf1-t60FY'
);

-- 確認用。果樹2件、品種2件、記事1件が返れば完了です。
select 'fruit' as kind, f.slug, f.name_ja
from public.fruits f
where f.slug in ('wampee', 'mamey-sapote')
union all
select 'cultivar' as kind, f.slug || '/cultivars/' || c.slug, c.name_ja
from public.cultivars c
join public.fruits f on f.id = c.fruit_id
where (f.slug, c.slug) in (('chempedak', 'bai-yu'), ('white-sapote', 'w4'))
union all
select 'article' as kind, a.slug, a.title
from public.articles a
where a.slug = 'youtube-taiwan-21-cultivar-graft-orchard-part1-20260919';
