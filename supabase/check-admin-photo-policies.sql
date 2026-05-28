select schemaname, tablename, policyname, cmd
from pg_policies
where schemaname in ('public', 'storage')
  and (
    tablename in ('photos', 'objects')
    or policyname ilike '%fruit photos%'
    or policyname ilike '%photos%'
  )
order by schemaname, tablename, policyname;

select id, name, public
from storage.buckets
where id = 'fruit-photos';

select id, role
from public.profiles
where id = 'f793fbe1-635c-4dde-9eab-cc33df84bed3';
