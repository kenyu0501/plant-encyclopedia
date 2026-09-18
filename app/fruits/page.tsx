import type { Metadata } from "next";
import { FruitCatalog, type FruitCatalogItem } from "@/components/fruit-catalog";
import { PageHeader } from "@/components/page-header";
import { getPhotoUrl } from "@/lib/photo-url";
import { getPublicFruits } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "果樹一覧"
};

export default async function FruitsPage() {
  const fruits = await getPublicFruits();
  const catalogItems: FruitCatalogItem[] = fruits.map((fruit, displayIndex) => {
    const photo = fruit.photos?.find((item) => item.is_main) ?? fruit.photos?.[0];
    return {
      id: fruit.id,
      slug: fruit.slug,
      nameJa: fruit.name_ja,
      nameEn: fruit.name_en,
      scientificName: fruit.scientific_name,
      familyName: fruit.family_name,
      description: fruit.description,
      imageUrl: photo ? getPhotoUrl(photo, "thumb") : null,
      imageAlt: photo?.caption ?? fruit.name_ja,
      cultivarCount: fruit.cultivars?.length ?? 0,
      displayIndex
    };
  });

  return (
    <div className="space-y-6">
      <PageHeader title="果樹図鑑" description="写真から気になる果樹を探せます。果樹を開くと品種や栽培情報をご覧いただけます。" />
      {catalogItems.length > 0 ? (
        <FruitCatalog fruits={catalogItems} />
      ) : (
        <p className="rounded-lg bg-white/80 p-5 text-leaf-900/70 ring-1 ring-leaf-100">
          公開中の果樹がありません．
        </p>
      )}
    </div>
  );
}
