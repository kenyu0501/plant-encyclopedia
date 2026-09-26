import { ImageResponse } from "next/og";
import { getEditorialDraft202609 } from "@/lib/editorial-drafts-2026-09";
import { getYoutubeEditorialDraft202609 } from "@/lib/youtube-editorial-drafts-2026-09";
import { getDailyEditorialDraft20260924 } from "@/lib/daily-editorial-drafts-2026-09-24";
import { getDailyEditorialDraft20260925 } from "@/lib/daily-editorial-drafts-2026-09-25";
import { getDailyEditorialDraft20260926 } from "@/lib/daily-editorial-drafts-2026-09-26";
import { getResearchEditorialDraft20260926 } from "@/lib/research-editorial-drafts-2026-09-26";
import { getEditorialSourcePhotoUrl } from "@/lib/editorial-thumbnails";
import { createClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: Props) {
  const { slug } = await params;
  const draft = getEditorialDraft202609(slug) ?? getYoutubeEditorialDraft202609(slug) ?? getDailyEditorialDraft20260924(slug) ?? getDailyEditorialDraft20260925(slug) ?? getDailyEditorialDraft20260926(slug) ?? getResearchEditorialDraft20260926(slug);
  if (!draft) return new Response("Not found", { status: 404 });

  const supabase = await createClient();
  const photoUrl = await getEditorialSourcePhotoUrl(supabase, slug);
  const category = draft.category === "youtube" ? "VIDEO STORY" : draft.category === "news" ? "WORLD NEWS" : draft.category === "quiz" ? "FRUIT QUIZ" : draft.category === "how-to" ? "HOW TO" : "NEW RESEARCH";
  const categoryJa = draft.category === "youtube" ? "動画解説" : draft.category === "news" ? "海外ニュース" : draft.category === "quiz" ? "果樹クイズ" : draft.category === "how-to" ? "栽培解説" : "新着論文";
  const titleSize = draft.title.length > 38 ? 51 : draft.title.length > 29 ? 58 : 66;

  return new ImageResponse(
    <div style={{ display: "flex", position: "relative", width: "100%", height: "100%", overflow: "hidden", background: "#173f32", color: "white", fontFamily: "sans-serif" }}>
      {photoUrl ? <img src={photoUrl} alt="" width="1200" height="630" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} /> : null}
      <div style={{ display: "flex", position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(8,34,26,0.96) 0%, rgba(8,34,26,0.80) 48%, rgba(8,34,26,0.18) 78%, rgba(8,34,26,0.08) 100%)" }} />
      <div style={{ display: "flex", position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(4,25,19,0.66) 0%, transparent 42%)" }} />
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "790px", padding: "62px 68px 48px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", borderRadius: "999px", padding: "11px 20px", background: "#e6b85c", color: "#173f32", fontSize: "22px", fontWeight: 800, letterSpacing: "0.08em" }}>{category}</div>
          <div style={{ display: "flex", fontSize: "23px", fontWeight: 700 }}>{categoryJa}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: `${titleSize}px`, fontWeight: 800, lineHeight: 1.25, letterSpacing: "-0.025em", textShadow: "0 3px 16px rgba(0,0,0,0.35)" }}>{draft.title}</div>
          <div style={{ display: "flex", width: "92px", height: "6px", marginTop: "28px", background: "#e6b85c", borderRadius: "999px" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "14px", fontSize: "24px", fontWeight: 700 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "38px", height: "38px", borderRadius: "50%", background: "white", color: "#173f32", fontSize: "23px" }}>果</div>
          けんゆーの熱帯果樹図鑑
        </div>
      </div>
      <div style={{ display: "flex", position: "absolute", right: "34px", bottom: "30px", borderRadius: "999px", padding: "10px 17px", background: "rgba(255,255,255,0.88)", color: "#173f32", fontSize: "17px", fontWeight: 800 }}>plant-encyclopedia.com</div>
    </div>,
    {
      width: 1200,
      height: 630,
      headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800" }
    }
  );
}
