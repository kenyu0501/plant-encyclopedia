import { NextResponse } from "next/server";
import { normalizeNewsletterEmail, type NewsletterSubscriber, wasRecentlyUpdated } from "@/lib/newsletter";
import { sendNewsletterUnsubscribeEmail } from "@/lib/resend";
import { createAdminClient } from "@/lib/supabase-admin";

const acceptedMessage = "登録がある場合、解除用メールを送信しました。";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { email?: unknown } | null;
  const email = normalizeNewsletterEmail(body?.email);
  if (!email) return NextResponse.json({ error: "メールアドレスをご確認ください。" }, { status: 400 });

  const supabase = createAdminClient();
  if (!supabase) return NextResponse.json({ error: "現在手続きできません。" }, { status: 503 });

  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("id, email, status, unsubscribe_token, source, updated_at")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    console.error("Newsletter unsubscribe lookup failed", error);
    return NextResponse.json({ error: "現在手続きできません。" }, { status: 500 });
  }

  const subscriber = data as NewsletterSubscriber | null;
  if (!subscriber || subscriber.status === "unsubscribed" || wasRecentlyUpdated(subscriber.updated_at)) {
    return NextResponse.json({ message: acceptedMessage });
  }

  const emailResult = await sendNewsletterUnsubscribeEmail({
    to: subscriber.email,
    token: subscriber.unsubscribe_token
  });
  if (emailResult.sent) {
    await supabase
      .from("newsletter_subscribers")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", subscriber.id);
  }

  return NextResponse.json({ message: acceptedMessage });
}
