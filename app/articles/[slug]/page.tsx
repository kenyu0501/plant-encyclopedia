import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { ArticleLikeButton } from "@/components/article-like-button";
import { ArticleContent } from "@/components/article-content";
import { AdSlot } from "@/components/ad-slot";
import { ContextNavigation } from "@/components/context-navigation";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { ShareButtons } from "@/components/share-buttons";
import { formatArticleDate, getArticleCategory } from "@/lib/articles";
import { getPublishedArticleBySlug } from "@/lib/queries";
import { getAbsoluteUrl, getMetadataDescription } from "@/lib/site-url";
import { getYoutubeId } from "@/lib/youtube";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);
  if (!article) return { title: "記事" };
  const title = article.seo_title || article.title;
  const description = getMetadataDescription(article.seo_description, article.excerpt, article.content);
  const url = getAbsoluteUrl(`/articles/${article.slug}`);
  return { title, description, alternates: { canonical: url }, openGraph: { type: "article", title, description, url, publishedTime: article.published_at ?? undefined, images: article.hero_image_url ? [{ url: article.hero_image_url }] : undefined }, twitter: { card: article.hero_image_url ? "summary_large_image" : "summary", title, description, images: article.hero_image_url ? [article.hero_image_url] : undefined } };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);
  if (!article) notFound();
  const category = getArticleCategory(article.category);
  const url = getAbsoluteUrl(`/articles/${article.slug}`);
  const youtubeId = article.youtube_url ? getYoutubeId(article.youtube_url) : null;
  const jsonLd = { "@context": "https://schema.org", "@type": article.category === "news" ? "NewsArticle" : "Article", headline: article.title, description: article.excerpt, image: article.hero_image_url ? [article.hero_image_url] : undefined, datePublished: article.published_at, dateModified: article.updated_at, author: { "@type": "Person", name: article.author_name }, mainEntityOfPage: url };

  return (
    <article className="space-y-7">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <ContextNavigation
        fallbackHref="/articles"
        trail={[
          { label: "記事", href: "/articles" },
          { label: category.label, href: `/articles?category=${article.category}` },
          { label: article.title }
        ]}
      />
      <header className="border-b border-leaf-200 pb-7">
        <Link href={`/articles?category=${article.category}`} className="text-[11px] font-black tracking-[0.2em] text-leaf-700">{category.shortLabel} · {category.label}</Link>
        <h1 className="display-serif mt-4 text-3xl font-bold leading-[1.4] text-leaf-900 sm:text-5xl">{article.title}</h1>
        <p className="mt-5 text-base leading-8 text-leaf-900/68 sm:text-lg">{article.excerpt}</p>
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-leaf-900/55"><time>{formatArticleDate(article.published_at)}</time><span>文：{article.author_name}</span></div>
      </header>
      {article.hero_image_url ? <figure className="overflow-hidden rounded-[1.5rem] bg-leaf-100">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={article.hero_image_url} alt="" className="aspect-[16/9] w-full object-cover" /></figure> : null}
      {youtubeId ? <div className="aspect-video overflow-hidden rounded-xl bg-black"><iframe src={`https://www.youtube-nocookie.com/embed/${youtubeId}`} title={article.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="h-full w-full" /></div> : null}
      <div className="mx-auto max-w-3xl space-y-6 text-[16px] leading-8 text-leaf-950/85 sm:text-[17px]">
        <ArticleContent content={article.content} />
      </div>
      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_ARTICLE_SLOT} className="mx-auto min-h-28 max-w-3xl border-y border-leaf-100 py-4" />
      {article.source_url ? <aside className="mx-auto max-w-3xl rounded-xl border border-leaf-100 bg-leaf-50/70 p-5"><p className="text-xs font-black tracking-widest text-leaf-700">SOURCE</p><a href={article.source_url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-2 font-bold text-leaf-900 underline decoration-leaf-300 underline-offset-4">{article.source_name || "出典を確認"}<ExternalLink size={15} /></a><p className="mt-2 text-xs leading-5 text-leaf-900/55">一次資料をご確認ください。記事は出典をもとに独自に解説しています。</p></aside> : null}
      <div className="flex flex-wrap items-center gap-3 border-y border-leaf-200 py-5"><ArticleLikeButton articleId={article.id} initialCount={article.like_count} /><ShareButtons title={article.title} text={article.excerpt} url={url} /></div>
      <NewsletterSignup />
      <ContextNavigation
        variant="footer"
        fallbackHref="/articles"
        trail={[]}
        destinations={[
          { label: `${category.label}の記事一覧へ`, href: `/articles?category=${article.category}` },
          { label: "すべての記事へ", href: "/articles" }
        ]}
      />
    </article>
  );
}
