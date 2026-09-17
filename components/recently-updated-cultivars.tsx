import Link from "next/link";
import { Sparkles } from "lucide-react";
import type { RecentlyUpdatedCultivar } from "@/lib/queries";

export function RecentlyUpdatedCultivars({ items }: { items: RecentlyUpdatedCultivar[] }) {
  if (items.length === 0) return null;

  return (
    <section className="space-y-3">
      <div>
        <p className="section-kicker">LATEST NOTES</p>
        <h2 className="display-serif mt-2 flex items-center gap-2 text-2xl font-bold text-leaf-900">
          <Sparkles size={20} className="text-fruit-600" /> 最近更新された品種
        </h2>
        <p className="mt-1 text-sm text-leaf-900/58">新しい情報や修正が加わった品種です．</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Link key={item.id} href={item.href} prefetch={false} className="interactive-card rounded-xl border border-leaf-100 bg-white p-5 shadow-soft">
            <p className="display-serif text-lg font-bold text-leaf-900">{item.cultivarName}</p>
            {item.nameEn ? <p className="mt-1 truncate text-xs text-leaf-900/50">{item.nameEn}</p> : null}
            <div className="mt-3 flex items-center justify-between gap-2 text-xs font-semibold text-leaf-900/54">
              <span>{item.fruitName}</span>
              <time dateTime={item.updatedAt}>{formatUpdatedAt(item.updatedAt)}</time>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function formatUpdatedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "更新済み";
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    month: "numeric",
    day: "numeric"
  }).format(date);
}
