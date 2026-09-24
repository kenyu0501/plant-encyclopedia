import { getAbsoluteUrl } from "@/lib/site-url";

type SendEmailInput = {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  headers?: Record<string, string>;
  from?: string;
};

type SendReviewEmailInput = {
  subject: string;
  text: string;
};

export type SendEmailResult =
  | { sent: true; id: string | null }
  | { sent: false; reason: "email_not_configured" | "provider_error" };

async function sendEmail({ to, subject, text, html, headers, from }: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const sender = from || process.env.NEWSLETTER_FROM_EMAIL || process.env.ARTICLE_REVIEW_FROM_EMAIL;
  if (!apiKey || !sender) return { sent: false, reason: "email_not_configured" };

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        from: sender,
        to: Array.isArray(to) ? to : [to],
        subject,
        text,
        ...(html ? { html } : {}),
        ...(headers ? { headers } : {})
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

export async function sendReviewEmail({ subject, text }: SendReviewEmailInput): Promise<SendEmailResult> {
  return sendEmail({
    to: "kenyu.uehara@gmail.com",
    subject,
    text,
    from: process.env.ARTICLE_REVIEW_FROM_EMAIL
  });
}

export function getNewsletterUnsubscribeUrl(token: string) {
  return getAbsoluteUrl(`/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}`);
}

function getUnsubscribeHeaders(token: string) {
  return {
    "List-Unsubscribe": `<${getNewsletterUnsubscribeUrl(token)}>`,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click"
  };
}

export async function sendNewsletterConfirmationEmail({ to, token }: { to: string; token: string }): Promise<SendEmailResult> {
  const confirmUrl = getAbsoluteUrl(`/api/newsletter/confirm?token=${encodeURIComponent(token)}`);
  const unsubscribeUrl = getNewsletterUnsubscribeUrl(token);
  const subject = "メール配信の登録をご確認ください";
  const text = [
    "けんゆーの熱帯果樹メディアのメール配信にお申し込みいただき、ありがとうございます。",
    "",
    "次のリンクを開いて本登録を完了してください。",
    confirmUrl,
    "",
    "お申し込みに心当たりがない場合は、このメールを破棄するか、次のリンクから解除してください。",
    unsubscribeUrl
  ].join("\n");
  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.8;color:#18352b;max-width:600px;margin:auto">
      <h1 style="font-size:22px">メール配信の登録をご確認ください</h1>
      <p>けんゆーの熱帯果樹メディアのメール配信にお申し込みいただき、ありがとうございます。</p>
      <p><a href="${confirmUrl}" style="display:inline-block;background:#246247;color:white;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:700">本登録を完了する</a></p>
      <p style="font-size:13px;color:#52665e">お申し込みに心当たりがない場合は、このメールを破棄するか、<a href="${unsubscribeUrl}">こちらから解除</a>してください。</p>
    </div>`;

  return sendEmail({ to, subject, text, html, headers: getUnsubscribeHeaders(token) });
}

export async function sendNewsletterUnsubscribeEmail({ to, token }: { to: string; token: string }): Promise<SendEmailResult> {
  const unsubscribeUrl = getNewsletterUnsubscribeUrl(token);
  const subject = "メール配信の解除手続き";
  const text = `次のリンクを開くと、メール配信を解除できます。\n\n${unsubscribeUrl}\n\n心当たりがない場合は、このメールを破棄してください。`;
  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.8;color:#18352b;max-width:600px;margin:auto">
      <h1 style="font-size:22px">メール配信の解除手続き</h1>
      <p>次のボタンを押すと、メール配信を解除できます。</p>
      <p><a href="${unsubscribeUrl}" style="display:inline-block;background:#246247;color:white;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:700">配信を解除する</a></p>
      <p style="font-size:13px;color:#52665e">心当たりがない場合は、このメールを破棄してください。</p>
    </div>`;

  return sendEmail({ to, subject, text, html, headers: getUnsubscribeHeaders(token) });
}

export async function sendNewsletterEmail({
  to,
  token,
  subject,
  text,
  html
}: {
  to: string;
  token: string;
  subject: string;
  text: string;
  html?: string;
}): Promise<SendEmailResult> {
  const unsubscribeUrl = getNewsletterUnsubscribeUrl(token);
  return sendEmail({
    to,
    subject,
    text: `${text}\n\n配信解除: ${unsubscribeUrl}`,
    html: html ? `${html}<p style="font-size:12px"><a href="${unsubscribeUrl}">配信を解除する</a></p>` : undefined,
    headers: getUnsubscribeHeaders(token)
  });
}
