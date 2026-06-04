-- PV記録日を日本時間に統一し、既存の記録関数を更新します。

create or replace function public.track_page_view(p_path text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  clean_path text;
  fruit_slug text;
  cultivar_slug text;
  found_fruit_id uuid;
  found_cultivar_id uuid;
  japan_date date;
begin
  clean_path := split_part(coalesce(p_path, ''), '?', 1);
  clean_path := split_part(clean_path, '#', 1);
  japan_date := (now() at time zone 'Asia/Tokyo')::date;

  if clean_path = '' then
    return;
  end if;

  fruit_slug := nullif((regexp_match(clean_path, '^/fruits/([^/]+)'))[1], '');
  cultivar_slug := nullif((regexp_match(clean_path, '^/fruits/[^/]+/cultivars/([^/]+)'))[1], '');

  if fruit_slug is not null then
    select id
    into found_fruit_id
    from public.fruits
    where slug = fruit_slug
    limit 1;
  end if;

  if found_fruit_id is not null and cultivar_slug is not null then
    select id
    into found_cultivar_id
    from public.cultivars
    where fruit_id = found_fruit_id
      and slug = cultivar_slug
    limit 1;
  end if;

  insert into public.page_views (page_path, fruit_id, cultivar_id, view_date, views)
  values (clean_path, found_fruit_id, found_cultivar_id, japan_date, 1)
  on conflict (page_path, view_date)
  do update set
    views = public.page_views.views + 1,
    fruit_id = coalesce(public.page_views.fruit_id, excluded.fruit_id),
    cultivar_id = coalesce(public.page_views.cultivar_id, excluded.cultivar_id),
    updated_at = now();
end;
$$;

grant execute on function public.track_page_view(text) to anon, authenticated;

delete from public.page_views where page_path = '/codex-pv-diagnostic';

select 'page view analytics fixed' as status;
