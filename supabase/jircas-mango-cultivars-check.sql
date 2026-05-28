select
  count(*) as imported_jircas_mango_cultivars
from public.cultivars
join public.fruits on fruits.id = cultivars.fruit_id
where fruits.slug = 'mango'
  and cultivars.public_notes like '%JIRCASマンゴー遺伝資源サイト%';
