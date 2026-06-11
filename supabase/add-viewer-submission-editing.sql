-- 閲覧者が自分の承認待ち投稿だけを修正・取り下げできるようにします．
-- 画像差し替えや承認済み投稿の直接編集は許可しません．

begin;

create or replace function public.update_own_pending_photo_submission(
  p_photo_id uuid,
  p_caption text,
  p_taken_at date,
  p_contributor_name text,
  p_location_name text,
  p_photo_type text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.photos
  set
    caption = nullif(btrim(p_caption), ''),
    taken_at = p_taken_at,
    contributor_name = nullif(btrim(p_contributor_name), ''),
    location_name = nullif(btrim(p_location_name), ''),
    photo_type = nullif(btrim(p_photo_type), '')
  where id = p_photo_id
    and uploaded_by = auth.uid()
    and source_type = 'viewer'
    and approval_status = 'pending'
    and char_length(coalesce(btrim(p_contributor_name), '')) between 1 and 40
    and (p_caption is null or char_length(p_caption) <= 100)
    and (p_location_name is null or char_length(p_location_name) <= 80);

  return found;
end;
$$;

create or replace function public.withdraw_own_pending_photo_submission(p_photo_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.photos
  set approval_status = 'rejected'
  where id = p_photo_id
    and uploaded_by = auth.uid()
    and source_type = 'viewer'
    and approval_status = 'pending';

  return found;
end;
$$;

grant execute on function public.update_own_pending_photo_submission(uuid, text, date, text, text, text) to authenticated;
grant execute on function public.withdraw_own_pending_photo_submission(uuid) to authenticated;

select 'viewer_submission_editing_ready' as status;

commit;
