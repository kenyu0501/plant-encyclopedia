import { createClient } from "@supabase/supabase-js";
import { getAbsoluteUrl } from "@/lib/site-url";

type DraftCandidate = {
  title: string;
  category: "news" | "research" | "youtube";
  excerpt: string;
  content: string;
  sourceName: string;
  sourceUrl: string;
  sourcePublishedAt: string | null;
  heroImageUrl?: string | null;
  youtubeUrl?: string | null;
};

export const maxDuration = 60;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) return Response.json({ error: "unauthorized" }, { status: 401 });
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return Response.json({ error: "service role is not configured" }, { status: 503 });

  const results = await Promise.allSettled([collectYoutube(), collectResearch(), collectNews()]);
  const candidates = results.flatMap((result) => result.status === "fulfilled" ? result.value : []).slice(0, 5);
  const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const created: { id: string; title: string }[] = [];

  for (const candidate of candidates) {
    const duplicateField = candidate.youtubeUrl ? "youtube_url" : "source_url";
    const duplicateValue = candidate.youtubeUrl || candidate.sourceUrl;
    const { data: existing } = await supabase.from("articles").select("id").eq(duplicateField, duplicateValue).maybeSingle();
    if (existing) continue;
    const stamp = candidate.sourcePublishedAt ? new Date(candidate.sourcePublishedAt).getTime() : Date.now();
    const { data, error } = await supabase.from("articles").insert({
      title: candidate.title,
      slug: `${candidate.category}-${stamp}-${slugPart(candidate.title)}`.slice(0, 110),
      category: candidate.category,
      excerpt: candidate.excerpt,
      content: candidate.content,
      hero_image_url: candidate.heroImageUrl || null,
      source_name: candidate.sourceName,
      source_url: candidate.sourceUrl,
      source_published_at: candidate.sourcePublishedAt,
      youtube_url: candidate.youtubeUrl || null,
      author_name: "けんゆー編集部",
      status: "draft",
      review_notes: "自動収集した候補です。一次資料、数値、翻訳、国内での意味を確認し、独自解説を加えてから承認待ちにしてください。"
    }).select("id, title").single();
    if (!error && data) created.push(data as { id: string; title: string });
  }

  if (created.length > 0) await sendDigest(created);
  return Response.json({ success: true, collected: candidates.length, created: created.length, sourceErrors: results.filter((result) => result.status === "rejected").length });
}

async function collectYoutube(): Promise<DraftCandidate[]> {
  const channelId = process.env.YOUTUBE_CHANNEL_ID || await resolveYoutubeChannelId();
  if (!channelId) return [];
  const response = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`, { next: { revalidate: 0 } });
  if (!response.ok) throw new Error(`YouTube feed ${response.status}`);
  const xml = await response.text();
  return Array.from(xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)).slice(0, 1).map((match) => {
    const entry = match[1];
    const videoId = textTag(entry, "yt:videoId");
    const title = decodeXml(textTag(entry, "title"));
    const publishedAt = textTag(entry, "published");
    const description = decodeXml(textTag(entry, "media:description")).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    return { title: `【動画解説】${title}`, category: "youtube" as const, excerpt: description.slice(0, 180) || "けんゆーのYouTube新着動画を、熱帯果樹メディアの記事として解説するための候補です。", content: `この動画で扱っている内容を、初めての読者にも分かるように要点整理してください。\n\n動画内の重要な発言、栽培条件、品種名、数値を確認し、必要に応じて追加の一次資料で裏付けてください。`, sourceName: "けんゆー YouTube", sourceUrl: url, sourcePublishedAt: publishedAt || null, heroImageUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`, youtubeUrl: url };
  });
}

async function resolveYoutubeChannelId() {
  const handle = process.env.YOUTUBE_CHANNEL_HANDLE || "avocado_japan";
  const response = await fetch(`https://www.youtube.com/@${handle}`, { headers: { "user-agent": "Mozilla/5.0 (compatible; TropicalFruitMediaBot/1.0)" }, next: { revalidate: 86400 } });
  if (!response.ok) return null;
  const html = await response.text();
  return html.match(/"externalId":"(UC[^"]+)"/)?.[1] ?? html.match(/"channelId":"(UC[^"]+)"/)?.[1] ?? null;
}

