import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getDailyEditorialDraft20260924 } from "@/lib/daily-editorial-drafts-2026-09-24";
import { getDailyEditorialDraft20260925 } from "@/lib/daily-editorial-drafts-2026-09-25";
import { getDailyEditorialDraft20260926 } from "@/lib/daily-editorial-drafts-2026-09-26";
import { getResearchEditorialDraft20260926 } from "@/lib/research-editorial-drafts-2026-09-26";
import { getEditorialDraft202609, type EditorialDraft } from "@/lib/editorial-drafts-2026-09";
import { getYoutubeEditorialDraft202609 } from "@/lib/youtube-editorial-drafts-2026-09";
import { getEditorialThumbnailUrl } from "@/lib/editorial-thumbnails";
import { sendReviewEmail } from "@/lib/resend";
import { getAbsoluteUrl } from "@/lib/site-url";

export const maxDuration = 60;

type ServiceClient = SupabaseClient<any>;
type SavedDraft = { id: string; title: string; slug: string; existed: boolean };

function findDraft(slug: string) {
  return getEditorialDraft202609(slug)
    ?? getYoutubeEditorialDraft202609(slug)
    ?? getDailyEditorialDraft20260924(slug)
    ?? getDailyEditorialDraft20260925(slug)
    ?? getDailyEditorialDraft20260926(slug)
    ?? getResearchEditorialDraft20260926(slug);
}

function articlePayload(draft: EditorialDraft) {
  return {
    title: draft.title,
    slug: draft.slug,
    category: draft.category,
    excerpt: draft.excerpt,
    content: draft.content,
    hero_image_url: getEditorialThumbnailUrl(draft.slug),
    source_name: draft.sourceName,
    source_url: draft.sourceUrl,
    source_published_at: draft.sourcePublishedAt,
    youtube_url: draft.youtubeUrl ?? null,
    author_name: "けんゆー",
    status: "draft",
    is_featured: false,
    seo_title: draft.seoTitle,
    seo_description: draft.seoDescription,
    review_notes: draft.reviewNotes,
    approved_by: null,
    approved_at: null,
    published_at: null
  };
}

async function saveDraft(supabase: ServiceClient, draft: EditorialDraft, preserveExisting: boolean): Promise<SavedDraft> {
  if (preserveExisting) {
    let { data: existing, error: existingError } = await supabase
      .from("articles")
      .select("id, title, slug")
      .eq("slug", draft.slug)
      .maybeSingle();
    if (existingError) throw existingError;

    if (!existing && draft.youtubeUrl) {
      const result = await supabase
        .from("articles")
        .select("id, title, slug")
        .eq("youtube_url", draft.youtubeUrl)
        .maybeSingle();
      existing = result.data;
      existingError = result.error;
      if (existingError) throw existingError;
    }

    if (existing) return { ...existing, existed: true } as SavedDraft;
  }

  const payload = { ...articlePayload(draft), updated_at: new Date().toISOString() };
  const operation = preserveExisting
    ? supabase.from("articles").insert(payload)
    : supabase.from("articles").upsert(payload, { onConflict: "slug" });
  const { data, error } = await operation.select("id, title, slug").single();
  if (error || !data) throw error ?? new Error("article_save_failed");
  return { ...data, existed: false } as SavedDraft;
}

async function appendPublicNote(supabase: ServiceClient, table: "fruits" | "cultivars", record: { id: string; public_notes: string | null }, marker: string, text: string) {
  if ((record.public_notes ?? "").includes(marker)) return;
  const next = [record.public_notes?.trim(), text].filter(Boolean).join("\n\n");
  const { error } = await supabase.from(table).update({ public_notes: next, updated_at: new Date().toISOString() }).eq("id", record.id);
  if (error) throw error;
}

async function ensureVideo(supabase: ServiceClient, fruitId: string, cultivarId: string | null, youtubeUrl: string, title: string, description: string) {
  let query = supabase.from("videos").select("id").eq("youtube_url", youtubeUrl).eq("fruit_id", fruitId);
  query = cultivarId ? query.eq("cultivar_id", cultivarId) : query.is("cultivar_id", null);
  const { data, error } = await query.limit(1);
  if (error) throw error;
  if (data?.length) return;
  const videoId = new URL(youtubeUrl).searchParams.get("v");
  const { error: insertError } = await supabase.from("videos").insert({
    fruit_id: fruitId,
    cultivar_id: cultivarId,
    youtube_url: youtubeUrl,
    title,
    description,
    thumbnail_url: videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null,
    video_type: "栽培解説・現地観察",
    is_public: true
  });
  if (insertError) throw insertError;
}

