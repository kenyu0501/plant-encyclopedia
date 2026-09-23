type SendEmailInput = {
  subject: string;
  text: string;
};

export type SendEmailResult =
  | { sent: true; id: string | null }
  | { sent: false; reason: "email_not_configured" | "provider_error" };

export async function sendReviewEmail({ subject, text }: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ARTICLE_REVIEW_FROM_EMAIL;
  if (!apiKey || !from) return { sent: false, reason: "email_not_configured" };

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        from,
        to: ["kenyu.uehara@gmail.com"],
        subject,
        text
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(15_000)
    });

    if (!response.ok) {
      console.error("Resend email failed", response.status, await response.text());
      return { sent: false, reason: "provider_error" };
    }

    const data = await response.json().catch(() => null) as { id?: string } | null;
    return { sent: true, id: data?.id ?? null };
  } catch (error) {
    console.error("Resend email request failed", error);
    return { sent: false, reason: "provider_error" };
  }
}
