import { createClient } from "@/lib/supabase-server";
import type { Cultivar, CultivarWithFruit, Fruit, FruitWithChildren, Photo, SiteSettings, Video } from "@/types/database";
import { uniqueYoutubeLinks } from "@/lib/youtube";

export type AdminCultivar = Cultivar & {
  fruits: Pick<Fruit, "name_ja" | "slug"> | null;
};

export type AdminPhoto = Photo & {
  fruits: Pick<Fruit, "name_ja" | "slug"> | null;
  cultivars: Pick<Cultivar, "name_ja" | "slug"> | null;
};

export type PublicFruitOption = Pick<Fruit, "id" | "name_ja" | "slug"> & {
  cultivars: Pick<Cultivar, "id" | "fruit_id" | "name_ja" | "slug">[];
};

export type ViewerPhotoSubmission = Photo & {
  fruits: Pick<Fruit, "name_ja" | "slug"> | null;
  cultivars: Pick<Cultivar, "name_ja" | "slug"> | null;
};

export type AdminVideo = Video & {
  fruits: Pick<Fruit, "name_ja" | "slug"> | null;
  cultivars: Pick<Cultivar, "name_ja" | "slug"> | null;
};

export type PublicSearchEntry = {
  id: string;
  type: "fruit" | "cultivar";
  title: string;
  subtitle: string | null;
  href: string;
  keywords: string;
};

export type SiteAnalytics = {
  todayViews: number;
  totalViews: number;
  topCultivars: {
    fruitName: string;
    cultivarName: string;
    href: string;
    views: number;
  }[];
};

export type SeasonalCultivar = {
  id: string;
  fruitName: string;
  fruitSlug: string;
  cultivarName: string;
  cultivarSlug: string;
  harvestSeason: string | null;
  taste: string | null;
  href: string;
};

export const defaultSiteSettings: SiteSettings = {
  id: "home",
  home_eyebrow: "スマホでひらく栽培メモ",
  home_title: "けんゆーの熱帯果樹図鑑",
  home_description:
    "果樹ページを親にして，品種・写真・YouTubeを整理する熱帯果樹PWAです． マンゴー，アボカド，バナナなどを現場で見返しやすい形にまとめます．",
  updated_at: new Date(0).toISOString()
};

export async function getPublicFruits(limit?: number) {
  const supabase = await createClient();
  let query = supabase
    .from("fruits")
    .select("*, photos(*), cultivars(id), videos(*)")
    .eq("is_public", true)
    .order("display_order", { ascending: true, nullsFirst: false })
    .order("name_ja", { ascending: true });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) {
    console.error(error);
    return [];
  }
  return (data as FruitWithChildren[]).map((fruit) => ({
    ...fruit,
    photos: (fruit.photos ?? []).filter((photo) => photo.approval_status === "approved" && !photo.cultivar_id),
    videos: uniqueYoutubeLinks((fruit.videos ?? []).filter((video) => video.is_public && !video.cultivar_id)),
    cultivars: (fruit.cultivars ?? []).filter((cultivar) => cultivar.is_public !== false)
  }));
}

export async function getPublicFruitBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fruits")
    .select("*, photos(*), videos(*), cultivars(*, photos(*), videos(*))")
    .eq("slug", slug)
    .eq("is_public", true)
    .order("name_ja", { referencedTable: "cultivars", ascending: true })
    .maybeSingle();

  if (error) {
    console.error(error);
    return null;
  }
  const fruit = data as FruitWithChildren | null;
  if (!fruit) return null;

  return {
    ...fruit,
    photos: (fruit.photos ?? []).filter((photo) => photo.approval_status === "approved" && !photo.cultivar_id),
    videos: uniqueYoutubeLinks((fruit.videos ?? []).filter((video) => video.is_public && !video.cultivar_id)),
    cultivars: (fruit.cultivars ?? [])
      .filter((cultivar) => cultivar.is_public)
      .map((cultivar) => ({
        ...cultivar,
        photos: (cultivar.photos ?? []).filter((photo) => photo.approval_status === "approved"),
        videos: (cultivar.videos ?? []).filter((video) => video.is_public)
      }))
  };
}

export async function getPublicCultivarBySlugs(fruitSlug: string, cultivarSlug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cultivars")
    .select("*, fruits!inner(*), photos(*), videos(*)")
    .eq("slug", cultivarSlug)
    .eq("is_public", true)
    .eq("fruits.slug", fruitSlug)
    .maybeSingle();

  if (error) {
    console.error(error);
    return null;
  }
  const cultivar = data as CultivarWithFruit | null;
  if (!cultivar || !cultivar.fruits?.is_public || !cultivar.is_public) return null;

  return {
    ...cultivar,
    photos: (cultivar.photos ?? []).filter((photo) => photo.approval_status === "approved"),
    videos: uniqueYoutubeLinks((cultivar.videos ?? []).filter((video) => video.is_public))
  };
}

