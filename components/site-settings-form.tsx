"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import type { SiteSettings } from "@/types/database";

export function SiteSettingsForm({ settings }: { settings: SiteSettings }) {
  const router = useRouter();
  const [homeEyebrow, setHomeEyebrow] = useState(settings.home_eyebrow);
  const [homeTitle, setHomeTitle] = useState(settings.home_title);
  const [homeDescription, setHomeDescription] = useState(settings.home_description);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const supabase = createClient();
    const { error } = await supabase.from("site_settings").upsert({
      id: "home",
      home_eyebrow: homeEyebrow,
      home_title: homeTitle,
      home_description: homeDescription,
      updated_at: new Date().toISOString()
    });
    setLoading(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    setMessage("トップページ文言を保存しました．");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-lg bg-white/86 p-5 ring-1 ring-leaf-100">
      <div>
        <p className="text-[10px] font-black tracking-[0.18em] text-leaf-700">HOME HERO</p>
        <h2 className="display-serif mt-2 text-xl font-bold text-leaf-900">トップページ上部の文言</h2>
        <p className="mt-2 text-sm leading-6 text-leaf-900/60">保存後、トップページの濃緑色の案内部分へ反映されます。タイトルと説明文は改行も反映されます。</p>
      </div>
      <label className="block">
        <span className="text-sm font-semibold text-leaf-900">英字の小見出し</span>
        <input required maxLength={100} value={homeEyebrow} onChange={(event) => setHomeEyebrow(event.target.value)} className="mt-2 w-full rounded-md border border-leaf-100 bg-white px-3 py-3" />
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-leaf-900">大見出し</span>
        <textarea required maxLength={160} value={homeTitle} onChange={(event) => setHomeTitle(event.target.value)} rows={3} className="mt-2 w-full rounded-md border border-leaf-100 bg-white px-3 py-3" />
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-leaf-900">説明文</span>
        <textarea required maxLength={500} value={homeDescription} onChange={(event) => setHomeDescription(event.target.value)} rows={5} className="mt-2 w-full rounded-md border border-leaf-100 bg-white px-3 py-3" />
      </label>
      <div className="rounded-2xl bg-[radial-gradient(circle_at_95%_0%,#2a6547_0%,#142f27_58%)] p-5 text-white shadow-soft sm:p-6">
        <p className="break-words text-[10px] font-bold tracking-[0.18em] text-fruit-200">{homeEyebrow || "小見出し"}</p>
        <p className="display-serif mt-3 whitespace-pre-line text-2xl font-bold leading-[1.35]">{homeTitle || "大見出し"}</p>
        <div className="mt-4 h-px w-12 bg-fruit-300" />
        <p className="mt-4 whitespace-pre-line text-sm leading-7 text-white/78">{homeDescription || "説明文"}</p>
      </div>
      {message ? <p className="rounded-md bg-leaf-50 p-3 text-sm text-leaf-900">{message}</p> : null}
      <button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-leaf-700 px-4 py-3 font-semibold text-white disabled:opacity-60">
        <Save size={18} />
        {loading ? "保存中" : "トップページ文言を保存"}
      </button>
    </form>
  );
}
