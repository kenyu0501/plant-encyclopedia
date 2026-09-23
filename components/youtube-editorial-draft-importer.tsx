"use client";

import { useState } from "react";
import { Clapperboard } from "lucide-react";

const drafts = [
  {
    slug: "youtube-taiwan-21-cultivar-graft-orchard-part1-20260919",
    title: "台湾の熱帯果樹園に21品種接ぎの大木"
  },
  {
    slug: "youtube-taiwan-abiu-xin-huang-mi-tasting-20260906",
    title: "台湾の夏でもおいしいアビウ『新黄蜜』"
  }
];

export function YoutubeEditorialDraftImporter() {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  async function importDrafts() {
    if (!window.confirm("YouTube動画の記事2本を下書きとして登録し、確認メールを送信します。よろしいですか？")) return;
    setLoading(true);
    setFailed(false);
    setProgress(0);

    for (let index = 0; index < drafts.length; index += 1) {
      const draft = drafts[index];
      setMessage(`${index + 1}本目「${draft.title}」を登録しています。`);
      try {
        const response = await fetch("/api/admin/import-editorial-draft", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ slug: draft.slug })
        });
        const result = await response.json().catch(() => null) as { imported?: boolean } | null;
        if (!response.ok || !result?.imported) throw new Error("import failed");
      } catch {
        setFailed(true);
        setMessage(`${index + 1}本目で停止しました。再実行すると同じURLの記事を更新して続けられます。`);
        setLoading(false);
        return;
      }

      setProgress(index + 1);
    }

    setMessage("2本を下書きとして登録し、確認メールを送信しました。");
    setLoading(false);
  }

  return (
    <section className="editorial-card space-y-4 p-5 sm:p-6">
      <div>
        <p className="text-[10px] font-black tracking-[0.18em] text-leaf-700">YOUTUBE ARCHIVE</p>
        <h2 className="display-serif mt-2 text-xl font-bold text-leaf-900">過去動画から作成した記事下書き</h2>
        <p className="mt-2 text-sm leading-7 text-leaf-900/65">正式字幕を基に執筆し、図鑑への内部リンクと加工サムネイルを設定した2本です。公開せず下書きとして登録します。</p>
      </div>
      <ol className="grid gap-2 text-sm text-leaf-900/75">
        {drafts.map((draft, index) => <li key={draft.slug} className="rounded-lg bg-leaf-50 px-3 py-2">{index + 1}. {draft.title}</li>)}
      </ol>
      {message ? <p aria-live="polite" className={`rounded-lg p-3 text-sm font-semibold ${failed ? "bg-red-50 text-red-800" : "bg-leaf-50 text-leaf-900"}`}>{message}</p> : null}
      {loading || progress > 0 ? <div className="h-2 overflow-hidden rounded-full bg-leaf-100"><div className="h-full bg-leaf-700 transition-all" style={{ width: `${(progress / drafts.length) * 100}%` }} /></div> : null}
      <button type="button" onClick={importDrafts} disabled={loading} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-leaf-900 px-4 font-bold text-white disabled:opacity-60">
        <Clapperboard size={18} />{loading ? `登録中（${progress}/${drafts.length}）` : progress === drafts.length ? "2本を再登録する" : "YouTube記事2本を下書き登録"}
      </button>
    </section>
  );
}