async function collectResearch(): Promise<DraftCandidate[]> {
  const from = new Date(Date.now() - 14 * 86400000).toISOString().slice(0, 10);
  const url = `https://api.crossref.org/works?query=${encodeURIComponent("tropical fruit cultivation mango avocado banana dragon fruit")}&filter=from-pub-date:${from},type:journal-article&sort=published&order=desc&rows=2&select=DOI,title,published,URL,publisher,abstract`;
  const response = await fetch(url, { headers: { "user-agent": "TropicalFruitMedia/1.0 (mailto:kenyu.uehara@gmail.com)" }, next: { revalidate: 0 } });
  if (!response.ok) throw new Error(`Crossref ${response.status}`);
  const json = await response.json() as { message?: { items?: Array<Record<string, unknown>> } };
  return (json.message?.items ?? []).map((item) => {
    const title = Array.isArray(item.title) ? String(item.title[0] ?? "") : String(item.title ?? "");
    const doi = String(item.DOI ?? "");
    const sourceUrl = doi ? `https://doi.org/${doi}` : String(item.URL ?? "");
    const publisher = String(item.publisher ?? "学術論文");
    const publishedAt = crossrefDate(item.published);
    return { title: `【論文候補】${title}`, category: "research" as const, excerpt: "新しく公開された熱帯果樹関連論文の候補です。研究の背景、方法、結果、日本の栽培者にとっての意味を確認して解説します。", content: `原題：${title}\n\nこの論文の本文または抄録を一次資料で確認し、研究目的、試験条件、主な結果、限界を日本語で整理してください。単なる翻訳ではなく、沖縄・日本の熱帯果樹栽培でどう役立つかを追記してください。`, sourceName: publisher, sourceUrl, sourcePublishedAt: publishedAt };
  }).filter((item) => item.sourceUrl && item.title !== "【論文候補】");
}

async function collectNews(): Promise<DraftCandidate[]> {
  const query = '("tropical fruit" OR mango OR avocado OR banana OR "dragon fruit") (cultivation OR disease OR variety OR research)';
  const url = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(query)}&mode=artlist&maxrecords=2&format=json&sort=datedesc`;
  const response = await fetch(url, { next: { revalidate: 0 } });
  if (!response.ok) throw new Error(`GDELT ${response.status}`);
  const json = await response.json() as { articles?: Array<{ title?: string; url?: string; domain?: string; seendate?: string; socialimage?: string }> };
  return (json.articles ?? []).map((item) => ({ title: `【海外ニュース候補】${item.title ?? "熱帯果樹ニュース"}`, category: "news" as const, excerpt: "海外で報じられた熱帯果樹関連ニュースの候補です。一次情報と国内への影響を確認してから記事化します。", content: `元記事を確認し、何が起きたか、なぜ重要か、情報源の信頼性、日本の生産者・愛好家への影響を整理してください。\n\n転載や単純翻訳ではなく、公的資料や研究機関の発表があれば追加で確認してください。`, sourceName: item.domain || "海外ニュース", sourceUrl: item.url || "", sourcePublishedAt: parseGdeltDate(item.seendate), heroImageUrl: item.socialimage || null })).filter((item) => item.sourceUrl);
}

async function sendDigest(created: { id: string; title: string }[]) {
  const apiKey = process.env.RESEND_API_KEY; const from = process.env.ARTICLE_REVIEW_FROM_EMAIL;
  if (!apiKey || !from) return;
  const list = created.map((item) => `・${item.title}\n  ${getAbsoluteUrl(`/admin/articles/${item.id}`)}`).join("\n");
  await fetch("https://api.resend.com/emails", { method: "POST", headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" }, body: JSON.stringify({ from, to: ["kenyu.uehara@gmail.com"], subject: `【記事候補 ${created.length}件】掲載確認をお願いします`, text: `本日の記事候補を下書きに追加しました。\n\n${list}\n\n一次資料と内容を確認し、必要な独自解説を加えてから公開してください。` }) });
}

function textTag(xml: string, tag: string) { return xml.match(new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`))?.[1]?.trim() ?? ""; }
function decodeXml(value: string) { return value.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'"); }
function slugPart(value: string) { return value.normalize("NFKC").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 35) || "candidate"; }
function crossrefDate(value: unknown) { const parts = (value as { "date-parts"?: number[][] } | undefined)?.["date-parts"]?.[0]; if (!parts?.[0]) return null; return new Date(Date.UTC(parts[0], (parts[1] ?? 1) - 1, parts[2] ?? 1)).toISOString(); }
function parseGdeltDate(value?: string) { if (!value || !/^\d{14}$/.test(value)) return null; return new Date(`${value.slice(0,4)}-${value.slice(4,6)}-${value.slice(6,8)}T${value.slice(8,10)}:${value.slice(10,12)}:${value.slice(12,14)}Z`).toISOString(); }
