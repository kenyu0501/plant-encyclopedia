"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ImagePlus, PlaySquare, Save, Trash2 } from "lucide-react";
import { compressImageForUpload, formatBytes } from "@/lib/image-compress";
import { createClient } from "@/lib/supabase-browser";
import { getYoutubeThumbnail } from "@/lib/youtube";
import type { Cultivar, CultivarInsert, Fruit } from "@/types/database";

type Field = keyof Pick<
  Cultivar,
  | "name_ja"
  | "name_en"
  | "slug"
  | "origin"
  | "description"
  | "fruit_size"
  | "taste"
  | "texture"
  | "aroma"
  | "harvest_season"
  | "cold_hardiness"
  | "flowering_type"
  | "plant_height_type"
  | "genome_group"
  | "yield_level"
  | "tree_vigor"
  | "difficulty"
  | "okinawa_suitability"
  | "container_suitability"
  | "beginner_suitability"
  | "kenyu_comment"
  | "public_notes"
  | "private_notes"
>;

const fields: { name: Field; label: string; textarea?: boolean; required?: boolean }[] = [
  { name: "name_ja", label: "品種名", required: true },
  { name: "name_en", label: "英名" },
  { name: "slug", label: "URLスラッグ", required: true },
  { name: "origin", label: "原産地" },
  { name: "description", label: "説明", textarea: true },
  { name: "fruit_size", label: "果実サイズ" },
  { name: "taste", label: "味", textarea: true },
  { name: "texture", label: "食感" },
  { name: "aroma", label: "香り" },
  { name: "harvest_season", label: "収穫期" },
  { name: "cold_hardiness", label: "耐寒温度目安" },
  { name: "flowering_type", label: "開花型" },
  { name: "plant_height_type", label: "背丈" },
  { name: "genome_group", label: "ゲノム構成" },
  { name: "yield_level", label: "収量" },
  { name: "tree_vigor", label: "樹勢" },
  { name: "difficulty", label: "難易度" },
  { name: "okinawa_suitability", label: "沖縄適性", textarea: true },
  { name: "container_suitability", label: "鉢植え適性" },
  { name: "beginner_suitability", label: "初心者向け" },
  { name: "kenyu_comment", label: "けんゆーコメント", textarea: true },
  { name: "public_notes", label: "出典・公開メモ", textarea: true },
  { name: "private_notes", label: "非公開メモ", textarea: true }
];

