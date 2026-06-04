"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, Save, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { getYoutubeKey, getYoutubeThumbnail } from "@/lib/youtube";
import type { AdminCultivar, AdminVideo } from "@/lib/queries";
import type { Fruit } from "@/types/database";

export function VideoManager({
  videos,
  fruits,
  cultivars
}: {
  videos: AdminVideo[];
  fruits: Fruit[];
  cultivars: AdminCultivar[];
}) {
  if (videos.length === 0) {
    return (
      <section className="rounded-lg bg-white/80 p-5 text-sm text-leaf-900/70 ring-1 ring-leaf-100">
        まだYouTubeリンクがありません．上のフォームから追加してください．
      </section>
    );
  }

  const keyCounts = videos.reduce((counts, video) => {
    const key = getYoutubeKey(video.youtube_url);
    counts.set(key, (counts.get(key) ?? 0) + 1);
    return counts;
  }, new Map<string, number>());

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-bold text-leaf-900">登録済みYouTube</h2>
      <div className="grid gap-4">
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            fruits={fruits}
            cultivars={cultivars}
            isDuplicate={(keyCounts.get(getYoutubeKey(video.youtube_url)) ?? 0) > 1}
          />
        ))}
      </div>
    </section>
  );
}

function VideoCard({
  video,
  fruits,
  cultivars,
  isDuplicate
}: {
  video: AdminVideo;
  fruits: Fruit[];
  cultivars: AdminCultivar[];
  isDuplicate: boolean;
}) {
  const router = useRouter();
  const [fruitId, setFruitId] = useState(video.fruit_id ?? "");
  const [cultivarId, setCultivarId] = useState(video.cultivar_id ?? "");
  const [youtubeUrl, setYoutubeUrl] = useState(video.youtube_url);
  const [title, setTitle] = useState(video.title ?? "");
  const [description, setDescription] = useState(video.description ?? "");
  const [videoType, setVideoType] = useState(video.video_type ?? "");
  const [isPublic, setIsPublic] = useState(video.is_public);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const filteredCultivars = cultivars.filter((cultivar) => cultivar.fruit_id === fruitId);
  const targetName = video.cultivars?.name_ja ?? video.fruits?.name_ja ?? "未設定";

  async function saveVideo() {
    setLoading(true);
    setMessage("保存しています．");
    const supabase = createClient();
    const { error } = await supabase
      .from("videos")
      .update({
        fruit_id: fruitId || null,
        cultivar_id: cultivarId || null,
        youtube_url: youtubeUrl,
        title: title || null,
        description: description || null,
        thumbnail_url: getYoutubeThumbnail(youtubeUrl),
        video_type: videoType || null,
        is_public: isPublic
      })
      .eq("id", video.id);

    setLoading(false);
    if (error) {
      setMessage(`保存に失敗しました: ${error.message}`);
      return;
    }
    setMessage("YouTubeリンクを保存しました．");
    router.refresh();
  }

  async function deleteVideo() {
    if (!confirm("このYouTubeリンクを削除しますか？")) return;
    setLoading(true);
    setMessage("削除しています．");
    const supabase = createClient();
    const { error } = await supabase.from("videos").delete().eq("id", video.id);
    setLoading(false);
    if (error) {
      setMessage(`削除に失敗しました: ${error.message}`);
      return;
    }
    setMessage("削除しました．");
    router.refresh();
  }

  return (
    <article className="rounded-lg bg-white/86 p-4 ring-1 ring-leaf-100">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-leaf-900">{title || video.youtube_url}</h3>
            {isDuplicate ? (
              <span className="rounded-md bg-red-50 px-2 py-1 text-xs font-bold text-red-700">重複</span>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-leaf-900/58">現在の紐づけ: {targetName}</p>
        </div>
        <a href={video.youtube_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2 py-1 text-xs font-bold text-red-700">
          <ExternalLink size={14} />
          開く
        </a>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-leaf-900">果樹</span>
          <select
            value={fruitId}
            onChange={(event) => {
              setFruitId(event.target.value);
              setCultivarId("");
            }}
            className="mt-2 w-full rounded-md border border-leaf-100 bg-white px-3 py-3"
          >
            <option value="">未設定</option>
            {fruits.map((fruit) => (
              <option key={fruit.id} value={fruit.id}>
                {fruit.name_ja}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-leaf-900">品種</span>
          <select value={cultivarId} onChange={(event) => setCultivarId(event.target.value)} className="mt-2 w-full rounded-md border border-leaf-100 bg-white px-3 py-3">
            <option value="">果樹ページの動画</option>
            {filteredCultivars.map((cultivar) => (
              <option key={cultivar.id} value={cultivar.id}>
                {cultivar.name_ja}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-3 grid gap-3">
        <Field label="YouTube URL" value={youtubeUrl} onChange={setYoutubeUrl} />
        <Field label="タイトル" value={title} onChange={setTitle} />
        <label className="block">
          <span className="text-sm font-semibold text-leaf-900">説明</span>
          <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={3} className="mt-2 w-full rounded-md border border-leaf-100 bg-white px-3 py-3" />
        </label>
        <Field label="動画タイプ" value={videoType} onChange={setVideoType} />
        <label className="flex items-center justify-between gap-3 rounded-md bg-leaf-50 p-3">
          <span className="font-semibold text-leaf-900">公開する</span>
          <input type="checkbox" checked={isPublic} onChange={(event) => setIsPublic(event.target.checked)} className="h-5 w-5" />
        </label>
      </div>

      {message ? <p className="mt-3 rounded-md bg-leaf-50 p-3 text-sm text-leaf-900">{message}</p> : null}

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={saveVideo} disabled={loading} className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-leaf-700 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60">
          <Save size={17} />
          保存
        </button>
        <button type="button" onClick={deleteVideo} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-md border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-700 disabled:opacity-60">
          <Trash2 size={17} />
          削除
        </button>
      </div>
    </article>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-leaf-900">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-md border border-leaf-100 bg-white px-3 py-3" />
    </label>
  );
}
