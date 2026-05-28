-- けんゆーの農ライフ! アボカド関連YouTube紐づけ
-- Supabase SQL Editorで実行してください。既に同じURLがある場合は重複追加しません。

with avocado as (
  select id from public.fruits where slug = 'avocado' limit 1
), new_videos (cultivar_slug, youtube_url, title, description, thumbnail_url, video_type, is_public) as (
  values
  (null, 'https://www.youtube.com/watch?v=FI6Lhwt4JMU', '【完全版】オススメのアボカド28種！一挙大公開！！これを見るとかなりアボカドに詳しくなれるよ！', 'けんゆーの農ライフ! より。アボカド関連動画。', 'https://img.youtube.com/vi/FI6Lhwt4JMU/hqdefault.jpg', '品種まとめ', true),
  (null, 'https://www.youtube.com/watch?v=Pb2DhJElT8Y', '【目から鱗】これは必見です！多品種アボカドコンテナ栽培！すごい工夫！育種・育て方！【愛媛県 アボカドラウンジ有田さん】', 'けんゆーの農ライフ! より。アボカド関連動画。', 'https://img.youtube.com/vi/Pb2DhJElT8Y/hqdefault.jpg', '栽培', true),
  ('reed', 'https://www.youtube.com/watch?v=edksNVQDYaM', '【アボカド品種12】横山果樹園さんの「リード」の食レポ！解説！1個6000円のアボカド！', 'けんゆーの農ライフ! より。アボカド品種「reed」関連動画。', 'https://img.youtube.com/vi/edksNVQDYaM/hqdefault.jpg', '品種解説', true),
  (null, 'https://www.youtube.com/watch?v=bjcEubpw4Lg', '【栽培者が教える!】アボカドのオススメ品種！沖縄で栽培したい人はこれ！寒波のあと大丈夫！？', 'けんゆーの農ライフ! より。アボカド関連動画。', 'https://img.youtube.com/vi/bjcEubpw4Lg/hqdefault.jpg', '品種まとめ', true),
  ('edranol', 'https://www.youtube.com/watch?v=RVGGwPFCix4', '【アボカド品種】超希少アボカド「エドラノール(Edranol)」を堪能した！2500円でした．[Avocado] Ultra-rare avocado "Edranol"! It was 25$.', 'けんゆーの農ライフ! より。アボカド品種「edranol」関連動画。', 'https://img.youtube.com/vi/RVGGwPFCix4/hqdefault.jpg', '品種解説', true),
  ('bacon', 'https://www.youtube.com/watch?v=m9O2bVykc10', '【アボカド品種10】とても甘い品種「ベーコン」！油分もたっぷり！タネが大きい！', 'けんゆーの農ライフ! より。アボカド品種「bacon」関連動画。', 'https://img.youtube.com/vi/m9O2bVykc10/hqdefault.jpg', '品種解説', true),
  ('mexicola', 'https://www.youtube.com/watch?v=F_7dLsA11QE', '【アボカド品種5】皮まで食べられるアボカド！メキシコーラが美味しすぎました！', 'けんゆーの農ライフ! より。アボカド品種「mexicola」関連動画。', 'https://img.youtube.com/vi/F_7dLsA11QE/hqdefault.jpg', '品種解説', true),
  ('murashige', 'https://www.youtube.com/watch?v=ewMbD6I-oQo', '6000円でハワイで人気の激レアアボカド品種を買ってみたら...ムラシゲ', 'けんゆーの農ライフ! より。アボカド品種「murashige」関連動画。', 'https://img.youtube.com/vi/ewMbD6I-oQo/hqdefault.jpg', '品種解説', true),
  ('fuerte', 'https://www.youtube.com/watch?v=oJ1ve2OXMY4', '【アボカド品種11】フェルテの解説・食レポ！ハスに次ぐ人気品種！油分濃厚！食味も良し！', 'けんゆーの農ライフ! より。アボカド品種「fuerte」関連動画。', 'https://img.youtube.com/vi/oJ1ve2OXMY4/hqdefault.jpg', '品種解説', true),
  (null, 'https://www.youtube.com/watch?v=A26zGobctao', '6つの品種のアボカドの苗木を導入しました！', 'けんゆーの農ライフ! より。アボカド関連動画。', 'https://img.youtube.com/vi/A26zGobctao/hqdefault.jpg', '品種まとめ', true),
  ('bacon', 'https://www.youtube.com/watch?v=NuWxJz7BPVQ', '【アボカド】ベーコン種の紹介！一つだけ収穫できました！', 'けんゆーの農ライフ! より。アボカド品種「bacon」関連動画。', 'https://img.youtube.com/vi/NuWxJz7BPVQ/hqdefault.jpg', '品種解説', true),
  ('monroe', 'https://www.youtube.com/watch?v=gB_TaoD7I1o', '【アボカド品種6】食味もよく大型の品種！綺麗な黄色い果肉モンロー(Monroe)の解説と食レポ！！美味い！', 'けんゆーの農ライフ! より。アボカド品種「monroe」関連動画。', 'https://img.youtube.com/vi/gB_TaoD7I1o/hqdefault.jpg', '品種解説', true),
  ('kabira-murasaki', 'https://www.youtube.com/watch?v=EowYgHobiGs', '【アボカド品種2】カビラムラサキという 約800gの巨大アボカドの特徴と食レポ！', 'けんゆーの農ライフ! より。アボカド品種「kabira-murasaki」関連動画。', 'https://img.youtube.com/vi/EowYgHobiGs/hqdefault.jpg', '品種解説', true),
  (null, 'https://www.youtube.com/watch?v=EKyiEhNFgtA', '【アボカド栽培】初心者必見のアボカド品種選び！沖縄県で露地栽培を考えている人に向けた動画', 'けんゆーの農ライフ! より。アボカド関連動画。', 'https://img.youtube.com/vi/EKyiEhNFgtA/hqdefault.jpg', '品種まとめ', true),
  ('pura-vida', 'https://www.youtube.com/watch?v=G-Wc2L-iGVA', '【アボカド品種4】30cm近くもある長いアボカド！？プーラビーダの紹介！！', 'けんゆーの農ライフ! より。アボカド品種「pura-vida」関連動画。', 'https://img.youtube.com/vi/G-Wc2L-iGVA/hqdefault.jpg', '品種解説', true),
  (null, 'https://www.youtube.com/watch?v=bfaKD79hzuY', '【2月のアボカド栽培】各品種の詳しい説明！花が咲く条件やその生理特性など色々！【ガーデニングにもおすすめ！】【園芸】【自然農】Explanation of each variety!', 'けんゆーの農ライフ! より。アボカド関連動画。', 'https://img.youtube.com/vi/bfaKD79hzuY/hqdefault.jpg', '品種まとめ', true),
  (null, 'https://www.youtube.com/watch?v=exqHBZxIkI8', '【超ロング編】一年間のアボカド栽培の様子！これを見たらアボカドに精通します！一本の動画にまとめました！', 'けんゆーの農ライフ! より。アボカド関連動画。', 'https://img.youtube.com/vi/exqHBZxIkI8/hqdefault.jpg', '栽培', true),
  ('kabira-murasaki', 'https://www.youtube.com/watch?v=MoCtmiDtKks', '【露地アボカド】大型のカビラムラサキという品種の紹介！栽培の様子など！Avocado', 'けんゆーの農ライフ! より。アボカド品種「kabira-murasaki」関連動画。', 'https://img.youtube.com/vi/MoCtmiDtKks/hqdefault.jpg', '品種解説', true),
  ('fuerte', 'https://www.youtube.com/watch?v=CaA16f8qqzY', '【アボカドの品種】フェルテ種の食レポ！ハスとの比較！特徴まで解説！', 'けんゆーの農ライフ! より。アボカド品種「fuerte」関連動画。', 'https://img.youtube.com/vi/CaA16f8qqzY/hqdefault.jpg', '品種解説', true)
)
insert into public.videos (fruit_id, cultivar_id, youtube_url, title, description, thumbnail_url, video_type, is_public)
select
  avocado.id,
  cultivars.id,
  new_videos.youtube_url,
  new_videos.title,
  new_videos.description,
  new_videos.thumbnail_url,
  new_videos.video_type,
  new_videos.is_public
from new_videos
cross join avocado
left join public.cultivars
  on cultivars.fruit_id = avocado.id
  and cultivars.slug = new_videos.cultivar_slug
where (new_videos.cultivar_slug is null or cultivars.id is not null)
  and not exists (
    select 1 from public.videos v
    where v.youtube_url = new_videos.youtube_url
      and v.fruit_id = avocado.id
      and coalesce(v.cultivar_id::text, '') = coalesce(cultivars.id::text, '')
  );
