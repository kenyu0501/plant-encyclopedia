import Link from "next/link";
import { ArrowRight, BookOpen, Newspaper } from "lucide-react";
import { AnalyticsSummary } from "@/components/analytics-summary";
import { ArticleCard } from "@/components/article-card";
import { CreatorProfile } from "@/components/creator-profile";
import { HomeSearch } from "@/components/home-search";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { PendingSubmissionsNotice } from "@/components/pending-submissions-notice";
import { RecentlyViewedCultivars } from "@/components/recently-viewed-cultivars";
import { RecentlyUpdatedCultivars } from "@/components/recently-updated-cultivars";
import { getCurrentUser, isAdminUser } from "@/lib/auth";
import { getPendingViewerPhotoCount, getPublicSearchEntries, getPublishedArticles, getRecentlyUpdatedCultivars, getSiteAnalytics } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [searchEntries, articles, recentlyUpdatedCultivars, analytics, user] = await Promise.all([
    getPublicSearchEntries(),
    getPublishedArticles({ limit: 7 }),
    getRecentlyUpdatedCultivars(),
    getSiteAnalytics(),
    getCurrentUser()
  ]);
  const isAdmin = await isAdminUser(user);
  const pendingViewerPhotoCount = isAdmin ? await getPendingViewerPhotoCount() : 0;

  return (
    <div className="space-y-10 sm:space-y-12">
      <section className="relative rounded-[2rem] bg-[radial-gradient(circle_at_95%_0%,#2a6547_0%,#142f27_58%)] px-6 py-9 text-white shadow-lift sm:px-10 sm:py-12">
        <div className="max-w-3xl">
          <p className="text-[11px] font-bold tracking-[0.22em] text-fruit-200">TROPICAL FRUIT JOURNAL &amp; FIELD GUIDE</p>
          <h1 className="display-serif mt-5 text-[2.25rem] font-bold leading-[1.3] text-white sm:text-5xl">熱帯果樹を、もっと深く。<br />育てる人の専門メディア。</h1>
          <div className="mt-5 h-px w-14 bg-fruit-300" />
          <p className="mt-5 max-w-2xl text-sm leading-8 text-white/78 sm:text-base">国内外のニュース、研究、栽培のコツを分かりやすく解説。蓄積してきた品種図鑑とともに、毎日の発見を届けます。</p>
        </div>
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link href="/articles" className="inline-flex items-center gap-2 rounded-full bg-fruit-300 px-5 py-3 text-sm font-bold text-leaf-950 transition-colors hover:bg-fruit-200">
            最新記事を読む <ArrowRight size={17} />
          </Link>
          <Link href="/fruits" className="inline-flex items-center gap-2 border-b border-white/40 pb-1 text-xs font-semibold text-white/75 hover:text-white"><BookOpen size={15} />品種図鑑を見る</Link>
        </div>
      </section>

      {articles.length > 0 ? (
        <section className="space-y-5">
          <div className="flex items-end justify-between gap-3"><div><p className="section-kicker">LATEST STORIES</p><h2 className="display-serif mt-2 text-2xl font-bold text-leaf-900 sm:text-3xl">新着記事</h2></div><Link href="/articles" className="inline-flex items-center gap-1 text-xs font-bold text-leaf-700">すべて見る <ArrowRight size={15} /></Link></div>
          <ArticleCard article={articles[0]} featured />
          {articles.length > 1 ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{articles.slice(1).map((article) => <ArticleCard key={article.id} article={article} />)}</div> : null}
        </section>
      ) : (
        <section className="editorial-card flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8"><div><p className="section-kicker">NEW MEDIA</p><h2 className="display-serif mt-2 text-2xl font-bold text-leaf-900">ニュース・栽培記事を準備しています</h2><p className="mt-2 text-sm leading-7 text-leaf-900/60">公開前に内容と出典を確認した記事だけを掲載します。</p></div><Newspaper className="shrink-0 text-leaf-300" size={52} /></section>
      )}

      <section className="editorial-card p-5 sm:p-7">
        <div className="grid gap-5 sm:grid-cols-[0.8fr_1.2fr] sm:items-center"><div><p className="section-kicker">FRUIT ENCYCLOPEDIA</p><h2 className="display-serif mt-2 text-2xl font-bold text-leaf-900">品種図鑑から探す</h2><p className="mt-2 text-sm leading-7 text-leaf-900/60">果樹名・品種名・特徴から検索できます。</p></div><div className="rounded-xl border border-leaf-100 bg-leaf-50/50 p-2"><HomeSearch entries={searchEntries} /></div></div>
      </section>

      <AnalyticsSummary analytics={analytics} />

      <NewsletterSignup />

      <RecentlyViewedCultivars />

      <RecentlyUpdatedCultivars items={recentlyUpdatedCultivars} />

      <CreatorProfile />

      <div className="text-center"><Link href="/admin/login" prefetch={false} className="text-[11px] font-semibold text-leaf-900/35 hover:text-leaf-700">管理者ログイン</Link></div>

      <PendingSubmissionsNotice count={pendingViewerPhotoCount} />
    </div>
  );
}
