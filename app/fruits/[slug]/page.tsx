import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, ImagePlus, Newspaper, Pencil, PlayCircle } from "lucide-react";
import { CommunityPhotoGallery, type CommunityPhotoItem } from "@/components/community-photo-gallery";
import { CultivarList } from "@/components/cultivar-list";
import { CultivarComparison } from "@/components/cultivar-comparison";
import { JsonLd } from "@/components/json-ld";
import { MangoPedigree } from "@/components/mango-pedigree";
import { PhotoLightboxGallery } from "@/components/photo-lightbox-gallery";
import { PageHeader } from "@/components/page-header";
import { ShareButtons } from "@/components/share-buttons";
import { getCurrentUser, isAdminUser } from "@/lib/auth";
import { getPhotoUrl } from "@/lib/photo-url";
import { getPublicFruitBySlug, getPublishedArticlesLinkingToPath } from "@/lib/queries";
import { getAbsoluteUrl, getMetadataDescription } from "@/lib/site-url";
import { buildBreadcrumbList, buildImageObjects } from "@/lib/structured-data";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const fruit = await getPublicFruitBySlug(slug);
  if (!fruit) return { title: "果樹詳細" };

  const title = `${fruit.name_ja}${fruit.name_en ? `（${fruit.name_en}）` : ""}`;
  const description = getMetadataDescription(fruit.description, fruit.fruit_description, fruit.cultivation_summary);
  const url = getAbsoluteUrl(`/fruits/${fruit.slug}`);
  const officialPhotos = (fruit.photos ?? []).filter((photo) => photo.source_type !== "viewer");
  const mainPhoto = officialPhotos.find((photo) => photo.is_main) ?? officialPhotos[0];
  const image = mainPhoto ? getPhotoUrl(mainPhoto, "medium") : null;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      images: image ? [{ url: image, alt: fruit.name_ja }] : undefined
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : undefined
    }
  };
}

