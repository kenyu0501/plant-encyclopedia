"use client";

import Link from "next/link";
import { Clock3, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  RECENT_CULTIVARS_EVENT,
  RECENT_CULTIVARS_STORAGE_KEY,
  readRecentCultivars,
  type RecentCultivar
} from "@/lib/recent-cultivars";

export function RecentlyViewedCultivars() {
  const [items, setItems] = useState<RecentCultivar[]>([]);

  useEffect(() => {
    const refresh = () => setItems(readRecentCultivars());
    refresh();
    window.addEventListener(RECENT_CULTIVARS_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(RECENT_CULTIVARS_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  if (items.length === 0) return null;

  const clearHistory = () => {
    try {
      window.localStorage.removeItem(RECENT_CULTIVARS_STORAGE_KEY);
    } catch {
      // localStorageが利用できない場合は表示だけを消します。
    }
    setItems([]);
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-xl font-bold text-leaf-900">
          <Clock3 size={20} />
          最近見た品種
        </h2>
        <button type="button" onClick={clearHistory} className="inline-flex items-center gap-1 text-xs font-semibold text-leaf-900/54">
          <X size={14} />履歴を消す
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="w-44 shrink-0 rounded-lg bg-white/84 p-4 ring-1 ring-leaf-100"
          >
            <p className="truncate font-bold text-leaf-900">{item.cultivarName}</p>
            <p className="mt-1 truncate text-xs font-semibold text-leaf-900/54">{item.fruitName}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
