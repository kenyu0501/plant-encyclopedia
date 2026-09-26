import { createClient } from "@/lib/supabase-server";
import { getAbsoluteUrl } from "@/lib/site-url";

export const editorialThumbnailTargets = [
  { articleSlug: "wild-banana-fusarium-resistant-hybrids-2026", fruitSlug: "banana", photoIndex: 0 },
  { articleSlug: "mango-regulated-deficit-irrigation-2026", fruitSlug: "mango", photoIndex: 0 },
  { articleSlug: "malaysia-durian-climate-china-demand-2026", fruitSlug: "durian", photoIndex: 0 },
  { articleSlug: "india-mango-sea-shipment-singapore-2026", fruitSlug: "mango", photoIndex: 1 },
  { articleSlug: "guava-ascorbic-acid-melatonin-storage-2026", fruitSlug: "guava", photoIndex: 0 },
  { articleSlug: "nondestructive-durian-maturity-ai-sensor-2026", fruitSlug: "durian", photoIndex: 1 },
  { articleSlug: "papaya-sex-chromosome-cpyyl-2026", fruitSlug: "papaya", photoIndex: 0 },
  { articleSlug: "tanzania-avocado-value-chain-2026", fruitSlug: "avocado", photoIndex: 0 },
  { articleSlug: "youtube-taiwan-21-cultivar-graft-orchard-part1-20260919", fruitSlug: "chempedak", photoIndex: 0 },
  { articleSlug: "youtube-taiwan-abiu-xin-huang-mi-tasting-20260906", fruitSlug: "abiu", photoIndex: 0 },
  { articleSlug: "youtube-nettai-mysore-banana-tasting-20260916", fruitSlug: "banana", cultivarSlug: "banana-010", photoIndex: 0 },
  { articleSlug: "beginner-mango-quiz-10-questions-20260923", fruitSlug: "mango", photoIndex: 0 },
  { articleSlug: "youtube-mango-iris-tasting-20260918", fruitSlug: "mango", photoIndex: 0 },
  { articleSlug: "youtube-mango-mallika-tasting-20260910", fruitSlug: "mango", cultivarSlug: "mallika", photoIndex: 0 },
  { articleSlug: "mango-olour-dwarf-rootstock-progenies-20260922", fruitSlug: "mango", photoIndex: 0 },
  { articleSlug: "dragon-fruit-integrated-nutrient-management-20260922", fruitSlug: "dragon-fruit", photoIndex: 0 },
  { articleSlug: "youtube-soil-microbiome-fruit-growing-20260916", fruitSlug: "banana", photoIndex: 0, youtubeId: "8t25V4bYFx4" },
  { articleSlug: "youtube-taiwan-high-graft-japanese-pear-20260912", fruitSlug: "japanese-pear", photoIndex: 0, youtubeId: "av_BIyG4Sy8" },
  { articleSlug: "youtube-baileys-marvel-mango-tasting-20260909", fruitSlug: "mango", cultivarSlug: "baileys-marvel", photoIndex: 0, youtubeId: "7MjKBV0AeNo" },
  { articleSlug: "youtube-maya-mayer-mango-tasting-20260907", fruitSlug: "mango", cultivarSlug: "mayer", photoIndex: 0, youtubeId: "j7Gw0l2cOI8" }
] as const;

type ServerSupabaseClient = Awaited<ReturnType<typeof createClient>>;

export function getEditorialThumbnailUrl(articleSlug: string) {
  const target = editorialThumbnailTargets.find((item) => item.articleSlug === articleSlug);
  return target ? getAbsoluteUrl(`/api/article-thumbnail/${target.articleSlug}`) : null;
}

export async function getEditorialSourcePhotoUrl(supabase: ServerSupabaseClient, articleSlug: string) {
  const target = editorialThumbnailTargets.find((item) => item.articleSlug === articleSlug);
  if (!target) return null;

  if ("youtubeId" in target && target.youtubeId) {
    return `https://img.youtube.com/vi/${target.youtubeId}/maxresdefault.jpg`;
  }

  const { data: fruit } = await supabase.from("fruits").select("id").eq("slug", target.fruitSlug).maybeSingle();
  if (!fruit) return null;

  let cultivarId: string | null = null;
  if ("cultivarSlug" in target && target.cultivarSlug) {
    const { data: cultivar } = await supabase
      .from("cultivars")
      .select("id")
      .eq("fruit_id", fruit.id)
      .eq("slug", target.cultivarSlug)
      .maybeSingle();
    cultivarId = cultivar?.id ?? null;
  }

  let query = supabase
    .from("photos")
    .select("image_url, medium_url, thumbnail_url")
    .eq("approval_status", "approved")
    .order("is_main", { ascending: false })
    .order("created_at", { ascending: true });
  query = cultivarId ? query.eq("cultivar_id", cultivarId) : query.eq("fruit_id", fruit.id);
  const { data: photos, error } = await query.range(target.photoIndex, target.photoIndex);

  if (error) {
    console.error("Editorial thumbnail lookup failed", target.articleSlug, error);
    return null;
  }

  const photo = photos?.[0];
  return photo?.medium_url ?? photo?.image_url ?? photo?.thumbnail_url ?? null;
}
