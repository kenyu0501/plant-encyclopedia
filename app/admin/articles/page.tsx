import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { articleStatuses, formatArticleDate, getArticleCategory } from "@/lib/articles";
import { requireAdmin } from "@/lib/auth";
import { getAdminArticles } from "@/lib/queries";

export const dynamic = "force-dynamic";
export default async function AdminArticlesPage() {
  const { isAdmin } = await requireAdmin(); if (!isAdmin) redirect("/admin/login");
  const articles = await getAdminArticles();
  return <div className="space-y-6"><PageHeader title="記事管理" description="下書き、承認待ち、公開記事を管理します。" action={<Link href="/admin/articles/new" className="inline-flex items-center gap-2 rounded-lg bg-leaf-900 px-4 py-3 text-sm font-bold text-white"><Plus size={17} />新規記事</Link>} />
    <div className="grid gap-3">{articles.map((article) => { const status = articleStatuses.find((item) => item.value === article.status); return <Link key={article.id} href={`/admin/articles/${article.id}`} className="interactive-card rounded-xl border border-leaf-100 bg-white p-5 shadow-soft"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-[10px] font-black tracking-widest text-leaf-700">{getArticleCategory(article.category).shortLabel}</p><h2 className="display-serif mt-2 text-lg font-bold text-leaf-900">{article.title}</h2><p className="mt-2 text-xs text-leaf-900/50">更新 {formatArticleDate(article.updated_at)}</p></div><span className={`rounded-full px-3 py-1 text-xs font-bold ${article.status === "published" ? "bg-leaf-100 text-leaf-800" : article.status === "pending" ? "bg-fruit-100 text-fruit-800" : "bg-stone-100 text-stone-600"}`}>{status?.label}</span></div></Link>; })}</div>
    {articles.length === 0 ? <p className="editorial-card p-6 text-sm text-leaf-900/65">記事はまだありません。最初の記事を作成してください。</p> : null}
  </div>;
}
