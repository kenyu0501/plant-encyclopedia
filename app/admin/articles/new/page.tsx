import { redirect } from "next/navigation";
import { ArticleForm } from "@/components/article-form";
import { PageHeader } from "@/components/page-header";
import { requireAdmin } from "@/lib/auth";
export const dynamic = "force-dynamic";
export default async function NewArticlePage() { const { isAdmin } = await requireAdmin(); if (!isAdmin) redirect("/admin/login"); return <div className="space-y-6"><PageHeader title="記事を作成" description="公開前に出典と内容を確認し、承認待ちまたは公開を選択します。" /><ArticleForm /></div>; }
