"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus } from "lucide-react";
import { formatDateStampForImage, todayDateInputValue } from "@/lib/date-stamp";
import { createImageVariantsForUpload, formatBytes, formatVariantSummary } from "@/lib/image-compress";
import { uploadPhotoVariants } from "@/lib/photo-upload";
import { createClient } from "@/lib/supabase-browser";
import type { AdminPhoto } from "@/lib/queries";
import type { Fruit } from "@/types/database";
import { PhotoManager } from "@/components/photo-manager";

const fruitPhotoTypes = ["fruit", "メイン下画像", "メイン画像2", "メイン画像3", "栽培暦", "特徴図", "育て方図", "剪定図", "果実", "枝葉", "花", "木の様子", "その他"];

export function FruitPhotoEditor({ fruit, photos }: { fruit: Fruit; photos: AdminPhoto[] }) {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [inputKey, setInputKey] = useState(0);
  const [photoType, setPhotoType] = useState("メイン下画像");
  const [caption, setCaption] = useState("");
  const [isMain, setIsMain] = useState(false);
  const [dateStampEnabled, setDateStampEnabled] = useState(true);
  const [dateStampDate, setDateStampDate] = useState(todayDateInputValue);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (files.length === 0) {
      setMessage("写真ファイルを選択してください．");
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
      setMessage("ログイン状態を確認できませんでした．もう一度管理者ログインしてください．");
      return;
    }

    if (isMain) {
      await supabase.from("photos").update({ is_main: false }).eq("fruit_id", fruit.id).is("cultivar_id", null);
    }

    for (let index = 0; index < files.length; index += 1) {
      const file = files[index];
      setMessage(`写真${index + 1}/${files.length}を3サイズに圧縮しています．`);

      let variants;
      try {
        variants = await createImageVariantsForUpload(file, {
          dateStamp: dateStampEnabled ? formatDateStampForImage(dateStampDate) : null
        });
      } catch (error) {
        setLoading(false);
        setMessage(error instanceof Error ? error.message : "画像圧縮に失敗しました．");
        return;
      }

      const basePath = `${fruit.id}/fruit/${crypto.randomUUID()}`;
      setMessage(
        `写真${index + 1}/${files.length}をアップロードしています．元画像 ${formatBytes(variants.originalBytes)} → ${formatVariantSummary(variants)}`
      );
      const uploaded = await uploadPhotoVariants(supabase, basePath, variants);
      if (uploaded.error || !uploaded.data) {
        setLoading(false);
        setMessage(`Storageアップロードに失敗しました: ${uploaded.error}`);
        return;
      }

      const { error } = await supabase.from("photos").insert({
        fruit_id: fruit.id,
        cultivar_id: null,
        ...uploaded.data,
        photo_type: photoType,
        caption: caption || null,
        taken_at: dateStampEnabled ? dateStampDate : null,
        uploaded_by: user.id,
        source_type: "admin",
        approval_status: "approved",
        is_main: isMain && index === 0
      });

      if (error) {
        setLoading(false);
        setMessage(`DB登録に失敗しました: ${error.message}`);
        return;
      }
    }

    setLoading(false);
    setFiles([]);
    setInputKey((current) => current + 1);
    setCaption("");
    setIsMain(false);
    setMessage("果樹ページ用の写真を追加しました．");
    router.refresh();
  }

  return (
    <section className="space-y-4">
      <form onSubmit={onSubmit} className="space-y-4 rounded-lg bg-white/86 p-5 ring-1 ring-leaf-100">
        <div className="flex items-center gap-2 font-bold text-leaf-900">
          <ImagePlus size={18} />
          果樹ページ用写真
        </div>
        <p className="text-sm leading-6 text-leaf-900/68">
          メイン画像，メイン画像2，栽培暦，特徴図など，果樹ページ上部に出したい画像をここで管理します．
        </p>

        <label className="block">
          <span className="text-sm font-semibold text-leaf-900">写真タイプ</span>
          <select
            value={photoType}
            onChange={(event) => setPhotoType(event.target.value)}
            className="mt-2 w-full rounded-md border border-leaf-100 bg-white px-3 py-3"
          >
            {fruitPhotoTypes.map((type) => (
              <option key={type} value={type}>
                {type === "fruit" ? "通常写真（果樹ページ上部には自動表示しない）" : type}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-leaf-900">キャプション</span>
          <input
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
            className="mt-2 w-full rounded-md border border-leaf-100 bg-white px-3 py-3"
          />
        </label>

        <label className="block rounded-md border border-dashed border-leaf-200 bg-leaf-50 p-4">
          <span className="text-sm font-semibold text-leaf-900">写真を選択（複数可）</span>
          <input
            key={inputKey}
            type="file"
            accept="image/*"
            multiple
            onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
            className="mt-3 block w-full text-sm"
          />
          {files.length > 0 ? <span className="mt-2 block text-xs font-semibold text-leaf-700">{files.length}枚選択中</span> : null}
        </label>

        <div className="rounded-md bg-leaf-50 p-3">
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
          <span className="mt-2 block text-xs text-leaf-900/58">選択した写真すべてに同じ日付を焼き込みます．</span>
        </div>

        <label className="flex items-center justify-between gap-3 rounded-md bg-fruit-100 p-3">
          <span className="font-semibold text-leaf-900">先頭の写真をメイン画像にする</span>
          <input type="checkbox" checked={isMain} onChange={(event) => setIsMain(event.target.checked)} className="h-5 w-5" />
        </label>

        {message ? <p className="rounded-md bg-leaf-50 p-3 text-sm text-leaf-900">{message}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-leaf-700 px-4 py-3 font-semibold text-white disabled:opacity-60"
        >
          <ImagePlus size={18} />
          {loading ? "追加中" : "果樹写真を追加"}
        </button>
      </form>

      <PhotoManager photos={photos} />
    </section>
  );
}
