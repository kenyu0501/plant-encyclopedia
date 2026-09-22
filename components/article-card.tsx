import Link from "next/link";
import { ArrowUpRight, Heart } from "lucide-react";
import { formatArticleDate, getArticleCategory } from "@/lib/articles";
import type { Article } from "@/types/database";

export function ArticleCard({ article, featured = false }: { article: Article; featured?: boolean }) {
  const category = getArticleCategory(article.category);
  return (
    <Link href={`/articles/${article.slug}`} className={`interactive-card group overflow-hidden rounded-xl border border-leaf-100 bg-white shadow-soft ${featured ? "sm:grid sm:grid-cols-[1.2fr_1fr]" : ""}`}>
      <div className={`relative overflow-hidden bg-leaf-100 ${featured ? "aspect-[16/10] sm:aspect-auto sm:min-h-72" : "aspect-[16/10]"}`}>
        {article.hero_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={article.hero_image_url} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.035]" loading={featured ? "eager" : "lazy"} />
        ) : (
          <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_70%_20%,#527c5e,#142f27_70%)] text-xs font-bold tracking-[0.24em] text-white/70">TROPICAL FRUIT MEDIA</div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-black tracking-widest text-leaf-900">{category.shortLabel}</span>
      </div>
      <div className={featured ? "flex flex-col justify-center p-6 sm:p-8" : "p-5"}>
        <div className="flex items-center justify-between gap-3 text-xs font-semibold text-leaf-900/55">
          <time dateTime={article.published_at ?? article.created_at}>{formatArticleDate(article.published_at ?? article.created_at)}</time>
          <span className="inline-flex items-center gap-1"><Heart size={13} />{article.like_count}</span>
        </div>
        <h2 className={`display-serif mt-3 font-bold leading-[1.45] text-leaf-900 ${featured ? "text-2xl sm:text-3xl" : "text-xl"}`}>{article.title}</h2>
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-leaf-900/68">{article.excerpt}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-leaf-700">記事を読む <ArrowUpRight size={15} /></span>
      </div>
    </Link>
  );
}
