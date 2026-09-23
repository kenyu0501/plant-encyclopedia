import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getEditorialDraft202609 } from "@/lib/editorial-drafts-2026-09";
import { sendReviewEmail } from "@/lib/resend";
import { createClient } from "@/lib/supabase-server";
import { getAbsoluteUrl } from "@/lib/site-url";

export async function POST(request: Request) {
  const { user, isAdmin } = await requireAdmin();
  if (!isAdmin || !user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null) as { slug?: string } | null;
  const draft = body?.slug ? getEditorialDraft202609(body.slug) : null;
  if (!draft) return NextResponse.json({ error: "draft_not_found" }, { status: 404 });

  const supabase = await createClient();
  const now = new Date().toISOString();
  const { data, error } = await supabase.from("articles").upsert({
    title: draft.title,
    slug: draft.slug,
    category: draft.category,
    excerpt: draft.excerpt,
    content: draft.content,
    hero_image_url: null,
    source_name: draft.sourceName,
    source_url: draft.sourceUrl,
    source_published_at: draft.sourcePublishedAt,
    youtube_url: null,
    author_name: "けんゆー",
    status: "draft",
    is_featured: false,
    seo_title: draft.seoTitle,
    seo_description: draft.seoDescription,
    review_notes: draft.reviewNotes,
    created_by: user.id,
    approved_by: null,
    approved_at: null,
    published_at: null,
    updated_at: now
  }, { onConflict: "slug" }).select("id").single();

  if (error || !data) {
    console.error("Editorial draft import failed", error);
    return NextResponse.json({ error: "database_error" }, { status: 500 });
  }

  const reviewUrl = getAbsoluteUrl(`/admin/articles/${data.id}`);
  const email = await sendReviewEmail({
    subject: `【下書き完成】${draft.title}`,
    text: `記事の下書きが1本完成しました。\n\n${draft.title}\n${reviewUrl}\n\n内容と出典を確認し、必要に応じて編集してから「承認待ち」または「公開」に変更してください。`
  });

  if (!email.sent) return NextResponse.json({ imported: true, id: data.id, email }, { status: 502 });
  return NextResponse.json({ imported: true, id: data.id, email });
}
