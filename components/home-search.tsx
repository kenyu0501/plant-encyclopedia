"use client";

import Link from "next/link";
import { useCallback, useMemo, useRef, useState } from "react";
import { Leaf, Search, Sprout, X } from "lucide-react";
import type { PublicSearchEntry } from "@/lib/queries";

export function HomeSearch() {
  const [query, setQuery] = useState("");
  const [entries, setEntries] = useState<PublicSearchEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const loadingRef = useRef(false);
  const normalizedQuery = normalize(query);

  const loadEntries = useCallback(async () => {
    if (hasLoaded || loadingRef.current) return;
    loadingRef.current = true;
    setIsLoading(true);
    setLoadError(false);
    try {
      const response = await fetch("/api/public-search");
      if (!response.ok) throw new Error("Search data could not be loaded");
      const data = (await response.json()) as { entries?: PublicSearchEntry[] };
      setEntries(data.entries ?? []);
      setHasLoaded(true);
    } catch (error) {
      setLoadError(true);
      console.error(error);
    } finally {
      loadingRef.current = false;
      setIsLoading(false);
    }
  }, [hasLoaded]);

  const results = useMemo(() => {
    if (!normalizedQuery) return [];

    return entries
      .map((entry) => ({ entry, score: scoreEntry(entry, normalizedQuery) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title, "ja"))
      .slice(0, 12)
      .map((item) => item.entry);
  }, [entries, normalizedQuery]);

  return (
    <div className="relative">
      <div className="flex min-h-12 items-center gap-2 rounded-lg bg-white px-3 focus-within:ring-2 focus-within:ring-fruit-400">
        <Search size={19} className="shrink-0 text-leaf-700" />
        <input
          value={query}
          onFocus={() => void loadEntries()}
          onChange={(event) => {
            setQuery(event.target.value);
            void loadEntries();
          }}
          placeholder="果樹や品種の名前で探す"
          className="min-w-0 flex-1 bg-transparent py-3 text-base text-leaf-900 outline-none placeholder:text-leaf-900/40"
        />
        {query ? (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="検索をクリア"
            className="grid h-8 w-8 place-items-center rounded-md text-leaf-900/56"
          >
            <X size={17} />
          </button>
        ) : null}
      </div>

      {normalizedQuery ? (
        <div className="absolute inset-x-0 top-full z-30 mt-4 max-h-[62vh] overflow-y-auto rounded-xl bg-white p-2 shadow-lift ring-1 ring-leaf-100">
          {isLoading ? (
            <p className="p-4 text-sm font-semibold text-leaf-900/56">検索データを読み込んでいます…</p>
          ) : results.length > 0 ? (
            <div className="grid gap-1">
              {results.map((entry) => (
                <Link
                  key={`${entry.type}-${entry.id}`}
                  href={entry.href}
                  prefetch={false}
                  onClick={() => setQuery("")}
                  className="flex items-center gap-3 rounded-md px-3 py-3 hover:bg-leaf-50"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-leaf-50 text-leaf-800">
                    {entry.type === "fruit" ? <Leaf size={18} /> : <Sprout size={18} />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-bold text-leaf-900">{entry.title}</span>
                    {entry.subtitle ? <span className="mt-0.5 block truncate text-sm text-leaf-900/58">{entry.subtitle}</span> : null}
                  </span>
                  <span className="rounded-md bg-fruit-100 px-2 py-1 text-xs font-bold text-leaf-900">
                    {entry.type === "fruit" ? "果樹" : "品種"}
                  </span>
                </Link>
              ))}
            </div>
          ) : loadError ? (
            <p className="p-4 text-sm font-semibold text-rose-700">検索データを読み込めませんでした。入力し直して再試行してください。</p>
          ) : hasLoaded ? (
            <p className="p-4 text-sm font-semibold text-leaf-900/56">一致する果樹・品種がありません．</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function normalize(value: string) {
  return value.toLocaleLowerCase("ja").replace(/\s+/g, " ").trim();
}

function scoreEntry(entry: PublicSearchEntry, query: string) {
  const title = normalize(entry.title);
  const subtitle = normalize(entry.subtitle ?? "");
  const keywords = normalize(entry.keywords);

  if (title === query) return 100;
  if (title.startsWith(query)) return 80;
  if (subtitle.startsWith(query)) return 65;
  if (title.includes(query)) return 55;
  if (subtitle.includes(query)) return 40;
  if (keywords.includes(query)) return 20;
  return 0;
}
