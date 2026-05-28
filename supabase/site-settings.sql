create table if not exists public.site_settings (
  id text primary key,
  home_eyebrow text not null default 'スマホでひらく栽培メモ',
  home_title text not null default 'けんゆーの熱帯果樹図鑑',
  home_description text not null default '果樹ページを親にして、品種・写真・YouTubeを整理する熱帯果樹PWAです。 マンゴー、アボカド、バナナなどを現場で見返しやすい形にまとめます。',
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

grant select on public.site_settings to anon, authenticated;
grant insert, update, delete on public.site_settings to authenticated;
grant execute on function public.is_admin() to anon, authenticated;

drop policy if exists "public site settings are readable" on public.site_settings;
create policy "public site settings are readable" on public.site_settings
for select using (true);

drop policy if exists "admins manage site settings" on public.site_settings;
create policy "admins manage site settings" on public.site_settings
for all using (public.is_admin())
with check (public.is_admin());

insert into public.site_settings (id)
values ('home')
on conflict (id) do nothing;
