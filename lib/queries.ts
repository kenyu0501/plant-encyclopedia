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
    photos: (fruit.photos ?? []).filter((photo) => photo.approval_status === "approved"),
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
    photos: (fruit.photos ?? []).filter((photo) => photo.approval_status === "approved"),
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