export default async function FruitDetailPage({ params }: Props) {
  const { slug } = await params;
  const fruit = await getPublicFruitBySlug(slug);
  if (!fruit) notFound();

  const user = await getCurrentUser();
  const isAdmin = await isAdminUser(user);
  const relatedArticles = await getPublishedArticlesLinkingToPath(`/fruits/${fruit.slug}`);
  const officialPhotos = (fruit.photos ?? []).filter((photo) => photo.source_type !== "viewer");
  const mainPhoto = officialPhotos.find((photo) => photo.is_main) ?? officialPhotos[0];
  const shareTitle = `${fruit.name_ja}${fruit.name_en ? `（${fruit.name_en}）` : ""}｜けんゆーの熱帯果樹図鑑`;
  const shareText = getMetadataDescription(fruit.description, fruit.fruit_description, fruit.cultivation_summary);
  const shareUrl = getAbsoluteUrl(`/fruits/${fruit.slug}`);
  const photos = [...officialPhotos].sort((a, b) => Number(b.is_main) - Number(a.is_main));
  const galleryPhotos = photos
    .filter((photo) => photo.id !== mainPhoto?.id)
    .filter((photo) => isFruitPagePhoto(photo.photo_type))
    .slice(0, 6);
  const communityPhotos: CommunityPhotoItem[] = [
    ...(fruit.photos ?? [])
      .filter((photo) => photo.source_type === "viewer")
      .map((photo) => ({ photo, fruitName: fruit.name_ja, cultivarName: null })),
    ...(fruit.cultivars ?? []).flatMap((cultivar) =>
      (cultivar.photos ?? [])
        .filter((photo) => photo.source_type === "viewer")
        .map((photo) => ({
          photo,
          fruitName: fruit.name_ja,
          cultivarName: cultivar.name_ja
        }))
    )
  ];
  const fruitTermId = `${shareUrl}#fruit`;
  const breadcrumbId = `${shareUrl}#breadcrumb`;
  const structuredImages = buildImageObjects({
    photos,
    pageUrl: shareUrl,
    subjectId: fruitTermId,
    subjectName: fruit.name_ja
  });
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      buildBreadcrumbList(breadcrumbId, [
        { name: "ホーム", url: getAbsoluteUrl("/") },
        { name: "果樹図鑑", url: getAbsoluteUrl("/fruits") },
        { name: fruit.name_ja, url: shareUrl }
      ]),
      {
        "@type": "WebPage",
        "@id": `${shareUrl}#webpage`,
        url: shareUrl,
        name: shareTitle,
        description: shareText,
        dateModified: fruit.updated_at,
        breadcrumb: { "@id": breadcrumbId },
        mainEntity: { "@id": fruitTermId },
        ...(structuredImages[0] ? { primaryImageOfPage: { "@id": structuredImages[0]["@id"] } } : {})
      },
      {
        "@type": "DefinedTerm",
        "@id": fruitTermId,
        name: fruit.name_ja,
        ...(fruit.name_en ? { alternateName: fruit.name_en } : {}),
        termCode: fruit.slug,
        description: shareText,
        url: shareUrl,
        inDefinedTermSet: {
          "@type": "DefinedTermSet",
          "@id": `${getAbsoluteUrl("/fruits")}#term-set`,
          name: "けんゆーの熱帯果樹図鑑",
          url: getAbsoluteUrl("/fruits")
        },
        ...(structuredImages.length > 0
          ? { image: structuredImages.map((image) => ({ "@id": image["@id"] })) }
          : {})
      },
      ...structuredImages
    ]
  };

  return (
    <div className="space-y-7">
      <JsonLd data={structuredData} />
      <PageHeader
        title={fruit.name_ja}
        description={fruit.name_en ?? undefined}
        action={
          <div className="flex flex-wrap justify-end gap-2">
            <Link
              href={`/submit-photo?fruit_id=${fruit.id}`}
              className="inline-flex items-center gap-2 rounded-md border border-leaf-200 bg-white px-3 py-2 text-sm font-semibold text-leaf-800"
            >
              <ImagePlus size={16} />
              写真投稿
            </Link>
          {isAdmin ? (
            <Link
              href={`/admin/fruits/${fruit.id}`}
              className="inline-flex items-center gap-2 rounded-md bg-leaf-700 px-3 py-2 text-sm font-semibold text-white"
            >
              <Pencil size={16} />
              編集
            </Link>
          ) : null
          }
          </div>
        }
      />

      <ShareButtons title={shareTitle} text={shareText} url={shareUrl} />

      {mainPhoto ? (
        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-leaf-100 shadow-soft sm:aspect-[16/10]">
          <Image src={getPhotoUrl(mainPhoto, "medium")} alt={mainPhoto.caption ?? fruit.name_ja} fill className="object-cover" priority sizes="100vw" unoptimized />
        </div>
      ) : null}

      {galleryPhotos.length > 0 ? (
        <section>
          <PhotoLightboxGallery
            photos={galleryPhotos}
            altFallback={fruit.name_ja}
            gridClassName="grid gap-3 sm:grid-cols-3"
            aspectClassName="aspect-[4/3]"
            sizes="(min-width: 640px) 33vw, 100vw"
          />
        </section>
      ) : null}

      <CommunityPhotoGallery items={communityPhotos} />

      {relatedArticles.length > 0 ? (
        <section className="space-y-3">
          <div>
            <p className="section-kicker">RELATED STORIES</p>
            <h2 className="display-serif mt-2 text-2xl font-bold text-leaf-900">この果樹を紹介している記事</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {relatedArticles.map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                className="interactive-card flex items-start gap-3 rounded-xl border border-leaf-100 bg-white p-4 shadow-soft"
              >
                <Newspaper className="mt-0.5 shrink-0 text-fruit-600" size={22} />
                <span className="min-w-0">
                  <span className="block font-bold leading-6 text-leaf-900">{article.title}</span>
                  {article.excerpt ? <span className="mt-1 line-clamp-2 block text-xs leading-5 text-leaf-900/60">{article.excerpt}</span> : null}
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="editorial-card p-5 sm:p-7">
        <p className="section-kicker">FRUIT PROFILE</p>
        <h2 className="display-serif mt-2 text-2xl font-bold text-leaf-900">果樹情報</h2>
        <div className="mt-5 grid gap-4 text-sm leading-7 text-leaf-900/76 sm:grid-cols-2">
          <Info label="学名" value={fruit.scientific_name} italic />
          <Info label="科名" value={fruit.family_name} />
          <Info label="原産地" value={fruit.origin} />
          <Info label="樹形・性質" value={fruit.growth_habit} />
          <Info label="花" value={fruit.flower_description} />
          <Info label="果実" value={fruit.fruit_description} />
          <Info label="栽培メモ" value={fruit.cultivation_summary} />
          <Info label="沖縄適性" value={fruit.okinawa_suitability} />
        </div>
        {fruit.description ? <p className="mt-5 leading-7 text-leaf-900/80">{fruit.description}</p> : null}
        {fruit.public_notes ? (
          <p className="mt-4 max-w-full whitespace-pre-line rounded-md bg-leaf-50 p-3 text-sm leading-6 text-leaf-900/76 [overflow-wrap:anywhere]">
            {fruit.public_notes}
          </p>
        ) : null}
      </section>

      <section id="cultivars" className="scroll-mt-5 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div><p className="section-kicker">CULTIVAR COLLECTION</p><h2 className="display-serif mt-2 text-2xl font-bold text-leaf-900">品種</h2></div>
          {isAdmin ? (
            <Link href={`/admin/cultivars/new?fruit_id=${fruit.id}`} className="text-sm font-semibold text-leaf-700">
              品種追加
            </Link>
          ) : null}
        </div>
        <CultivarComparison fruitName={fruit.name_ja} fruitSlug={fruit.slug} cultivars={fruit.cultivars ?? []} />
        <CultivarList fruitSlug={fruit.slug} cultivars={fruit.cultivars ?? []} />
      </section>

      {fruit.slug === "mango" ? <MangoPedigree /> : null}

      {fruit.videos && fruit.videos.length > 0 ? (
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-leaf-900">関連YouTube</h2>
            {isAdmin ? (
              <Link href={`/admin/fruits/${fruit.id}`} className="text-sm font-semibold text-leaf-700">
                YouTube管理
              </Link>
            ) : null}
          </div>
          <div className="grid gap-3">
            {fruit.videos.map((video) => (
              <a
                key={video.id}
                href={video.youtube_url}
                target="_blank"
                rel="noreferrer"
                className="interactive-card flex items-center gap-3 rounded-xl border border-leaf-100 bg-white p-4 shadow-soft"
              >
                <PlayCircle className="shrink-0 text-fruit-600" size={24} />
                <span className="min-w-0 flex-1 font-semibold text-leaf-900">{video.title || video.youtube_url}</span>
                <ExternalLink className="shrink-0" size={16} />
              </a>
            ))}
          </div>
        </section>
      ) : isAdmin ? (
        <section className="rounded-lg border border-dashed border-leaf-200 bg-white/70 p-4">
          <Link href={`/admin/fruits/${fruit.id}`} className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-leaf-700 px-4 py-3 text-sm font-semibold text-white">
            <PlayCircle size={17} />
            この果樹にYouTubeを追加
          </Link>
        </section>
      ) : null}
    </div>
  );
}

function isFruitPagePhoto(photoType: string | null) {
  if (!photoType) return true;
  return [
    "fruit",
    "メイン下画像",
    "メイン画像2",
    "メイン画像3",
    "栽培暦",
    "特徴図",
    "育て方図",
    "剪定図",
    "果実",
    "枝葉",
    "花",
    "木の様子",
    "その他"
  ].includes(photoType);
}

function Info({ label, value, italic = false }: { label: string; value: string | null; italic?: boolean }) {
  if (!value) return null;
  return (
    <div className="border-b border-leaf-100 pb-3">
      <dt className="text-xs font-bold tracking-wide text-leaf-700">{label}</dt>
      <dd className={`mt-1 text-leaf-900 ${italic ? "italic" : ""}`}>{value}</dd>
    </div>
  );
}
