import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, CircleAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "メール配信の解除結果",
  robots: { index: false, follow: false }
};

export default async function NewsletterUnsubscribedPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const success = status === "success" || status === "already";
  return (
    <div className="mx-auto max-w-xl py-12">
      <section className="editorial-card p-7 text-center sm:p-10">
        {success ? <CheckCircle2 className="mx-auto text-emerald-600" size={48} /> : <CircleAlert className="mx-auto text-rose-600" size={48} />}
        <h1 className="display-serif mt-5 text-2xl font-bold text-leaf-900">
          {success ? "メール配信を解除しました" : "解除リンクを利用できませんでした"}
        </h1>
        <p className="mt-3 text-sm leading-7 text-leaf-900/68">
          {success ? "今後、この登録先へのメール配信は行いません。" : "リンクが無効です。解除ページから登録メールアドレスを入力して、専用リンクを再発行してください。"}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/" className="inline-flex rounded-lg bg-leaf-700 px-5 py-3 text-sm font-bold text-white">トップページへ戻る</Link>
          {!success ? <Link href="/newsletter/unsubscribe" className="inline-flex rounded-lg border border-leaf-200 bg-white px-5 py-3 text-sm font-bold text-leaf-800">解除ページへ</Link> : null}
        </div>
      </section>
    </div>
  );
}
