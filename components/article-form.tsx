"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { articleCategories, articleStatuses, createArticleSlug } from "@/lib/articles";
import { createClient } from "@/lib/supabase-browser";
import type { Article, ArticleCategory, ArticleStatus } from "@/types/database";

export function ArticleForm({ article }: { article?: Article | null }) {
  const router = useRouter();
  const [title, setTitle] = useState(article?.title ?? "");
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [category, setCategory] = useState<ArticleCategory>(article?.category ?? "news");
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? "");
  const [content, setContent] = useState(article?.content ?? "");
  const [heroImageUrl, setHeroImageUrl] = useState(article?.hero_image_url ?? "");
  const [sourceName, setSourceName] = useState(article?.source_name ?? "");
  const [sourceUrl, setSourceUrl] = useState(article?.source_url ?? "");
  const [sourcePublishedAt, setSourcePublishedAt] = useState(toLocalDate(article?.source_published_at));
  const [youtubeUrl, setYoutubeUrl] = useState(article?.youtube_url ?? "");
  const [authorName, setAuthorName] = useState(article?.author_name ?? "けんゆー");
  const [status, setStatus] = useState<ArticleStatus>(article?.status ?? "draft");
  const [isFeatured, setIsFeatured] = useState(article?.is_featured ?? false);
  const [seoTitle, setSeoTitle] = useState(article?.seo_title ?? "");
  const [seoDescription, setSeoDescription] = useState(article?.seo_description ?? "");
  const [reviewNotes, setReviewNotes] = useState(article?.review_notes ?? "");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setMessage("管理者ログインが必要です。"); setLoading(false); return; }
    const now = new Date().toISOString();
    const finalSlug = slug.trim() || createArticleSlug(title);
    const payload = {
      title: title.trim(), slug: finalSlug, category, excerpt: excerpt.trim(), content: content.trim(),
      hero_image_url: heroImageUrl.trim() || null, source_name: sourceName.trim() || null, source_url: sourceUrl.trim() || null,
      source_published_at: sourcePublishedAt ? new Date(sourcePublishedAt).toISOString() : null,
      youtube_url: youtubeUrl.trim() || null, author_name: authorName.trim() || "けんゆー", status, is_featured: isFeatured,
      seo_title: seoTitle.trim() || null, seo_description: seoDescription.trim() || null, review_notes: reviewNotes.trim() || null,
      created_by: article?.created_by ?? user.id,
      approved_by: status === "published" ? user.id : article?.approved_by ?? null,
      approved_at: status === "published" ? article?.approved_at ?? now : article?.approved_at ?? null,
      published_at: status === "published" ? article?.published_at ?? now : article?.published_at ?? null,
      updated_at: now
    };
    const result = article
      ? await supabase.from("articles").update(payload).eq("id", article.id).select("id").single()
      : await supabase.from("articles").insert(payload).select("id").single();
    setLoading(false);
    if (result.error) { setMessage(result.error.message); return; }
    const articleId = result.data.id as string;
    setSlug(finalSlug);
    setMessage(status === "published" ? "記事を公開しました。" : status === "pending" ? "承認待ちとして保存しました。" : "記事を保存しました。");
    if (status === "pending") await fetch("/api/article-review-notification", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ articleId, title: title.trim() }) });
    if (!article) router.replace(`/admin/articles/${articleId}`);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <section className="editorial-card space-y-4 p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="タイトル"><input required value={title} onChange={(event) => setTitle(event.target.value)} className="form-control" /></Field>
          <Field label="URLスラッグ"><input value={slug} onChange={(event) => setSlug(event.target.value)} placeholder="空欄ならタイトルから自動作成" className="form-control" /></Field>
          <Field label="カテゴリー"><select value={category} onChange={(event) => setCategory(event.target.value as ArticleCategory)} className="form-control">{articleCategories.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></Field>
          <Field label="公開状態"><select value={status} onChange={(event) => setStatus(event.target.value as ArticleStatus)} className="form-control">{articleStatuses.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></Field>
        </div>
        <Field label="概要（一覧・SNS・検索結果に使用）"><textarea required rows={3} value={excerpt} onChange={(event) => setExcerpt(event.target.value)} className="form-control" /></Field>
        <Field label="本文（空行で段落を分けます）"><textarea required rows={18} value={content} onChange={(event) => setContent(event.target.value)} className="form-control font-mono text-sm leading-7" /></Field>
        <Field label="メイン画像URL"><input type="url" value={heroImageUrl} onChange={(event) => setHeroImageUrl(event.target.value)} className="form-control" /></Field>
        <label className="flex items-center justify-between gap-3 rounded-lg bg-leaf-50 p-4"><span className="font-bold text-leaf-900">トップの注目記事にする</span><input type="checkbox" checked={isFeatured} onChange={(event) => setIsFeatured(event.target.checked)} className="h-5 w-5" /></label>
      </section>
      <section className="editorial-card space-y-4 p-5 sm:p-6">
        <h2 className="display-serif text-xl font-bold text-leaf-900">出典・動画</h2>
        <div className="grid gap-4 sm:grid-cols-2"><Field label="出典名"><input value={sourceName} onChange={(event) => setSourceName(event.target.value)} className="form-control" /></Field><Field label="出典公開日"><input type="datetime-local" value={sourcePublishedAt} onChange={(event) => setSourcePublishedAt(event.target.value)} className="form-control" /></Field></div>
        <Field label="出典URL（一次資料を推奨）"><input type="url" value={sourceUrl} onChange={(event) => setSourceUrl(event.target.value)} className="form-control" /></Field>
        <Field label="YouTube URL"><input type="url" value={youtubeUrl} onChange={(event) => setYoutubeUrl(event.target.value)} className="form-control" /></Field>
      </section>
      <section className="editorial-card space-y-4 p-5 sm:p-6">
        <h2 className="display-serif text-xl font-bold text-leaf-900">編集・SEO</h2>
        <Field label="執筆者"><input value={authorName} onChange={(event) => setAuthorName(event.target.value)} className="form-control" /></Field>
        <Field label="SEOタイトル"><input value={seoTitle} onChange={(event) => setSeoTitle(event.target.value)} className="form-control" /></Field>
        <Field label="SEO説明"><textarea rows={3} value={seoDescription} onChange={(event) => setSeoDescription(event.target.value)} className="form-control" /></Field>
        <Field label="承認メモ（公開されません）"><textarea rows={3} value={reviewNotes} onChange={(event) => setReviewNotes(event.target.value)} className="form-control" /></Field>
      </section>
      {message ? <p aria-live="polite" className="rounded-lg bg-leaf-50 p-4 text-sm font-semibold text-leaf-900">{message}</p> : null}
      <button type="submit" disabled={loading} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-leaf-900 px-5 font-bold text-white disabled:opacity-60"><Save size={18} />{loading ? "保存中" : "記事を保存"}</button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block"><span className="mb-2 block text-sm font-bold text-leaf-900">{label}</span>{children}</label>; }
function toLocalDate(value?: string | null) { if (!value) return ""; const date = new Date(value); const offset = date.getTimezoneOffset() * 60000; return new Date(date.getTime() - offset).toISOString().slice(0, 16); }
