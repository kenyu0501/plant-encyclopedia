import Link from "next/link";
import type { SiteAnalytics } from "@/lib/queries";

export function AnalyticsSummary({ analytics }: { analytics: SiteAnalytics | null }) {
  if (!analytics) return null;

  return (
    <section className="space-y-3 rounded-lg bg-white/84 p-5 ring-1 ring-leaf-100">
      <div>
        <h2 className="text-xl font-bold text-leaf-900">閲覧データ</h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <StatCard label="今日のPV" value={analytics.todayViews.toLocaleString()} />
        <StatCard label="総PV" value={analytics.totalViews.toLocaleString()} />
      </div>

      {analytics.topCultivars.length > 0 ? (
        <ol className="divide-y divide-leaf-100 overflow-hidden rounded-lg bg-leaf-50 ring-1 ring-leaf-100">
          {analytics.topCultivars.map((item, index) => (
            <li key={item.href}>
              <Link href={item.href} className="flex items-center gap-3 p-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-sm font-black text-leaf-800 ring-1 ring-leaf-100">
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-bold text-leaf-900">{item.cultivarName}</span>
                  <span className="mt-0.5 block text-xs font-semibold text-leaf-900/56">{item.fruitName}</span>
                </span>
                <span className="text-sm font-bold text-leaf-800">{item.views.toLocaleString()} PV</span>
              </Link>
            </li>
          ))}
        </ol>
      ) : (
        <p className="rounded-lg bg-leaf-50 p-3 text-sm leading-6 text-leaf-900/68">
          品種ページの閲覧データが集まると、ここにランキングが表示されます。
        </p>
      )}
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-leaf-50 p-4 ring-1 ring-leaf-100">
      <p className="text-xs font-bold text-leaf-700">{label}</p>
      <p className="mt-1 text-2xl font-black text-leaf-900">{value}</p>
    </div>
  );
}
