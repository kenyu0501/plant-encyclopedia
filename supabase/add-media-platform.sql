-- 熱帯果樹メディア基盤: 記事・LIKE・メールマガジン登録
-- Supabase SQL Editor で一度実行してください。

create extension if not exists pgcrypto;

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text not null default 'news' check (category in ('news', 'how-to', 'research', 'youtube', 'quiz')),
  excerpt text not null default '',
  content text not null default '',
  hero_image_url text,
  source_name text,
  source_url text,
  source_published_at timestamptz,
  youtube_url text,
  author_name text not null default 'けんゆー',
  status text not null default 'draft' check (status in ('draft', 'pending', 'published', 'rejected')),
  is_featured boolean not null default false,
  like_count integer not null default 0 check (like_count >= 0),
  seo_title text,
  seo_description text,
  review_notes text,
  created_by uuid references auth.users(id) on delete set null,
  approved_by uuid references auth.users(id) on delete set null,
  approved_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists articles_public_feed_idx
  on public.articles (published_at desc)
  where status = 'published';
create index if not exists articles_category_idx
  on public.articles (category, published_at desc)
  where status = 'published';

create table if not exists public.article_likes (
  article_id uuid not null references public.articles(id) on delete cascade,
  visitor_id uuid not null,
  created_at timestamptz not null default now(),
  primary key (article_id, visitor_id)
);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  status text not null default 'pending' check (status in ('pending', 'active', 'unsubscribed')),
  consented_at timestamptz not null default now(),
  confirmed_at timestamptz,
  unsubscribe_token uuid not null default gen_random_uuid(),
  source text not null default 'website',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists newsletter_subscribers_email_lower_idx
  on public.newsletter_subscribers (lower(email));

create or replace function public.is_media_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.toggle_article_like(p_article_id uuid, p_visitor_id uuid)
returns table(liked boolean, likes integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_liked boolean;
  v_likes integer;
begin
  if not exists (
    select 1 from public.articles
    where id = p_article_id and status = 'published'
  ) then
    raise exception 'article not found';
  end if;

  if exists (
    select 1 from public.article_likes
    where article_id = p_article_id and visitor_id = p_visitor_id
  ) then
    delete from public.article_likes
    where article_id = p_article_id and visitor_id = p_visitor_id;
    v_liked := false;
  else
    insert into public.article_likes(article_id, visitor_id)
    values (p_article_id, p_visitor_id)
    on conflict do nothing;
    v_liked := true;
  end if;

  select count(*)::integer into v_likes
  from public.article_likes where article_id = p_article_id;

  update public.articles set like_count = v_likes where id = p_article_id;
  return query select v_liked, v_likes;
end;
$$;

create or replace function public.subscribe_newsletter(p_email text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text := lower(trim(p_email));
begin
  if v_email !~ '^[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}$' then
    raise exception 'invalid email';
  end if;

  insert into public.newsletter_subscribers(email, status, consented_at, updated_at)
  values (v_email, 'pending', now(), now())
  on conflict ((lower(email))) do update
  set status = case when newsletter_subscribers.status = 'unsubscribed' then 'pending' else newsletter_subscribers.status end,
      consented_at = now(),
      updated_at = now();
  return 'accepted';
end;
$$;

alter table public.articles enable row level security;
alter table public.article_likes enable row level security;
alter table public.newsletter_subscribers enable row level security;

drop policy if exists "published articles are public" on public.articles;
create policy "published articles are public" on public.articles
  for select using (status = 'published' or public.is_media_admin());

drop policy if exists "admins manage articles" on public.articles;
create policy "admins manage articles" on public.articles
  for all using (public.is_media_admin()) with check (public.is_media_admin());

drop policy if exists "admins inspect likes" on public.article_likes;
create policy "admins inspect likes" on public.article_likes
  for select using (public.is_media_admin());

drop policy if exists "admins manage subscribers" on public.newsletter_subscribers;
create policy "admins manage subscribers" on public.newsletter_subscribers
  for all using (public.is_media_admin()) with check (public.is_media_admin());

revoke all on function public.toggle_article_like(uuid, uuid) from public;
grant execute on function public.toggle_article_like(uuid, uuid) to anon, authenticated;
revoke all on function public.subscribe_newsletter(text) from public;
grant execute on function public.subscribe_newsletter(text) to anon, authenticated;

comment on table public.articles is '公開前承認を含む熱帯果樹メディアの記事';
comment on table public.newsletter_subscribers is '配信同意を記録するメールマガジン登録者';
