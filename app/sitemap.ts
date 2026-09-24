import type { MetadataRoute } from "next";
import { getPublishedArticles, getPublicCultivarSitemapEntries, getPublicFruits } from "@/lib/queries";
import { getAbsoluteUrl } from "@/lib/site-url";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, fruits, cultivars] = await Promise.all([
    getPublishedArticles(),
    getPublicFruits(),
    getPublicCultivarSitemapEntries()
  ]);
  return [
    { url: getAbsoluteUrl("/"), changeFrequency: "daily", priority: 1 },
    { url: getAbsoluteUrl("/articles"), changeFrequency: "daily", priority: 0.9 },
    { url: getAbsoluteUrl("/fruits"), changeFrequency: "weekly", priority: 0.9 },
    ...articles.map((article) => ({ url: getAbsoluteUrl(`/articles/${article.slug}`), lastModified: article.updated_at, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...fruits.map((fruit) => ({ url: getAbsoluteUrl(`/fruits/${fruit.slug}`), lastModified: fruit.updated_at, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...cultivars.map((cultivar) => ({
      url: getAbsoluteUrl(`/fruits/${cultivar.fruitSlug}/cultivars/${cultivar.cultivarSlug}`),
      lastModified: cultivar.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6
    }))
  ];
}
