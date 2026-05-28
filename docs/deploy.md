# 公開までの手順

このアプリを実際に動かして公開する流れです。

## 1. Supabaseプロジェクトを作る

1. Supabaseにログインします。
2. New projectを作成します。
3. Project Settings > API から次を控えます。
   - Project URL
   - anon public key

## 2. データベースを作る

Supabase DashboardのSQL Editorで、次の順番で実行します。

1. `supabase/schema.sql`
2. 必要なら `supabase/seed.sql`

`schema.sql` は以下を作成します。

- `fruits`
- `cultivars`
- `photos`
- `videos`
- `profiles`
- `fruit-photos` Storage bucket
- RLS policy

## 3. 管理者ユーザーを作る

1. Supabase Dashboard > Authentication > Users で管理者ユーザーを作成します。
2. 作成したユーザーのUUIDをコピーします。
3. `supabase/admin-bootstrap.sql` のUUIDを置き換えてSQL Editorで実行します。

## 4. ローカル環境変数

`.env.local` を作成します。

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_ADMIN_USER_IDS=your-admin-user-uuid
```

## 5. ローカル起動

Node.js 24系を使ってください。

```bash
npm install
npm run dev
```

このCodex作業フォルダでは `.tools` にNode.js 24を配置済みなので、以下でも起動できます。

```bash
sh scripts/dev-local.sh
```

ブラウザで `http://localhost:3000` を開きます。

## 6. Vercelに公開

1. GitHubにこのプロジェクトをpushします。
2. VercelでNew Projectからこのリポジトリを選びます。
3. Project Settings > General > Node.js VersionでNode.js 24系を選びます。
4. Environment Variablesに以下を設定します。

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.vercel.app
NEXT_PUBLIC_ADMIN_USER_IDS=your-admin-user-uuid
```

5. Deployします。

## 7. Supabase AuthのURL設定

Supabase Dashboard > Authentication > URL Configurationで、VercelのURLを登録します。

```text
Site URL:
https://your-vercel-domain.vercel.app

Redirect URLs:
https://your-vercel-domain.vercel.app/**
http://localhost:3000/**
```

独自ドメインを使う場合は、独自ドメインも追加します。

```text
Site URL:
https://your-domain.example

Redirect URLs:
https://your-domain.example/**
https://your-vercel-domain.vercel.app/**
http://localhost:3000/**
```

## 8. XServerで取得したドメインを使う

アプリ本体はVercelに置き、XServer側ではDNSだけをVercelに向けます。

1. Vercel > Project > Settings > Domainsを開きます。
2. 使いたいドメインを追加します。
   - 例: `tropical-fruits.example.com`
   - ルートドメインを使う場合: `example.com`
3. Vercelに表示されるDNSレコードをXServer側に登録します。

サブドメインの場合は、基本的にCNAMEを使います。

```text
Type: CNAME
Name: tropical-fruits
Value: cname.vercel-dns.com
```

ルートドメインの場合は、Vercelが表示するAレコードを設定します。

```text
Type: A
Name: @
Value: 76.76.21.21
```

`www` も使う場合はCNAMEを追加します。

```text
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

DNS反映には数分から数時間かかることがあります。反映後、Vercel側でSSL証明書が自動発行されます。

## 9. 公開後に確認すること

- `/` が表示される
- `/fruits` に公開中の果樹が出る
- `/admin/login` で管理者ログインできる
- 果樹を追加できる
- 品種を追加できる
- `/admin/photos` で写真をアップロードできる
- `/admin/videos` でYouTubeリンクを登録できる
- `is_public` をオフにした果樹・品種が一般画面に出ない
