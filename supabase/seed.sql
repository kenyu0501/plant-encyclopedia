insert into public.fruits (
  name_ja,
  name_en,
  slug,
  scientific_name,
  family_name,
  origin,
  description,
  cultivation_summary,
  okinawa_suitability,
  is_public
) values
  ('マンゴー', 'Mango', 'mango', 'Mangifera indica', 'ウルシ科', 'インド周辺', '濃厚な甘みと香りが魅力の代表的な熱帯果樹です。', '日当たりと排水を好み、開花期の湿度管理が重要です。', '品種選びと病害対策ができれば有望です。', true),
  ('アボカド', 'Avocado', 'avocado', 'Persea americana', 'クスノキ科', '中南米', 'クリーミーな果肉を食べる常緑果樹です。', '品種の開花型、風、排水、台風対策を考えて植えます。', '暖地では可能性が高く、品種選定が重要です。', true),
  ('バナナ', 'Banana', 'banana', 'Musa spp.', 'バショウ科', '東南アジア周辺', '生育が早く、庭でも存在感のある熱帯果樹です。', '肥料と水を好み、強風対策が大切です。', '沖縄と相性がよい果樹です。', true)
on conflict (slug) do update set
  name_ja = excluded.name_ja,
  name_en = excluded.name_en,
  scientific_name = excluded.scientific_name,
  family_name = excluded.family_name,
  origin = excluded.origin,
  description = excluded.description,
  cultivation_summary = excluded.cultivation_summary,
  okinawa_suitability = excluded.okinawa_suitability,
  is_public = true,
  updated_at = now();

insert into public.cultivars (fruit_id, name_ja, name_en, slug, description, taste, harvest_season, is_public)
select id, 'アーウィン', 'Irwin', 'irwin', '国内でもよく知られる赤色系マンゴー。', '甘みと酸味のバランスがよい。', '初夏から夏', true
from public.fruits where slug = 'mango'
on conflict (fruit_id, slug) do update set
  name_ja = excluded.name_ja,
  name_en = excluded.name_en,
  description = excluded.description,
  taste = excluded.taste,
  harvest_season = excluded.harvest_season,
  is_public = true,
  updated_at = now();

insert into public.cultivars (fruit_id, name_ja, name_en, slug, description, taste, harvest_season, is_public)
select id, 'キーツ', 'Keitt', 'keitt', '晩生で大玉になりやすいマンゴー。', '濃厚で食べごたえがある。', '夏から秋', true
from public.fruits where slug = 'mango'
on conflict (fruit_id, slug) do update set
  name_ja = excluded.name_ja,
  name_en = excluded.name_en,
  description = excluded.description,
  taste = excluded.taste,
  harvest_season = excluded.harvest_season,
  is_public = true,
  updated_at = now();

insert into public.cultivars (fruit_id, name_ja, name_en, slug, description, taste, harvest_season, is_public)
select id, 'ハス', 'Hass', 'hass', '世界的に流通量が多いアボカド品種。', 'コクが強い。', '地域により変動', true
from public.fruits where slug = 'avocado'
on conflict (fruit_id, slug) do update set
  name_ja = excluded.name_ja,
  name_en = excluded.name_en,
  description = excluded.description,
  taste = excluded.taste,
  harvest_season = excluded.harvest_season,
  is_public = true,
  updated_at = now();

insert into public.cultivars (fruit_id, name_ja, name_en, slug, description, taste, harvest_season, is_public)
select id, 'ナムワ', 'Nam Wah', 'nam-wah', '家庭栽培でも人気のあるバナナ。', '甘みが強く、もっちり。', '周年の可能性', true
from public.fruits where slug = 'banana'
on conflict (fruit_id, slug) do update set
  name_ja = excluded.name_ja,
  name_en = excluded.name_en,
  description = excluded.description,
  taste = excluded.taste,
  harvest_season = excluded.harvest_season,
  is_public = true,
  updated_at = now();

select
  (select count(*) from public.fruits where is_public = true) as public_fruits,
  (select count(*) from public.cultivars where is_public = true) as public_cultivars;
