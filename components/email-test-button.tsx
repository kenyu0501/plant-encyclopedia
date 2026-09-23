"use client";

import { useState } from "react";
import { MailCheck } from "lucide-react";

export function EmailTestButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [succeeded, setSucceeded] = useState(false);

  async function sendTestEmail() {
    setLoading(true);
    setMessage("");
    setSucceeded(false);

    try {
      const response = await fetch("/api/admin/test-review-email", { method: "POST" });
      const result = await response.json().catch(() => null) as { sent?: boolean; reason?: string } | null;
      if (!response.ok || !result?.sent) {
        setMessage(result?.reason === "email_not_configured"
          ? "メール設定が本番環境に反映されていません。"
          : "送信に失敗しました。しばらくしてから再度お試しください。");
        return;
      }

      setSucceeded(true);
      setMessage("テストメールを送信しました。受信箱をご確認ください。");
    } catch {
      setMessage("通信に失敗しました。しばらくしてから再度お試しください。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="editorial-card space-y-4 p-5 sm:p-6">
      <div>
        <p className="text-[10px] font-black tracking-[0.18em] text-leaf-700">EMAIL NOTIFICATION</p>
        <h2 className="display-serif mt-2 text-xl font-bold text-leaf-900">記事確認メール</h2>
        <p className="mt-2 text-sm leading-7 text-leaf-900/65">
          記事候補の確認通知が届くか、記事を作成せずにテストできます。
        </p>
      </div>
      {message ? (
        <p aria-live="polite" className={`rounded-lg p-3 text-sm font-semibold ${succeeded ? "bg-leaf-50 text-leaf-900" : "bg-red-50 text-red-800"}`}>
          {message}
        </p>
      ) : null}
      <button
        type="button"
        onClick={sendTestEmail}
        disabled={loading}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-leaf-200 bg-white px-4 font-bold text-leaf-900 transition hover:bg-leaf-50 disabled:opacity-60"
      >
        <MailCheck size={18} />
        {loading ? "送信中" : "確認メールをテスト送信"}
      </button>
    </section>
  );
}
