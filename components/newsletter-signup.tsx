"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import Link from "next/link";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function subscribe(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const response = await fetch("/api/newsletter/subscribe", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email })
    });
    const result = await response.json().catch(() => null) as { message?: string; error?: string } | null;
    setLoading(false);
    if (!response.ok) {
      setMessage(result?.error ?? "現在登録できません。少し時間をおいてお試しください。");
      return;
    }
    setEmail("");
    setMessage(result?.message ?? "確認メールを送信しました。メール内のリンクから本登録を完了してください。");
  }

  return (
    <section className="overflow-hidden rounded-[1.5rem] bg-leaf-900 p-6 text-white sm:p-8" aria-labelledby="newsletter-title">
      <div className="grid gap-5 sm:grid-cols-[1fr_1.1fr] sm:items-center">
        <div>
          <p className="text-[10px] font-black tracking-[0.22em] text-fruit-200">WEEKLY TROPICAL FRUIT LETTER</p>
          <h2 id="newsletter-title" className="display-serif mt-3 text-2xl font-bold">新着記事をメールでお届け</h2>
          <p className="mt-2 text-sm leading-7 text-white/70">注目ニュース、栽培のヒント、品種情報を厳選してお知らせします。</p>
        </div>
        <form onSubmit={subscribe} className="space-y-2">
          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="flex min-h-12 min-w-0 flex-1 items-center gap-2 rounded-lg bg-white px-3 text-leaf-900">
              <Mail size={17} className="shrink-0 text-leaf-700" />
              <span className="sr-only">メールアドレス</span>
              <input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="mail@example.com" className="min-w-0 flex-1 bg-transparent py-3 outline-none" />
            </label>
            <button disabled={loading} className="min-h-12 rounded-lg bg-fruit-300 px-5 text-sm font-bold text-leaf-950 disabled:opacity-60">{loading ? "登録中" : "無料登録"}</button>
          </div>
          <p className="text-[10px] leading-5 text-white/55">
            確認メール内のリンクで本登録となります。いつでも
            <Link href="/newsletter/unsubscribe" className="underline underline-offset-2 hover:text-white">配信を解除</Link>
            できます。
          </p>
          {message ? <p aria-live="polite" className="text-xs font-semibold text-fruit-100">{message}</p> : null}
        </form>
      </div>
    </section>
  );
}
