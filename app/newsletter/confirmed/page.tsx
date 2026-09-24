import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, CircleAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "メール配信の登録確認",
  robots: { index: false, follow: false }
};

export default async function NewsletterConfirmedPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const success = status === "success" || status === "already";
  return (
    <div className="mx-auto max-w-xl py-12">
      <section className="editorial-card p-7 text-center sm:p-10">
        {success ? <CheckCircle2 className="mx-auto text-emerald-600" size={48} /> : <CircleAlert className="mx-auto text-rose-600" size={48} />}
        <h1 className="display-serif mt-5 text-2xl font-bold text-leaf-900">
          {success ? "メール配信の本登録が完了しました" : "確認リンクを利用できませんでした"}
        </h1>
        <p className="mt-3 text-sm leading-7 text-leaf-900/68">
          {success ? "新着記事や栽培情報を厳選してお届けします。" : "リンクが無効か、すでに解除されています。トップページからもう一度お申し込みください。"}
        </p>
        <Link href="/" className="mt-6 inline-flex rounded-lg bg-leaf-700 px-5 py-3 text-sm font-bold text-white">トップページへ戻る</Link>
      </section>
    </div>
  );
}
