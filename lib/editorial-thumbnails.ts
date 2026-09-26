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
  { articleSlug: "youtube-maya-mayer-mango-tasting-20260907", fruitSlug: "mango", cultivarSlug: "mayer", photoIndex: 0, youtubeId: "j7Gw0l2cOI8" },
  { articleSlug: "mango-hot-water-microrna-heat-response-20260217", fruitSlug: "mango", photoIndex: 0 },
  { articleSlug: "mango-nirs-acidity-vitamin-c-machine-learning-20260613", fruitSlug: "mango", photoIndex: 1 },
  { articleSlug: "hass-avocado-altitude-soil-fruit-quality-20260416", fruitSlug: "avocado", cultivarSlug: "hass", photoIndex: 0 },
  { articleSlug: "avocado-uav-canopy-nitrogen-yield-quality-20260801", fruitSlug: "avocado", photoIndex: 0 },
  { articleSlug: "banana-ratoon-corm-microbiome-fusarium-20260203", fruitSlug: "banana", photoIndex: 0 },
  { articleSlug: "rubber-banana-intercrop-organic-nitrogen-20260731", fruitSlug: "banana", photoIndex: 1 },
  { articleSlug: "papaya-banana-anthracnose-essential-oil-nanoemulsion-20260903", fruitSlug: "papaya", photoIndex: 0 },
  { articleSlug: "passion-fruit-spent-mushroom-substrate-yield-20260907", fruitSlug: "passion-fruit", photoIndex: 0 },
  { articleSlug: "passion-fruit-thrips-climate-ipm-20260227", fruitSlug: "passion-fruit", photoIndex: 1 },
  { articleSlug: "banana-nine-ripening-stages-biochemical-profile-20260518", fruitSlug: "banana", photoIndex: 2 },
  { articleSlug: "pineapple-unemat-rubi-spineless-fusariosis-resistant-20250513", fruitSlug: "pineapple", photoIndex: 0 }
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

  const { data: cultivars, error: cultivarError } = await supabase
    .from("cultivars")
    .select("id")
    .eq("fruit_id", fruit.id)
    .eq("is_public", true);
  if (cultivarError) {
    console.error("Editorial cultivar photo lookup failed", target.articleSlug, cultivarError);
  }

  const photoFields = "id, image_url, medium_url, thumbnail_url, is_main, created_at";
  const { data: fruitPhotos, error: fruitPhotoError } = await supabase
    .from("photos")
    .select(photoFields)
    .eq("approval_status", "approved")
    .eq("fruit_id", fruit.id)
    .order("is_main", { ascending: false })
    .order("created_at", { ascending: true });
  if (fruitPhotoError) {
    console.error("Editorial fruit photo lookup failed", target.articleSlug, fruitPhotoError);
  }

  const cultivarIds = (cultivars ?? []).map((cultivar) => cultivar.id);
  const cultivarResult = cultivarIds.length
    ? await supabase
        .from("photos")
        .select(photoFields)
        .eq("approval_status", "approved")
        .in("cultivar_id", cultivarIds)
        .order("is_main", { ascending: false })
        .order("created_at", { ascending: true })
    : { data: [], error: null };
  if (cultivarResult.error) {
    console.error("Editorial cultivar photo lookup failed", target.articleSlug, cultivarResult.error);
  }

  const photos = [...(cultivarResult.data ?? []), ...(fruitPhotos ?? [])].filter(
    (photo, index, all) => all.findIndex((candidate) => candidate.id === photo.id) === index
  );
  if (!photos.length) {
    return null;
  }

  const sameFruitTargets = editorialThumbnailTargets.filter(
    (item) => item.fruitSlug === target.fruitSlug && !("youtubeId" in item && item.youtubeId)
  );
  const articleSlot = Math.max(0, sameFruitTargets.findIndex((item) => item.articleSlug === target.articleSlug));
  const photo = photos[articleSlot % photos.length];
  return photo?.medium_url ?? photo?.image_url ?? photo?.thumbnail_url ?? null;
}