export async function getPublicSearchEntries() {
  const supabase = await createClient();
  const [fruitsResult, cultivarsResult] = await Promise.all([
    supabase
      .from("fruits")
      .select("id, name_ja, name_en, slug, scientific_name, family_name, origin, description")
      .eq("is_public", true)
      .order("display_order", { ascending: true, nullsFirst: false })
      .order("name_ja", { ascending: true }),
    supabase
      .from("cultivars")
      .select("id, name_ja, name_en, slug, origin, description, taste, harvest_season, fruits!inner(name_ja, slug, is_public)")
      .eq("is_public", true)
      .eq("fruits.is_public", true)
      .order("name_ja", { ascending: true })
  ]);

  if (fruitsResult.error) console.error(fruitsResult.error);
  if (cultivarsResult.error) console.error(cultivarsResult.error);

  const fruitEntries: PublicSearchEntry[] = ((fruitsResult.data ?? []) as Pick<
    Fruit,
    "id" | "name_ja" | "name_en" | "slug" | "scientific_name" | "family_name" | "origin" | "description"
  >[]).map((fruit) => ({
    id: fruit.id,
    type: "fruit",
    title: fruit.name_ja,
    subtitle: [fruit.name_en, fruit.scientific_name].filter(Boolean).join(" / ") || null,
    href: `/fruits/${fruit.slug}`,
    keywords: [fruit.name_ja, fruit.name_en, fruit.scientific_name, fruit.family_name, fruit.origin, fruit.description]
      .filter(Boolean)
      .join(" ")
  }));

  type SearchCultivar = Pick<
    Cultivar,
    "id" | "name_ja" | "name_en" | "slug" | "origin" | "description" | "taste" | "harvest_season"
  > & {
    fruits: Pick<Fruit, "name_ja" | "slug"> | Pick<Fruit, "name_ja" | "slug">[] | null;
  };

  const cultivarEntries: PublicSearchEntry[] = ((cultivarsResult.data ?? []) as SearchCultivar[])
    .map((cultivar) => ({ ...cultivar, fruit: Array.isArray(cultivar.fruits) ? cultivar.fruits[0] : cultivar.fruits }))
    .filter((cultivar) => cultivar.fruit)
    .map((cultivar) => ({
      id: cultivar.id,
      type: "cultivar",
      title: cultivar.name_ja,
      subtitle: [cultivar.fruit?.name_ja, cultivar.name_en].filter(Boolean).join(" / ") || null,
      href: `/fruits/${cultivar.fruit?.slug}/cultivars/${cultivar.slug}`,
      keywords: [
        cultivar.name_ja,
        cultivar.name_en,
        cultivar.fruit?.name_ja,
        cultivar.origin,
        cultivar.description,
        cultivar.taste,
        cultivar.harvest_season
      ]
        .filter(Boolean)
        .join(" ")
    }));

  return [...fruitEntries, ...cultivarEntries];
}

export async function getPublicFruitOptions() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fruits")
    .select("id, name_ja, slug, cultivars(id, fruit_id, name_ja, slug, is_public)")
    .eq("is_public", true)
    .order("display_order", { ascending: true, nullsFirst: false })
    .order("name_ja", { ascending: true })
    .order("name_ja", { referencedTable: "cultivars", ascending: true });

  if (error) {
    console.error(error);
    return [];
  }

  return ((data ?? []) as (Pick<Fruit, "id" | "name_ja" | "slug"> & {
    cultivars: (Pick<Cultivar, "id" | "fruit_id" | "name_ja" | "slug" | "is_public"> & { is_public: boolean })[];
  })[]).map((fruit) => ({
    ...fruit,
    cultivars: (fruit.cultivars ?? [])
      .filter((cultivar) => cultivar.is_public)
      .map(({ is_public: _isPublic, ...cultivar }) => cultivar)
  }));
}

