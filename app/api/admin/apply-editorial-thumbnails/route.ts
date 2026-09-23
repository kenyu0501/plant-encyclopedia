import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { editorialThumbnailTargets, getEditorialThumbnailUrl } from "@/lib/editorial-thumbnails";
import { createClient } from "@/lib/supabase-server";

export async function POST() {
  const { isAdmin } = await requireAdmin();
  if (!isAdmin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const supabase = await createClient();
  const updated: string[] = [];
  const missing: string[] = [];

  for (const target of editorialThumbnailTargets) {
    const imageUrl = getEditorialThumbnailUrl(target.articleSlug);
    if (!imageUrl) {
      missing.push(target.articleSlug);
      continue;
    }

    const { error } = await supabase
      .from("articles")
      .update({ hero_image_url: imageUrl, updated_at: new Date().toISOString() })
      .eq("slug", target.articleSlug);

    if (error) {
      console.error("Editorial thumbnail update failed", target.articleSlug, error);
      return NextResponse.json({ error: "database_error", updated, missing }, { status: 500 });
    }
    updated.push(target.articleSlug);
  }

  return NextResponse.json({ updated, missing });
}
