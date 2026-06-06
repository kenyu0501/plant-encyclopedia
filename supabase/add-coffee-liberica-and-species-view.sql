begin;

with coffee as (
  select id
  from public.fruits
  where slug = 'coffee'
),
liberica as (
  select
    'リベリカ'::text as name_ja,
    'Liberica'::text as name_en,
    'liberica'::text as slug,
    '西アフリカ（リベリア周辺）'::text as origin,
    'リベリカはCoffea libericaに由来するコーヒーで，アラビカ，ロブスタに比べると流通量は少ないものの，大きな果実と豆，強い樹勢，暑さや湿潤条件への適応性で注目される種です．香味はジャックフルーツのような果実香，花香，カラメル，チョコレート様の印象が出ることがあり，焙煎度や精製によって評価が大きく変わります．'::text as description,
    '果実と豆は大きめ．豆は左右非対称で特徴的な形になりやすい．'::text as fruit_size,
    '果実感，花香，カラメル感，チョコレート感が出ることがあります．個性が強く，精製と焙煎で印象が変わりやすいタイプです．'::text as taste,
    'ローストと精製により，しっかりした口当たりから丸みのある質感まで幅があります．'::text as texture,
    '果実香，花香，ジャックフルーツ様の香りが報告されています．'::text as aroma,
    '地域や栽培条件で変動します．沖縄では開花，結実，熟期を園地ごとに記録したい種です．'::text as harvest_season,
    null::text as genome_group,
    '高性'::text as plant_height_type,
    '中から高い'::text as yield_level,
    '樹勢が強く，大きな樹になりやすいコーヒーです．管理しやすい高さに抑える剪定と防風を意識したいです．'::text as tree_vigor,
    'リベリカ / Coffea liberica'::text as difficulty,
    '沖縄では高温多湿への適応性を比較したい候補です．一方で樹が大きくなりやすいため，防風，剪定，収穫しやすい樹形づくりを早めに考えたいです．'::text as okinawa_suitability,
    '鉢では長期的に樹勢を抑える工夫が必要です．小苗の観察や試験栽培には向きますが，収穫まで狙うなら大鉢と強めの剪定管理が必要になります．'::text as container_suitability,
    '珍しいコーヒーを比較したい人向きです．一般的なアラビカより樹が大きくなりやすいため，スペースを確保できる人に向きます．'::text as beginner_suitability,
    'リベリカは，沖縄のような暖地で「アラビカだけではないコーヒー栽培」を考えるときに面白い存在です．豆の個性が強いので，栽培だけでなく精製と焙煎まで記録すると図鑑価値が高くなります．'::text as kenyu_comment,
    '出典: Liberica Coffee (Coffea liberica): A Bibliometric Analysis and Targeted Review of Physical, Bioactive, and Sensory Characteristics, Molecules, 2026. https://pmc.ncbi.nlm.nih.gov/articles/PMC13164717/'::text as public_notes,
    'コーヒー品種の種別表示用に追加．'::text as private_notes,
    true::boolean as is_public,
    false::boolean as is_for_sale
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
  aroma,
  harvest_season,
  genome_group,
  plant_height_type,
  yield_level,
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
  coffee.id,
  liberica.name_ja,
  liberica.name_en,
  liberica.slug,
  liberica.origin,
  liberica.description,
  liberica.fruit_size,
  liberica.taste,
  liberica.texture,
  liberica.aroma,
  liberica.harvest_season,
  liberica.genome_group,
  liberica.plant_height_type,
  liberica.yield_level,
  liberica.tree_vigor,
  liberica.difficulty,
  liberica.okinawa_suitability,
  liberica.container_suitability,
  liberica.beginner_suitability,
  liberica.kenyu_comment,
  liberica.public_notes,
  liberica.private_notes,
  liberica.is_public,
  liberica.is_for_sale
from coffee
cross join liberica
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
  genome_group = excluded.genome_group,
  plant_height_type = excluded.plant_height_type,
  yield_level = excluded.yield_level,
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
  updated_at = now();

select
  f.name_ja as fruit_name,
  c.name_ja as cultivar_name,
  c.difficulty as coffee_species
from public.fruits f
join public.cultivars c on c.fruit_id = f.id
where f.slug = 'coffee'
  and c.slug = 'liberica';

commit;
