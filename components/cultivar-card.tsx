import Link from "next/link";
import type { Cultivar } from "@/types/database";

export function CultivarCard({ fruitSlug, cultivar }: { fruitSlug: string; cultivar: Cultivar }) {
  const coldHardiness = getColdHardiness(cultivar);
  const originGroup = fruitSlug === "mango" ? getOriginGroup(cultivar) : null;
  const useGroup = fruitSlug === "banana" ? getUseGroup(cultivar) : null;

  return (
    <Link
      href={`/fruits/${fruitSlug}/cultivars/${cultivar.slug}`}
      className="rounded-lg bg-white/84 p-4 ring-1 ring-leaf-100"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-leaf-900">{cultivar.name_ja}</h3>
          {cultivar.name_en ? <p className="mt-1 text-sm text-leaf-900/58">{cultivar.name_en}</p> : null}
        </div>
        {cultivar.is_for_sale ? (
          <span className="rounded-md bg-fruit-100 px-2 py-1 text-xs font-bold text-leaf-900">販売</span>
        ) : null}
      </div>
      {coldHardiness || cultivar.harvest_season || useGroup ? (
        <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-leaf-900/64">
          {originGroup ? <span className="rounded-md bg-leaf-50 px-2 py-1">{originGroup}</span> : null}
          {useGroup ? <span className="rounded-md bg-leaf-50 px-2 py-1">{useGroup}</span> : null}
          {coldHardiness ? <span className="rounded-md bg-leaf-50 px-2 py-1">耐寒 {coldHardiness}</span> : null}
          {cultivar.harvest_season ? <span className="rounded-md bg-fruit-100 px-2 py-1">{shortHarvest(cultivar.harvest_season)}</span> : null}
        </div>
      ) : originGroup ? (
        <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-leaf-900/64">
          <span className="rounded-md bg-leaf-50 px-2 py-1">{originGroup}</span>
        </div>
      ) : null}
      {cultivar.taste ? <p className="mt-3 text-sm leading-6 text-leaf-900/70">{cultivar.taste}</p> : null}
    </Link>
  );
}

function getColdHardiness(cultivar: Cultivar) {
  const match = cultivar.difficulty?.match(/耐寒温度:\s*([^。]+)。/);
  return match?.[1] ?? null;
}

function getUseGroup(cultivar: Cultivar) {
  const match = cultivar.difficulty?.match(/用途:\s*([^。]+)。/);
  return match?.[1] ?? null;
}

function shortHarvest(value: string) {
  return value.split("（")[0] ?? value;
}

function getOriginGroup(cultivar: Cultivar) {
  const origin = cultivar.origin?.trim();
  if (!origin) return null;
  if (origin.includes("アメリカ") || origin.includes("ハワイ") || origin.includes("フロリダ")) return "アメリカ";
  if (origin.includes("台湾")) return "台湾";
  if (origin.includes("タイ")) return "タイ";
  if (origin.includes("メキシコ")) return "メキシコ";
  if (origin.includes("中南米")) return "中南米";
  return origin.replace(/（.*?）/g, "").replace(/由来$/, "").trim() || origin;
}
