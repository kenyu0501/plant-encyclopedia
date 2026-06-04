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
      <label className="block">
        <span className="text-sm font-semibold text-leaf-900">小見出し</span>
        <input value={homeEyebrow} onChange={(event) => setHomeEyebrow(event.target.value)} className="mt-2 w-full rounded-md border border-leaf-100 bg-white px-3 py-3" />
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-leaf-900">タイトル</span>
        <input value={homeTitle} onChange={(event) => setHomeTitle(event.target.value)} className="mt-2 w-full rounded-md border border-leaf-100 bg-white px-3 py-3" />
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-leaf-900">説明文</span>
        <textarea value={homeDescription} onChange={(event) => setHomeDescription(event.target.value)} rows={5} className="mt-2 w-full rounded-md border border-leaf-100 bg-white px-3 py-3" />
      </label>
      {message ? <p className="rounded-md bg-leaf-50 p-3 text-sm text-leaf-900">{message}</p> : null}
      <button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-leaf-700 px-4 py-3 font-semibold text-white disabled:opacity-60">
        <Save size={18} />
        {loading ? "保存中" : "トップページ文言を保存"}
      </button>
    </form>
  );
}
