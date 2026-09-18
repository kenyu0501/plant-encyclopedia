"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { CatalogPagination } from "@/components/catalog-pagination";
import { FruitCard } from "@/components/fruit-card";

const PAGE_SIZE = 25;
type SortOrder = "display" | "name" | "cultivars";

export type FruitCatalogItem = {
  id: string;
  slug: string;
  nameJa: string;
  nameEn: string | null;
  scientificName: string | null;
  familyName: string | null;
  description: string | null;
  imageUrl: string | null;
  imageAlt: string;
  cultivarCount: number;
  displayIndex: number;
};

export function FruitCatalog({ fruits }: { fruits: FruitCatalogItem[] }) {
  const [query, setQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("display");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const needle = normalize(query);
    const matching = fruits.filter((fruit) =>
      !needle || normalize([fruit.nameJa, fruit.nameEn, fruit.scientificName, fruit.familyName, fruit.description].filter(Boolean).join(" ")).includes(needle)
    );
    return matching.sort((a, b) => {
      if (sortOrder === "name") return a.nameJa.localeCompare(b.nameJa, "ja");
      if (sortOrder === "cultivars") return b.cultivarCount - a.cultivarCount || a.nameJa.localeCompare(b.nameJa, "ja");
      return a.displayIndex - b.displayIndex;
    });
  }, [fruits, query, sortOrder]);

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const currentPage = Math.min(page, Math.max(pageCount, 1));
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function changePage(nextPage: number) {
    setPage(nextPage);
    document.getElementById("fruit-catalog-results")?.scrollIntoView({ block: "start" });
  }

  return (
    <section className="space-y-5" aria-label="果樹図鑑の一覧">
      <div className="editorial-card grid gap-4 p-4 sm:grid-cols-[1fr_auto] sm:items-end sm:p-5">
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-leaf-900">名前・特徴で探す</span>
          <span className="flex min-h-12 items-center gap-2 rounded-lg border border-leaf-200 bg-white px-3 focus-within:border-leaf-600 focus-within:ring-2 focus-within:ring-leaf-100">
            <Search size={18} className="shrink-0 text-leaf-700" />
            <input type="search" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="例：マンゴー、バンレイシ科" className="min-w-0 flex-1 bg-transparent py-3 text-base text-leaf-900 outline-none placeholder:text-leaf-900/40" />
            {query ? <button type="button" aria-label="検索をクリア" onClick={() => { setQuery(""); setPage(1); }} className="grid h-8 w-8 place-items-center rounded-full text-leaf-700 hover:bg-leaf-50"><X size={16} /></button> : null}
          </span>
        </label>
        <label className="block sm:min-w-44">
          <span className="mb-2 block text-sm font-bold text-leaf-900">並び順</span>
          <select value={sortOrder} onChange={(event) => { setSortOrder(event.target.value as SortOrder); setPage(1); }} className="min-h-12 w-full rounded-lg border border-leaf-200 bg-white px-3 text-sm font-semibold text-leaf-900 focus:border-leaf-600 focus:outline-none focus:ring-2 focus:ring-leaf-100">
            <option value="display">図鑑掲載順</option>
            <option value="name">名前順</option>
            <option value="cultivars">品種が多い順</option>
          </select>
        </label>
      </div>

      <div id="fruit-catalog-results" className="flex scroll-mt-6 flex-wrap items-end justify-between gap-2 border-b border-leaf-200 pb-3">
        <p aria-live="polite" className="text-sm font-bold text-leaf-900">{filtered.length}件の果樹が見つかりました</p>
        {filtered.length > 0 ? <p className="text-xs font-semibold text-leaf-900/55">{(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)}件を表示</p> : null}
      </div>

      {visible.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          {visible.map((fruit) => <FruitCard key={fruit.id} fruit={fruit} />)}
        </div>
      ) : (
        <div className="editorial-card p-8 text-center">
          <p className="font-bold text-leaf-900">該当する果樹が見つかりませんでした</p>
          <p className="mt-2 text-sm text-leaf-900/60">別の名前や特徴で検索してみてください。</p>
        </div>
      )}

      <CatalogPagination page={currentPage} pageCount={pageCount} onPageChange={changePage} />
    </section>
  );
}

function normalize(value: string) {
  return value.toLocaleLowerCase("ja").replace(/\s+/g, " ").trim();
}