export function CultivarForm({ cultivar, fruits }: { cultivar?: Cultivar | null; fruits: Fruit[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultFruitId = searchParams.get("fruit_id") ?? fruits[0]?.id ?? "";
  const [fruitId, setFruitId] = useState(cultivar?.fruit_id ?? defaultFruitId);
  const [form, setForm] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((field) => [field.name, cultivar?.[field.name] ?? ""]))
  );
  const [isPublic, setIsPublic] = useState(cultivar?.is_public ?? false);
  const [isForSale, setIsForSale] = useState(cultivar?.is_for_sale ?? false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoCaption, setPhotoCaption] = useState("");
  const [photoIsMain, setPhotoIsMain] = useState(true);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [youtubeTitle, setYoutubeTitle] = useState("");
  const [message, setMessage] = useState("");
  const [saveSucceeded, setSaveSucceeded] = useState(false);
  const [loading, setLoading] = useState(false);
  const parentFruit = fruits.find((fruit) => fruit.id === fruitId);

  function update(name: string, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setSaveSucceeded(false);
    const supabase = createClient();
    const payload = {
      ...form,
      fruit_id: fruitId,
      is_public: isPublic,
      is_for_sale: isForSale,
      updated_at: new Date().toISOString()
    } as CultivarInsert;
    const { data, error } = cultivar
      ? await supabase.from("cultivars").update(payload).eq("id", cultivar.id).select("id").single()
      : await supabase.from("cultivars").insert(payload).select("id").single();
    if (error) {
      setLoading(false);
      setMessage(error.message);
      return;
    }

    const savedCultivarId = data.id;

    if (photoFile) {
      setMessage("写真を圧縮しています．");
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        setMessage("写真追加にはログイン状態の確認が必要です．もう一度ログインしてください．");
        return;
      }

      let compressed;
      try {
        compressed = await compressImageForUpload(photoFile);
      } catch (compressError) {
        setLoading(false);
        setMessage(compressError instanceof Error ? compressError.message : "画像圧縮に失敗しました．");
        return;
      }

      const storagePath = `${fruitId}/${savedCultivarId}/${crypto.randomUUID()}.jpg`;
      setMessage(
        `写真をアップロードしています．${formatBytes(compressed.originalBytes)} → ${formatBytes(
          compressed.compressedBytes
        )} / ${compressed.width}x${compressed.height}px`
      );
      const { error: uploadError } = await supabase.storage.from("fruit-photos").upload(storagePath, compressed.file, {
        cacheControl: "3600",
        upsert: false
      });
      if (uploadError) {
        setLoading(false);
        setMessage(`写真アップロードに失敗しました: ${uploadError.message}`);
        return;
      }

      const { data: publicUrl } = supabase.storage.from("fruit-photos").getPublicUrl(storagePath);
      if (photoIsMain) {
        await supabase.from("photos").update({ is_main: false }).eq("cultivar_id", savedCultivarId);
      }
      const { error: photoError } = await supabase.from("photos").insert({
        fruit_id: fruitId || null,
        cultivar_id: savedCultivarId,
        image_url: publicUrl.publicUrl,
        storage_path: storagePath,
        photo_type: "cultivar",
        caption: photoCaption || null,
        taken_at: null,
        uploaded_by: user.id,
        source_type: "admin",
        approval_status: "approved",
        is_main: photoIsMain
      });
      if (photoError) {
        setLoading(false);
        setMessage(`写真レコード登録に失敗しました: ${photoError.message}`);
        return;
      }
    }

    if (youtubeUrl) {
      setMessage("YouTubeリンクを登録しています．");
      const { error: videoError } = await supabase.from("videos").insert({
        fruit_id: fruitId || null,
        cultivar_id: savedCultivarId,
        youtube_url: youtubeUrl,
        title: youtubeTitle || null,
        description: null,
        thumbnail_url: getYoutubeThumbnail(youtubeUrl),
        video_type: "cultivar",
        is_public: true
      });
      if (videoError) {
        setLoading(false);
        setMessage(`YouTube登録に失敗しました: ${videoError.message}`);
        return;
      }
    }

    setLoading(false);
    setSaveSucceeded(true);
    setMessage("保存しました．");
    if (!cultivar) {
      router.replace(`/admin/cultivars/${data.id}`);
    }
    router.refresh();
  }

  async function onDelete() {
    if (!cultivar || !confirm("この品種を削除しますか？")) return;
    const supabase = createClient();
    const { error } = await supabase.from("cultivars").delete().eq("id", cultivar.id);
    if (error) {
      setMessage(error.message);
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-lg bg-white/86 p-5 ring-1 ring-leaf-100">
      <label className="block">
        <span className="text-sm font-semibold text-leaf-900">親の果樹</span>
        <select
          required
          value={fruitId}
          onChange={(event) => setFruitId(event.target.value)}
          className="mt-2 w-full rounded-md border border-leaf-100 bg-white px-3 py-3 outline-none focus:border-leaf-600"
        >
          {fruits.map((fruit) => (
            <option key={fruit.id} value={fruit.id}>
              {fruit.name_ja}
            </option>
          ))}
        </select>
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex items-center justify-between gap-3 rounded-md bg-leaf-50 p-3">
          <span className="font-semibold text-leaf-900">公開する</span>
          <input type="checkbox" checked={isPublic} onChange={(event) => setIsPublic(event.target.checked)} className="h-5 w-5" />
        </label>
        <label className="flex items-center justify-between gap-3 rounded-md bg-fruit-100 p-3">
          <span className="font-semibold text-leaf-900">販売対象</span>
          <input type="checkbox" checked={isForSale} onChange={(event) => setIsForSale(event.target.checked)} className="h-5 w-5" />
        </label>
      </div>
      {fields.map((field) => (
        <label key={field.name} className="block">
          <span className="text-sm font-semibold text-leaf-900">{field.label}</span>
          {field.textarea ? (
            <textarea
              required={field.required}
              value={form[field.name]}
              onChange={(event) => update(field.name, event.target.value)}
              rows={4}
              className="mt-2 w-full rounded-md border border-leaf-100 bg-white px-3 py-3 outline-none focus:border-leaf-600"
            />
          ) : (
            <input
              required={field.required}
              value={form[field.name]}
              onChange={(event) => update(field.name, event.target.value)}
              className="mt-2 w-full rounded-md border border-leaf-100 bg-white px-3 py-3 outline-none focus:border-leaf-600"
            />
          )}
        </label>
      ))}
      <section className="space-y-3 rounded-lg border border-leaf-100 bg-leaf-50 p-4">
        <div className="flex items-center gap-2 font-bold text-leaf-900">
          <ImagePlus size={18} />
          写真も同時に追加
        </div>
        <label className="block">
          <span className="text-sm font-semibold text-leaf-900">写真</span>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(event) => setPhotoFile(event.target.files?.[0] ?? null)}
            className="mt-2 block w-full text-sm"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-leaf-900">写真キャプション</span>
          <input value={photoCaption} onChange={(event) => setPhotoCaption(event.target.value)} className="mt-2 w-full rounded-md border border-leaf-100 bg-white px-3 py-3" />
        </label>
        <label className="flex items-center justify-between gap-3 rounded-md bg-white p-3">
          <span className="font-semibold text-leaf-900">メイン写真にする</span>
          <input type="checkbox" checked={photoIsMain} onChange={(event) => setPhotoIsMain(event.target.checked)} className="h-5 w-5" />
        </label>
      </section>
      <section className="space-y-3 rounded-lg border border-leaf-100 bg-fruit-100 p-4">
        <div className="flex items-center gap-2 font-bold text-leaf-900">
          <PlaySquare size={18} />
          YouTubeも同時に追加
        </div>
        <label className="block">
          <span className="text-sm font-semibold text-leaf-900">YouTube URL</span>
          <input type="url" value={youtubeUrl} onChange={(event) => setYoutubeUrl(event.target.value)} className="mt-2 w-full rounded-md border border-leaf-100 bg-white px-3 py-3" />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-leaf-900">YouTubeタイトル</span>
          <input value={youtubeTitle} onChange={(event) => setYoutubeTitle(event.target.value)} className="mt-2 w-full rounded-md border border-leaf-100 bg-white px-3 py-3" />
        </label>
      </section>
      {message ? (
        <p className={`rounded-md p-3 text-sm ${saveSucceeded ? "bg-leaf-50 text-leaf-800" : "bg-red-50 text-red-700"}`}>
          {message}
        </p>
      ) : null}
      {saveSucceeded && parentFruit ? (
        <Link
          href={`/fruits/${parentFruit.slug}#cultivars`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-leaf-200 bg-white px-4 py-3 font-semibold text-leaf-800"
        >
          <ArrowLeft size={18} />
          {parentFruit.name_ja}の品種一覧へ戻る
        </Link>
      ) : null}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="submit" disabled={loading} className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-leaf-700 px-4 py-3 font-semibold text-white disabled:opacity-60">
          <Save size={18} />
          {loading ? "保存中" : "保存"}
        </button>
        {cultivar ? (
          <button type="button" onClick={onDelete} className="inline-flex items-center justify-center gap-2 rounded-md border border-red-200 bg-white px-4 py-3 font-semibold text-red-700">
            <Trash2 size={18} />
            削除
          </button>
        ) : null}
      </div>
    </form>
  );
}
