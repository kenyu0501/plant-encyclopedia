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

export type AnalyticsPeriodKey = "24h" | "7d" | "30d";

export type AnalyticsCultivarItem = {
  fruitName: string;
  cultivarName: string;
  href: string;
  views: number;
  previousRank: number | null;
  rankChange: number | null;
};

export type SiteAnalytics = {
  totalViews: number;
  periods: Record<
    AnalyticsPeriodKey,
    {
      views: number;
      previousViews: number;
      topCultivars: AnalyticsCultivarItem[];
    }
  >;
};

type AnalyticsRow = {
  views: number | null;
  view_hour?: string | null;
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

export type RecentlyUpdatedCultivar = {
  id: string;
  fruitName: string;
  cultivarName: string;
  nameEn: string | null;
  href: string;
  updatedAt: string;
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
  const currentHour = new Date();
  currentHour.setMinutes(0, 0, 0);
  const oldestIncludedHour = new Date(currentHour.getTime() - (30 * 24 * 2 - 1) * 60 * 60 * 1000).toISOString();
  const dailyAnalyticsSelect =
    "views, cultivar_id, cultivars(name_ja, slug, is_public, fruits(name_ja, slug, is_public))";
  const hourlyAnalyticsSelect =
    "id, views, view_hour, cultivar_id, cultivars(name_ja, slug, is_public, fruits(name_ja, slug, is_public))";
  const dailyResultPromise = supabase.from("page_views").select(dailyAnalyticsSelect);
  const recentData: unknown[] = [];
  let recentError: { message?: string } | null = null;
  const pageSize = 1000;

  for (let from = 0; ; from += pageSize) {
    const hourlyResult = await supabase
      .from("page_view_hourly")
      .select(hourlyAnalyticsSelect)
      .gte("view_hour", oldestIncludedHour)
      .order("view_hour", { ascending: true })
      .order("id", { ascending: true })
      .range(from, from + pageSize - 1);

    if (hourlyResult.error) {
      recentError = hourlyResult.error;
      break;
    }

    const page = hourlyResult.data ?? [];
    recentData.push(...page);
    if (page.length < pageSize) break;
  }

  const { data, error } = await dailyResultPromise;

  if (error || recentError) {
    console.error(error ?? recentError);
    return null;
  }

  const rows = (data ?? []) as unknown as AnalyticsRow[];
  const recentRows = recentData as AnalyticsRow[];
  const totalViews = rows.reduce((sum, row) => sum + (row.views ?? 0), 0);

  return {
    totalViews,
    periods: {
      "24h": buildAnalyticsPeriod(recentRows, currentHour.getTime(), 24),
      "7d": buildAnalyticsPeriod(recentRows, currentHour.getTime(), 7 * 24),
      "30d": buildAnalyticsPeriod(recentRows, currentHour.getTime(), 30 * 24)
    }
  };
}

export async function getRecentlyUpdatedCultivars(limit = 6): Promise<RecentlyUpdatedCultivar[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cultivars")
    .select("id, name_ja, name_en, slug, updated_at, fruits!inner(name_ja, slug, is_public)")
    .eq("is_public", true)
    .eq("fruits.is_public", true)
    .order("updated_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error(error);
    return [];
  }

  type UpdatedCultivarRow = Pick<Cultivar, "id" | "name_ja" | "name_en" | "slug" | "updated_at"> & {
    fruits: Pick<Fruit, "name_ja" | "slug"> | Pick<Fruit, "name_ja" | "slug">[] | null;
  };

  return ((data ?? []) as UpdatedCultivarRow[])
    .map((cultivar) => ({
      cultivar,
      fruit: Array.isArray(cultivar.fruits) ? cultivar.fruits[0] : cultivar.fruits
    }))
    .filter((item): item is { cultivar: UpdatedCultivarRow; fruit: Pick<Fruit, "name_ja" | "slug"> } => Boolean(item.fruit))
    .map(({ cultivar, fruit }) => ({
      id: cultivar.id,
      fruitName: fruit.name_ja,
      cultivarName: cultivar.name_ja,
      nameEn: cultivar.name_en,
      href: `/fruits/${fruit.slug}/cultivars/${cultivar.slug}`,
      updatedAt: cultivar.updated_at
    }));
}

function buildAnalyticsPeriod(rows: AnalyticsRow[], currentHourMs: number, hours: number) {
  const hourMs = 60 * 60 * 1000;
  const currentStartMs = currentHourMs - (hours - 1) * hourMs;
  const previousStartMs = currentHourMs - (hours * 2 - 1) * hourMs;
  const currentRows = rows.filter((row) => {
    const viewedAt = row.view_hour ? Date.parse(row.view_hour) : Number.NaN;
    return Number.isFinite(viewedAt) && viewedAt >= currentStartMs;
  });
  const previousRows = rows.filter((row) => {
    const viewedAt = row.view_hour ? Date.parse(row.view_hour) : Number.NaN;
    return Number.isFinite(viewedAt) && viewedAt >= previousStartMs && viewedAt < currentStartMs;
  });
  const currentCultivars = aggregateAnalyticsCultivars(currentRows);
  const previousCultivars = Array.from(aggregateAnalyticsCultivars(previousRows).values()).sort(
    (a, b) => b.views - a.views || a.cultivarName.localeCompare(b.cultivarName, "ja")
  );
  const previousRanks = new Map(previousCultivars.map((item, index) => [item.href, index + 1]));

  return {
    views: currentRows.reduce((sum, row) => sum + (row.views ?? 0), 0),
    previousViews: previousRows.reduce((sum, row) => sum + (row.views ?? 0), 0),
    topCultivars: Array.from(currentCultivars.values())
      .sort((a, b) => b.views - a.views || a.cultivarName.localeCompare(b.cultivarName, "ja"))
      .slice(0, 5)
      .map((item, index) => {
        const previousRank = previousRanks.get(item.href) ?? null;
        return {
          ...item,
          previousRank,
          rankChange: previousRank === null ? null : previousRank - (index + 1)
        };
      })
  };
}

function aggregateAnalyticsCultivars(rows: AnalyticsRow[]) {
  const cultivarMap = new Map<
    string,
    Pick<AnalyticsCultivarItem, "fruitName" | "cultivarName" | "href" | "views">
  >();

  for (const row of rows) {
    if (!row.cultivar_id || !row.cultivars) continue;
    const cultivar = Array.isArray(row.cultivars) ? row.cultivars[0] : row.cultivars;
    const fruit = Array.isArray(cultivar?.fruits) ? cultivar.fruits[0] : cultivar?.fruits;
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

  return cultivarMap;
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
