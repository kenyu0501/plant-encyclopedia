import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Pencil, PlayCircle } from "lucide-react";
import { CultivarList } from "@/components/cultivar-list";
import { MangoPedigree } from "@/components/mango-pedigree";
import { PageHeader } from "@/components/page-header";
import { getCurrentUser, isAdminUser } from "@/lib/auth";
import { getPublicFruitBySlug } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const fruit = await getPublicFruitBySlug(slug);
  return {
    title: fruit?.name_ja ?? "果樹詳細"
  };
}

export default async function FruitDetailPage({ params }: Props) {
  const { slug } = await params;
  const fruit = await getPublicFruitBySlug(slug);
  if (!fruit) notFound();

  const user = await getCurrentUser();
  const isAdmin = await isAdminUser(user);
  const mainPhoto = fruit.photos?.find((photo) => photo.is_main) ?? fruit.photos?.[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title={fruit.name_ja}
        description={[fruit.name_en, fruit.scientific_name].filter(Boolean).join(" / ")}
        action={
          isAdmin ? (
            <Link
              href={`/admin/fruits/${fruit.id}`}
              className="inline-flex items-center gap-2 rounded-md bg-leaf-700 px-3 py-2 text-sm font-semibold text-white"
            >
              <Pencil size={16} />
              編集
            </Link>
          ) : null
        }
      />

      {mainPhoto ? (
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-leaf-100">
          <Image src={mainPhoto.image_url} alt={mainPhoto.caption ?? fruit.name_ja} fill className="object-cover" priority />
        </div>
      ) : null}

      <section className="rounded-lg bg-white/84 p-5 ring-1 ring-leaf-100">
        <h2 className="font-bold text-leaf-900">果樹情報</h2>
        <div className="mt-4 grid gap-4 text-sm leading-6 text-leaf-900/76">
          <Info label="科名" value={fruit.family_name} />
          <Info label="原産地" value={fruit.origin} />
          <Info label="樹形・性質" value={fruit.growth_habit} />
          <Info label="花" value={fruit.flower_description} />
          <Info label="果実" value={fruit.fruit_description} />
          <Info label="栽培メモ" value={fruit.cultivation_summary} />
          <Info label="沖縄適性" value={fruit.okinawa_suitability} />
        </div>
        {fruit.description ? <p className="mt-5 leading-7 text-leaf-900/80">{fruit.description}</p> : null}
        {fruit.public_notes ? <p className="mt-4 rounded-md bg-leaf-50 p-3 text-sm leading-6 text-leaf-900/76">{fruit.public_notes}</p> : null}
      </section>

      {fruit.slug === "mango" ? <MangoPedigree /> : null}

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-leaf-900">品種</h2>
          {isAdmin ? (
            <Link href={`/admin/cultivars/new?fruit_id=${fruit.id}`} className="text-sm font-semibold text-leaf-700">
              品種追加
            </Link>
          ) : null}
        </div>
        <CultivarList fruitSlug={fruit.slug} cultivars={fruit.cultivars ?? []} />
      </section>

      {fruit.videos && fruit.videos.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-leaf-900">YouTube</h2>
          <div className="grid gap-3">
            {fruit.videos.map((video) => (
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
    </div>
  );
}

function Info({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div>
      <dt className="font-semibold text-leaf-900">{label}</dt>
      <dd className="mt-1">{value}</dd>
    </div>
  );
}