async function ensureFruit(supabase: ServiceClient, slug: string, payload?: Record<string, unknown>) {
  const { data: existing, error } = await supabase.from("fruits").select("id, slug, name_ja, public_notes").eq("slug", slug).maybeSingle();
  if (error) throw error;
  if (existing) return existing;
  if (!payload) throw new Error(`fruit_not_found:${slug}`);
  const { data, error: insertError } = await supabase.from("fruits").insert(payload).select("id, slug, name_ja, public_notes").single();
  if (insertError || !data) throw insertError ?? new Error(`fruit_create_failed:${slug}`);
  return data;
}

async function ensureCultivar(supabase: ServiceClient, fruitId: string, slug: string, payload: Record<string, unknown>) {
  const { data: existing, error } = await supabase
    .from("cultivars")
    .select("id, slug, name_ja, public_notes")
    .eq("fruit_id", fruitId)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (existing) return existing;
  const { data, error: insertError } = await supabase
    .from("cultivars")
    .insert({ fruit_id: fruitId, slug, ...payload })
    .select("id, slug, name_ja, public_notes")
    .single();
  if (insertError || !data) throw insertError ?? new Error(`cultivar_create_failed:${slug}`);
  return data;
}

async function ensureDailyCatalog(supabase: ServiceClient) {
  const soilUrl = "https://www.youtube.com/watch?v=8t25V4bYFx4";
  const soilTitle = "【農業 × 微生物】もう菌に迷わない！植物から見た土の世界！";
  const soilNote = `【YouTube栽培解説｜${soilUrl}】\n植物の根分泌物、有機物、細菌・菌類・菌根菌の相互作用を土壌生態系として捉え、菌資材は菌名だけでなく、目的、餌となる基質、土壌養分、処理区との比較で評価する必要があると解説。特定資材の効果を品目全体へ一般化するものではありません。`;

  for (const slug of ["banana", "mango"]) {
    const fruit = await ensureFruit(supabase, slug);
    await appendPublicNote(supabase, "fruits", fruit, soilUrl, soilNote);
    await ensureVideo(supabase, fruit.id, null, soilUrl, soilTitle, "根圏、菌根菌、窒素固定、有機物、施肥と微生物資材を植物目線で整理した長編講義。");
  }

  const pearUrl = "https://www.youtube.com/watch?v=av_BIyG4Sy8";
  const pear = await ensureFruit(supabase, "japanese-pear", {
    slug: "japanese-pear",
    name_ja: "ニホンナシ",
    name_en: "Japanese pear / Asian pear",
    scientific_name: "Pyrus pyrifolia",
    family_name: "バラ科",
    origin: "東アジア",
    description: "ニホンナシは、しゃきしゃきした多汁質の果肉を持つ落葉果樹です。日本の主要品種は冬季の低温を必要とし、台湾の中低標高地では花芽付き穂木を毎年高接ぎする栽培法も用いられます。",
    growth_habit: "落葉性の木本。品種ごとに休眠打破に必要な低温量、樹勢、花芽の着き方が異なります。",
    flower_description: "春に白い花を咲かせます。多くの品種で他品種の花粉を必要とし、開花期の一致と交配和合性の確認が重要です。",
    fruit_description: "果皮は黄褐色または緑色で、果肉は白色、多汁で歯切れのよい品種が多くあります。",
    cultivation_summary: "休眠、受粉、摘果、袋掛け、黒星病などの病害管理が重要です。温暖地では低温不足による発芽・開花不良に注意します。",
    okinawa_suitability: "沖縄では冬季低温が不足しやすく、一般的な温帯品種の安定栽培は難しい可能性があります。低温要求量の少ない系統、台木、接ぎ穂管理を小規模に検証してください。",
    public_notes: `新規登録の根拠: ${pearUrl}。分類はPyrus pyrifoliaとして登録。高接ぎ梨の技術情報は台湾農業部（https://epost.moa.gov.tw/theme_data.php?id=1841&sub_theme=photo&theme=epost）を参照。動画で名称を確定できない系統番号4029は品種登録していません。`,
    is_public: true
  });

  const hosui = await ensureCultivar(supabase, pear.id, "hosui", {
    name_ja: "豊水",
    name_en: "Hosui",
    origin: "日本",
    description: "果汁が多く、適度な酸味と濃厚な食味を持つニホンナシの主要品種。台湾では低温を受けた花芽付き穂木を平地の台木へ毎年高接ぎして生産されます。",
    fruit_size: "約400g（農研機構の標準的な記載）",
    sugar_content: "12〜13%（農研機構資料）。動画の台湾産果実は個別測定値として扱います。",
    taste: "多汁で甘味とやや酸味があり、濃厚な食味。",
    texture: "緻密で歯切れがよい",
    cultivar_lineage: "幸水×イ-33（石井早生×二十世紀）の可能性が高いとDNA解析等で確認。",
    harvest_season: "日本では主に8〜9月。台湾の高接ぎ栽培では5〜7月に収穫される場合があります。",
    okinawa_suitability: "冬季低温の不足で安定開花しない可能性が高く、通常栽培は要検証です。",
    public_notes: `出典: 農研機構 https://www.naro.go.jp/laboratory/nifts/kih/pear_nut/post_63.html\nYouTube現地観察: ${pearUrl}。台湾の高接ぎ園で栽培・実食し、果汁の多さと食味を高く評価。動画内の値は当該果実の観察です。`,
    is_public: true,
    is_for_sale: false
  });

  const ganlu = await ensureCultivar(supabase, pear.id, "baodao-ganlu", {
    name_ja: "寶島甘露",
    name_en: "Baodao Ganlu pear",
    origin: "台湾",
    description: "台湾育成の晩生ニホンナシ。中低標高地では冷蔵した花芽付き枝を高接ぎして生産され、高標高地では高接ぎをせず栽培されます。",
    fruit_size: "平均800g超。動画の試食果は840g。",
    sugar_content: "約11〜12°Brix（台湾農業部資料）。動画内でも11〜12度程度。",
    taste: "動画では蜂蜜、サトウキビ、わずかにナツメヤシを思わせる甘い風味。",
    texture: "白い果肉で歯切れがよく、多汁",
    harvest_season: "台湾の中低標高地では8月中旬前後、高標高地では9月末〜10月上旬。",
    cultivar_lineage: "台湾で育成された雑種品種。動画字幕だけでは交配組合せを確定しない。",
    okinawa_suitability: "低温要求量と開花安定性は未確認。台湾でも平地では冷蔵枝の高接ぎが必要とされるため、沖縄での通常栽培は要検証です。",
    public_notes: `出典: 台湾農業部 https://kmweb.moa.gov.tw/subject/subject.php?id=46588\nYouTube現地観察: ${pearUrl}。試食果840g、糖度11〜12度程度。数値は当該果実の実測例です。`,
    is_public: true,
    is_for_sale: false
  });

  const pearDescription = "台湾の低標高地で、低温を受けた花芽付き穂木を毎年高接ぎする梨栽培を取材。豊水と寶島甘露を実食。";
  await ensureVideo(supabase, pear.id, null, pearUrl, "台湾で日本の高級梨を作る高接ぎ技術", pearDescription);
  await ensureVideo(supabase, pear.id, hosui.id, pearUrl, "台湾の高接ぎ梨『豊水』", pearDescription);
  await ensureVideo(supabase, pear.id, ganlu.id, pearUrl, "台湾育成梨『寶島甘露』を実食", pearDescription);

  return [
    { name: "ニホンナシ", url: getAbsoluteUrl("/fruits/japanese-pear") },
    { name: "豊水", url: getAbsoluteUrl("/fruits/japanese-pear/cultivars/hosui") },
    { name: "寶島甘露", url: getAbsoluteUrl("/fruits/japanese-pear/cultivars/baodao-ganlu") },
    { name: "バナナ（栽培メモ追記）", url: getAbsoluteUrl("/fruits/banana") },
    { name: "マンゴー（栽培メモ追記）", url: getAbsoluteUrl("/fruits/mango") }
  ];
}

