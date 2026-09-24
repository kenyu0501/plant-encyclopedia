import type { Metadata } from "next";
import { NewsletterUnsubscribeForm } from "@/components/newsletter-unsubscribe-form";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "メール配信の解除",
  description: "けんゆーの熱帯果樹メディアからのメール配信を解除します。"
};

export default function NewsletterUnsubscribePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="メール配信の解除" description="登録メールアドレスへ安全な解除リンクをお送りします。" />
      <NewsletterUnsubscribeForm />
    </div>
  );
}
