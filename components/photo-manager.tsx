"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUp, Save, Star, Trash2 } from "lucide-react";
import { formatDateStampForImage, todayDateInputValue } from "@/lib/date-stamp";
import { createImageVariantsForUpload, formatBytes, formatVariantSummary } from "@/lib/image-compress";
import { getPhotoStoragePaths, getPhotoUrl } from "@/lib/photo-url";
import { uploadPhotoVariants } from "@/lib/photo-upload";
import { createClient } from "@/lib/supabase-browser";
import type { AdminPhoto } from "@/lib/queries";

const photoTypes = ["fruit", "メイン下画像", "メイン画像2", "メイン画像3", "栽培暦", "特徴図", "育て方図", "剪定図", "果実", "果実断面", "花", "枝葉", "新芽", "木の様子", "樹皮", "糖度計", "収穫物", "栽培記録", "その他"];

export function PhotoManager({ photos }: { photos: AdminPhoto[] }) {
  if (photos.length === 0) {
    return (
      <section className="rounded-lg bg-white/80 p-5 text-sm text-leaf-900/70 ring-1 ring-leaf-100">
        まだ写真がありません．上のフォームから追加してください．
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
  const [dateStampEnabled, setDateStampEnabled] = useState(true);
  const [dateStampDate, setDateStampDate] = useState(todayDateInputValue);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const targetName = photo.cultivars?.name_ja ?? photo.fruits?.name_ja ?? "未設定";
  const photoTypeOptions = photoType && !photoTypes.includes(photoType) ? [photoType, ...photoTypes] : photoTypes;

  async function savePhoto() {
    setLoading(true);
    setMessage("保存しています．");
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

    setMessage("写真情報を保存しました．");
    router.refresh();
  }

  async function replacePhoto() {
    if (!replacementFile) {
      setMessage("差し替える写真を選択してください．");
      return;
    }

    setLoading(true);
    setMessage("新しい写真を3サイズに圧縮しています．");
    const supabase = createClient();
    let variants;
    try {
      variants = await createImageVariantsForUpload(replacementFile, {
        dateStamp: dateStampEnabled ? formatDateStampForImage(dateStampDate) : null
      });
    } catch (error) {
      setLoading(false);
      setMessage(error instanceof Error ? error.message : "画像圧縮に失敗しました．");
      return;
    }

    const basePath = `${photo.fruit_id ?? "unknown"}/${photo.cultivar_id || "fruit"}/${crypto.randomUUID()}`;
    setMessage(
      `新しい写真をアップロードしています．元画像 ${formatBytes(variants.originalBytes)} → ${formatVariantSummary(variants)}`
    );

    const uploaded = await uploadPhotoVariants(supabase, basePath, variants);
    if (uploaded.error || !uploaded.data) {
      setLoading(false);
      setMessage(`差し替えアップロードに失敗しました: ${uploaded.error}`);
      return;
    }

    const { error } = await supabase
      .from("photos")
      .update(uploaded.data)
      .eq("id", photo.id);

    if (error) {
      setLoading(false);
      setMessage(`DB更新に失敗しました: ${error.message}`);
      return;
    }

    await supabase.storage.from("fruit-photos").remove(getPhotoStoragePaths(photo));
    setLoading(false);
    setReplacementFile(null);
    setMessage("写真を差し替えました．");
    router.refresh();
  }

  async function deletePhoto() {
    if (!confirm("この写真を削除しますか？")) return;

    setLoading(true);
    setMessage("削除しています．");
    const supabase = createClient();
    const { error } = await supabase.from("photos").delete().eq("id", photo.id);

    if (error) {
      setLoading(false);
      setMessage(`DB削除に失敗しました: ${error.message}`);
      return;
    }

    await supabase.storage.from("fruit-photos").remove(getPhotoStoragePaths(photo));
    setLoading(false);
    setMessage("写真を削除しました．");
    router.refresh();
  }

  return (
    <article className="overflow-hidden rounded-lg bg-white/86 shadow-soft ring-1 ring-leaf-100">
      <div className="relative aspect-[4/3] bg-leaf-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={getPhotoUrl(photo, "thumb")} alt={photo.caption ?? targetName} className="h-full w-full object-cover" />
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
          <select
            value={photoType}
            onChange={(event) => setPhotoType(event.target.value)}
            className="mt-2 w-full rounded-md border border-leaf-100 bg-white px-3 py-3 outline-none focus:border-leaf-600"
          >
            <option value="">未設定</option>
            {photoTypeOptions.map((type) => (
              <option key={type} value={type}>
                {type === "fruit" ? "通常写真" : type}
              </option>
            ))}
          </select>
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
              onChange={(event) => setReplacementFile(event.target.files?.[0] ?? null)}
              className="mt-3 block w-full text-sm"
            />
          </label>
          <div className="mt-3 rounded-md bg-white p-3">
            <label className="flex items-center justify-between gap-3">
              <span className="font-semibold text-leaf-900">右下に日付を入れる</span>
              <input
                type="checkbox"
                checked={dateStampEnabled}
                onChange={(event) => setDateStampEnabled(event.target.checked)}
                className="h-5 w-5"
              />
            </label>
            <input
              type="date"
              value={dateStampDate}
              onChange={(event) => setDateStampDate(event.target.value)}
              disabled={!dateStampEnabled}
              className="mt-3 w-full rounded-md border border-leaf-100 bg-white px-3 py-3 disabled:opacity-50"
            />
          </div>
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