async function ensureDailyCatalog20260926(supabase: ServiceClient) {
  const mango = await ensureFruit(supabase, "mango");
  const targets = [
    {
      slug: "baileys-marvel",
      name: "ベイリーズ・マーベル",
      url: "https://www.youtube.com/watch?v=7MjKBV0AeNo",
      title: "ベイリーズ・マーベルの実食と食べ頃の検討",
      description: "収穫約10日後の一果を実食。部位別糖度15.7〜17.5度で、中心部と果皮側の熟度差、濃厚な香り、収穫・追熟判断の難しさを記録した。",
      note: "収穫約10日後の一果では、白っぽく酸味の強い中心部と、甘味・香りの強い橙色の果皮側が同居した。部位別糖度は15.7、17.4、17.5、17.1°Brix。スポンジ状部分の原因と適期は一果から断定できず、次作での継続観察が必要。"
    },
    {
      slug: "mayer",
      name: "マイヤー",
      url: "https://www.youtube.com/watch?v=j7Gw0l2cOI8",
      title: "マンゴー『Maya／マイヤー』の実食と名称検討",
      description: "Mayaを実食し、蜂蜜、高級メロン、濃いマンゴー香、糖度19.2度・19.1度を記録。JIRCASのMayerとの同一性は未確定として検討した。",
      note: "動画のMaya試食果は甘味が強く酸味は穏やかで、蜂蜜、高級メロン、濃いマンゴー香を感じ、糖度19.2°Brix（別測定19.1°Brix）を記録。MayaとJIRCAS登録Mayerの同一性は投稿者の仮説であり、導入記録または遺伝子型による確認までは確定しない。"
    }
  ];

  const catalog = [{ name: "マンゴー", url: getAbsoluteUrl("/fruits/mango") }];
  for (const target of targets) {
    const cultivar = await ensureCultivar(supabase, mango.id, target.slug, {
      name_ja: target.name,
      name_en: target.slug === "baileys-marvel" ? "Bailey's Marvel" : "Mayer",
      is_public: true,
      is_for_sale: false,
      public_notes: `YouTube実食記録: ${target.url}\n${target.note}`
    });
    await appendPublicNote(supabase, "cultivars", cultivar, target.url, `【YouTube実食記録｜${target.url}】\n${target.note}`);
    await ensureVideo(supabase, mango.id, cultivar.id, target.url, target.title, target.description);
    catalog.push({ name: `${target.name}（実食記録追記）`, url: getAbsoluteUrl(`/fruits/mango/cultivars/${target.slug}`) });
  }
  return catalog;
}

