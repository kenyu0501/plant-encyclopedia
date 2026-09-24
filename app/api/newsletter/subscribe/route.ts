import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { normalizeNewsletterEmail, type NewsletterSubscriber, wasRecentlyUpdated } from "@/lib/newsletter";
import { sendNewsletterConfirmationEmail } from "@/lib/resend";
import { createAdminClient } from "@/lib/supabase-admin";

const acceptedMessage = "確認メールを送信しました。メール内のリンクから本登録を完了してください。";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { email?: unknown } | null;
  const email = normalizeNewsletterEmail(body?.email);
  if (!email) return NextResponse.json({ error: "メールアドレスをご確認ください。" }, { status: 400 });

  const supabase = createAdminClient();
  if (!supabase) return NextResponse.json({ error: "現在登録できません。" }, { status: 503 });

  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("id, email, status, unsubscribe_token, source, updated_at")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    console.error("Newsletter subscriber lookup failed", error);
    return NextResponse.json({ error: "現在登録できません。" }, { status: 500 });
  }

  const existing = data as NewsletterSubscriber | null;
  if (existing?.status === "active") return NextResponse.json({ message: acceptedMessage });
  if (existing?.status === "pending" && existing.source === "double-opt-in" && wasRecentlyUpdated(existing.updated_at)) {
    return NextResponse.json({ message: acceptedMessage });
  }

  const now = new Date().toISOString();
  const token = randomUUID();
  const values = {
    email,
    status: "pending",
    consented_at: now,
    confirmed_at: null,
    unsubscribe_token: token,
    source: "double-opt-in",
    updated_at: now
  };

  const writeResult = existing
    ? await supabase.from("newsletter_subscribers").update(values).eq("id", existing.id)
    : await supabase.from("newsletter_subscribers").insert(values);

  if (writeResult.error) {
    console.error("Newsletter subscriber write failed", writeResult.error);
    return NextResponse.json({ error: "現在登録できません。" }, { status: 500 });
  }

  const emailResult = await sendNewsletterConfirmationEmail({ to: email, token });
  if (!emailResult.sent) {
    await supabase
      .from("newsletter_subscribers")
      .update({ source: "confirmation-email-failed" })
      .eq("email", email)
      .eq("status", "pending");
    return NextResponse.json({ error: "確認メールを送信できませんでした。時間をおいて再度お試しください。" }, { status: 502 });
  }

  return NextResponse.json({ message: acceptedMessage });
}
