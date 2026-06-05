import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Apple, BarChart3, Dna, ExternalLink, Flower2, Globe2, ImagePlus, Leaf, Pencil, PlayCircle, Ruler, Scale, Sprout, Thermometer } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { getCurrentUser, isAdminUser } from "@/lib/auth";
import { getPhotoUrl } from "@/lib/photo-url";
import { getPublicCultivarBySlugs } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string; cultivarSlug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, cultivarSlug } = await params;
  const cultivar = await getPublicCultivarBySlugs(slug, cultivarSlug);
  return {
    title: cultivar?.name_ja ?? "品種詳細"
  };
}

export default async function CultivarDetailPage({ params }: Props) {
  const { slug, cultivarSlug } = await params;
  const cultivar = await getPublicCultivarBySlugs(slug, cultivarSlug);
  if (!cultivar || !cultivar.fruits) notFound();

  const user = await getCurrentUser();
  const isAdmin = await isAdminUser(user);
  const mainPhoto = cultivar.photos?.find((photo) => photo.is_main) ?? cultivar.photos?.[0];
  const photos = [...(cultivar.photos ?? [])].sort((a, b) => Number(b.is_main) - Number(a.is_main));
  const galleryPhotos = mainPhoto ? photos.filter((photo) => photo.id !== mainPhoto.id) : photos;
  const fruitSlug = cultivar.fruits.slug;
  const isBanana = fruitSlug === "banana";
  const isAvocado = fruitSlug === "avocado";
  const showsFloweringType = fruitSlug === "avocado" || fruitSlug === "white-sapote";
  const displayOrigin = isBanana ? getPublicBananaOrigin(cultivar.origin) : cultivar.origin;
  const primaryStats = getPrimaryStats({
    fruitSlug,
    origin: displayOrigin,
    fruitSize: cultivar.fruit_size,
    taste: cultivar.taste,
    description: cultivar.description,
    harvestSeason: cultivar.harvest_season,
    coldHardiness: cultivar.cold_hardiness,
    floweringType: cultivar.flowering_type,
    plantHeightType: cultivar.plant_height_type,
    genomeGroup: cultivar.genome_group,
    yieldLevel: cultivar.yield_level
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title={cultivar.name_ja}
        description={`${cultivar.fruits.name_ja}の品種${cultivar.name_en ? ` / ${cultivar.name_en}` : ""}`}
        action={
          isAdmin ? (
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/admin/photos?fruit_id=${cultivar.fruit_id}&cultivar_id=${cultivar.id}`}
                className="inline-flex items-center gap-2 rounded-md border border-leaf-200 bg-white px-3 py-2 text-sm font-semibold text-leaf-800"
              >
                <ImagePlus size={16} />
                写真追加
              </Link>
            <Link
              href={`/admin/cultivars/${cultivar.id}`}
              className="inline-flex items-center gap-2 rounded-md bg-leaf-700 px-3 py-2 text-sm font-semibold text-white"
            >
              <Pencil size={16} />
              編集
            </Link>
            </div>
          ) : null
        }
      />

      {mainPhoto ? (
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-leaf-100">
          <Image src={getPhotoUrl(mainPhoto, "medium")} alt={mainPhoto.caption ?? cultivar.name_ja} fill className="object-cover" priority sizes="100vw" />
        </div>
      ) : null}

      {galleryPhotos.length > 0 ? (
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-leaf-900">写真</h2>
            {isAdmin ? (
              <Link href={`/admin/photos?fruit_id=${cultivar.fruit_id}&cultivar_id=${cultivar.id}`} className="text-sm font-semibold text-leaf-700">
                写真追加
              </Link>
            ) : null}
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {galleryPhotos.map((photo) => (
              <figure key={photo.id} className="overflow-hidden rounded-lg bg-white/84 ring-1 ring-leaf-100">
                <div className="relative aspect-square bg-leaf-100">
                  <Image src={getPhotoUrl(photo, "thumb")} alt={photo.caption ?? cultivar.name_ja} fill className="object-cover" sizes="(min-width: 640px) 33vw, 50vw" />
                </div>
                {photo.caption || photo.photo_type ? (
                  <figcaption className="space-y-1 p-2 text-xs leading-5 text-leaf-900/68">
                    {photo.photo_type ? <span className="inline-flex rounded-md bg-leaf-50 px-2 py-1 font-semibold">{photo.photo_type}</span> : null}
                    {photo.caption ? <p>{photo.caption}</p> : null}
                  </figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        </section>
      ) : isAdmin ? (
        <section className="rounded-lg border border-dashed border-leaf-200 bg-white/70 p-4">
          <Link href={`/admin/photos?fruit_id=${cultivar.fruit_id}&cultivar_id=${cultivar.id}`} className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-leaf-700 px-4 py-3 text-sm font-semibold text-white">
            <ImagePlus size={17} />
            この品種に写真を追加
          </Link>
        </section>
      ) : null}

      {cultivar.videos && cultivar.videos.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-leaf-900">YouTube</h2>
          <div className="grid gap-3">
            {cultivar.videos.map((video) => (
              <a
                key={video.id}
                href={video.youtube_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-lg bg-white/84 p-4 ring-1 ring-leaf-100"
              >
                <PlayCircle className="text-fruit-600" size={24} />
                <span className="min-w-0 flex-1 font-semibold text-leaf-900">{video.title || video.youtube_url}</span>
                <ExternalLink size={16} />
              </a>
            ))}
          </div>
        </section>
      ) : null}

      <section className="rounded-lg bg-white/84 p-5 ring-1 ring-leaf-100">
        <h2 className="font-bold text-leaf-900">品種情報</h2>

        {cultivar.description ? <p className="mt-4 leading-7 text-leaf-900/82">{cultivar.description}</p> : null}

        {primaryStats.some((stat) => stat.value) ? (
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {primaryStats.map((stat) => (
              <MetricCard key={stat.label} label={stat.label} value={stat.value} icon={stat.icon} />
            ))}
          </div>
        ) : null}

        <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr]">
          <InfoGroup title="果実と食味">
            <Info label="原産地" value={displayOrigin} />
            <Info label="果実サイズ" value={cultivar.fruit_size} />
            <Info label="味" value={cultivar.taste} />
            <Info label="食感" value={cultivar.texture} />
            <Info label="香り" value={cultivar.aroma} />
            <Info label="収穫期" value={cultivar.harvest_season} />
          </InfoGroup>

          <InfoGroup title="栽培の見どころ">
            {isAvocado ? <Info label="耐寒温度目安" value={cultivar.cold_hardiness} /> : null}
            {showsFloweringType ? <Info label="開花型" value={cultivar.flowering_type} /> : null}
            {isBanana ? <Info label="背丈" value={cultivar.plant_height_type} /> : null}
            {isBanana ? <Info label="ゲノム構成" value={cultivar.genome_group} /> : null}
            {isBanana ? <Info label="収量" value={cultivar.yield_level} /> : null}
            <Info label="樹勢" value={cultivar.tree_vigor} />
            <Info label="難易度" value={cultivar.difficulty} />
            <Info label="沖縄適性" value={cultivar.okinawa_suitability} />
            <Info label="鉢植え適性" value={cultivar.container_suitability} />
            <Info label="初心者向け" value={cultivar.beginner_suitability} />
          </InfoGroup>
        </div>

        {cultivar.kenyu_comment ? (
          <div className="mt-5 rounded-lg bg-fruit-100 p-4 text-sm leading-6 text-leaf-900/82">
            <p className="font-bold text-leaf-900">けんゆーコメント</p>
            <p className="mt-2">{cultivar.kenyu_comment}</p>
          </div>
        ) : null}
        {cultivar.public_notes ? (
          <div className="mt-4 rounded-lg bg-leaf-50 p-4 text-sm leading-6 text-leaf-900/72">
            <p className="font-bold text-leaf-900">出典・補足</p>
            <p className="mt-1 whitespace-pre-line">{cultivar.public_notes}</p>
          </div>
        ) : null}
      </section>
    </div>
  );
}

function MetricCard({ label, value, icon }: { label: string; value: string | null; icon: ReactNode }) {
  if (!value) return null;
  return (
    <div className="rounded-lg bg-leaf-50 p-4 ring-1 ring-leaf-100">
      <div className="flex items-center gap-2 text-leaf-700">
        {icon}
        <dt className="text-xs font-bold">{label}</dt>
      </div>
      <dd className="mt-2 text-lg font-bold leading-tight text-leaf-900">{value}</dd>
    </div>
  );
}

function getPrimaryStats({
  fruitSlug,
  origin,
  fruitSize,
  taste,
  description,
  harvestSeason,
  coldHardiness,
  floweringType,
  plantHeightType,
  genomeGroup,
  yieldLevel
}: {
  fruitSlug: string;
  origin: string | null;
  fruitSize: string | null;
  taste: string | null;
  description: string | null;
  harvestSeason: string | null;
  coldHardiness: string | null;
  floweringType: string | null;
  plantHeightType: string | null;
  genomeGroup: string | null;
  yieldLevel: string | null;
}) {
  if (fruitSlug === "banana") {
    return [
      { label: "背丈", value: plantHeightType, icon: <Ruler size={18} /> },
      { label: "ゲノム", value: genomeGroup, icon: <Dna size={18} /> },
      { label: "収量", value: yieldLevel, icon: <BarChart3 size={18} /> }
    ];
  }

  if (fruitSlug === "avocado") {
    return [
      { label: "耐寒温度", value: coldHardiness, icon: <Thermometer size={18} /> },
      { label: "開花型", value: floweringType, icon: <Flower2 size={18} /> },
      { label: "収穫期", value: harvestSeason, icon: <Apple size={18} /> }
    ];
  }

  if (fruitSlug === "mango") {
    return [
      { label: "産地", value: origin, icon: <Globe2 size={18} /> },
      { label: "糖度", value: getMangoSugar(taste, description), icon: <BarChart3 size={18} /> },
      { label: "収穫期", value: harvestSeason ?? getMaturityDays(taste, description), icon: <Apple size={18} /> },
      { label: "果実重", value: getFruitWeightSummary(fruitSize, description), icon: <Scale size={18} /> }
    ];
  }

  return [
    { label: "耐寒温度目安", value: coldHardiness, icon: <Sprout size={18} /> },
    { label: "開花型", value: floweringType, icon: <Leaf size={18} /> },
    { label: "収穫期", value: harvestSeason, icon: <Apple size={18} /> }
  ];
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

function InfoGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-lg bg-white/72 p-4 ring-1 ring-leaf-100">
      <h3 className="text-sm font-bold text-leaf-900">{title}</h3>
      <dl className="mt-3 grid gap-3 text-sm leading-6 text-leaf-900/76">{children}</dl>
    </section>
  );
}

function Info({ label, value }: { label: string; value: string | boolean | null }) {
  if (value === null || value === "") return null;
  return (
    <div className="grid gap-1 border-b border-leaf-100 pb-3 last:border-b-0 last:pb-0 sm:grid-cols-[8.5rem_1fr]">
      <dt className="font-semibold text-leaf-900">{label}</dt>
      <dd className="whitespace-pre-line">{typeof value === "boolean" ? (value ? "はい" : "いいえ") : value}</dd>
    </div>
  );
}

function getPublicBananaOrigin(origin: string | null) {
  if (!origin) return null;
  const internalPatterns = ["さん", "氏", "購入", "吸芽", "導入", "提供", "株", "メイクマン", "JAおきなわ", "旧農大", "農大"];
  if (internalPatterns.some((pattern) => origin.includes(pattern))) return null;
  return origin;
}
