select
  fruits.name_ja as fruit,
  count(cultivars.id) as cultivar_count
from public.fruits
left join public.cultivars on cultivars.fruit_id = fruits.id
where fruits.slug = 'banana'
group by fruits.name_ja;
