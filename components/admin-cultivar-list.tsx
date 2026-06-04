"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import type { AdminCultivar } from "@/lib/queries";

type VisibilityFilter = "all" | "public" | "private";

export function AdminCultivarList({ cultivars }: { cultivars: AdminCultivar[] }) {
  const [query, setQuery] = useState("");
  const [visibility, setVisibility] = useState<VisibilityFilter>("all");
  const normalizedQuery = normalize(query);

  const filteredCultivars = useMemo(
    () =>
      cultivars.filter((cultivar) => {
        if (visibility === "public" && !cultivar.is_public) return false;
        if (visibility === "private" && cultivar.is_public) return false;
        if (!normalizedQuery) return true;

        return normalize(
          [cultivar.name_ja, cultivar.name_en, cultivar.slug, cultivar.fruits?.name_ja, cultivar.fruits?.slug]
            .filter(Boolean)
            .join(" ")
        ).includes(normalizedQuery);
      }),
    [cultivars, normalizedQuery, visibility]
  );

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-leaf-900">品種</h2>
        <span className="text-xs font-bold text-leaf-900/52">{filteredCultivars.length}件</span>
      </div>

      <div className="space-y-3 rounded-lg bg-white/84 p-3 ring-1 ring-leaf-100">
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
      </div>

      <div className="grid gap-3">
        {filteredCultivars.map((cultivar) => (
          <Link key={cultivar.id} href={`/admin/cultivars/${cultivar.id}`} className="flex items-center justify-between gap-3 rounded-lg bg-white/84 p-4 ring-1 ring-leaf-100">
            <span className="min-w-0">
              <span className="block truncate font-semibold text-leaf-900">{cultivar.name_ja}</span>
              <span className="mt-1 block truncate text-sm text-leaf-900/58">
                {[cultivar.fruits?.name_ja, cultivar.name_en].filter(Boolean).join(" / ")}
              </span>
            </span>
            <span className={`shrink-0 rounded-md px-2 py-1 text-xs font-bold ${cultivar.is_public ? "bg-leaf-50 text-leaf-800" : "bg-stone-100 text-stone-600"}`}>
              {cultivar.is_public ? "公開" : "非公開"}
            </span>
          </Link>
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
