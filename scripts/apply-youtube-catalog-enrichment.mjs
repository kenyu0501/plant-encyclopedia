import { createClient } from "@supabase/supabase-js";
import { youtubeCatalogEnrichments } from "./youtube-catalog-enrichment-data.mjs";

const isProductionBuild = process.env.VERCEL_ENV === "production";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!isProductionBuild || !supabaseUrl || !serviceKey || serviceKey === "[SENSITIVE]") {
  console.log("[youtube-catalog] skipped (production credentials are not available)");
  process.exit(0);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

function sourceBlock(item) {
  return `【YouTube実食・観察記録｜${item.youtubeUrl}】\n${item.observed}\n※投稿者が動画内で扱った果実についての観察です。数値は特記がない限り当該果実の実測例であり、品種全体を保証する値ではありません。`;
}

function appendOnce(current, marker, addition) {
  const existing = (current || "").trim();
  if (existing.includes(marker)) return null;
  return existing ? `${existing}\n\n${addition}` : addition;
}

async function findFruit(slug) {
  const { data, error } = await supabase.from("fruits").select("id, slug, public_notes").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data;
}

async function ensureFruit(item) {
  let fruit = await findFruit(item.fruitSlug);
  if (fruit || !item.ensureFruit) return fruit;

  const seed = item.ensureFruit;
  const { data, error } = await supabase.from("fruits").insert({
    slug: seed.slug,
    name_ja: seed.nameJa,
    name_en: seed.nameEn || null,
    scientific_name: seed.scientificName || null,
    family_name: seed.familyName || null,
    description: `${seed.nameJa}の図鑑ページです。基本情報は確認できた範囲のみ登録し、今後写真・栽培情報・一次資料を追加します。`,
    public_notes: "YouTube食レポとの関連付けを起点に新規登録。未確認の項目は推測で補っていません。",
    is_public: true,
  }).select("id, slug, public_notes").single();
  if (error) throw error;
  return data;
}

async function findCultivar(fruitId, slug) {
  const { data, error } = await supabase.from("cultivars").select("id, slug, public_notes").eq("fruit_id", fruitId).eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data;
}

async function ensureCultivar(item, fruitId) {
  const slug = item.cultivarSlug || item.ensureCultivar?.slug;
  if (!slug) return null;
  let cultivar = await findCultivar(fruitId, slug);
  if (cultivar || !item.ensureCultivar) return cultivar;

  const seed = item.ensureCultivar;
  const { data, error } = await supabase.from("cultivars").insert({
    fruit_id: fruitId,
    slug: seed.slug,
    name_ja: seed.nameJa,
    name_en: seed.nameEn || null,
    description: `${seed.nameJa}の品種ページです。YouTubeで確認できた観察を出典付きで記録し、来歴など未確認の情報は推測で補っていません。`,
    public_notes: "YouTube食レポとの関連付けを起点に新規登録。写真は未登録です。",
    is_public: true,
  }).select("id, slug, public_notes").single();
  if (error) throw error;
  return data;
}

async function appendObservation(table, record, item) {
  const next = appendOnce(record.public_notes, item.youtubeUrl, sourceBlock(item));
  if (next === null) return false;
  const { error } = await supabase.from(table).update({ public_notes: next, updated_at: new Date().toISOString() }).eq("id", record.id);
  if (error) throw error;
  return true;
}

async function ensureVideo(fruitId, cultivarId, item) {
  let query = supabase.from("videos").select("id").eq("youtube_url", item.youtubeUrl);
  query = cultivarId ? query.eq("cultivar_id", cultivarId) : query.eq("fruit_id", fruitId).is("cultivar_id", null);
  const { data, error } = await query.limit(1);
  if (error) throw error;
  if (data?.length) return false;

  const { error: insertError } = await supabase.from("videos").insert({
    fruit_id: fruitId,
    cultivar_id: cultivarId || null,
    youtube_url: item.youtubeUrl,
    title: item.title,
    description: item.observed,
    thumbnail_url: item.thumbnailUrl,
    video_type: "食レポ・実測",
    is_public: true,
  });
  if (insertError) throw insertError;
  return true;
}

let createdFruits = 0;
let createdCultivars = 0;
let appended = 0;
let linkedVideos = 0;

for (const item of youtubeCatalogEnrichments) {
  const fruitBefore = await findFruit(item.fruitSlug);
  const fruit = await ensureFruit(item);
  if (!fruit) throw new Error(`Fruit not found and not safe to create: ${item.fruitSlug}`);
  if (!fruitBefore) createdFruits += 1;

  const cultivarSlug = item.cultivarSlug || item.ensureCultivar?.slug;
  const cultivarBefore = cultivarSlug ? await findCultivar(fruit.id, cultivarSlug) : null;
  const cultivar = await ensureCultivar(item, fruit.id);
  if (cultivar && !cultivarBefore) createdCultivars += 1;

  if (await appendObservation(cultivar ? "cultivars" : "fruits", cultivar || fruit, item)) appended += 1;
  if (await ensureVideo(fruit.id, cultivar?.id || null, item)) linkedVideos += 1;
}

console.log(JSON.stringify({
  scope: youtubeCatalogEnrichments.length,
  createdFruits,
  createdCultivars,
  appended,
  linkedVideos,
}));
