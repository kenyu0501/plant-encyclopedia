const DEFAULT_SITE_URL = "https://plant-encyclopedia.com";

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, "");
}

export function getAbsoluteUrl(path: string) {
  return new URL(path, `${getSiteUrl()}/`).toString();
}

export function getMetadataDescription(...candidates: Array<string | null | undefined>) {
  const description = candidates
    .find((candidate) => candidate?.trim())
    ?.replace(/\s+/g, " ")
    .trim();

  if (!description) return "けんゆーの熱帯果樹図鑑で、果樹と品種の特徴や栽培情報を確認できます。";
  return description.length > 155 ? `${description.slice(0, 154)}…` : description;
}
