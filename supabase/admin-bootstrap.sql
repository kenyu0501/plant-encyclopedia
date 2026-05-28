-- Supabase Authで管理者ユーザーを作成した後、そのユーザーIDに置き換えて実行してください。
-- SQL Editorで実行する想定です。

insert into public.profiles (id, role)
values ('f793fbe1-635c-4dde-9eab-cc33df84bed3', 'admin')
on conflict (id) do update set role = 'admin';
