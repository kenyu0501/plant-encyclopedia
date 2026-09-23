"use client";

import { useState } from "react";
import { FilePlus2 } from "lucide-react";

const drafts = [
  { slug: "wild-banana-fusarium-resistant-hybrids-2026", title: "耐病性バナナの育種研究" },
  { slug: "mango-regulated-deficit-irrigation-2026", title: "マンゴーの節水かん水研究" },
  { slug: "malaysia-durian-climate-china-demand-2026", title: "ドリアン産地と気候変動" },
  { slug: "india-mango-sea-shipment-singapore-2026", title: "マンゴーの海上輸送" },
  { slug: "guava-ascorbic-acid-melatonin-storage-2026", title: "グアバの鮮度保持研究" },
  { slug: "nondestructive-durian-maturity-ai-sensor-2026", title: "AIによるドリアン成熟判定" },
  { slug: "papaya-sex-chromosome-cpyyl-2026", title: "パパイヤの性染色体研究" },
  { slug: "tanzania-avocado-value-chain-2026", title: "タンザニアのアボカド産業" }
];

export function EditorialDraftImporter() {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  async function importDrafts() {
    if (!window.confirm("8本の記事を下書きとして登録し、1本ごとに確認メールを送信します。よろしいですか？")) return;
    setLoading(true);
    setFailed(false);
    setProgress(0);
    setMessage("1本目を登録しています。");

    for (let index = 0; index < drafts.length; index += 1) {
      const draft = drafts[index];
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
        setMessage(`${index + 1}本目「${draft.title}」で停止しました。再実行すると同じURLの記事を更新して続けられます。`);
        setLoading(false);
        return;
      }

      const completed = index + 1;
      setProgress(completed);
      setMessage(completed === drafts.length
        ? "8本すべてを下書きとして登録し、確認メールを送信しました。"
        : `${completed}本を登録しました。${completed + 1}本目を登録しています。`);
    }

    setLoading(false);
  }

  return (
    <section className="editorial-card space-y-4 p-5 sm:p-6">
      <div>
        <p className="text-[10px] font-black tracking-[0.18em] text-leaf-700">EDITORIAL DRAFTS</p>
        <h2 className="display-serif mt-2 text-xl font-bold text-leaf-900">海外ニュース・新着論文の記事下書き</h2>
        <p className="mt-2 text-sm leading-7 text-leaf-900/65">一次資料を基に執筆した8本を、公開せず下書きとして登録します。1本の登録ごとに確認メールを送ります。</p>
      </div>
      <ol className="grid gap-2 text-sm text-leaf-900/75 sm:grid-cols-2">
        {drafts.map((draft, index) => <li key={draft.slug} className="rounded-lg bg-leaf-50 px-3 py-2">{index + 1}. {draft.title}</li>)}
      </ol>
      {message ? <p aria-live="polite" className={`rounded-lg p-3 text-sm font-semibold ${failed ? "bg-red-50 text-red-800" : "bg-leaf-50 text-leaf-900"}`}>{message}</p> : null}
      {loading || progress > 0 ? <div className="h-2 overflow-hidden rounded-full bg-leaf-100"><div className="h-full bg-leaf-700 transition-all" style={{ width: `${(progress / drafts.length) * 100}%` }} /></div> : null}
      <button type="button" onClick={importDrafts} disabled={loading} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-leaf-900 px-4 font-bold text-white disabled:opacity-60">
        <FilePlus2 size={18} />{loading ? `登録中（${progress}/${drafts.length}）` : progress === drafts.length ? "8本を再登録する" : "8本を下書きとして登録"}
      </button>
    </section>
  );
}
