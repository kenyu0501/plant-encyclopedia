import type { ArticleCategory, ArticleStatus } from "@/types/database";

export const articleCategories: { value: ArticleCategory; label: string; shortLabel: string }[] = [
  { value: "news", label: "ニュース", shortLabel: "NEWS" },
  { value: "how-to", label: "栽培・How to", shortLabel: "HOW TO" },
  { value: "research", label: "論文・研究", shortLabel: "RESEARCH" },
  { value: "youtube", label: "YouTube", shortLabel: "VIDEO" },
  { value: "quiz", label: "クイズ", shortLabel: "QUIZ" }
];

export const articleStatuses: { value: ArticleStatus; label: string }[] = [
  { value: "draft", label: "下書き" },
  { value: "pending", label: "承認待ち" },
  { value: "published", label: "公開" },
  { value: "rejected", label: "差し戻し" }
];

export function getArticleCategory(category: ArticleCategory) {
  return articleCategories.find((item) => item.value === category) ?? articleCategories[0];
}

export function formatArticleDate(value: string | null) {
  if (!value) return "公開日未設定";
  return new Intl.DateTimeFormat("ja-JP", { timeZone: "Asia/Tokyo", year: "numeric", month: "long", day: "numeric" }).format(new Date(value));
}

export function createArticleSlug(title: string) {
  const normalized = title
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^a-z0-9\u3040-\u30ff\u3400-\u9fff]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
  return normalized || `article-${Date.now()}`;
}
