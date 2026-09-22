import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getAbsoluteUrl } from "@/lib/site-url";

export async function POST(request: Request) {
  const { isAdmin } = await requireAdmin();
  if (!isAdmin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => null) as { articleId?: string; title?: string } | null;
  if (!body?.articleId || !body.title) return NextResponse.json({ error: "invalid request" }, { status: 400 });
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ARTICLE_REVIEW_FROM_EMAIL;
  if (!apiKey || !from) return NextResponse.json({ sent: false, reason: "email_not_configured" });
  const reviewUrl = getAbsoluteUrl(`/admin/articles/${body.articleId}`);
  const response = await fetch("https://api.resend.com/emails", { method: "POST", headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" }, body: JSON.stringify({ from, to: ["kenyu.uehara@gmail.com"], subject: `【掲載確認】${body.title}`, text: `記事の下書きが承認待ちになりました。\n\n${body.title}\n${reviewUrl}\n\n内容と出典を確認し、管理画面で「公開」に変更してください。` }) });
  if (!response.ok) return NextResponse.json({ sent: false }, { status: 502 });
  return NextResponse.json({ sent: true });
}
