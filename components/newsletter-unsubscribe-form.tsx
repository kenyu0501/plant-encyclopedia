"use client";

import { useState } from "react";
import { Mail } from "lucide-react";

export function NewsletterUnsubscribeForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function requestUnsubscribe(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const response = await fetch("/api/newsletter/unsubscribe-request", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email })
    });
    const result = await response.json().catch(() => null) as { message?: string; error?: string } | null;
    setLoading(false);
    if (!response.ok) {
      setMessage(result?.error ?? "現在手続きできません。時間をおいて再度お試しください。");
      return;
    }
    setEmail("");
    setMessage(result?.message ?? "登録がある場合、解除用メールを送信しました。");
  }

  return (
    <form onSubmit={requestUnsubscribe} className="editorial-card space-y-4 p-6 sm:p-8">
      <p className="text-sm leading-7 text-leaf-900/70">
        登録したメールアドレスを入力してください。登録が確認できた場合、ワンクリックで解除できる専用リンクを送信します。
      </p>
      <label className="block">
        <span className="text-sm font-bold text-leaf-900">メールアドレス</span>
        <span className="mt-2 flex min-h-12 items-center gap-2 rounded-lg border border-leaf-200 bg-white px-3 focus-within:ring-2 focus-within:ring-fruit-400">
          <Mail size={17} className="shrink-0 text-leaf-700" />
          <input
            required
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="mail@example.com"
            className="min-w-0 flex-1 bg-transparent py-3 outline-none"
          />
        </span>
      </label>
      <button disabled={loading} className="min-h-12 rounded-lg bg-leaf-700 px-5 text-sm font-bold text-white disabled:opacity-60">
        {loading ? "送信中" : "解除用メールを送信"}
      </button>
      {message ? <p aria-live="polite" className="text-sm font-semibold text-leaf-800">{message}</p> : null}
    </form>
  );
}
