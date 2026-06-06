"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Edit3, Eye, EyeOff, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import type { AdminCultivar } from "@/lib/queries";
import { createClient } from "@/lib/supabase-browser";
import type { Fruit } from "@/types/database";

type VisibilityFilter = "all" | "public" | "private";

export function AdminCultivarList({ cultivars, fruits }: { cultivars: AdminCultivar[]; fruits: Fruit[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [visibility, setVisibility] = useState<VisibilityFilter>("all");
  const [fruitId, setFruitId] = useState("all");
  const [items, setItems] = useState(cultivars);
  const [updatingIds, setUpdatingIds] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const normalizedQuery = normalize(query);

  useEffect(() => {
    setItems(cultivars);
  }, [cultivars]);

  const filteredCultivars = useMemo(
    () =>
      items.filter((cultivar) => {
        if (fruitId !== "all" && cultivar.fruit_id !== fruitId) return false;
        if (visibility === "public" && !cultivar.is_public) return false;
        if (visibility === "private" && cultivar.is_public) return false;
        if (!normalizedQuery) return true;

        return normalize(
          [cultivar.name_ja, cultivar.name_en, cultivar.slug, cultivar.fruits?.name_ja, cultivar.fruits?.slug]
            .filter(Boolean)
          .join(" ")
        ).includes(normalizedQuery);
      }),
    [fruitId, items, normalizedQuery, visibility]
  );

  const selectedFruit = fruitId === "all" ? null : fruits.find((fruit) => fruit.id === fruitId);
  const publicCount = filteredCultivars.filter((cultivar) => cultivar.is_public).length;
  const privateCount = filteredCultivars.length - publicCount;

  async function updateVisibility(ids: string[], nextIsPublic: boolean) {
    if (ids.length === 0) return;

    setUpdatingIds((current) => Array.from(new Set([...current, ...ids])));
    setMessage(nextIsPublic ? "公開へ切り替えています．" : "非公開へ切り替えています．");

    const previousItems = items;
    setItems((current) =>
      current.map((cultivar) => (ids.includes(cultivar.id) ? { ...cultivar, is_public: nextIsPublic } : cultivar))
    );

    const supabase = createClient();
    const { error } = await supabase.from("cultivars").update({ is_public: nextIsPublic }).in("id", ids);

    setUpdatingIds((current) => current.filter((id) => !ids.includes(id)));

    if (error) {
      setItems(previousItems);
      setMessage(`保存に失敗しました: ${error.message}`);
      return;
    }

    setMessage(nextIsPublic ? `${ids.length}件を公開しました．` : `${ids.length}件を非公開にしました．`);
    router.refresh();
  }

  function updateFilteredVisibility(nextIsPublic: boolean) {
    const targetIds = filteredCultivars.filter((cultivar) => cultivar.is_public !== nextIsPublic).map((cultivar) => cultivar.id);
    updateVisibility(targetIds, nextIsPublic);
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-leaf-900">品種</h2>
        <span className="text-xs font-bold text-leaf-900/52">
          {filteredCultivars.length}件 / 公開 {publicCount} / 非公開 {privateCount}
        </span>
      </div>

      <div className="space-y-3 rounded-lg bg-white/84 p-3 ring-1 ring-leaf-100">
        <label className="block">
          <span className="text-sm font-semibold text-leaf-900">果樹で絞り込み</span>
          <select
            value={fruitId}
            onChange={(event) => setFruitId(event.target.value)}
            className="mt-2 w-full rounded-md border border-leaf-100 bg-white px-3 py-3 text-sm font-semibold text-leaf-900"
          >
            <option value="all">すべての果樹</option>
            {fruits.map((fruit) => (
              <option key={fruit.id} value={fruit.id}>
                {fruit.name_ja}
              </option>
            ))}
          </select>
        </label>

        <div className="flex min-h-12 items-center gap-2 rounded-md border border-leaf-100 bg-white px-3 focus-within:border-leaf-600">
          <Search size={18} className="shrink-0 text-leaf-700" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="品種名・英名・果樹名で検索"
            className="min-w-0 flex-1 bg-transparent py-3 outline-none placeholder:text-leaf-900/40"
          />
          {query ? (
            <button type="button" onClick={() => setQuery("")} aria-label="検索をクリア" className="grid h-8 w-8 place-items-center text-leaf-900/56">
              <X size={17} />
            </button>
          ) : null}
        </div>

        <div className="grid grid-cols-3 gap-2">
          {([
            ["all", "すべて"],
            ["public", "公開"],
            ["private", "非公開"]
          ] as const).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setVisibility(value)}
              className={`rounded-md px-3 py-2 text-sm font-bold ${
                visibility === value ? "bg-leaf-700 text-white" : "bg-leaf-50 text-leaf-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => updateFilteredVisibility(true)}
            disabled={filteredCultivars.every((cultivar) => cultivar.is_public)}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-leaf-700 px-3 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-500"
          >
            <Eye size={17} />
            表示中を公開
          </button>
          <button
            type="button"
            onClick={() => updateFilteredVisibility(false)}
            disabled={filteredCultivars.every((cultivar) => !cultivar.is_public)}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-stone-700 px-3 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-500"
          >
            <EyeOff size={17} />
            表示中を非公開
          </button>
        </div>

        {message ? <p className="rounded-md bg-leaf-50 px-3 py-2 text-sm font-semibold text-leaf-900/72">{message}</p> : null}
      </div>

      {selectedFruit ? (
        <p className="rounded-lg bg-white/70 p-3 text-sm text-leaf-900/64 ring-1 ring-leaf-100">
          {selectedFruit.name_ja}の品種だけを表示しています．必要な品種だけ，右側のボタンで公開/非公開を切り替えられます．
        </p>
      ) : null}

      <div className="grid gap-3">
        {filteredCultivars.map((cultivar) => (
          <article key={cultivar.id} className="grid gap-3 rounded-lg bg-white/84 p-4 ring-1 ring-leaf-100 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="min-w-0">
              <p className="truncate font-semibold text-leaf-900">{cultivar.name_ja}</p>
              <p className="mt-1 truncate text-sm text-leaf-900/58">
                {[cultivar.fruits?.name_ja, cultivar.name_en].filter(Boolean).join(" / ")}
              </p>
            </div>
            <div className="grid grid-cols-[1fr_auto] gap-2 sm:flex sm:items-center">
              <button
                type="button"
                onClick={() => updateVisibility([cultivar.id], !cultivar.is_public)}
                disabled={updatingIds.includes(cultivar.id)}
                className={`inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-bold disabled:cursor-wait disabled:opacity-60 ${
                  cultivar.is_public ? "bg-leaf-50 text-leaf-800" : "bg-stone-100 text-stone-700"
                }`}
              >
                {cultivar.is_public ? <Eye size={16} /> : <EyeOff size={16} />}
                {cultivar.is_public ? "公開中" : "非公開"}
              </button>
              <Link
                href={`/admin/cultivars/${cultivar.id}`}
                aria-label={`${cultivar.name_ja}を編集`}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-leaf-100 bg-white text-leaf-800"
              >
                <Edit3 size={17} />
              </Link>
            </div>
          </article>
        ))}
      </div>

      {filteredCultivars.length === 0 ? (
        <p className="rounded-lg bg-white/84 p-5 text-sm text-leaf-900/68 ring-1 ring-leaf-100">
          一致する品種がありません．保存に失敗した可能性があるため，もう一度品種追加から登録してください．
        </p>
      ) : null}
    </section>
  );
}

function normalize(value: string) {
  return value.toLocaleLowerCase("ja").replace(/\s+/g, "").trim();
}
