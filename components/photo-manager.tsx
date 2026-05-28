"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUp, Save, Star, Trash2 } from "lucide-react";
import { compressImageForUpload, formatBytes } from "@/lib/image-compress";
import { createClient } from "@/lib/supabase-browser";
import type { AdminPhoto } from "@/lib/queries";

export function PhotoManager({ photos }: { photos: AdminPhoto[] }) {
  if (photos.length === 0) {
    return (
      <section className="rounded-lg bg-white/80 p-5 text-sm text-leaf-900/70 ring-1 ring-leaf-100">
        まだ写真がありません。上のフォームから追加してください。
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-bold text-leaf-900">登録済み写真</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {photos.map((photo) => (
          <PhotoCard key={photo.id} photo={photo} />
        ))}
      </div>
    </section>
  );
}

function PhotoCard({ photo }: { photo: AdminPhoto }) {
  const router = useRouter();
  const [caption, setCaption] = useState(photo.caption ?? "");
  const [photoType, setPhotoType] = useState(photo.photo_type ?? "");
  const [approvalStatus, setApprovalStatus] = useState(photo.approval_status);
  const [isMain, setIsMain] = useState(photo.is_main);
  const [replacementFile, setReplacementFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const targetName = photo.cultivars?.name_ja ?? photo.fruits?.name_ja ?? "未設定";

  async function savePhoto() {
    setLoading(true);
    setMessage("保存しています。");
    const supabase = createClient();

    if (isMain) {
      let query = supabase.from("photos").update({ is_main: false });
      if (photo.cultivar_id) {
        query = query.eq("cultivar_id", photo.cultivar_id);
      } else if (photo.fruit_id) {
        query = query.eq("fruit_id", photo.fruit_id).is("cultivar_id", null);
      }
      await query.neq("id", photo.id);
    }

    const { error } = await supabase
      .from("photos")
      .update({
        caption: caption || null,
        photo_type: photoType || null,
        approval_status: approvalStatus,
        is_main: isMain
      })
      .eq("id", photo.id);

    setLoading(false);
    if (error) {
      setMessage(`保存に失敗しました: ${error.message}`);
      return;
    }

    setMessage("写真情報を保存しました。");
    router.refresh();
  }

  async function replacePhoto() {
    if (!replacementFile) {
      setMessage("差し替える写真を選択してください。");
      return;
    }

    setLoading(true);
    setMessage("新しい写真を圧縮しています。");
    const supabase = createClient();
    let compressed;
    try {
      compressed = await compressImageForUpload(replacementFile);
    } catch (error) {
      setLoading(false);
      setMessage(error instanceof Error ? error.message : "画像圧縮に失敗しました。");
      return;
    }

    const storagePath = `${photo.fruit_id ?? "unknown"}/${photo.cultivar_id || "fruit"}/${crypto.randomUUID()}.jpg`;
    setMessage(
      `新しい写真をアップロードしています。${formatBytes(compressed.originalBytes)} → ${formatBytes(
        compressed.compressedBytes
      )} / ${compressed.width}x${compressed.height}px`
    );

    const { error: uploadError } = await supabase.storage.from("fruit-photos").upload(storagePath, compressed.file, {
      cacheControl: "3600",
      upsert: false
    });

    if (uploadError) {
      setLoading(false);
      setMessage(`差し替えアップロードに失敗しました: ${uploadError.message}`);
      return;
    }

    const { data: publicUrl } = supabase.storage.from("fruit-photos").getPublicUrl(storagePath);
    const { error } = await supabase
      .from("photos")
      .update({
        image_url: publicUrl.publicUrl,
        storage_path: storagePath
      })
      .eq("id", photo.id);

    if (error) {
      setLoading(false);
      setMessage(`DB更新に失敗しました: ${error.message}`);
      return;
    }

    await supabase.storage.from("fruit-photos").remove([photo.storage_path]);
    setLoading(false);
    setReplacementFile(null);
    setMessage("写真を差し替えました。");
    router.refresh();
  }

  async function deletePhoto() {
    if (!confirm("この写真を削除しますか？")) return;

    setLoading(true);
    setMessage("削除しています。");
    const supabase = createClient();
    const { error } = await supabase.from("photos").delete().eq("id", photo.id);

    if (error) {
      setLoading(false);
      setMessage(`DB削除に失敗しました: ${error.message}`);
      return;
    }

    await supabase.storage.from("fruit-photos").remove([photo.storage_path]);
    setLoading(false);
    setMessage("写真を削除しました。");
    router.refresh();
  }

  return (
    <article className="overflow-hidden rounded-lg bg-white/86 shadow-soft ring-1 ring-leaf-100">
      <div className="relative aspect-[4/3] bg-leaf-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo.image_url} alt={photo.caption ?? targetName} className="h-full w-full object-cover" />
      </div>
      <div className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-bold text-leaf-900">{targetName}</h3>
            <p className="mt-1 break-all text-xs text-leaf-900/55">{photo.storage_path}</p>
          </div>
          {isMain ? (
            <span className="inline-flex items-center gap-1 rounded-md bg-fruit-100 px-2 py-1 text-xs font-bold text-leaf-900">
              <Star size={13} />
              メイン
            </span>
          ) : null}
        </div>

        <label className="block">
          <span className="text-sm font-semibold text-leaf-900">キャプション</span>
          <input
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
            className="mt-2 w-full rounded-md border border-leaf-100 bg-white px-3 py-3 outline-none focus:border-leaf-600"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-leaf-900">写真タイプ</span>
          <input
            value={photoType}
            onChange={(event) => setPhotoType(event.target.value)}
            className="mt-2 w-full rounded-md border border-leaf-100 bg-white px-3 py-3 outline-none focus:border-leaf-600"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-leaf-900">承認状態</span>
          <select
            value={approvalStatus}
            onChange={(event) => setApprovalStatus(event.target.value as AdminPhoto["approval_status"])}
            className="mt-2 w-full rounded-md border border-leaf-100 bg-white px-3 py-3 outline-none focus:border-leaf-600"
          >
            <option value="approved">公開</option>
            <option value="pending">保留</option>
            <option value="rejected">非公開</option>
          </select>
        </label>

        <label className="flex items-center justify-between gap-3 rounded-md bg-fruit-100 p-3">
          <span className="font-semibold text-leaf-900">メイン写真にする</span>
          <input type="checkbox" checked={isMain} onChange={(event) => setIsMain(event.target.checked)} className="h-5 w-5" />
        </label>

        <div className="rounded-md border border-dashed border-leaf-200 bg-leaf-50 p-3">
          <label className="block">
            <span className="text-sm font-semibold text-leaf-900">画像を差し替え</span>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(event) => setReplacementFile(event.target.files?.[0] ?? null)}
              className="mt-3 block w-full text-sm"
            />
          </label>
          <button
            type="button"
            onClick={replacePhoto}
            disabled={loading || !replacementFile}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md border border-leaf-200 bg-white px-4 py-3 text-sm font-semibold text-leaf-800 disabled:opacity-60"
          >
            <ImageUp size={17} />
            差し替え
          </button>
        </div>

        {message ? <p className="rounded-md bg-leaf-50 p-3 text-sm text-leaf-900">{message}</p> : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={savePhoto}
            disabled={loading}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-leaf-700 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            <Save size={17} />
            保存
          </button>
          <button
            type="button"
            onClick={deletePhoto}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-700 disabled:opacity-60"
          >
            <Trash2 size={17} />
            削除
          </button>
        </div>
      </div>
    </article>
  );
}
