"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { compressImageForUpload, formatBytes } from "@/lib/image-compress";
import { createClient } from "@/lib/supabase-browser";
import type { AdminCultivar } from "@/lib/queries";
import type { Fruit } from "@/types/database";

export function PhotoUploadForm({
  fruits,
  cultivars
}: {
  fruits: Fruit[];
  cultivars: AdminCultivar[];
}) {
  const router = useRouter();
  const [fruitId, setFruitId] = useState(fruits[0]?.id ?? "");
  const [cultivarId, setCultivarId] = useState("");
  const [caption, setCaption] = useState("");
  const [photoType, setPhotoType] = useState("fruit");
  const [isMain, setIsMain] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const filteredCultivars = cultivars.filter((cultivar) => cultivar.fruit_id === fruitId);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) {
      setMessage("写真ファイルを選択してください。");
      return;
    }

    setLoading(true);
    setMessage("");
    const supabase = createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      setMessage("ログイン状態を確認できませんでした。もう一度管理者ログインしてください。");
      return;
    }

    setMessage("写真を圧縮しています。");
    let compressed;
    try {
      compressed = await compressImageForUpload(file);
    } catch (error) {
      setLoading(false);
      setMessage(error instanceof Error ? error.message : "画像圧縮に失敗しました。");
      return;
    }

    const storagePath = `${fruitId}/${cultivarId || "fruit"}/${crypto.randomUUID()}.jpg`;
    setMessage(
      `Storageへ写真をアップロードしています。${formatBytes(compressed.originalBytes)} → ${formatBytes(
        compressed.compressedBytes
      )} / ${compressed.width}x${compressed.height}px`
    );
    const { error: uploadError } = await supabase.storage.from("fruit-photos").upload(storagePath, compressed.file, {
      cacheControl: "3600",
      upsert: false
    });

    if (uploadError) {
      setLoading(false);
      setMessage(`Storageアップロードに失敗しました: ${uploadError.message}`);
      return;
    }

    setMessage("写真レコードをデータベースに登録しています。");
    const { data: publicUrl } = supabase.storage.from("fruit-photos").getPublicUrl(storagePath);
    const { error } = await supabase.from("photos").insert({
      fruit_id: fruitId || null,
      cultivar_id: cultivarId || null,
      image_url: publicUrl.publicUrl,
      storage_path: storagePath,
      photo_type: photoType,
      caption: caption || null,
      taken_at: null,
      uploaded_by: user?.id ?? null,
      source_type: "admin",
      approval_status: "approved",
      is_main: isMain
    });

    setLoading(false);
    if (error) {
      setMessage(`DB登録に失敗しました: ${error.message}`);
      return;
    }

    setCaption("");
    setFile(null);
    setMessage("写真をアップロードしました。公開ページを再読み込みすると反映されます。");
    router.refresh();
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
          <option value="">果樹ページの写真</option>
          {filteredCultivars.map((cultivar) => (
            <option key={cultivar.id} value={cultivar.id}>
              {cultivar.name_ja}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-leaf-900">写真タイプ</span>
        <input value={photoType} onChange={(event) => setPhotoType(event.target.value)} className="mt-2 w-full rounded-md border border-leaf-100 bg-white px-3 py-3" />
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-leaf-900">キャプション</span>
        <input value={caption} onChange={(event) => setCaption(event.target.value)} className="mt-2 w-full rounded-md border border-leaf-100 bg-white px-3 py-3" />
      </label>
      <label className="block rounded-md border border-dashed border-leaf-200 bg-leaf-50 p-4">
        <span className="text-sm font-semibold text-leaf-900">写真を選択</span>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          className="mt-3 block w-full text-sm"
        />
      </label>
      <label className="flex items-center justify-between gap-3 rounded-md bg-fruit-100 p-3">
        <span className="font-semibold text-leaf-900">メイン写真にする</span>
        <input type="checkbox" checked={isMain} onChange={(event) => setIsMain(event.target.checked)} className="h-5 w-5" />
      </label>
      {message ? <p className="rounded-md bg-leaf-50 p-3 text-sm text-leaf-900">{message}</p> : null}
      <button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-leaf-700 px-4 py-3 font-semibold text-white disabled:opacity-60">
        <Upload size={18} />
        {loading ? "アップロード中" : "写真を追加"}
      </button>
    </form>
  );
}
