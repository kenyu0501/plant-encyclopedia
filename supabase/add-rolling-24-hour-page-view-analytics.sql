-- 0時にリセットされない、直近24時間のPVランキング用集計を追加します。
-- 総PVに使う既存の日別集計はそのまま残し、1時間単位の集計を併記します。

create table if not exists public.page_view_hourly (
  id uuid primary key default gen_random_uuid(),
  page_path text not null,
  fruit_id uuid references public.fruits(id) on delete cascade,
  cultivar_id uuid references public.cultivars(id) on delete cascade,
  view_hour timestamptz not null,
  views integer not null default 0 check (views >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (page_path, view_hour)
);

create index if not exists page_view_hourly_hour_idx
  on public.page_view_hourly (view_hour desc);
create index if not exists page_view_hourly_cultivar_hour_idx
  on public.page_view_hourly (cultivar_id, view_hour desc);

alter table public.page_view_hourly enable row level security;

grant select on public.page_view_hourly to anon, authenticated;

drop policy if exists "public hourly page view stats are readable" on public.page_view_hourly;
create policy "public hourly page view stats are readable" on public.page_view_hourly
for select using (true);

-- 導入直後にランキングが空にならないよう、当日分を現在の時間枠へ一度だけ引き継ぎます。
-- 日別データから正確な閲覧時刻は復元できないため、この処理は移行時だけの近似です。
insert into public.page_view_hourly (
  page_path,
  fruit_id,
  cultivar_id,
  view_hour,
  views
)
select
  page_path,
  fruit_id,
  cultivar_id,
  date_trunc('hour', now()),
  views
from public.page_views
where view_date = (now() at time zone 'Asia/Tokyo')::date
  and views > 0
on conflict (page_path, view_hour) do nothing;

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
  current_hour timestamptz;
begin
  clean_path := split_part(coalesce(p_path, ''), '?', 1);
  clean_path := split_part(clean_path, '#', 1);
  japan_date := (now() at time zone 'Asia/Tokyo')::date;
  current_hour := date_trunc('hour', now());

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

  insert into public.page_view_hourly (page_path, fruit_id, cultivar_id, view_hour, views)
  values (clean_path, found_fruit_id, found_cultivar_id, current_hour, 1)
  on conflict (page_path, view_hour)
  do update set
    views = public.page_view_hourly.views + 1,
    fruit_id = coalesce(public.page_view_hourly.fruit_id, excluded.fruit_id),
    cultivar_id = coalesce(public.page_view_hourly.cultivar_id, excluded.cultivar_id),
    updated_at = now();
end;
$$;

grant execute on function public.track_page_view(text) to anon, authenticated;

select 'rolling 24-hour page view analytics ready' as status;
