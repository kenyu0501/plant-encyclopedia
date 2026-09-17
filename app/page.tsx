import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnalyticsSummary } from "@/components/analytics-summary";
import { CreatorProfile } from "@/components/creator-profile";
import { HomeSearch } from "@/components/home-search";
import { PendingSubmissionsNotice } from "@/components/pending-submissions-notice";
import { RecentlyViewedCultivars } from "@/components/recently-viewed-cultivars";
import { RecentlyUpdatedCultivars } from "@/components/recently-updated-cultivars";
import { getCurrentUser, isAdminUser } from "@/lib/auth";
import { getPendingViewerPhotoCount, getPublicSearchEntries, getRecentlyUpdatedCultivars, getSiteAnalytics, getSiteSettings } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [settings, searchEntries, analytics, recentlyUpdatedCultivars, user] = await Promise.all([
    getSiteSettings(),
    getPublicSearchEntries(),
    getSiteAnalytics(),
    getRecentlyUpdatedCultivars(),
    getCurrentUser()
  ]);
  const isAdmin = await isAdminUser(user);
  const pendingViewerPhotoCount = isAdmin ? await getPendingViewerPhotoCount() : 0;

  return (
    <div className="space-y-10 sm:space-y-12">
      <section className="relative rounded-[2rem] bg-[radial-gradient(circle_at_95%_0%,#2a6547_0%,#142f27_58%)] px-6 py-9 text-white shadow-lift sm:px-10 sm:py-12">
        <div className="max-w-2xl">
          <p className="text-[11px] font-bold tracking-[0.22em] text-fruit-200">{settings.home_eyebrow}</p>
          <h1 className="display-serif mt-5 text-[2.25rem] font-bold leading-[1.3] text-white sm:text-5xl">
            {settings.home_title}
          </h1>
          <div className="mt-5 h-px w-14 bg-fruit-300" />
          <p className="mt-5 max-w-xl text-sm leading-8 text-white/78 sm:text-base">
            {settings.home_description}
          </p>
        </div>
        <div className="mt-7 max-w-xl rounded-xl bg-white p-2 text-leaf-900 shadow-lift sm:mt-9">
          <HomeSearch entries={searchEntries} />
        </div>
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link href="/fruits" prefetch={false} className="inline-flex items-center gap-2 rounded-full bg-fruit-300 px-5 py-3 text-sm font-bold text-leaf-950 transition-colors hover:bg-fruit-200">
            果樹一覧を見る <ArrowRight size={17} />
          </Link>
          <Link href="/admin/login" prefetch={false} className="border-b border-white/40 pb-1 text-xs font-semibold text-white/70 hover:text-white">
            管理者ログイン
          </Link>
        </div>
      </section>

      <AnalyticsSummary analytics={analytics} />

      <RecentlyViewedCultivars />

      <RecentlyUpdatedCultivars items={recentlyUpdatedCultivars} />

      <CreatorProfile />

      <PendingSubmissionsNotice count={pendingViewerPhotoCount} />
    </div>
  );
}
