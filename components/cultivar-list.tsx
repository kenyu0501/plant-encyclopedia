"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  BarChart3,
  Coffee,
  Dna,
  Flower2,
  Globe2,
  ListFilter,
  RotateCcw,
  Ruler,
  Search,
  SlidersHorizontal,
  Tags,
  Thermometer
} from "lucide-react";
import { CultivarCard } from "@/components/cultivar-card";
import type { CultivarWithMedia } from "@/types/database";

type ViewMode = "name" | "cold" | "flowering" | "origin" | "use" | "height" | "genome" | "yield" | "coffeeSpecies";
type CultivarGroup = {
  label: string;
  rank: number;
  cultivars: CultivarWithMedia[];
};
type CultivarFilters = {
  query: string;
  minWeight: string;
  maxWeight: string;
  minBrix: string;
  harvestMonth: string;
  maxColdTemperature: string;
  containerOnly: boolean;
  beginnerOnly: boolean;
};

const initialFilters: CultivarFilters = {
  query: "",
  minWeight: "",
  maxWeight: "",
  minBrix: "",
  harvestMonth: "",
  maxColdTemperature: "",
  containerOnly: false,
  beginnerOnly: false
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
  const hasCoffeeSpeciesView = fruitSlug === "coffee" && cultivars.some((cultivar) => getCoffeeSpecies(cultivar));
  const hasWeightData = cultivars.some((cultivar) => getFruitWeightGrams(cultivar) !== null);
  const hasBrixData = cultivars.some((cultivar) => getBrix(cultivar) !== null);
  const hasHarvestMonthData = cultivars.some((cultivar) => getHarvestMonths(cultivar).length > 0);
  const hasColdData = cultivars.some((cultivar) => getColdTemperature(cultivar) !== null);
  const hasContainerData = cultivars.some((cultivar) => hasSuitableText(cultivar.container_suitability, "container"));
  const hasBeginnerData = cultivars.some((cultivar) => hasSuitableText(cultivar.beginner_suitability, "beginner"));
  const [viewMode, setViewMode] = useState<ViewMode>("name");
  const [filters, setFilters] = useState<CultivarFilters>(initialFilters);

  const filteredCultivars = useMemo(
    () => cultivars.filter((cultivar) => matchesFilters(cultivar, filters)),
    [cultivars, filters]
  );
  const sortedCultivars = useMemo(
    () => [...filteredCultivars].sort((a, b) => a.name_ja.localeCompare(b.name_ja, "ja")),
    [filteredCultivars]
  );

  const coldGroups = useMemo(() => groupByColdHardiness(filteredCultivars), [filteredCultivars]);
  const floweringGroups = useMemo(
    () => groupByField(filteredCultivars, "flowering_type", floweringRank, "開花型未設定"),
    [filteredCultivars]
  );
  const originGroups = useMemo(() => groupByOrigin(filteredCultivars), [filteredCultivars]);
  const useGroups = useMemo(() => groupByUse(filteredCultivars), [filteredCultivars]);
  const heightGroups = useMemo(
    () => groupByField(filteredCultivars, "plant_height_type", heightRank, "背丈未設定"),
    [filteredCultivars]
  );
  const genomeGroups = useMemo(
    () => groupByField(filteredCultivars, "genome_group", genomeRank, "ゲノム未設定"),
    [filteredCultivars]
  );
  const yieldGroups = useMemo(
    () => groupByField(filteredCultivars, "yield_level", yieldRank, "収量未設定"),
    [filteredCultivars]
  );
  const coffeeSpeciesGroups = useMemo(() => groupByCoffeeSpecies(filteredCultivars), [filteredCultivars]);
  const availableModes: ViewMode[] = [
    "name",
    ...(hasColdView ? (["cold"] as const) : []),
    ...(hasFloweringView ? (["flowering"] as const) : []),
    ...(hasOriginView ? (["origin"] as const) : []),
    ...(hasUseView ? (["use"] as const) : []),
    ...(hasHeightView ? (["height"] as const) : []),
    ...(hasGenomeView ? (["genome"] as const) : []),
    ...(hasYieldView ? (["yield"] as const) : []),
    ...(hasCoffeeSpeciesView ? (["coffeeSpecies"] as const) : [])
  ];
  const activeMode = availableModes.includes(viewMode) ? viewMode : "name";
  const detailedFilterCount = countDetailedFilters(filters);
  const hasActiveFilters = Boolean(filters.query.trim()) || detailedFilterCount > 0;

  function updateFilter<Key extends keyof CultivarFilters>(key: Key, value: CultivarFilters[Key]) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  if (cultivars.length === 0) {
    return (
      <p className="rounded-lg bg-white/78 p-4 text-sm text-leaf-900/70 ring-1 ring-leaf-100">
        公開中の品種はまだありません．
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-lg bg-white/86 ring-1 ring-leaf-100">
        <div className="p-4">
          <label htmlFor="cultivar-search" className="mb-2 block text-sm font-bold text-leaf-900">
            品種名・特徴から検索
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-leaf-700/60" size={18} />
            <input
              id="cultivar-search"
              type="search"
              value={filters.query}
              onChange={(event) => updateFilter("query", event.target.value)}
              placeholder="例：アーウィン、沖縄、豊産性"
              className="min-h-11 w-full rounded-md border border-leaf-200 bg-white py-2 pl-10 pr-3 text-base text-leaf-900 outline-none placeholder:text-leaf-900/36 focus:border-leaf-500 focus:ring-2 focus:ring-leaf-200"
            />
          </div>
        </div>

        <details className="group border-t border-leaf-100" open={detailedFilterCount > 0}>
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-bold text-leaf-900 [&::-webkit-details-marker]:hidden">
            <span className="flex items-center gap-2">
              <SlidersHorizontal size={17} />
              詳しい条件
              {detailedFilterCount > 0 ? (
                <span className="rounded-full bg-leaf-700 px-2 py-0.5 text-xs text-white">{detailedFilterCount}</span>
              ) : null}
            </span>
            <span className="text-xs font-semibold text-leaf-900/52 group-open:hidden">開く</span>
            <span className="hidden text-xs font-semibold text-leaf-900/52 group-open:inline">閉じる</span>
          </summary>

          <div className="border-t border-leaf-100 bg-leaf-50/55 p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {hasWeightData ? (
                <fieldset>
                  <legend className="text-sm font-bold text-leaf-900">果実重</legend>
                  <div className="mt-2 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                    <NumberFilter
                      label="最小果実重"
                      value={filters.minWeight}
                      onChange={(value) => updateFilter("minWeight", value)}
                      placeholder="最小"
                      unit="g"
                    />
                    <span className="text-leaf-900/44">〜</span>
                    <NumberFilter
                      label="最大果実重"
                      value={filters.maxWeight}
                      onChange={(value) => updateFilter("maxWeight", value)}
                      placeholder="最大"
                      unit="g"
                    />
                  </div>
                </fieldset>
              ) : null}

              {hasBrixData ? (
                <fieldset>
                  <legend className="text-sm font-bold text-leaf-900">糖度</legend>
                  <div className="mt-2">
                    <NumberFilter
                      label="最低糖度"
                      value={filters.minBrix}
                      onChange={(value) => updateFilter("minBrix", value)}
                      placeholder="指定なし"
                      unit="度以上"
                      step="0.1"
                    />
                  </div>
                </fieldset>
              ) : null}

              {hasHarvestMonthData ? (
                <label className="block text-sm font-bold text-leaf-900">
                  収穫期
                  <select
                    value={filters.harvestMonth}
                    onChange={(event) => updateFilter("harvestMonth", event.target.value)}
                    className="mt-2 min-h-11 w-full rounded-md border border-leaf-200 bg-white px-3 text-base font-normal text-leaf-900 outline-none focus:border-leaf-500 focus:ring-2 focus:ring-leaf-200"
                  >
                    <option value="">すべての月</option>
                    {Array.from({ length: 12 }, (_, index) => index + 1).map((month) => (
                      <option key={month} value={month}>
                        {month}月に収穫
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}

              {hasColdData ? (
                <fieldset>
                  <legend className="text-sm font-bold text-leaf-900">耐寒性</legend>
                  <div className="mt-2">
                    <NumberFilter
                      label="耐えられる最低温度"
                      value={filters.maxColdTemperature}
                      onChange={(value) => updateFilter("maxColdTemperature", value)}
                      placeholder="指定なし"
                      unit="℃以下"
                      step="0.5"
                    />
                  </div>
                </fieldset>
              ) : null}
            </div>

            {hasContainerData || hasBeginnerData ? (
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {hasContainerData ? (
                  <FilterCheckbox
                    checked={filters.containerOnly}
                    label="鉢植え向きだけ表示"
                    onChange={(checked) => updateFilter("containerOnly", checked)}
                  />
                ) : null}
                {hasBeginnerData ? (
                  <FilterCheckbox
                    checked={filters.beginnerOnly}
                    label="初心者向けだけ表示"
                    onChange={(checked) => updateFilter("beginnerOnly", checked)}
                  />
                ) : null}
              </div>
            ) : null}

            <p className="mt-3 text-xs leading-5 text-leaf-900/52">
              数値や適性が未登録の品種は、その条件で絞り込んだ場合は表示されません。
            </p>
          </div>
        </details>

        <div className="flex min-h-12 items-center justify-between gap-3 border-t border-leaf-100 px-4 py-2">
          <p aria-live="polite" className="text-sm font-bold text-leaf-900">
            {filteredCultivars.length}
            <span className="font-semibold text-leaf-900/54"> / {cultivars.length}品種</span>
          </p>
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={() => setFilters(initialFilters)}
              className="inline-flex min-h-10 items-center gap-2 rounded-md px-3 text-sm font-bold text-leaf-700 transition hover:bg-leaf-50"
            >
              <RotateCcw size={15} />
              条件をリセット
            </button>
          ) : null}
        </div>
      </section>

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
          {hasCoffeeSpeciesView ? <ModeButton active={activeMode === "coffeeSpecies"} icon={<Coffee size={16} />} label="種別" onClick={() => setViewMode("coffeeSpecies")} /> : null}
        </div>
      ) : null}

      {filteredCultivars.length === 0 ? (
        <div className="rounded-lg border border-dashed border-leaf-200 bg-white/72 p-6 text-center">
          <p className="font-bold text-leaf-900">条件に合う品種が見つかりませんでした</p>
          <p className="mt-2 text-sm text-leaf-900/58">条件を減らすか、検索語を変えてお試しください。</p>
          <button
            type="button"
            onClick={() => setFilters(initialFilters)}
            className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-md bg-leaf-700 px-4 py-2 text-sm font-bold text-white"
          >
            <RotateCcw size={16} />
            すべての品種を表示
          </button>
        </div>
      ) : activeMode === "cold" ? (
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
      ) : activeMode === "coffeeSpecies" ? (
        <GroupedCultivars fruitSlug={fruitSlug} groups={coffeeSpeciesGroups} />
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

function NumberFilter({
  label,
  value,
  onChange,
  placeholder,
  unit,
  step = "1"
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  unit: string;
  step?: string;
}) {
  return (
    <label className="relative block">
      <span className="sr-only">{label}</span>
      <input
        type="number"
        inputMode="decimal"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        step={step}
        className="min-h-11 w-full rounded-md border border-leaf-200 bg-white px-3 pr-14 text-base text-leaf-900 outline-none placeholder:text-leaf-900/36 focus:border-leaf-500 focus:ring-2 focus:ring-leaf-200"
      />
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-leaf-900/50">
        {unit}
      </span>
    </label>
  );
}

function FilterCheckbox({
  checked,
  label,
  onChange
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-md border border-leaf-200 bg-white px-3 text-sm font-bold text-leaf-900">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 rounded border-leaf-300 text-leaf-700 focus:ring-leaf-500"
      />
      {label}
    </label>
  );
}

function matchesFilters(cultivar: CultivarWithMedia, filters: CultivarFilters) {
  const query = normalizeSearchText(filters.query);
  if (query) {
    const searchable = normalizeSearchText(
      [
        cultivar.name_ja,
        cultivar.name_en,
        cultivar.origin,
        cultivar.description,
        cultivar.fruit_size,
        cultivar.taste,
        cultivar.harvest_season,
        cultivar.cold_hardiness,
        cultivar.difficulty,
        cultivar.okinawa_suitability,
        cultivar.container_suitability,
        cultivar.beginner_suitability
      ]
        .filter(Boolean)
        .join(" ")
    );
    if (!searchable.includes(query)) return false;
  }

  const minWeight = parseOptionalNumber(filters.minWeight);
  const maxWeight = parseOptionalNumber(filters.maxWeight);
  if (minWeight !== null || maxWeight !== null) {
    const weight = getFruitWeightGrams(cultivar);
    if (weight === null) return false;
    if (minWeight !== null && weight < minWeight) return false;
    if (maxWeight !== null && weight > maxWeight) return false;
  }

  const minBrix = parseOptionalNumber(filters.minBrix);
  if (minBrix !== null) {
    const brix = getBrix(cultivar);
    if (brix === null || brix < minBrix) return false;
  }

  const harvestMonth = parseOptionalNumber(filters.harvestMonth);
  if (harvestMonth !== null && !getHarvestMonths(cultivar).includes(harvestMonth)) return false;

  const maxColdTemperature = parseOptionalNumber(filters.maxColdTemperature);
  if (maxColdTemperature !== null) {
    const coldTemperature = getColdTemperature(cultivar);
    if (coldTemperature === null || coldTemperature > maxColdTemperature) return false;
  }

  if (filters.containerOnly && !hasSuitableText(cultivar.container_suitability, "container")) return false;
  if (filters.beginnerOnly && !hasSuitableText(cultivar.beginner_suitability, "beginner")) return false;

  return true;
}

function countDetailedFilters(filters: CultivarFilters) {
  return [
    filters.minWeight,
    filters.maxWeight,
    filters.minBrix,
    filters.harvestMonth,
    filters.maxColdTemperature,
    filters.containerOnly,
    filters.beginnerOnly
  ].filter(Boolean).length;
}

function parseOptionalNumber(value: string) {
  if (!value.trim()) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function normalizeSearchText(value: string) {
  return value.normalize("NFKC").trim().toLocaleLowerCase("ja");
}

function getFruitWeightGrams(cultivar: CultivarWithMedia) {
  const primary = normalizeNumericText(cultivar.fruit_size ?? "");
  const primaryWithUnit = primary.match(
    /(\d+(?:\.\d+)?)\s*(?:[-〜～~–—]\s*(\d+(?:\.\d+)?))?\s*(kg|キログラム|g|グラム)/i
  );
  const primaryWithoutUnit = /cm|mm|センチ|ミリ/i.test(primary)
    ? null
    : primary.match(/(\d+(?:\.\d+)?)\s*(?:[-〜～~–—]\s*(\d+(?:\.\d+)?))?/);
  const primaryMatch = primaryWithUnit ?? primaryWithoutUnit;
  if (primaryMatch) return weightMatchToGrams(primaryMatch);

  const fallback = normalizeNumericText(cultivar.description ?? "");
  const labeledMatch = fallback.match(
    /(?:果実重|平均果実重|重さ)[^0-9-]*(\d+(?:\.\d+)?)\s*(?:[-〜～~–—]\s*(\d+(?:\.\d+)?))?\s*(kg|キログラム|g|グラム)?/i
  );
  return labeledMatch ? weightMatchToGrams(labeledMatch) : null;
}

function weightMatchToGrams(match: RegExpMatchArray) {
  const first = Number(match[1]);
  const second = match[2] ? Number(match[2]) : first;
  if (!Number.isFinite(first) || !Number.isFinite(second)) return null;
  const average = (first + second) / 2;
  return /kg|キログラム/i.test(match[3] ?? "") ? average * 1000 : average;
}

function getBrix(cultivar: CultivarWithMedia) {
  const text = normalizeNumericText([cultivar.taste, cultivar.description].filter(Boolean).join(" "));
  const match = text.match(/(?:糖度|Brix)[^0-9]*(\d+(?:\.\d+)?)/i);
  return match ? Number(match[1]) : null;
}

function getHarvestMonths(cultivar: CultivarWithMedia) {
  const text = normalizeNumericText(cultivar.harvest_season ?? "");
  if (!text) return [];
  const months = new Set<number>();
  const rangePattern = /(\d{1,2})\s*(?:月)?\s*[-〜～~–—]\s*(\d{1,2})\s*月/g;

  for (const match of Array.from(text.matchAll(rangePattern))) {
    const start = Number(match[1]);
    const end = Number(match[2]);
    if (!isMonth(start) || !isMonth(end)) continue;
    let month = start;
    for (let count = 0; count < 12; count += 1) {
      months.add(month);
      if (month === end) break;
      month = month === 12 ? 1 : month + 1;
    }
  }

  for (const match of Array.from(text.matchAll(/(\d{1,2})\s*月/g))) {
    const month = Number(match[1]);
    if (isMonth(month)) months.add(month);
  }

  return Array.from(months);
}

function isMonth(value: number) {
  return Number.isInteger(value) && value >= 1 && value <= 12;
}

function getColdTemperature(cultivar: CultivarWithMedia) {
  const text = normalizeNumericText(getColdHardiness(cultivar) ?? "");
  const numbers = Array.from(text.matchAll(/-?\d+(?:\.\d+)?/g)).map((match) => Number(match[0]));
  return numbers.length > 0 ? Math.min(...numbers) : null;
}

function hasSuitableText(value: string | null, kind: "container" | "beginner") {
  const text = normalizeSearchText(value ?? "");
  if (!text) return false;
  const negative =
    kind === "beginner"
      ? /上級|熟練|難し|困難|不向き|適さない|非推奨/
      : /地植え向き|露地向き|鉢植え.{0,6}(?:不向き|適さない|困難|難し)|非推奨/;
  return !negative.test(text);
}

function normalizeNumericText(value: string) {
  return value
    .normalize("NFKC")
    .replace(/マイナス\s*/g, "-")
    .replace(/[−‐‑]/g, "-");
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

function groupByCoffeeSpecies(cultivars: CultivarWithMedia[]): CultivarGroup[] {
  const groups = new Map<string, CultivarWithMedia[]>();

  for (const cultivar of cultivars) {
    const species = getCoffeeSpecies(cultivar) ?? "種別未設定";
    groups.set(species, [...(groups.get(species) ?? []), cultivar]);
  }

  return Array.from(groups.entries())
    .map(([label, items]) => ({
      label,
      rank: coffeeSpeciesRank(label),
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
  const match = cultivar.difficulty?.match(/耐寒温度:\s*([^．]+)．/);
  return match?.[1] ?? null;
}

function getUseGroup(cultivar: CultivarWithMedia) {
  const match = cultivar.difficulty?.match(/用途:\s*([^．]+)．/);
  return match?.[1] ?? null;
}

function getCoffeeSpecies(cultivar: CultivarWithMedia) {
  const text = [cultivar.difficulty, cultivar.description, cultivar.name_ja, cultivar.name_en].filter(Boolean).join(" ");
  if (/リベリカ|liberica/i.test(text)) return "リベリカ";
  if (/ロブスタ|カネフォラ|canephora|robusta/i.test(text)) return "ロブスタ";
  if (/アラビカ|arabica/i.test(text)) return "アラビカ";
  return null;
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

function coffeeSpeciesRank(label: string) {
  const order = ["アラビカ", "ロブスタ", "リベリカ", "種別未設定"];
  const index = order.indexOf(label);
  return index === -1 ? order.length : index;
}
