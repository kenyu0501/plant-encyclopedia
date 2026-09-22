import Link from "next/link";
import { Leaf } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 pb-5 pt-5 sm:px-6 sm:pt-7">
      <Link href="/" prefetch={false} className="group inline-flex min-w-0 items-center gap-3" aria-label="けんゆーの熱帯果樹メディア ホーム">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-leaf-900 text-fruit-200 transition-colors group-hover:bg-leaf-700">
          <Leaf size={19} strokeWidth={1.8} />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-[15px] font-bold tracking-[0.035em] text-leaf-900 sm:text-base">けんゆーの熱帯果樹メディア</span>
          <span className="mt-0.5 block text-[9px] font-bold tracking-[0.2em] text-leaf-700/65 sm:text-[10px]">NEWS · HOW TO · FRUIT GUIDE</span>
        </span>
      </Link>
      <nav aria-label="サイト内メニュー" className="hidden items-center gap-5 sm:flex">
        <Link href="/articles" className="text-xs font-bold tracking-wider text-leaf-800 hover:text-leaf-600">記事・ニュース</Link>
        <Link href="/fruits" className="text-xs font-bold tracking-wider text-leaf-800 hover:text-leaf-600">品種図鑑</Link>
      </nav>
    </header>
  );
}
