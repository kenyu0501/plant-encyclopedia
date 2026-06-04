"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Leaf, Search, Sprout, X } from "lucide-react";
import type { PublicSearchEntry } from "@/lib/queries";

export function HomeSearch({ entries }: { entries: PublicSearchEntry[] }) {
  const [query, setQuery] = useState("");
  const normalizedQuery = normalize(query);

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
    <div className="relative mt-5">
      <div className="flex min-h-12 items-center gap-2 rounded-md border border-leaf-100 bg-white px-3 shadow-sm focus-within:border-leaf-600">
        <Search size={19} className="shrink-0 text-leaf-700" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="果樹・品種を検索"
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
        <div className="absolute inset-x-0 top-full z-30 mt-2 max-h-[62vh] overflow-y-auto rounded-lg bg-white p-2 shadow-soft ring-1 ring-leaf-100">
          {results.length > 0 ? (
            <div className="grid gap-1">
              {results.map((entry) => (
                <Link
                  key={`${entry.type}-${entry.id}`}
                  href={entry.href}
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
          ) : (
            <p className="p-4 text-sm font-semibold text-leaf-900/56">一致する果樹・品種がありません．</p>
          )}
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
