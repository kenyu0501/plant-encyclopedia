import Image from "next/image";
import Link from "next/link";
import type { FruitWithChildren } from "@/types/database";

export function FruitCard({ fruit }: { fruit: FruitWithChildren }) {
  const mainPhoto = fruit.photos?.find((photo) => photo.is_main) ?? fruit.photos?.[0];
  const cultivarCount = fruit.cultivars?.length ?? 0;

  return (
    <Link href={`/fruits/${fruit.slug}`} className="overflow-hidden rounded-lg bg-white/86 shadow-soft ring-1 ring-leaf-100">
      <div className="relative aspect-[4/3] bg-leaf-100">
        {mainPhoto ? (
          <Image src={mainPhoto.image_url} alt={mainPhoto.caption ?? fruit.name_ja} fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm font-semibold text-leaf-700">No photo</div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-leaf-900">{fruit.name_ja}</h2>
            {fruit.name_en ? <p className="mt-1 text-sm text-leaf-900/58">{fruit.name_en}</p> : null}
          </div>
          <span className="rounded-md bg-fruit-100 px-2 py-1 text-xs font-bold text-leaf-900">
            {cultivarCount}品種
          </span>
        </div>
        {fruit.description ? <p className="mt-3 line-clamp-3 text-sm leading-6 text-leaf-900/70">{fruit.description}</p> : null}
      </div>
    </Link>
  );
}
