import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mx-auto w-full max-w-5xl px-4 pb-28 pt-8 sm:px-6">
      <div className="flex flex-col gap-4 border-t border-leaf-200 pt-6 text-xs text-leaf-900/55 sm:flex-row sm:items-center sm:justify-between">
        <p>© けんゆーの熱帯果樹メディア</p>
        <nav className="flex flex-wrap gap-x-4 gap-y-2" aria-label="サイト情報">
          <Link href="/about/editorial-policy" className="hover:text-leaf-800">編集方針</Link>
          <Link href="/privacy" className="hover:text-leaf-800">プライバシー</Link>
          <Link href="/fruits" className="hover:text-leaf-800">品種図鑑</Link>
        </nav>
      </div>
    </footer>
  );
}
