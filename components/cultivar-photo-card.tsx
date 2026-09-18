import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getPhotoUrl } from "@/lib/photo-url";
import type { CultivarWithMedia } from "@/types/database";

export function CultivarPhotoCard({ fruitSlug, cultivar }: { fruitSlug: string; cultivar: CultivarWithMedia }) {
  const photo = cultivar.photos?.find((item) => item.is_main) ?? cultivar.photos?.[0];

  return (
    <Link href={`/fruits/${fruitSlug}/cultivars/${cultivar.slug}`} className="interactive-card group overflow-hidden rounded-xl border border-leaf-100 bg-white shadow-soft">
      <div className="relative aspect-square overflow-hidden bg-leaf-100">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={getPhotoUrl(photo, "thumb")} alt={photo.caption ?? cultivar.name_ja} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]" loading="lazy" />
        ) : (
          <div className="flex h-full items-center justify-center px-3 text-center text-xs font-bold tracking-wide text-leaf-700/55">写真準備中</div>
        )}
        {cultivar.is_for_sale ? <span className="absolute bottom-2 left-2 rounded-full bg-fruit-100/95 px-2.5 py-1 text-[10px] font-bold text-fruit-800">販売あり</span> : null}
      </div>
      <div className="p-3.5 sm:p-4">
        <div className="flex items-start justify-between gap-1">
          <h3 className="display-serif min-w-0 text-base font-bold leading-snug text-leaf-900 sm:text-lg">{cultivar.name_ja}</h3>
          <ArrowUpRight size={16} className="mt-0.5 shrink-0 text-leaf-700 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
        {cultivar.name_en ? <p className="mt-1 truncate text-xs text-leaf-900/55">{cultivar.name_en}</p> : null}
        {cultivar.sugar_content ? <p className="mt-2 text-[11px] font-bold text-leaf-700">糖度 {cultivar.sugar_content}</p> : null}
      </div>
    </Link>
  );
}
