import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard } from "@/components/article-card";
import { AdSlot } from "@/components/ad-slot";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { PageHeader } from "@/components/page-header";
import { articleCategories } from "@/lib/articles";
import { getPublishedArticles } from "@/lib/queries";
import type { ArticleCategory } from "@/types/database";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "記事・ニュース", description: "熱帯果樹のニュース、栽培方法、研究情報をけんゆーが分かりやすく紹介します。" };

export default async function ArticlesPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category: requestedCategory } = await searchParams;
  const category = articleCategories.some((item) => item.value === requestedCategory) ? requestedCategory as ArticleCategory : undefined;
  const articles = await getPublishedArticles({ category });
  const [featured, ...rest] = articles;

  return (
    <div className="space-y-7">
      <PageHeader title="熱帯果樹ジャーナル" description="国内外のニュース、論文、栽培のコツを、現場の視点で読み解きます。" />
      <nav aria-label="記事カテゴリー" className="flex gap-2 overflow-x-auto pb-1">
        <CategoryLink href="/articles" active={!category}>すべて</CategoryLink>
        {articleCategories.map((item) => <CategoryLink key={item.value} href={`/articles?category=${item.value}`} active={category === item.value}>{item.label}</CategoryLink>)}
      </nav>
      {featured ? (
        <>
          <ArticleCard article={featured} featured />
          <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_FEED_SLOT} className="my-2 min-h-24" />
          {rest.length > 0 ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{rest.map((article) => <ArticleCard key={article.id} article={article} />)}</div> : null}
        </>
      ) : (
        <section className="editorial-card p-8 text-center"><p className="font-bold text-leaf-900">記事を準備しています</p><p className="mt-2 text-sm text-leaf-900/60">公開された記事がここに並びます。</p></section>
      )}
      <NewsletterSignup />
    </div>
  );
}

function CategoryLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return <Link href={href} className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold ${active ? "border-leaf-900 bg-leaf-900 text-white" : "border-leaf-200 bg-white text-leaf-800"}`}>{children}</Link>;
}
