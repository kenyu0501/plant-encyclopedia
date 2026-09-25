"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight } from "lucide-react";

type TrailItem = {
  label: string;
  href?: string;
};

type Destination = {
  label: string;
  href: string;
};

export function ContextNavigation({
  trail,
  fallbackHref,
  destinations = [],
  variant = "top"
}: {
  trail: TrailItem[];
  fallbackHref: string;
  destinations?: Destination[];
  variant?: "top" | "footer";
}) {
  const router = useRouter();

  function goBack() {
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.push(fallbackHref);
  }

  if (variant === "footer") {
    return (
      <nav aria-label="次のページへの移動" className="editorial-card p-5 sm:p-6">
        <p className="section-kicker">KEEP EXPLORING</p>
        <p className="mt-2 text-sm leading-6 text-leaf-900/62">続けて別のページを見る</p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            onClick={goBack}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-leaf-200 bg-white px-4 py-2.5 text-sm font-bold text-leaf-800 transition-colors hover:bg-leaf-50"
          >
            <ArrowLeft size={17} />
            前のページへ戻る
          </button>
          {destinations.map((destination, index) => (
            <Link
              key={destination.href}
              href={destination.href}
              className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-colors ${
                index === 0
                  ? "bg-leaf-800 text-white hover:bg-leaf-700"
                  : "border border-leaf-200 bg-white text-leaf-800 hover:bg-leaf-50"
              }`}
            >
              {destination.label}
              <ChevronRight size={17} />
            </Link>
          ))}
        </div>
      </nav>
    );
  }

  return (
    <nav aria-label="パンくずリスト" className="flex min-w-0 flex-col gap-3 border-b border-leaf-100 pb-4 sm:flex-row sm:items-center">
      <button
        type="button"
        onClick={goBack}
        className="inline-flex min-h-10 shrink-0 items-center gap-2 self-start rounded-full border border-leaf-200 bg-white px-3.5 py-2 text-sm font-bold text-leaf-800 shadow-sm transition-colors hover:bg-leaf-50"
      >
        <ArrowLeft size={16} />
        前へ戻る
      </button>
      <ol className="flex min-w-0 items-center gap-1.5 overflow-x-auto whitespace-nowrap pb-1 text-xs font-semibold text-leaf-900/58 sm:pb-0">
        {trail.map((item, index) => {
          const current = index === trail.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex min-w-0 items-center gap-1.5">
              {index > 0 ? <ChevronRight aria-hidden="true" className="shrink-0 text-leaf-900/30" size={14} /> : null}
              {item.href && !current ? (
                <Link href={item.href} className="rounded px-1 py-1 text-leaf-700 hover:bg-leaf-50 hover:text-leaf-900">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={current ? "page" : undefined} className={current ? "max-w-52 truncate px-1 text-leaf-900" : "px-1"}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
