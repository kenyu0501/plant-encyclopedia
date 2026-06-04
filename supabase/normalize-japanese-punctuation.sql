-- 図鑑内の日本語句読点を「，」「．」へ統一します。
-- URL、slug、Storageパスなどの識別子は変更しません。

begin;

update public.fruits
set
  name_ja = translate(name_ja, '、。', '，．'),
  name_en = translate(name_en, '、。', '，．'),
  scientific_name = translate(scientific_name, '、。', '，．'),
  family_name = translate(family_name, '、。', '，．'),
  origin = translate(origin, '、。', '，．'),
  description = translate(description, '、。', '，．'),
  growth_habit = translate(growth_habit, '、。', '，．'),
  flower_description = translate(flower_description, '、。', '，．'),
  fruit_description = translate(fruit_description, '、。', '，．'),
  cultivation_summary = translate(cultivation_summary, '、。', '，．'),
  okinawa_suitability = translate(okinawa_suitability, '、。', '，．'),
  public_notes = translate(public_notes, '、。', '，．'),
  private_notes = translate(private_notes, '、。', '，．'),
  updated_at = now()
where concat_ws(
  '',
  name_ja,
  name_en,
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
  private_notes
) ~ '[、。]';

update public.cultivars
set
  name_ja = translate(name_ja, '、。', '，．'),
  name_en = translate(name_en, '、。', '，．'),
  origin = translate(origin, '、。', '，．'),
  description = translate(description, '、。', '，．'),
  fruit_size = translate(fruit_size, '、。', '，．'),
  taste = translate(taste, '、。', '，．'),
  texture = translate(texture, '、。', '，．'),
  aroma = translate(aroma, '、。', '，．'),
  harvest_season = translate(harvest_season, '、。', '，．'),
  cold_hardiness = translate(cold_hardiness, '、。', '，．'),
  flowering_type = translate(flowering_type, '、。', '，．'),
  plant_height_type = translate(plant_height_type, '、。', '，．'),
  genome_group = translate(genome_group, '、。', '，．'),
  yield_level = translate(yield_level, '、。', '，．'),
  tree_vigor = translate(tree_vigor, '、。', '，．'),
  difficulty = translate(difficulty, '、。', '，．'),
  okinawa_suitability = translate(okinawa_suitability, '、。', '，．'),
  container_suitability = translate(container_suitability, '、。', '，．'),
  beginner_suitability = translate(beginner_suitability, '、。', '，．'),
  kenyu_comment = translate(kenyu_comment, '、。', '，．'),
  public_notes = translate(public_notes, '、。', '，．'),
  private_notes = translate(private_notes, '、。', '，．'),
  updated_at = now()
where concat_ws(
  '',
  name_ja,
  name_en,
  origin,
  description,
  fruit_size,
  taste,
  texture,
  aroma,
  harvest_season,
  cold_hardiness,
  flowering_type,
  plant_height_type,
  genome_group,
  yield_level,
  tree_vigor,
  difficulty,
  okinawa_suitability,
  container_suitability,
  beginner_suitability,
  kenyu_comment,
  public_notes,
  private_notes
) ~ '[、。]';

update public.photos
set
  photo_type = translate(photo_type, '、。', '，．'),
  caption = translate(caption, '、。', '，．')
where concat_ws('', photo_type, caption) ~ '[、。]';

update public.videos
set
  title = translate(title, '、。', '，．'),
  description = translate(description, '、。', '，．'),
  video_type = translate(video_type, '、。', '，．')
where concat_ws('', title, description, video_type) ~ '[、。]';

update public.site_settings
set
  home_eyebrow = translate(home_eyebrow, '、。', '，．'),
  home_title = translate(home_title, '、。', '，．'),
  home_description = translate(home_description, '、。', '，．'),
  updated_at = now()
where concat_ws('', home_eyebrow, home_title, home_description) ~ '[、。]';

create or replace function public.normalize_japanese_punctuation()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  normalized_record jsonb;
begin
  select jsonb_object_agg(
    key,
    case
      when jsonb_typeof(value) = 'string'
        then to_jsonb(translate(value #>> '{}', '、。', '，．'))
      else value
    end
  )
  into normalized_record
  from jsonb_each(to_jsonb(new));

  new := jsonb_populate_record(new, normalized_record);
  return new;
end;
$$;

drop trigger if exists normalize_fruits_punctuation on public.fruits;
create trigger normalize_fruits_punctuation
before insert or update on public.fruits
for each row execute function public.normalize_japanese_punctuation();

drop trigger if exists normalize_cultivars_punctuation on public.cultivars;
create trigger normalize_cultivars_punctuation
before insert or update on public.cultivars
for each row execute function public.normalize_japanese_punctuation();

drop trigger if exists normalize_photos_punctuation on public.photos;
create trigger normalize_photos_punctuation
before insert or update on public.photos
for each row execute function public.normalize_japanese_punctuation();

drop trigger if exists normalize_videos_punctuation on public.videos;
create trigger normalize_videos_punctuation
before insert or update on public.videos
for each row execute function public.normalize_japanese_punctuation();

drop trigger if exists normalize_site_settings_punctuation on public.site_settings;
create trigger normalize_site_settings_punctuation
before insert or update on public.site_settings
for each row execute function public.normalize_japanese_punctuation();

commit;

select
  (select count(*) from public.fruits where concat_ws('', description, cultivation_summary, okinawa_suitability, public_notes) ~ '[、。]') as remaining_fruits,
  (select count(*) from public.cultivars where concat_ws('', description, taste, harvest_season, kenyu_comment, public_notes) ~ '[、。]') as remaining_cultivars,
  (select count(*) from public.photos where concat_ws('', photo_type, caption) ~ '[、。]') as remaining_photos,
  (select count(*) from public.videos where concat_ws('', title, description, video_type) ~ '[、。]') as remaining_videos;
