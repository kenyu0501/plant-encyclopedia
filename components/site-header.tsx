import Link from "next/link";
import { ArrowUpRight, Leaf } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 pb-5 pt-5 sm:px-6 sm:pt-7">
      <Link href="/" prefetch={false} className="group inline-flex min-w-0 items-center gap-3" aria-label="けんゆーの熱帯果樹図鑑 ホーム">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-leaf-900 text-fruit-200 transition-colors group-hover:bg-leaf-700">
          <Leaf size={19} strokeWidth={1.8} />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-[15px] font-bold tracking-[0.035em] text-leaf-900 sm:text-base">けんゆーの熱帯果樹図鑑</span>
          <span className="mt-0.5 block text-[9px] font-bold tracking-[0.22em] text-leaf-700/65 sm:text-[10px]">TROPICAL FRUIT FIELD GUIDE</span>
        </span>
      </Link>
      <Link href="/fruits" prefetch={false} className="hidden items-center gap-1.5 border-b border-leaf-300 pb-1 text-xs font-bold tracking-wider text-leaf-800 transition-colors hover:border-leaf-700 sm:inline-flex">
        図鑑を見る <ArrowUpRight size={15} />
      </Link>
    </header>
  );
}
