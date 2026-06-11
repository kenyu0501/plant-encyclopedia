import Link from "next/link";
import { CalendarDays, ChevronRight, Sparkles } from "lucide-react";
import type { SeasonalCultivar } from "@/lib/queries";

export function SeasonalCultivars({ items, month }: { items: SeasonalCultivar[]; month: number }) {
  if (items.length === 0) return null;

  return (
    <section className="space-y-3 rounded-lg bg-white/84 p-5 ring-1 ring-leaf-100">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm font-bold text-fruit-700">
            <CalendarDays size={17} />
            {month}月の旬
          </div>
          <h2 className="mt-1 text-xl font-bold text-leaf-900">今見たいフルーツ</h2>
        </div>
        <span className="rounded-md bg-fruit-100 px-2 py-1 text-xs font-bold text-leaf-900">
          {items.length}品種
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <Link key={item.id} href={item.href} className="group rounded-lg bg-leaf-50 p-4 ring-1 ring-leaf-100 transition hover:bg-fruit-50">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-fruit-700 ring-1 ring-fruit-100">
                <Sparkles size={18} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-bold text-leaf-900/56">{item.fruitName}</span>
                <span className="mt-1 block truncate text-base font-black text-leaf-900">{item.cultivarName}</span>
                {item.harvestSeason ? (
                  <span className="mt-2 block line-clamp-2 text-xs leading-5 text-leaf-900/66">
                    {shortSeason(item.harvestSeason)}
                  </span>
                ) : null}
              </span>
              <ChevronRight className="mt-1 shrink-0 text-leaf-700/50 transition group-hover:translate-x-0.5" size={18} />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function shortSeason(value: string) {
  return value.replace(/JIRCAS成熟日数:\s*/g, "").split("\n")[0] ?? value;
}
