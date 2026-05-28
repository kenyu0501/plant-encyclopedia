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

select id, name_ja, slug, is_public
from public.fruits
order by name_ja;
