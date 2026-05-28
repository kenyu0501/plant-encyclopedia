select
  count(*) as avocado_cultivar_count
from public.cultivars
join public.fruits on fruits.id = cultivars.fruit_id
where fruits.slug = 'avocado';
