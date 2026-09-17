"use client";

import Link from "next/link";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { useState } from "react";
import type { AnalyticsCultivarItem, AnalyticsPeriodKey, SiteAnalytics } from "@/lib/queries";

const periods: { key: AnalyticsPeriodKey; label: string; statLabel: string }[] = [
  { key: "24h", label: "24時間", statLabel: "直近24時間のPV" },
  { key: "7d", label: "7日間", statLabel: "直近7日間のPV" },
  { key: "30d", label: "30日間", statLabel: "直近30日間のPV" }
];

export function AnalyticsSummary({ analytics }: { analytics: SiteAnalytics | null }) {
  const [activePeriod, setActivePeriod] = useState<AnalyticsPeriodKey>("24h");
  if (!analytics) return null;

  const period = periods.find((item) => item.key === activePeriod) ?? periods[0];
  const activeAnalytics = analytics.periods[activePeriod];

  return (
    <section className="editorial-card space-y-5 p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="section-kicker">READERS&apos; INTEREST</p>
          <h2 className="display-serif mt-2 text-2xl font-bold text-leaf-900">閲覧データ</h2>
        </div>
        <div className="flex rounded-full bg-leaf-50 p-1 ring-1 ring-leaf-100" aria-label="ランキング期間">
          {periods.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setActivePeriod(item.key)}
              className={`min-h-9 rounded-full px-3 text-xs font-bold transition ${
                activePeriod === item.key ? "bg-leaf-700 text-white shadow-sm" : "text-leaf-900/64"
              }`}
              aria-pressed={activePeriod === item.key}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <StatCard
          label={period.statLabel}
          value={activeAnalytics.views.toLocaleString()}
          comparison={getViewComparison(activeAnalytics.views, activeAnalytics.previousViews)}
        />
        <StatCard label="総PV" value={analytics.totalViews.toLocaleString()} />
      </div>

      {activeAnalytics.topCultivars.length > 0 ? (
        <ol className="divide-y divide-leaf-100 overflow-hidden rounded-xl border border-leaf-100 bg-white">
          {activeAnalytics.topCultivars.map((item, index) => (
            <li key={item.href}>
              <Link href={item.href} prefetch={false} className="flex items-center gap-3 p-3.5 transition-colors hover:bg-leaf-50">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-leaf-50 text-sm font-black text-leaf-800 ring-1 ring-leaf-100">
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate font-bold text-leaf-900">{item.cultivarName}</span>
                    <RankChange item={item} />
                  </span>
                  <span className="mt-0.5 block text-xs font-semibold text-leaf-900/56">{item.fruitName}</span>
                </span>
                <span className="text-sm font-bold text-leaf-800">{item.views.toLocaleString()} PV</span>
              </Link>
            </li>
          ))}
        </ol>
      ) : (
        <p className="rounded-lg bg-leaf-50 p-3 text-sm leading-6 text-leaf-900/68">
          この期間の品種ページ閲覧データが集まると，ここにランキングが表示されます．
        </p>
      )}
    </section>
  );
}

function RankChange({ item }: { item: AnalyticsCultivarItem }) {
  if (item.previousRank === null) {
    return <span className="shrink-0 rounded bg-fruit-100 px-1.5 py-0.5 text-[10px] font-black text-fruit-800">NEW</span>;
  }
  if (item.rankChange === 0) {
    return <Minus size={13} className="shrink-0 text-leaf-900/38" aria-label="順位変動なし" />;
  }
  if ((item.rankChange ?? 0) > 0) {
    return (
      <span className="inline-flex shrink-0 items-center text-[11px] font-black text-emerald-700" aria-label={`${item.rankChange}位上昇`}>
        <ArrowUp size={13} />{item.rankChange}
      </span>
    );
  }
  return (
    <span className="inline-flex shrink-0 items-center text-[11px] font-black text-rose-600" aria-label={`${Math.abs(item.rankChange ?? 0)}位下降`}>
      <ArrowDown size={13} />{Math.abs(item.rankChange ?? 0)}
    </span>
  );
}

function getViewComparison(current: number, previous: number) {
  if (previous === 0) return current > 0 ? "前期間は0 PV" : "前期間と同じ";
  const change = Math.round(((current - previous) / previous) * 100);
  if (change === 0) return "前期間と同じ";
  return `前期間比 ${change > 0 ? "+" : ""}${change}%`;
}

function StatCard({ label, value, comparison }: { label: string; value: string; comparison?: string }) {
  return (
    <div className="rounded-xl border border-leaf-100 bg-leaf-50/75 p-5">
      <p className="text-xs font-bold tracking-wide text-leaf-700">{label}</p>
      <p className="display-serif mt-2 text-3xl font-bold text-leaf-900">{value}</p>
      {comparison ? <p className="mt-1 text-xs font-semibold text-leaf-900/52">{comparison}</p> : null}
    </div>
  );
}
