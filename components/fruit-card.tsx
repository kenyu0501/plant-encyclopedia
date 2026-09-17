import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getPhotoUrl } from "@/lib/photo-url";
import type { FruitWithChildren } from "@/types/database";

export function FruitCard({ fruit }: { fruit: FruitWithChildren }) {
  const mainPhoto = fruit.photos?.find((photo) => photo.is_main) ?? fruit.photos?.[0];
  const cultivarCount = fruit.cultivars?.length ?? 0;

  return (
    <Link href={`/fruits/${fruit.slug}`} className="interactive-card group overflow-hidden rounded-xl border border-leaf-100 bg-white shadow-soft">
      <div className="relative aspect-[16/10] overflow-hidden bg-leaf-100">
        {mainPhoto ? (
          <>
            <Image src={getPhotoUrl(mainPhoto, "thumb")} alt={mainPhoto.caption ?? fruit.name_ja} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.035]" sizes="(min-width: 640px) 50vw, 100vw" unoptimized />
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-sm font-semibold tracking-widest text-leaf-700/50">PHOTO COMING SOON</div>
        )}
        <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-leaf-900 shadow-sm">{cultivarCount} 品種</span>
      </div>
      <div className="p-5 sm:p-6">
        <p className="section-kicker">FRUIT COLLECTION</p>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="display-serif mt-2 text-[1.35rem] font-bold text-leaf-900">{fruit.name_ja}</h2>
            {fruit.name_en ? <p className="mt-1 text-xs tracking-wide text-leaf-900/55">{fruit.name_en}</p> : null}
          </div>
          <ArrowUpRight size={19} className="mt-2 shrink-0 text-leaf-700 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
        {fruit.description ? <p className="mt-4 line-clamp-2 text-sm leading-7 text-leaf-900/68">{fruit.description}</p> : null}
      </div>
    </Link>
  );
}
