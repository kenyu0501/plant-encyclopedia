"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Save, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
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
  { name: "tree_vigor", label: "樹勢" },
  { name: "difficulty", label: "難易度" },
  { name: "okinawa_suitability", label: "沖縄適性", textarea: true },
  { name: "container_suitability", label: "鉢植え適性" },
  { name: "beginner_suitability", label: "初心者向け" },
  { name: "kenyu_comment", label: "けんゆーコメント", textarea: true },
  { name: "public_notes", label: "公開メモ", textarea: true },
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
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function update(name: string, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
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
    setLoading(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    router.replace(`/admin/cultivars/${data.id}`);
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
      {message ? <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{message}</p> : null}
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
