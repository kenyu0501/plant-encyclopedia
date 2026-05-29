"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { BarChart3, Dna, Flower2, Globe2, Tags, Thermometer, ListFilter, Ruler } from "lucide-react";
import { CultivarCard } from "@/components/cultivar-card";
import type { CultivarWithMedia } from "@/types/database";

type ViewMode = "name" | "cold" | "flowering" | "origin" | "use" | "height" | "genome" | "yield";
type CultivarGroup = {
  label: string;
  rank: number;
  cultivars: CultivarWithMedia[];
};

export function CultivarList({
  fruitSlug,
  cultivars
}: {
  fruitSlug: string;
  cultivars: CultivarWithMedia[];
}) {
  const hasColdView = fruitSlug === "avocado" && cultivars.some((cultivar) => getColdHardiness(cultivar));
  const hasFloweringView = ["avocado", "white-sapote"].includes(fruitSlug) && cultivars.some((cultivar) => cultivar.flowering_type);
  const hasOriginView = fruitSlug === "mango" && cultivars.some((cultivar) => getOriginGroup(cultivar));
  const hasUseView = fruitSlug === "banana" && cultivars.some((cultivar) => getUseGroup(cultivar));
  const hasHeightView = fruitSlug === "banana" && cultivars.some((cultivar) => cultivar.plant_height_type);
  const hasGenomeView = fruitSlug === "banana" && cultivars.some((cultivar) => cultivar.genome_group);
  const hasYieldView = fruitSlug === "banana" && cultivars.some((cultivar) => cultivar.yield_level);
  const [viewMode, setViewMode] = useState<ViewMode>("name");

  const sortedCultivars = useMemo(
    () => [...cultivars].sort((a, b) => a.name_ja.localeCompare(b.name_ja, "ja")),
    [cultivars]
  );

  const coldGroups = useMemo(() => groupByColdHardiness(cultivars), [cultivars]);
  const floweringGroups = useMemo(() => groupByField(cultivars, "flowering_type", floweringRank, "開花型未設定"), [cultivars]);
  const originGroups = useMemo(() => groupByOrigin(cultivars), [cultivars]);
  const useGroups = useMemo(() => groupByUse(cultivars), [cultivars]);
  const heightGroups = useMemo(() => groupByField(cultivars, "plant_height_type", heightRank, "背丈未設定"), [cultivars]);
  const genomeGroups = useMemo(() => groupByField(cultivars, "genome_group", genomeRank, "ゲノム未設定"), [cultivars]);
  const yieldGroups = useMemo(() => groupByField(cultivars, "yield_level", yieldRank, "収量未設定"), [cultivars]);
  const availableModes: ViewMode[] = [
    "name",
    ...(hasColdView ? (["cold"] as const) : []),
    ...(hasFloweringView ? (["flowering"] as const) : []),
    ...(hasOriginView ? (["origin"] as const) : []),
    ...(hasUseView ? (["use"] as const) : []),
    ...(hasHeightView ? (["height"] as const) : []),
    ...(hasGenomeView ? (["genome"] as const) : []),
    ...(hasYieldView ? (["yield"] as const) : [])
  ];
  const activeMode = availableModes.includes(viewMode) ? viewMode : "name";

  if (cultivars.length === 0) {
    return (
      <p className="rounded-lg bg-white/78 p-4 text-sm text-leaf-900/70 ring-1 ring-leaf-100">
        公開中の品種はまだありません。
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {availableModes.length > 1 ? (
        <div className="flex gap-1 overflow-x-auto rounded-lg bg-white/86 p-1 ring-1 ring-leaf-100">
          <ModeButton active={activeMode === "name"} icon={<ListFilter size={16} />} label="あいうえお順" onClick={() => setViewMode("name")} />
          {hasColdView ? <ModeButton active={activeMode === "cold"} icon={<Thermometer size={16} />} label="耐寒性順" onClick={() => setViewMode("cold")} /> : null}
          {hasFloweringView ? <ModeButton active={activeMode === "flowering"} icon={<Flower2 size={16} />} label="開花型別" onClick={() => setViewMode("flowering")} /> : null}
          {hasOriginView ? <ModeButton active={activeMode === "origin"} icon={<Globe2 size={16} />} label="産地別" onClick={() => setViewMode("origin")} /> : null}
          {hasUseView ? <ModeButton active={activeMode === "use"} icon={<Tags size={16} />} label="用途別" onClick={() => setViewMode("use")} /> : null}
          {hasHeightView ? <ModeButton active={activeMode === "height"} icon={<Ruler size={16} />} label="背丈別" onClick={() => setViewMode("height")} /> : null}
          {hasGenomeView ? <ModeButton active={activeMode === "genome"} icon={<Dna size={16} />} label="ゲノム別" onClick={() => setViewMode("genome")} /> : null}
          {hasYieldView ? <ModeButton active={activeMode === "yield"} icon={<BarChart3 size={16} />} label="収量別" onClick={() => setViewMode("yield")} /> : null}
        </div>
      ) : null}

      {activeMode === "cold" ? (
        <GroupedCultivars fruitSlug={fruitSlug} groups={coldGroups} />
      ) : activeMode === "flowering" ? (
        <GroupedCultivars fruitSlug={fruitSlug} groups={floweringGroups} />
      ) : activeMode === "origin" ? (
        <GroupedCultivars fruitSlug={fruitSlug} groups={originGroups} />
      ) : activeMode === "use" ? (
        <GroupedCultivars fruitSlug={fruitSlug} groups={useGroups} />
      ) : activeMode === "height" ? (
        <GroupedCultivars fruitSlug={fruitSlug} groups={heightGroups} />
      ) : activeMode === "genome" ? (
        <GroupedCultivars fruitSlug={fruitSlug} groups={genomeGroups} />
      ) : activeMode === "yield" ? (
        <GroupedCultivars fruitSlug={fruitSlug} groups={yieldGroups} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {sortedCultivars.map((cultivar) => (
            <CultivarCard key={cultivar.id} fruitSlug={fruitSlug} cultivar={cultivar} />
          ))}
        </div>
      )}
    </div>
  );
}

function groupByField(
  cultivars: CultivarWithMedia[],
  field: "flowering_type" | "plant_height_type" | "genome_group" | "yield_level",
  ranker: (label: string) => number,
  fallback: string
): CultivarGroup[] {
  const groups = new Map<string, CultivarWithMedia[]>();

  for (const cultivar of cultivars) {
    const label = cultivar[field] ?? fallback;
    groups.set(label, [...(groups.get(label) ?? []), cultivar]);
  }

  return Array.from(groups.entries())
    .map(([label, items]) => ({
      label,
      rank: ranker(label),
      cultivars: items.sort((a, b) => a.name_ja.localeCompare(b.name_ja, "ja"))
    }))
    .sort((a, b) => a.rank - b.rank || a.label.localeCompare(b.label, "ja"));
}

function groupByUse(cultivars: CultivarWithMedia[]): CultivarGroup[] {
  const groups = new Map<string, CultivarWithMedia[]>();

  for (const cultivar of cultivars) {
    const use = getUseGroup(cultivar) ?? "用途未設定";
    groups.set(use, [...(groups.get(use) ?? []), cultivar]);
  }

  return Array.from(groups.entries())
    .map(([label, items]) => ({
      label,
      rank: useRank(label),
      cultivars: items.sort((a, b) => a.name_ja.localeCompare(b.name_ja, "ja"))
    }))
    .sort((a, b) => a.rank - b.rank || a.label.localeCompare(b.label, "ja"));
}

function GroupedCultivars({ fruitSlug, groups }: { fruitSlug: string; groups: CultivarGroup[] }) {
  return (
    <div className="space-y-5">
      {groups.map((group) => (
        <section key={group.label} className="space-y-3">
          <div className="flex items-baseline justify-between gap-3 border-b border-leaf-100 pb-2">
            <h3 className="font-bold text-leaf-900">{group.label}</h3>
            <span className="text-xs font-semibold text-leaf-900/56">{group.cultivars.length}品種</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {group.cultivars.map((cultivar) => (
              <CultivarCard key={cultivar.id} fruitSlug={fruitSlug} cultivar={cultivar} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function ModeButton({
  active,
  icon,
  label,
  onClick
}: {
  active: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md px-3 text-sm font-bold transition",
        active ? "bg-leaf-700 text-white shadow-sm" : "text-leaf-900/70"
      ].join(" ")}
    >
      {icon}
      {label}
    </button>
  );
}

function groupByColdHardiness(cultivars: CultivarWithMedia[]): CultivarGroup[] {
  const groups = new Map<string, CultivarWithMedia[]>();

  for (const cultivar of cultivars) {
    const cold = getColdHardiness(cultivar) ?? "耐寒温度未設定";
    groups.set(cold, [...(groups.get(cold) ?? []), cultivar]);
  }

  return Array.from(groups.entries())
    .map(([label, items]) => ({
      label,
      rank: coldRank(label),
      cultivars: items.sort((a, b) => a.name_ja.localeCompare(b.name_ja, "ja"))
    }))
    .sort((a, b) => a.rank - b.rank || a.label.localeCompare(b.label, "ja"));
}

function groupByOrigin(cultivars: CultivarWithMedia[]): CultivarGroup[] {
  const groups = new Map<string, CultivarWithMedia[]>();

  for (const cultivar of cultivars) {
    const origin = getOriginGroup(cultivar) ?? "産地未設定";
    groups.set(origin, [...(groups.get(origin) ?? []), cultivar]);
  }

  return Array.from(groups.entries())
    .map(([label, items]) => ({
      label,
      rank: originRank(label),
      cultivars: items.sort((a, b) => a.name_ja.localeCompare(b.name_ja, "ja"))
    }))
    .sort((a, b) => a.rank - b.rank || a.label.localeCompare(b.label, "ja"));
}

function getColdHardiness(cultivar: CultivarWithMedia) {
  if (cultivar.cold_hardiness) return cultivar.cold_hardiness;
  const match = cultivar.difficulty?.match(/耐寒温度:\s*([^。]+)。/);
  return match?.[1] ?? null;
}

function getUseGroup(cultivar: CultivarWithMedia) {
  const match = cultivar.difficulty?.match(/用途:\s*([^。]+)。/);
  return match?.[1] ?? null;
}

function coldRank(label: string) {
  const numbers = Array.from(label.matchAll(/-?\d+(?:\.\d+)?/g)).map((match) => Number(match[0]));
  if (numbers.length === 0) return Number.POSITIVE_INFINITY;
  return numbers[0];
}

function getOriginGroup(cultivar: CultivarWithMedia) {
  const origin = cultivar.origin?.trim();
  if (!origin) return null;
  if (origin.includes("アメリカ")) return "アメリカ";
  if (origin.includes("台湾")) return "台湾";
  if (origin.includes("タイ")) return "タイ";
  if (origin.includes("メキシコ")) return "メキシコ";
  if (origin.includes("ハワイ")) return "アメリカ";
  if (origin.includes("フロリダ")) return "アメリカ";
  if (origin.includes("中南米")) return "中南米";
  return origin.replace(/（.*?）/g, "").replace(/由来$/, "").trim() || origin;
}

function originRank(label: string) {
  const order = [
    "台湾",
    "アメリカ",
    "メキシコ",
    "タイ",
    "フィリピン",
    "インド",
    "インドネシア",
    "オーストラリア",
    "イスラエル",
    "ハイチ",
    "ホンジュラス",
    "中南米",
    "不明",
    "産地未設定"
  ];
  const index = order.indexOf(label);
  return index === -1 ? order.length : index;
}

function useRank(label: string) {
  const order = [
    "デザート",
    "デザート・調理兼用",
    "調理・デザート兼用",
    "調理用",
    "デザート・観賞",
    "観賞・デザート",
    "観賞・調理",
    "観賞",
    "鉢向き",
    "用途未設定"
  ];
  const index = order.indexOf(label);
  return index === -1 ? order.length : index;
}

function heightRank(label: string) {
  const order = ["矮性", "小型", "中間", "中型", "高性", "大型", "背丈未設定"];
  const index = order.indexOf(label);
  return index === -1 ? order.length : index;
}

function floweringRank(label: string) {
  const order = ["A型", "B型", "AB型", "タイプ1", "タイプ2", "タイプ3", "開花型未設定"];
  const index = order.indexOf(label);
  return index === -1 ? order.length : index;
}

function genomeRank(label: string) {
  const order = ["AA", "AB", "AAA", "AAB", "ABB", "BBB", "不明", "？", "ゲノム未設定"];
  const index = order.indexOf(label);
  return index === -1 ? order.length : index;
}

function yieldRank(label: string) {
  const order = ["多い", "豊産性", "中", "普通", "少ない", "不明", "収量未設定"];
  const index = order.indexOf(label);
  return index === -1 ? order.length : index;
}
