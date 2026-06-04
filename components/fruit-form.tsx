"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import type { Fruit, FruitInsert } from "@/types/database";

type Field = keyof Pick<
  Fruit,
  | "name_ja"
  | "name_en"
  | "slug"
  | "scientific_name"
  | "family_name"
  | "origin"
  | "description"
  | "growth_habit"
  | "flower_description"
  | "fruit_description"
  | "cultivation_summary"
  | "okinawa_suitability"
  | "public_notes"
  | "private_notes"
>;

const fields: { name: Field; label: string; textarea?: boolean; required?: boolean; placeholder?: string; help?: string }[] = [
  { name: "name_ja", label: "和名", required: true },
  { name: "name_en", label: "英名" },
  {
    name: "slug",
    label: "URLスラッグ",
    required: true,
    placeholder: "例: dragon-fruit",
    help: "URLに使う英数字です．新しい果樹ごとに重複しない値にしてください．"
  },
  { name: "scientific_name", label: "学名" },
  { name: "family_name", label: "科名" },
  { name: "origin", label: "原産地" },
  { name: "description", label: "説明", textarea: true },
  { name: "growth_habit", label: "樹形・性質", textarea: true },
  { name: "flower_description", label: "花の説明", textarea: true },
  { name: "fruit_description", label: "果実の説明", textarea: true },
  { name: "cultivation_summary", label: "栽培まとめ", textarea: true },
  { name: "okinawa_suitability", label: "沖縄適性", textarea: true },
  { name: "public_notes", label: "公開メモ", textarea: true },
  { name: "private_notes", label: "非公開メモ", textarea: true }
];

export function FruitForm({ fruit }: { fruit?: Fruit | null }) {
  const router = useRouter();
  const [form, setForm] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((field) => [field.name, fruit?.[field.name] ?? ""]))
  );
  const [displayOrder, setDisplayOrder] = useState(fruit?.display_order?.toString() ?? "");
  const [isPublic, setIsPublic] = useState(fruit?.is_public ?? false);
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
      display_order: displayOrder.trim() ? Number(displayOrder) : null,
      is_public: isPublic,
      updated_at: new Date().toISOString()
    } as FruitInsert;
    const { data, error } = fruit
      ? await supabase.from("fruits").update(payload).eq("id", fruit.id).select("id").single()
      : await supabase.from("fruits").insert(payload).select("id").single();
    setLoading(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    router.replace(`/admin/fruits/${data.id}`);
    router.refresh();
  }

  async function onDelete() {
    if (!fruit || !confirm("この果樹を削除しますか？紐づく品種・写真・動画も削除対象になります．")) return;
    const supabase = createClient();
    const { error } = await supabase.from("fruits").delete().eq("id", fruit.id);
    if (error) {
      setMessage(error.message);
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-lg bg-white/86 p-5 ring-1 ring-leaf-100">
      <label className="flex items-center justify-between gap-3 rounded-md bg-leaf-50 p-3">
        <span className="font-semibold text-leaf-900">公開する</span>
        <input type="checkbox" checked={isPublic} onChange={(event) => setIsPublic(event.target.checked)} className="h-5 w-5" />
      </label>
      <label className="block rounded-md border border-leaf-100 bg-white p-3">
        <span className="text-sm font-semibold text-leaf-900">表示順</span>
        <input
          type="number"
          inputMode="numeric"
          value={displayOrder}
          onChange={(event) => setDisplayOrder(event.target.value)}
          placeholder="例: 10"
          className="mt-2 w-full rounded-md border border-leaf-100 bg-white px-3 py-3 outline-none focus:border-leaf-600"
        />
        <span className="mt-1 block text-xs leading-5 text-leaf-900/58">
          小さい数字ほど先に表示されます．未入力の果樹は，表示順が入っている果樹の後ろで名前順になります．
        </span>
      </label>
      {fields.map((field) => (
        <label key={field.name} className="block">
          <span className="text-sm font-semibold text-leaf-900">{field.label}</span>
          {field.textarea ? (
            <textarea
              required={field.required}
              value={form[field.name]}
              onChange={(event) => update(field.name, event.target.value)}
              placeholder={field.placeholder}
              rows={4}
              className="mt-2 w-full rounded-md border border-leaf-100 bg-white px-3 py-3 outline-none focus:border-leaf-600"
            />
          ) : (
            <input
              required={field.required}
              value={form[field.name]}
              onChange={(event) => update(field.name, event.target.value)}
              placeholder={field.placeholder}
              className="mt-2 w-full rounded-md border border-leaf-100 bg-white px-3 py-3 outline-none focus:border-leaf-600"
            />
          )}
          {field.help ? <span className="mt-1 block text-xs leading-5 text-leaf-900/58">{field.help}</span> : null}
        </label>
      ))}
      {message ? <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{message}</p> : null}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="submit" disabled={loading} className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-leaf-700 px-4 py-3 font-semibold text-white disabled:opacity-60">
          <Save size={18} />
          {loading ? "保存中" : "保存"}
        </button>
        {fruit ? (
          <button type="button" onClick={onDelete} className="inline-flex items-center justify-center gap-2 rounded-md border border-red-200 bg-white px-4 py-3 font-semibold text-red-700">
            <Trash2 size={18} />
            削除
          </button>
        ) : null}
      </div>
    </form>
  );
}
