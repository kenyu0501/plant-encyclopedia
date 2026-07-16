"use client";

import Link from "next/link";
import { Scale, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { CultivarWithMedia } from "@/types/database";

type ComparisonField = {
  label: string;
  value: (cultivar: CultivarWithMedia) => string | null;
};

const comparisonFields: ComparisonField[] = [
  { label: "英名", value: (item) => item.name_en },
  { label: "原産地", value: (item) => item.origin },
  { label: "果実サイズ", value: (item) => item.fruit_size },
  { label: "味", value: (item) => item.taste },
  { label: "食感", value: (item) => item.texture },
  { label: "香り", value: (item) => item.aroma },
  { label: "収穫期", value: (item) => item.harvest_season },
  { label: "耐寒性", value: (item) => item.cold_hardiness },
  { label: "開花型", value: (item) => item.flowering_type },
  { label: "背丈", value: (item) => item.plant_height_type },
  { label: "ゲノム構成", value: (item) => item.genome_group },
  { label: "収量", value: (item) => item.yield_level },
  { label: "樹勢", value: (item) => item.tree_vigor },
  { label: "栽培難易度", value: (item) => item.difficulty },
  { label: "沖縄適性", value: (item) => item.okinawa_suitability },
  { label: "鉢植え適性", value: (item) => item.container_suitability },
  { label: "初心者向け", value: (item) => item.beginner_suitability },
  { label: "販売", value: (item) => (item.is_for_sale ? "販売あり" : null) }
];

export function CultivarComparison({
  fruitName,
  fruitSlug,
  cultivars
}: {
  fruitName: string;
  fruitSlug: string;
  cultivars: CultivarWithMedia[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState(["", "", ""]);
  const sortedCultivars = useMemo(
    () => [...cultivars].sort((a, b) => a.name_ja.localeCompare(b.name_ja, "ja")),
    [cultivars]
  );
  const selectedCultivars = selectedIds
    .map((id) => sortedCultivars.find((cultivar) => cultivar.id === id))
    .filter((cultivar): cultivar is CultivarWithMedia => Boolean(cultivar));
  const visibleFields = comparisonFields.filter((field) =>
    selectedCultivars.some((cultivar) => Boolean(field.value(cultivar)))
  );

  if (cultivars.length < 2) return null;

  const updateSelection = (index: number, value: string) => {
    setSelectedIds((current) => current.map((id, itemIndex) => (itemIndex === index ? value : id)));
  };

  return (
    <section className="rounded-lg bg-white/84 p-4 ring-1 ring-leaf-100">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex min-h-11 w-full items-center justify-between gap-3 text-left"
        aria-expanded={isOpen}
      >
        <span>
          <span className="flex items-center gap-2 font-bold text-leaf-900"><Scale size={18} />品種を比較</span>
          <span className="mt-1 block text-xs font-semibold text-leaf-900/54">{fruitName}から最大3品種を横並びにできます．</span>
        </span>
        <span className="text-sm font-bold text-leaf-700">{isOpen ? "閉じる" : "選ぶ"}</span>
      </button>

      {isOpen ? (
        <div className="mt-4 space-y-4 border-t border-leaf-100 pt-4">
          <div className="grid gap-3 sm:grid-cols-3">
            {selectedIds.map((selectedId, index) => (
              <label key={index} className="text-xs font-bold text-leaf-700">
                比較品種 {index + 1}
                <select
                  value={selectedId}
                  onChange={(event) => updateSelection(index, event.target.value)}
                  className="mt-1 min-h-11 w-full rounded-md border border-leaf-200 bg-white px-3 text-sm font-semibold text-leaf-900"
                >
                  <option value="">選択してください</option>
                  {sortedCultivars.map((cultivar) => (
                    <option
                      key={cultivar.id}
                      value={cultivar.id}
                      disabled={selectedIds.some((id, selectedIndex) => selectedIndex !== index && id === cultivar.id)}
                    >
                      {cultivar.name_ja}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>

          {selectedCultivars.length > 0 ? (
            <button
              type="button"
              onClick={() => setSelectedIds(["", "", ""])}
              className="inline-flex items-center gap-1 text-xs font-semibold text-leaf-900/54"
            >
              <X size={14} />選択をすべて外す
            </button>
          ) : null}

          {selectedCultivars.length >= 2 ? (
            <div className="overflow-x-auto rounded-lg ring-1 ring-leaf-100">
              <table className="w-full min-w-[680px] border-collapse bg-white text-left text-sm">
                <thead className="bg-leaf-50">
                  <tr>
                    <th className="w-32 border-b border-r border-leaf-100 p-3 text-xs font-bold text-leaf-700">比較項目</th>
                    {selectedCultivars.map((cultivar) => (
                      <th key={cultivar.id} className="min-w-44 border-b border-leaf-100 p-3">
                        <Link href={`/fruits/${fruitSlug}/cultivars/${cultivar.slug}`} className="font-bold text-leaf-800 underline decoration-leaf-300 underline-offset-4">
                          {cultivar.name_ja}
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleFields.map((field) => (
                    <tr key={field.label} className="align-top odd:bg-white even:bg-leaf-50/45">
                      <th className="border-r border-t border-leaf-100 p-3 text-xs font-bold text-leaf-700">{field.label}</th>
                      {selectedCultivars.map((cultivar) => (
                        <td key={cultivar.id} className="border-t border-leaf-100 p-3 leading-6 text-leaf-900/76">
                          {field.value(cultivar) ?? "—"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="rounded-md bg-leaf-50 p-3 text-sm text-leaf-900/62">2品種以上を選ぶと比較表が表示されます．</p>
          )}
        </div>
      ) : null}
    </section>
  );
}
