"use client";

import { useState } from "react";
import { Images } from "lucide-react";

export function EditorialThumbnailButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);

  async function applyThumbnails() {
    setLoading(true);
    setMessage("");
    setFailed(false);
    try {
      const response = await fetch("/api/admin/apply-editorial-thumbnails", { method: "POST" });
      const result = await response.json().catch(() => null) as { updated?: string[]; missing?: string[] } | null;
      if (!response.ok || !result?.updated) throw new Error("update failed");
      if (result.missing?.length) {
        setFailed(true);
        setMessage(`${result.updated.length}本へ設定しました。図鑑写真が見つからない記事が${result.missing.length}本あります。`);
      } else {
        setMessage("8本すべてに図鑑写真のサムネイルを設定しました。");
      }
    } catch {
      setFailed(true);
      setMessage("サムネイルの設定に失敗しました。時間をおいて再度お試しください。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3 rounded-xl border border-leaf-100 bg-leaf-50/60 p-4">
      <div>
        <h3 className="font-bold text-leaf-900">記事サムネイル</h3>
        <p className="mt-1 text-sm leading-6 text-leaf-900/60">承認済みの図鑑写真へ、記事タイトル・カテゴリ・サイト名を重ねた専用画像を8本に設定します。</p>
      </div>
      {message ? <p aria-live="polite" className={`rounded-lg p-3 text-sm font-semibold ${failed ? "bg-red-50 text-red-800" : "bg-white text-leaf-900"}`}>{message}</p> : null}
      <button type="button" onClick={applyThumbnails} disabled={loading} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-leaf-200 bg-white px-4 font-bold text-leaf-900 hover:bg-leaf-50 disabled:opacity-60">
        <Images size={18} />{loading ? "生成・設定中" : "記事用サムネイルを生成・設定"}
      </button>
    </div>
  );
}
