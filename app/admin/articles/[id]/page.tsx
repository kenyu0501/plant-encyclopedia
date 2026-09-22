import { notFound, redirect } from "next/navigation";
import { ArticleForm } from "@/components/article-form";
import { PageHeader } from "@/components/page-header";
import { requireAdmin } from "@/lib/auth";
import { getAdminArticleById } from "@/lib/queries";
export const dynamic = "force-dynamic";
export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) { const { isAdmin } = await requireAdmin(); if (!isAdmin) redirect("/admin/login"); const { id } = await params; const article = await getAdminArticleById(id); if (!article) notFound(); return <div className="space-y-6"><PageHeader title="記事を編集" description="出典、本文、公開状態を確認できます。" /><ArticleForm article={article} /></div>; }
