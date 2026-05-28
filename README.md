# けんゆーの熱帯果樹図鑑

Next.js App Router、TypeScript、Tailwind CSS、Supabase Auth/Database/Storage/RLSで作る熱帯果樹図鑑PWAです。

ローカルとVercelではNode.js 24系を使ってください。

## 実装済みMVP

- 公開トップページ
- 果樹一覧
- 果樹詳細
- 果樹に紐づく品種一覧
- 品種詳細
- 管理者ログイン
- 管理者用の果樹追加・編集・削除
- 管理者用の品種追加・編集・削除
- Supabase Storageへのスマホ写真アップロード
- YouTubeリンク登録
- 公開／非公開切り替え
- 下部ナビつきスマホ対応UI
- PWA manifestと基本service worker

## セットアップ

1. Supabaseで新規プロジェクトを作成します。
2. Supabase SQL Editorで `supabase/schema.sql` を実行します。
3. 必要なら `supabase/seed.sql` を実行してサンプル果樹を入れます。
4. Supabase Authで管理者ユーザーを作成します。
5. SQL Editorでそのユーザーを管理者にします。

```sql
insert into public.profiles (id, role)
values ('AUTH_USER_ID_HERE', 'admin')
on conflict (id) do update set role = 'admin';
```

6. `.env.example` を参考に `.env.local` を作成します。
7. 依存関係を入れて起動します。

```bash
npm install
npm run dev
```

公開までの詳しい手順は [docs/deploy.md](./docs/deploy.md) を見てください。

## 主なURL

- `/` 公開トップ
- `/fruits` 果樹一覧
- `/fruits/[slug]` 果樹詳細
- `/fruits/[slug]/cultivars/[cultivarSlug]` 品種詳細
- `/admin/login` 管理者ログイン
- `/admin` 管理画面
- `/admin/photos` 写真アップロード
- `/admin/videos` YouTube登録

## Supabase Storage

`supabase/schema.sql` は `fruit-photos` bucketをpublic bucketとして作成します。写真レコード自体は `photos.approval_status = 'approved'` のものだけ一般公開ページに表示されます。
