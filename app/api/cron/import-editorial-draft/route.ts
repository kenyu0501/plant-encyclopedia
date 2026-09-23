import { createClient } from "@supabase/supabase-js";
import { getEditorialDraft202609 } from "@/lib/editorial-drafts-2026-09";
import { getYoutubeEditorialDraft202609 } from "@/lib/youtube-editorial-drafts-2026-09";
import { getEditorialThumbnailUrl } from "@/lib/editorial-thumbnails";
import { sendReviewEmail } from "@/lib/resend";
import { getAbsoluteUrl } from "@/lib/site-url";

export const maxDuration = 30;

export async function POST(request: Request) {
  const importSecret = process.env.EDITORIAL_IMPORT_SECRET;
  if (!importSecret || request.headers.get("x-editorial-import-token") !== importSecret) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null) as { slug?: string } | null;
  const draft = body?.slug
    ? getEditorialDraft202609(body.slug) ?? getYoutubeEditorialDraft202609(body.slug)
    : null;
  if (!draft) return Response.json({ error: "draft_not_found" }, { status: 404 });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return Response.json({ error: "service role is not configured" }, { status: 503 });

  const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const now = new Date().toISOString();
  const { data, error } = await supabase.from("articles").upsert({
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
    published_at: null,
    updated_at: now
  }, { onConflict: "slug" }).select("id").single();

  if (error || !data) {
    console.error("Editorial automation import failed", error);
    return Response.json({ error: "database_error" }, { status: 500 });
  }

  if (draft.youtubeUrl && draft.slug === "youtube-nettai-mysore-banana-tasting-20260916") {
    const { data: fruit } = await supabase.from("fruits").select("id").eq("slug", "banana").maybeSingle();
    const { data: cultivar } = fruit
      ? await supabase.from("cultivars").select("id").eq("fruit_id", fruit.id).eq("slug", "banana-010").maybeSingle()
      : { data: null };

    if (fruit && cultivar) {
      const { data: existing } = await supabase
        .from("videos")
        .select("id")
        .eq("cultivar_id", cultivar.id)
        .eq("youtube_url", draft.youtubeUrl)
        .maybeSingle();
      if (!existing) {
        const videoId = new URL(draft.youtubeUrl).searchParams.get("v");
        await supabase.from("videos").insert({
          fruit_id: fruit.id,
          cultivar_id: cultivar.id,
          youtube_url: draft.youtubeUrl,
          title: draft.title,
          description: draft.excerpt,
          thumbnail_url: videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null,
          video_type: "品種紹介・食レポ",
          is_public: true
        });
      }
    }
  }

  const reviewUrl = getAbsoluteUrl(`/admin/articles/${data.id}`);
  const email = await sendReviewEmail({
    subject: `【下書き完成】${draft.title}`,
    text: `記事の下書きが1本完成しました。\n\n${draft.title}\n${reviewUrl}\n\n内容と出典を確認し、必要に応じて編集してから公開してください。`
  });

  return Response.json({ imported: true, id: data.id, email }, { status: email.sent ? 200 : 502 });
}
