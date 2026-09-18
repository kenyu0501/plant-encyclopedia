import { ChevronLeft, ChevronRight } from "lucide-react";

export function CatalogPagination({
  page,
  pageCount,
  onPageChange
}: {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}) {
  if (pageCount <= 1) return null;

  return (
    <nav aria-label="一覧のページ切り替え" className="flex flex-wrap items-center justify-center gap-2">
      <button type="button" disabled={page === 1} onClick={() => onPageChange(page - 1)} className="inline-flex min-h-10 items-center gap-1 rounded-full border border-leaf-200 bg-white px-3 text-sm font-semibold text-leaf-800 disabled:cursor-not-allowed disabled:opacity-40">
        <ChevronLeft size={16} />前へ
      </button>
      {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
        <button
          key={number}
          type="button"
          onClick={() => onPageChange(number)}
          aria-label={`${number}ページ目`}
          aria-current={page === number ? "page" : undefined}
          className={`grid min-h-10 min-w-10 place-items-center rounded-full border px-2 text-sm font-bold ${page === number ? "border-leaf-900 bg-leaf-900 text-white" : "border-leaf-200 bg-white text-leaf-800 hover:bg-leaf-50"}`}
        >
          {number}
        </button>
      ))}
      <button type="button" disabled={page === pageCount} onClick={() => onPageChange(page + 1)} className="inline-flex min-h-10 items-center gap-1 rounded-full border border-leaf-200 bg-white px-3 text-sm font-semibold text-leaf-800 disabled:cursor-not-allowed disabled:opacity-40">
        次へ<ChevronRight size={16} />
      </button>
    </nav>
  );
}
