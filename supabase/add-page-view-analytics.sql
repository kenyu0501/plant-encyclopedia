-- 公開ページのPV集計機能を追加します。
-- 個人情報やIPアドレスは保存せず、ページURLごとの日別PVだけを集計します。

create table if not exists public.page_views (
  id uuid primary key default gen_random_uuid(),
  page_path text not null,
  fruit_id uuid references public.fruits(id) on delete cascade,
  cultivar_id uuid references public.cultivars(id) on delete cascade,
  view_date date not null default current_date,
  views integer not null default 0 check (views >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (page_path, view_date)
);

create index if not exists page_views_date_idx on public.page_views (view_date desc);
create index if not exists page_views_fruit_idx on public.page_views (fruit_id, view_date desc);
create index if not exists page_views_cultivar_idx on public.page_views (cultivar_id, view_date desc);

alter table public.page_views enable row level security;

grant select on public.page_views to anon, authenticated;

drop policy if exists "public page view stats are readable" on public.page_views;
create policy "public page view stats are readable" on public.page_views
for select using (true);

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
begin
  clean_path := split_part(coalesce(p_path, ''), '?', 1);
  clean_path := split_part(clean_path, '#', 1);

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
  values (clean_path, found_fruit_id, found_cultivar_id, current_date, 1)
  on conflict (page_path, view_date)
  do update set
    views = public.page_views.views + 1,
    fruit_id = coalesce(public.page_views.fruit_id, excluded.fruit_id),
    cultivar_id = coalesce(public.page_views.cultivar_id, excluded.cultivar_id),
    updated_at = now();
end;
$$;

grant execute on function public.track_page_view(text) to anon, authenticated;

select 'page view analytics ready' as status;
