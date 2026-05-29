-- グァバ（グアバ）の果樹ページと代表品種を追加・更新します。
-- Sources:
-- - https://okinawan-avocado.com/tropical_fruit/
-- - https://eng.moa.gov.tw/ws.php?id=9440&print=Y
-- - https://www.tari.gov.tw/english/df_inc/get_content.asp?n=%2Fenglish%2Ftour%2Findex%E2%80%941.asp%3FParser%3D99%2C15%2C95%2C81%2C%2C%2C198%2C27%2C%2C%2C%2C2&t=p
-- - https://www.sciencedirect.com/science/article/abs/pii/S0925521422003155
-- - https://www.vietnamonline.com/entry/guava.html
-- - https://baonghean.vn/en/oi-le-nghe-an-theo-tieu-chuan-vietgap-gia-cao-hut-khach-10161808.html

begin;

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
) values (
  'グァバ',
  'Guava',
  'guava',
  'Psidium guajava',
  'フトモモ科',
  '熱帯アメリカ',
  'グァバは、熱帯から亜熱帯で広く栽培されるフトモモ科の果樹です。白肉、紅肉、黄肉、低種子系、シャキシャキ食感の台湾系など、品種によって食味と用途が大きく変わります。',
  '常緑の小高木で、暖地では生育が早く、剪定で樹高を抑えながら管理しやすい果樹です。枝が混みやすいため、日当たりと風通しを意識します。',
  '白い花をつけ、条件が合うと着果しやすい果樹です。枝の更新と着果負担の調整で果実品質が変わります。',
  '果実は丸形から洋梨形まで幅があり、果肉は白、淡黄、桃、赤紫など多様です。台湾系の真珠グァバは緑色で硬く、シャキシャキした食感と貯蔵性が特徴です。',
  '排水のよい場所と十分な日照を好みます。沖縄では台風対策、ミバエ対策、カミキリムシなどの幹害虫、過湿時の根傷みに注意します。袋掛けや摘果で見た目と食味を整えやすくなります。',
  '沖縄では露地栽培の候補になります。夏から秋に生育が旺盛ですが、品種により香り、種の硬さ、果肉の厚さが大きく違うため、家庭栽培では台湾系の低種子・硬肉タイプと、香りの強い紅肉タイプを分けて評価したい果樹です。',
  '出典: 糸満フルーツ園けんちゃん 果樹図鑑 / Taiwan MOA Guava / TARI Tainung No.1 Emperor / Chen et al. 2023 Postharvest Biology and Technology / VietnamOnline Vietnamese Guava / Baonghean pear guava.',
  '初期データ。品種名は流通名・現地名を含むため、導入株のラベル確認後に統合・修正する。',
  540,
  true
) on conflict (slug) do update set
  name_ja = excluded.name_ja,
  name_en = excluded.name_en,
  scientific_name = excluded.scientific_name,
  family_name = excluded.family_name,
  origin = excluded.origin,
  description = excluded.description,
  growth_habit = excluded.growth_habit,
  flower_description = excluded.flower_description,
  fruit_description = excluded.fruit_description,
  cultivation_summary = excluded.cultivation_summary,
  okinawa_suitability = excluded.okinawa_suitability,
  public_notes = excluded.public_notes,
  private_notes = excluded.private_notes,
  display_order = coalesce(public.fruits.display_order, excluded.display_order),
  is_public = excluded.is_public,
  updated_at = now();

commit;

select name_ja, slug from public.fruits where slug = 'guava';