export async function getSiteAnalytics(): Promise<SiteAnalytics | null> {
  const supabase = await createClient();
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());
  const { data, error } = await supabase
    .from("page_views")
    .select("views, view_date, cultivar_id, cultivars(name_ja, slug, is_public, fruits(name_ja, slug, is_public))");

  if (error) {
    console.error(error);
    return null;
  }

  type AnalyticsRow = {
    views: number | null;
    view_date: string | null;
    cultivar_id: string | null;
    cultivars:
      | {
          name_ja: string | null;
          slug: string | null;
          is_public: boolean;
          fruits:
            | { name_ja: string | null; slug: string | null; is_public: boolean }
            | { name_ja: string | null; slug: string | null; is_public: boolean }[]
            | null;
        }
      | {
          name_ja: string | null;
          slug: string | null;
          is_public: boolean;
          fruits:
            | { name_ja: string | null; slug: string | null; is_public: boolean }
            | { name_ja: string | null; slug: string | null; is_public: boolean }[]
            | null;
        }[]
      | null;
  };

  const rows = (data ?? []) as unknown as AnalyticsRow[];
  const totalViews = rows.reduce((sum, row) => sum + (row.views ?? 0), 0);
  const todayViews = rows
    .filter((row) => row.view_date === today)
    .reduce((sum, row) => sum + (row.views ?? 0), 0);
  const cultivarMap = new Map<string, SiteAnalytics["topCultivars"][number]>();
  const todayRows = rows.filter((row) => row.view_date === today);

  for (const row of todayRows) {
    if (!row.cultivar_id || !row.cultivars) continue;
    const cultivar = Array.isArray(row.cultivars) ? row.cultivars[0] : row.cultivars;
    const fruit = Array.isArray(cultivar.fruits) ? cultivar.fruits[0] : cultivar.fruits;
    if (!cultivar?.is_public || !fruit?.is_public || !cultivar.slug || !cultivar.name_ja || !fruit.slug || !fruit.name_ja) continue;

    const href = `/fruits/${fruit.slug}/cultivars/${cultivar.slug}`;
    const current = cultivarMap.get(href);
    cultivarMap.set(href, {
      fruitName: fruit.name_ja,
      cultivarName: cultivar.name_ja,
      href,
      views: (current?.views ?? 0) + (row.views ?? 0)
    });
  }

  return {
    todayViews,
    totalViews,
    topCultivars: Array.from(cultivarMap.values())
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)
  };
}

export async function getSeasonalCultivars(month = getTokyoMonth(), limit = 8): Promise<SeasonalCultivar[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cultivars")
    .select("id, name_ja, slug, harvest_season, taste, fruits!inner(name_ja, slug, is_public)")
    .eq("is_public", true)
    .eq("fruits.is_public", true)
    .not("harvest_season", "is", null)
    .order("name_ja", { ascending: true });

  if (error) {
    console.error(error);
    return [];
  }

  type SeasonalRow = Pick<Cultivar, "id" | "name_ja" | "slug" | "harvest_season" | "taste"> & {
    fruits: Pick<Fruit, "name_ja" | "slug" | "is_public"> | Pick<Fruit, "name_ja" | "slug" | "is_public">[] | null;
  };

  return ((data ?? []) as SeasonalRow[])
    .map((cultivar) => ({ ...cultivar, fruit: Array.isArray(cultivar.fruits) ? cultivar.fruits[0] : cultivar.fruits }))
    .filter((cultivar) => cultivar.fruit?.is_public && (isHarvestSeasonForMonth(cultivar.harvest_season, month) || isFruitSeasonForMonth(cultivar.fruit.slug, month)))
    .map((cultivar) => ({
      id: cultivar.id,
      fruitName: cultivar.fruit?.name_ja ?? "",
      fruitSlug: cultivar.fruit?.slug ?? "",
      cultivarName: cultivar.name_ja,
      cultivarSlug: cultivar.slug,
      harvestSeason: isHarvestSeasonForMonth(cultivar.harvest_season, month)
        ? cultivar.harvest_season
        : getFruitSeasonLabel(cultivar.fruit?.slug ?? ""),
      taste: cultivar.taste,
      href: `/fruits/${cultivar.fruit?.slug}/cultivars/${cultivar.slug}`
    }))
    .sort((a, b) => seasonalFruitRank(a.fruitSlug) - seasonalFruitRank(b.fruitSlug) || a.cultivarName.localeCompare(b.cultivarName, "ja"))
    .filter(createPerFruitLimitFilter(2))
    .slice(0, limit);
}

function getTokyoMonth() {
  const month = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tokyo",
    month: "numeric"
  }).format(new Date());
  return Number(month);
}

function isHarvestSeasonForMonth(value: string | null, month: number) {
  if (!value) return false;
  const text = value.normalize("NFKC");

  for (const range of Array.from(text.matchAll(/(1[0-2]|[1-9])\s*(?:月)?\s*[〜~\-ー－–]\s*(1[0-2]|[1-9])\s*月?/g))) {
    if (isMonthInRange(month, Number(range[1]), Number(range[2]))) return true;
  }

  for (const match of Array.from(text.matchAll(/(1[0-2]|[1-9])\s*月/g))) {
    if (Number(match[1]) === month) return true;
  }

  return seasonWordsForMonth(month).some((word) => text.includes(word));
}

