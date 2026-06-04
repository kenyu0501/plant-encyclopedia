"use client";

import { useState } from "react";
import { PlaySquare } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { getYoutubeThumbnail } from "@/lib/youtube";
import type { AdminCultivar } from "@/lib/queries";
import type { Fruit } from "@/types/database";

export function VideoForm({
  fruits,
  cultivars
}: {
  fruits: Fruit[];
  cultivars: AdminCultivar[];
}) {
  const [fruitId, setFruitId] = useState(fruits[0]?.id ?? "");
  const [cultivarId, setCultivarId] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoType, setVideoType] = useState("overview");
  const [isPublic, setIsPublic] = useState(true);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const filteredCultivars = cultivars.filter((cultivar) => cultivar.fruit_id === fruitId);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const supabase = createClient();
    const { error } = await supabase.from("videos").insert({
      fruit_id: fruitId || null,
      cultivar_id: cultivarId || null,
      youtube_url: youtubeUrl,
      title: title || null,
      description: description || null,
      thumbnail_url: getYoutubeThumbnail(youtubeUrl),
      video_type: videoType || null,
      is_public: isPublic
    });
    setLoading(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    setYoutubeUrl("");
    setTitle("");
    setDescription("");
    setMessage("YouTubeリンクを登録しました．");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-lg bg-white/86 p-5 ring-1 ring-leaf-100">
      <label className="block">
        <span className="text-sm font-semibold text-leaf-900">果樹</span>
        <select value={fruitId} onChange={(event) => setFruitId(event.target.value)} className="mt-2 w-full rounded-md border border-leaf-100 bg-white px-3 py-3">
          {fruits.map((fruit) => (
            <option key={fruit.id} value={fruit.id}>
              {fruit.name_ja}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-leaf-900">品種に紐づける</span>
        <select value={cultivarId} onChange={(event) => setCultivarId(event.target.value)} className="mt-2 w-full rounded-md border border-leaf-100 bg-white px-3 py-3">
          <option value="">果樹ページの動画</option>
          {filteredCultivars.map((cultivar) => (
            <option key={cultivar.id} value={cultivar.id}>
              {cultivar.name_ja}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-leaf-900">YouTube URL</span>
        <input required type="url" value={youtubeUrl} onChange={(event) => setYoutubeUrl(event.target.value)} className="mt-2 w-full rounded-md border border-leaf-100 bg-white px-3 py-3" />
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-leaf-900">タイトル</span>
        <input value={title} onChange={(event) => setTitle(event.target.value)} className="mt-2 w-full rounded-md border border-leaf-100 bg-white px-3 py-3" />
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-leaf-900">説明</span>
        <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={4} className="mt-2 w-full rounded-md border border-leaf-100 bg-white px-3 py-3" />
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-leaf-900">動画タイプ</span>
        <input value={videoType} onChange={(event) => setVideoType(event.target.value)} className="mt-2 w-full rounded-md border border-leaf-100 bg-white px-3 py-3" />
      </label>
      <label className="flex items-center justify-between gap-3 rounded-md bg-leaf-50 p-3">
        <span className="font-semibold text-leaf-900">公開する</span>
        <input type="checkbox" checked={isPublic} onChange={(event) => setIsPublic(event.target.checked)} className="h-5 w-5" />
      </label>
      {message ? <p className="rounded-md bg-leaf-50 p-3 text-sm text-leaf-900">{message}</p> : null}
      <button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-leaf-700 px-4 py-3 font-semibold text-white disabled:opacity-60">
        <PlaySquare size={18} />
        {loading ? "登録中" : "YouTubeを追加"}
      </button>
    </form>
  );
}
