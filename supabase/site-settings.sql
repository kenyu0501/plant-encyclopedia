create table if not exists public.site_settings (
  id text primary key,
  home_eyebrow text not null default 'スマホでひらく栽培メモ',
  home_title text not null default 'けんゆーの熱帯果樹図鑑',
  home_description text not null default '果樹ページを親にして、品種・写真・YouTubeを整理する熱帯果樹PWAです。 マンゴー、アボカド、バナナなどを現場で見返しやすい形にまとめます。',
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

drop policy if exists "public site settings are readable" on public.site_settings;
create policy "public site settings are readable" on public.site_settings
for select using (true);

drop policy if exists "admins manage site settings" on public.site_settings;
create policy "admins manage site settings" on public.site_settings
for all using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
) with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

insert into public.site_settings (id)
values ('home')
on conflict (id) do nothing;
