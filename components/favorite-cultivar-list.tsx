"use client";

import Link from "next/link";
import { Heart, Leaf, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  CULTIVAR_FAVORITES_EVENT,
  favoriteStatusOptions,
  getFavoriteStatusLabel,
  readFavoriteCultivars,
  removeFavoriteCultivar,
  saveFavoriteCultivar,
  type FavoriteCultivar,
  type FavoriteStatus
} from "@/lib/cultivar-favorites";

type FilterStatus = "all" | FavoriteStatus;

export function FavoriteCultivarList() {
  const [items, setItems] = useState<FavoriteCultivar[]>([]);
  const [activeStatus, setActiveStatus] = useState<FilterStatus>("all");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const refresh = () => {
      setItems(readFavoriteCultivars());
      setReady(true);
    };
    refresh();
    window.addEventListener(CULTIVAR_FAVORITES_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(CULTIVAR_FAVORITES_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const visibleItems = useMemo(
    () => (activeStatus === "all" ? items : items.filter((item) => item.status === activeStatus)),
    [activeStatus, items]
  );

  if (!ready) {
    return (
      <div className="rounded-lg bg-white/84 p-5 text-sm text-leaf-900/56 ring-1 ring-leaf-100">
        保存した品種を読み込んでいます。
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <section className="rounded-lg border border-dashed border-leaf-200 bg-white/76 p-7 text-center">
        <Heart className="mx-auto text-fruit-500" size={34} />
        <h2 className="mt-4 text-lg font-bold text-leaf-900">保存した品種はまだありません</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-leaf-900/60">
          品種詳細ページの♡から、「育てている」「育てたい」「気になる」のいずれかに保存できます。
        </p>
        <Link
          href="/fruits"
          className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-md bg-leaf-700 px-4 py-2 text-sm font-bold text-white"
        >
          <Leaf size={17} />
          果樹から品種を探す
        </Link>
      </section>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="保存状態で絞り込み">
        <StatusFilterButton
          active={activeStatus === "all"}
          label="すべて"
          count={items.length}
          onClick={() => setActiveStatus("all")}
        />
        {favoriteStatusOptions.map((option) => (
          <StatusFilterButton
            key={option.value}
            active={activeStatus === option.value}
            label={option.label}
            count={items.filter((item) => item.status === option.value).length}
            onClick={() => setActiveStatus(option.value)}
          />
        ))}
      </div>

      <p aria-live="polite" className="text-sm font-semibold text-leaf-900/56">
        {visibleItems.length}品種を表示
      </p>

      {visibleItems.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {visibleItems.map((item) => (
            <article key={item.id} className="rounded-lg bg-white/84 p-4 ring-1 ring-leaf-100">
              <div className="flex items-start justify-between gap-3">
                <Link href={item.href} className="min-w-0 flex-1">
                  <h2 className="truncate font-bold text-leaf-900">{item.cultivarName}</h2>
                  <p className="mt-1 truncate text-xs font-semibold text-leaf-900/52">{item.fruitName}</p>
                </Link>
                <button
                  type="button"
                  onClick={() => removeFavoriteCultivar(item.id)}
                  aria-label={`${item.cultivarName}をリストから削除`}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-leaf-900/44 transition hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 size={17} />
                </button>
              </div>

              <label className="mt-4 block text-xs font-bold text-leaf-900/56">
                保存状態
                <select
                  value={item.status}
                  onChange={(event) =>
                    saveFavoriteCultivar(
                      {
                        id: item.id,
                        fruitName: item.fruitName,
                        cultivarName: item.cultivarName,
                        href: item.href
                      },
                      event.target.value as FavoriteStatus
                    )
                  }
                  aria-label={`${item.cultivarName}の保存状態`}
                  className="mt-1 min-h-11 w-full rounded-md border border-leaf-200 bg-white px-3 text-sm font-semibold text-leaf-900 outline-none focus:border-leaf-500 focus:ring-2 focus:ring-leaf-200"
                >
                  {favoriteStatusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <Link
                href={item.href}
                className="mt-3 inline-flex min-h-10 items-center text-sm font-bold text-leaf-700"
              >
                品種詳細を見る
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-leaf-200 bg-white/70 p-6 text-center">
          <p className="font-bold text-leaf-900">
            「{activeStatus === "all" ? "すべて" : getFavoriteStatusLabel(activeStatus)}」の品種はありません
          </p>
          <button
            type="button"
            onClick={() => setActiveStatus("all")}
            className="mt-3 min-h-10 text-sm font-bold text-leaf-700"
          >
            すべての保存品種を見る
          </button>
        </div>
      )}

      <p className="rounded-md bg-leaf-50 p-3 text-xs leading-5 text-leaf-900/56">
        保存内容は現在お使いの端末に保存されます。ブラウザのデータを削除すると、リストも消去されます。
      </p>
    </div>
  );
}

function StatusFilterButton({
  active,
  label,
  count,
  onClick
}: {
  active: boolean;
  label: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={[
        "flex min-h-11 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-bold transition",
        active ? "bg-leaf-700 text-white" : "bg-white text-leaf-900/68 ring-1 ring-leaf-100"
      ].join(" ")}
    >
      {label}
      <span className={active ? "text-white/72" : "text-leaf-900/42"}>{count}</span>
    </button>
  );
}