export async function POST(request: Request) {
  const importSecret = process.env.EDITORIAL_IMPORT_SECRET;
  const oneTimeToken = process.env.ONE_TIME_EDITORIAL_TOKEN;
  const suppliedToken = request.headers.get("x-editorial-import-token");
  if ((!importSecret || suppliedToken !== importSecret) && (!oneTimeToken || suppliedToken !== oneTimeToken)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null) as { slug?: string; slugs?: string[] } | null;
  const requested = Array.from(new Set((body?.slugs?.length ? body.slugs : body?.slug ? [body.slug] : []).filter(Boolean))).slice(0, 12);
  if (!requested.length) return Response.json({ error: "draft_not_found" }, { status: 404 });
  const drafts = requested.map(findDraft);
  if (drafts.some((draft) => !draft)) return Response.json({ error: "draft_not_found" }, { status: 404 });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return Response.json({ error: "service role is not configured" }, { status: 503 });
  const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });

  try {
    const preserveExisting = requested.length > 1;
    const saved: SavedDraft[] = [];
    for (const draft of drafts as EditorialDraft[]) saved.push(await saveDraft(supabase, draft, preserveExisting));

    const isDailyBatch = requested.includes("youtube-soil-microbiome-fruit-growing-20260916")
      || requested.includes("youtube-taiwan-high-graft-japanese-pear-20260912");
    const isDailyBatch20260926 = requested.includes("youtube-baileys-marvel-mango-tasting-20260909")
      || requested.includes("youtube-maya-mayer-mango-tasting-20260907");
    const catalog = isDailyBatch20260926
      ? await ensureDailyCatalog20260926(supabase)
      : isDailyBatch ? await ensureDailyCatalog(supabase) : [];

    const articleList = saved.map((item) => `・${item.title}\n  ${getAbsoluteUrl(`/admin/articles/${item.id}`)}`).join("\n");
    const catalogList = catalog.map((item) => `・${item.name}\n  ${item.url}`).join("\n");
    const email = await sendReviewEmail({
      subject: `【本日分の下書き完成・${saved.length}本】掲載確認をお願いします`,
      text: `本日分の記事下書きを保存しました。すべて未公開です。\n\n${articleList}${catalogList ? `\n\n図鑑の新規追加・追記\n${catalogList}` : ""}\n\n内容と出典を確認し、必要に応じて編集してから公開してください。`
    });

    return Response.json({ imported: saved.length, articles: saved, catalog, email }, { status: email.sent ? 200 : 502 });
  } catch (error) {
    console.error("Editorial automation import failed", error);
    return Response.json({ error: "database_error" }, { status: 500 });
  }
}
