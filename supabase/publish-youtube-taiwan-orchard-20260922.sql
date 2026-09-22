-- YouTube新着の試験記事を公開します。
-- Supabase SQL Editor で一度実行してください。

insert into public.articles (
  title,
  slug,
  category,
  excerpt,
  content,
  hero_image_url,
  source_name,
  source_url,
  source_published_at,
  youtube_url,
  author_name,
  status,
  is_featured,
  seo_title,
  seo_description,
  review_notes,
  approved_at,
  published_at,
  updated_at
)
values (
  '台湾の熱帯果樹園を歩く。多品種接ぎ木と果実の食味を動画で紹介',
  'youtube-taiwan-tropical-fruit-orchard-20260922',
  'youtube',
  '台湾の熱帯果樹園を訪ね、ホワイトサポテやアボカド、パラミツ類などを観察しました。多品種接ぎ木や樹を強くする工夫、現地で味わった果実の印象を動画とともに紹介します。',
  $article$2026年9月22日にYouTubeで公開した「【後半 本日限定】台湾のすごい園地に来た【#台湾17】」では、台湾の熱帯果樹園を歩きながら、園内の樹や果実を紹介しています。この記事では、約29分の動画の見どころを簡潔にまとめます。

まず目を引くのは、一つの園地に植えられた熱帯果樹の多様さです。ホワイトサポテやアボカド、パラミツ類などが次々に登場し、同じ果樹でも複数の品種が育てられています。日本では実物を見る機会が少ない果実や樹形を、園地を歩く視点で観察できるのが今回の動画の魅力です。

園内では、一本の樹に複数の品種を接いだように見える樹や、複数の根を利用して樹勢を支える工夫も紹介されています。動画内の説明には中国語も含まれるため、技術の名称や目的については追加確認が必要ですが、樹を強くし、成長や結実を支えようとする現地の試みを映像で確認できます。

種なしの果実やハイブリッドとして紹介されるパラミツ類も見どころです。果実の大きさ、果皮の色、着果の様子など、品種による違いが園内の随所に見られます。名称を確定できないものもあるため、この記事では映像で確認できる特徴を中心に紹介しています。

後半では、香りの強い果実を実食します。パイナップルやバナナ、ドリアン、パラミツ類を思わせる複雑な香りと、強い甘さが印象的でした。自動字幕では果実名を正確に判別しにくい部分があるため、ぜひ動画の色や形、食感とあわせてご覧ください。

ホワイトサポテの「マクディール」として紹介された果実も試食しています。果肉はやわらかく、甘みが強く、カスタードプリンのような印象です。苦みや渋みをほとんど感じず、現地で食べたことで、この品種が選ばれている理由を実感できました。

熱帯果樹は、品種名だけでなく、実際の樹姿、着果、香り、食感を一緒に見ることで理解が深まります。動画を見ながら図鑑の品種情報も確認し、気になった果樹や品種を探してみてください。$article$,
  'https://img.youtube.com/vi/DTmz_5rnTyk/maxresdefault.jpg',
  'けんゆー YouTube',
  'https://www.youtube.com/watch?v=DTmz_5rnTyk',
  '2026-09-22T11:49:10Z'::timestamptz,
  'https://www.youtube.com/watch?v=DTmz_5rnTyk',
  'けんゆー',
  'published',
  true,
  '台湾の熱帯果樹園を動画で紹介｜多品種接ぎ木と果実の食味',
  '台湾の熱帯果樹園で、ホワイトサポテ、アボカド、パラミツ類、多品種接ぎ木や果実の食味を紹介する動画記事です。',
  'YouTube動画と自動字幕を確認して作成した試験記事。果実名を確定できない箇所は断定を避けています。',
  now(),
  now(),
  now()
)
on conflict (slug) do update set
  title = excluded.title,
  category = excluded.category,
  excerpt = excluded.excerpt,
  content = excluded.content,
  hero_image_url = excluded.hero_image_url,
  source_name = excluded.source_name,
  source_url = excluded.source_url,
  source_published_at = excluded.source_published_at,
  youtube_url = excluded.youtube_url,
  author_name = excluded.author_name,
  status = excluded.status,
  is_featured = excluded.is_featured,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description,
  review_notes = excluded.review_notes,
  approved_at = excluded.approved_at,
  published_at = excluded.published_at,
  updated_at = excluded.updated_at;

