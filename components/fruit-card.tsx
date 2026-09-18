import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { FruitCatalogItem } from "@/components/fruit-catalog";

export function FruitCard({ fruit }: { fruit: FruitCatalogItem }) {
  return (
    <Link href={`/fruits/${fruit.slug}`} className="interactive-card group overflow-hidden rounded-xl border border-leaf-100 bg-white shadow-soft">
      <div className="relative aspect-square overflow-hidden bg-leaf-100">
        {fruit.imageUrl ? (
          <Image src={fruit.imageUrl} alt={fruit.imageAlt} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.06]" sizes="(min-width: 1024px) 180px, (min-width: 640px) 33vw, 50vw" unoptimized />
        ) : (
          <div className="flex h-full items-center justify-center px-3 text-center text-xs font-bold tracking-widest text-leaf-700/50">写真準備中</div>
        )}
      </div>
      <div className="p-3.5 sm:p-4">
        <div className="flex items-start justify-between gap-1">
          <h2 className="display-serif min-w-0 text-base font-bold leading-snug text-leaf-900 sm:text-lg">{fruit.nameJa}</h2>
          <ArrowUpRight size={16} className="mt-0.5 shrink-0 text-leaf-700 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
        {fruit.nameEn ? <p className="mt-1 truncate text-xs text-leaf-900/55">{fruit.nameEn}</p> : null}
        <p className="mt-2 text-[11px] font-bold text-leaf-700">{fruit.cultivarCount} 品種</p>
      </div>
    </Link>
  );
}
