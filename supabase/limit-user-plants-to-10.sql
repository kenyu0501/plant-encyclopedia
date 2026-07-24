-- 読者1人につき、育てている株を最大10株に制限します。
-- Supabase SQL Editorで、このファイル全体を1回実行してください。

create or replace function public.enforce_user_plants_limit()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  -- 同じ利用者による同時登録を直列化し、10株を超えないようにします。
  perform pg_advisory_xact_lock(hashtextextended(new.user_id::text, 0));

  if (
    select count(*)
    from public.user_plants
    where user_id = new.user_id
  ) >= 10 then
    raise exception using
      errcode = 'P0001',
      message = 'user_plants_limit_exceeded';
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_user_plants_limit_trigger on public.user_plants;
create trigger enforce_user_plants_limit_trigger
before insert on public.user_plants
for each row
execute function public.enforce_user_plants_limit();

revoke all on function public.enforce_user_plants_limit() from public;
