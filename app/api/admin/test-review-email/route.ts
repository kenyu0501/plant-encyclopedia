import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { sendReviewEmail } from "@/lib/resend";

export async function POST() {
  const { isAdmin } = await requireAdmin();
  if (!isAdmin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const result = await sendReviewEmail({
    subject: "【送信テスト】記事確認メールの設定が完了しました",
    text: [
      "けんゆーの熱帯果樹図鑑からのテストメールです。",
      "",
      "ResendとVercelの接続が正常に動作しています。",
      "今後、記事候補が承認待ちになると、このメールアドレスへ確認通知を送信します。"
    ].join("\n")
  });

  if (!result.sent) {
    const status = result.reason === "email_not_configured" ? 503 : 502;
    return NextResponse.json(result, { status });
  }

  return NextResponse.json(result);
}
