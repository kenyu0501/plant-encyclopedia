import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, ImagePlus, Pencil, PlayCircle } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { getCurrentUser, isAdminUser } from "@/lib/auth";
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
          <Image src={mainPhoto.image_url} alt={mainPhoto.caption ?? cultivar.name_ja} fill className="object-cover" priority />
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
                  <Image src={photo.image_url} alt={photo.caption ?? cultivar.name_ja} fill className="object-cover" sizes="(min-width: 640px) 33vw, 50vw" />
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
        <div className="mt-4 grid gap-4 text-sm leading-6 text-leaf-900/76 sm:grid-cols-2">
          <Info label="原産地" value={cultivar.origin} />
          <Info label="果実サイズ" value={cultivar.fruit_size} />
          <Info label="味" value={cultivar.taste} />
          <Info label="食感" value={cultivar.texture} />
          <Info label="香り" value={cultivar.aroma} />
          <Info label="収穫期" value={cultivar.harvest_season} />
          <Info label="耐寒温度目安" value={cultivar.cold_hardiness} />
          <Info label="開花型" value={cultivar.flowering_type} />
          <Info label="樹勢" value={cultivar.tree_vigor} />
          <Info label="難易度" value={cultivar.difficulty} />
          <Info label="沖縄適性" value={cultivar.okinawa_suitability} />
          <Info label="鉢植え適性" value={cultivar.container_suitability} />
          <Info label="初心者向け" value={cultivar.beginner_suitability} />
        </div>
        {cultivar.description ? <p className="mt-5 leading-7 text-leaf-900/80">{cultivar.description}</p> : null}
        {cultivar.kenyu_comment ? (
          <p className="mt-4 rounded-md bg-fruit-100 p-3 text-sm leading-6 text-leaf-900/82">
            {cultivar.kenyu_comment}
          </p>
        ) : null}
        {cultivar.public_notes ? <p className="mt-4 text-sm leading-6 text-leaf-900/72">{cultivar.public_notes}</p> : null}
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string | boolean | null }) {
  if (value === null || value === "") return null;
  return (
    <div>
      <dt className="font-semibold text-leaf-900">{label}</dt>
      <dd className="mt-1">{typeof value === "boolean" ? (value ? "はい" : "いいえ") : value}</dd>
    </div>
  );
}
