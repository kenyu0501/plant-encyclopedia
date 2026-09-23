-- 新黄蜜の記事と図鑑品種ページを双方向に関連付けます。
-- 本文に品種リンクを追加すると、品種ページの「この品種を紹介している記事」にも自動表示されます。

update public.articles
set
  content = replace(
    replace(
      content,
      '正式字幕で確認できる名称は『新黄蜜（シン・ホァンミー）』。',
      '正式字幕で確認できる名称は[『新黄蜜（シン・ホァンミー）』](/fruits/abiu/cultivars/Shinkoumitsu)。'
    ),
    '・[アビウ](/fruits/abiu)\n・[白金](/fruits/abiu/cultivars/bai-jin)',
    '・[アビウ](/fruits/abiu)\n・[新黄蜜](/fruits/abiu/cultivars/Shinkoumitsu)\n・[白金](/fruits/abiu/cultivars/bai-jin)'
  ),
  updated_at = now()
where slug = 'youtube-taiwan-abiu-xin-huang-mi-tasting-20260906'
  and content not like '%/fruits/abiu/cultivars/Shinkoumitsu%';

with target as (
  select f.id as fruit_id, c.id as cultivar_id
  from public.fruits f
  join public.cultivars c on c.fruit_id = f.id
  where f.slug = 'abiu' and c.slug = 'Shinkoumitsu'
)
insert into public.videos (
  fruit_id,
  cultivar_id,
  youtube_url,
  title,
  description,
  thumbnail_url,
  video_type,
  is_public
)
select
  target.fruit_id,
  target.cultivar_id,
  'https://www.youtube.com/watch?v=flxZpogI3Bk',
  '台湾の猛暑でも作れる最高果実がやばかった！',
  '新黄蜜の625gの夏果を試食し、糖度12〜12.5度、香り、食感、冬果との違いを紹介する動画です。',
  'https://img.youtube.com/vi/flxZpogI3Bk/hqdefault.jpg',
  '品種・食味紹介',
  true
from target
where not exists (
  select 1
  from public.videos existing
  where existing.cultivar_id = target.cultivar_id
    and existing.youtube_url = 'https://www.youtube.com/watch?v=flxZpogI3Bk'
);