function isMonthInRange(month: number, start: number, end: number) {
  if (start <= end) return month >= start && month <= end;
  return month >= start || month <= end;
}

function seasonWordsForMonth(month: number) {
  const words = ["周年", "通年"];
  if ([3, 4, 5].includes(month)) words.push("春", "晩春");
  if ([6, 7, 8].includes(month)) words.push("夏", "初夏", "梅雨", "盛夏");
  if ([9, 10, 11].includes(month)) words.push("秋", "初秋", "晩秋");
  if ([12, 1, 2].includes(month)) words.push("冬", "初冬", "晩冬");
  return words;
}

function isFruitSeasonForMonth(slug: string, month: number) {
  const months = fruitSeasonMonths(slug);
  return months.includes(month);
}

function fruitSeasonMonths(slug: string) {
  const seasons: Record<string, number[]> = {
    mango: [6, 7, 8],
    banana: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    guava: [7, 8, 9, 10],
    avocado: [9, 10, 11, 12, 1, 2],
    "white-sapote": [3, 4, 5],
    coffee: [11, 12, 1, 2]
  };
  return seasons[slug] ?? [];
}

function getFruitSeasonLabel(slug: string) {
  const labels: Record<string, string> = {
    mango: "果樹の旬目安: 6〜8月",
    banana: "果樹の旬目安: 周年",
    guava: "果樹の旬目安: 7〜10月",
    avocado: "果樹の旬目安: 9〜2月",
    "white-sapote": "果樹の旬目安: 3〜5月",
    coffee: "果樹の旬目安: 11〜2月"
  };
  return labels[slug] ?? null;
}

function createPerFruitLimitFilter(maxPerFruit: number) {
  const counts = new Map<string, number>();
  return (item: SeasonalCultivar) => {
    const count = counts.get(item.fruitSlug) ?? 0;
    if (count >= maxPerFruit) return false;
    counts.set(item.fruitSlug, count + 1);
    return true;
  };
}

function seasonalFruitRank(slug: string) {
  const order = ["mango", "banana", "avocado", "white-sapote", "guava", "coffee"];
  const index = order.indexOf(slug);
  return index === -1 ? order.length : index;
}

export async function getAdminFruits() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fruits")
    .select("*")
    .order("display_order", { ascending: true, nullsFirst: false })
    .order("name_ja", { ascending: true });
  if (error) {
    console.error(error);
    return [];
  }
  return data as Fruit[];
}

export async function getAdminCultivars() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cultivars")
    .select("*, fruits(name_ja, slug)")
    .order("name_ja", { ascending: true });
  if (error) {
    console.error(error);
    return [];
  }
  return data as AdminCultivar[];
}

export async function getAdminPhotos() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("photos")
    .select("*, fruits(name_ja, slug), cultivars(name_ja, slug)")
    .order("created_at", { ascending: false });
  if (error) {
    console.error(error);
    return [];
  }
  return data as AdminPhoto[];
}

export async function getPendingViewerPhotos() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("photos")
    .select("*, fruits(name_ja, slug), cultivars(name_ja, slug)")
    .eq("source_type", "viewer")
    .eq("approval_status", "pending")
    .order("created_at", { ascending: false });
  if (error) {
    console.error(error);
    return [];
  }
  return data as AdminPhoto[];
}

export async function getPendingViewerPhotoCount() {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("photos")
    .select("id", { count: "exact", head: true })
    .eq("source_type", "viewer")
    .eq("approval_status", "pending");
  if (error) {
    console.error(error);
    return 0;
  }
  return count ?? 0;
}

export async function getOwnViewerPhotoSubmissions(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("photos")
    .select("*, fruits(name_ja, slug), cultivars(name_ja, slug)")
    .eq("source_type", "viewer")
    .eq("uploaded_by", userId)
    .order("created_at", { ascending: false });
  if (error) {
    console.error(error);
    return [];
  }
  return data as ViewerPhotoSubmission[];
}

export async function getAdminVideos() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("videos")
    .select("*, fruits(name_ja, slug), cultivars(name_ja, slug)")
    .order("created_at", { ascending: false });
  if (error) {
    console.error(error);
    return [];
  }
  return data as AdminVideo[];
}

export async function getSiteSettings() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", "home").maybeSingle();
  if (error) {
    console.error(error);
    return defaultSiteSettings;
  }
  return (data as SiteSettings | null) ?? defaultSiteSettings;
}
