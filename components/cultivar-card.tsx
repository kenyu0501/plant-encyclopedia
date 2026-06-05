import Link from "next/link";
import { PlayCircle } from "lucide-react";
import { getPhotoUrl } from "@/lib/photo-url";
import type { CultivarWithMedia } from "@/types/database";

export function CultivarCard({ fruitSlug, cultivar }: { fruitSlug: string; cultivar: CultivarWithMedia }) {
  const coldHardiness = getColdHardiness(cultivar);
  const floweringType = ["avocado", "white-sapote"].includes(fruitSlug) ? cultivar.flowering_type : null;
  const plantHeightType = fruitSlug === "banana" ? cultivar.plant_height_type : null;
  const genomeGroup = fruitSlug === "banana" ? cultivar.genome_group : null;
  const yieldLevel = fruitSlug === "banana" ? cultivar.yield_level : null;
  const originGroup = fruitSlug === "mango" ? getOriginGroup(cultivar) : null;
  const mangoSugar = fruitSlug === "mango" ? getMangoSugar(cultivar.taste, cultivar.description) : null;
  const mangoFruitWeight = fruitSlug === "mango" ? getFruitWeightSummary(cultivar.fruit_size, cultivar.description) : null;
  const harvestSummary = cultivar.harvest_season ?? (fruitSlug === "mango" ? getMaturityDays(cultivar.taste, cultivar.description) : null);
  const useGroup = fruitSlug === "banana" ? getUseGroup(cultivar) : null;
  const mainPhoto = cultivar.photos?.find((photo) => photo.is_main) ?? cultivar.photos?.[0];
  const mainVideo = cultivar.videos?.[0];

  return (
    <Link
      href={`/fruits/${fruitSlug}/cultivars/${cultivar.slug}`}
      className="grid grid-cols-[88px_1fr] gap-3 rounded-lg bg-white/84 p-3 ring-1 ring-leaf-100"
    >
      <div className="relative h-24 overflow-hidden rounded-md bg-leaf-100">
        {mainPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={getPhotoUrl(mainPhoto, "thumb")} alt={mainPhoto.caption ?? cultivar.name_ja} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-full items-center justify-center px-2 text-center text-xs font-semibold text-leaf-900/38">
            No photo
          </div>
        )}
      </div>
      <div className="min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-bold text-leaf-900">{cultivar.name_ja}</h3>
            {cultivar.name_en ? <p className="mt-1 text-sm text-leaf-900/58">{cultivar.name_en}</p> : null}
          </div>
          {cultivar.is_for_sale ? (
            <span className="rounded-md bg-fruit-100 px-2 py-1 text-xs font-bold text-leaf-900">販売</span>
          ) : null}
        </div>
        {coldHardiness || floweringType || plantHeightType || genomeGroup || yieldLevel || originGroup || mangoSugar || mangoFruitWeight || harvestSummary || useGroup ? (
          <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-leaf-900/64">
            {originGroup ? <span className="rounded-md bg-leaf-50 px-2 py-1">{originGroup}</span> : null}
            {useGroup ? <span className="rounded-md bg-leaf-50 px-2 py-1">{useGroup}</span> : null}
            {coldHardiness ? <span className="rounded-md bg-leaf-50 px-2 py-1">耐寒温度 {coldHardiness}</span> : null}
            {floweringType ? <span className="rounded-md bg-leaf-50 px-2 py-1">開花 {floweringType}</span> : null}
            {mangoSugar ? <span className="rounded-md bg-fruit-100 px-2 py-1">糖度 {mangoSugar}</span> : null}
            {plantHeightType ? <span className="rounded-md bg-leaf-50 px-2 py-1">背丈 {plantHeightType}</span> : null}
            {genomeGroup ? <span className="rounded-md bg-leaf-50 px-2 py-1">ゲノム {genomeGroup}</span> : null}
            {yieldLevel ? <span className="rounded-md bg-fruit-100 px-2 py-1">収量 {yieldLevel}</span> : null}
            {harvestSummary ? <span className="rounded-md bg-fruit-100 px-2 py-1">収穫 {shortHarvest(harvestSummary)}</span> : null}
            {mangoFruitWeight ? <span className="rounded-md bg-leaf-50 px-2 py-1">果実重 {mangoFruitWeight}</span> : null}
          </div>
        ) : null}
        {mainVideo ? (
          <div className="mt-2 inline-flex max-w-full items-center gap-1 rounded-md bg-red-50 px-2 py-1 text-xs font-semibold text-red-700">
            <PlayCircle size={13} />
            <span className="truncate">{mainVideo.title || "YouTubeあり"}</span>
          </div>
        ) : null}
        {cultivar.taste ? <p className="mt-3 line-clamp-2 text-sm leading-6 text-leaf-900/70">{cultivar.taste}</p> : null}
      </div>
    </Link>
  );
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

function shortHarvest(value: string) {
  return value.split("（")[0] ?? value;
}

function getOriginGroup(cultivar: CultivarWithMedia) {
  const origin = cultivar.origin?.trim();
  if (!origin) return null;
  if (origin.includes("アメリカ") || origin.includes("ハワイ") || origin.includes("フロリダ")) return "アメリカ";
  if (origin.includes("台湾")) return "台湾";
  if (origin.includes("タイ")) return "タイ";
  if (origin.includes("メキシコ")) return "メキシコ";
  if (origin.includes("中南米")) return "中南米";
  return origin.replace(/（.*?）/g, "").replace(/由来$/, "").trim() || origin;
}

function getMangoSugar(taste: string | null, description: string | null) {
  const text = [taste, description].filter(Boolean).join(" ");
  const match = text.match(/糖度[^0-9]*(\d+(?:\.\d+)?)\s*度?/);
  return match ? `${match[1]}度` : null;
}

function getMaturityDays(taste: string | null, description: string | null) {
  const text = [taste, description].filter(Boolean).join(" ");
  const match = text.match(/成熟日数[^0-9]*(\d+(?:\.\d+)?)\s*日/);
  return match ? `成熟${match[1]}日` : null;
}

function getFruitWeightSummary(fruitSize: string | null, description: string | null) {
  const text = [fruitSize, description].filter(Boolean).join(" ");
  const labeled = text.match(/(?:果実重|平均果実重|重さ)[^0-9]*(\d+(?:\.\d+)?)\s*(kg|g|グラム)/i);
  const fallback = text.match(/(\d+(?:\.\d+)?)\s*(kg|g|グラム)/i);
  const match = labeled ?? fallback;
  if (!match) return null;
  const unit = match[2] === "グラム" ? "g" : match[2];
  return `${match[1]}${unit}`;
}
