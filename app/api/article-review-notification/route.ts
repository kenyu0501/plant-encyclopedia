import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { sendReviewEmail } from "@/lib/resend";
import { getAbsoluteUrl } from "@/lib/site-url";

export async function POST(request: Request) {
  const { isAdmin } = await requireAdmin();
  if (!isAdmin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => null) as { articleId?: string; title?: string } | null;
  if (!body?.articleId || !body.title) return NextResponse.json({ error: "invalid request" }, { status: 400 });
  const reviewUrl = getAbsoluteUrl(`/admin/articles/${body.articleId}`);
  const result = await sendReviewEmail({
    subject: `【掲載確認】${body.title}`,
    text: `記事の下書きが承認待ちになりました。\n\n${body.title}\n${reviewUrl}\n\n内容と出典を確認し、管理画面で「公開」に変更してください。`
  });
  if (!result.sent) return NextResponse.json(result, { status: result.reason === "email_not_configured" ? 503 : 502 });
  return NextResponse.json(result);
}
