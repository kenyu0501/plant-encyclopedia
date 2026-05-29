-- 果樹の公開表示順を管理できるようにします。
-- 小さい数字ほど先に表示されます。null の果樹は後ろで名前順になります。

alter table public.fruits
add column if not exists display_order integer;

create index if not exists fruits_public_display_order_idx
on public.fruits (is_public, display_order, name_ja);

-- 現在公開中の主要果樹に初期順を入れます。あとで管理画面から変更できます。
update public.fruits
set display_order = case slug
  when 'mango' then 10
  when 'avocado' then 20
  when 'banana' then 30
  else display_order
end
where slug in ('mango', 'avocado', 'banana')
  and display_order is null;

select slug, name_ja, display_order
from public.fruits
order by display_order nulls last, name_ja;
