import Link from "next/link";
import { ArrowRight, Leaf, ShieldCheck, Smartphone } from "lucide-react";
import { FruitCard } from "@/components/fruit-card";
import { getPublicFruits } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const fruits = await getPublicFruits(6);

  return (
    <div className="space-y-8">
      <section className="rounded-lg bg-white/84 p-5 shadow-soft ring-1 ring-leaf-100">
        <p className="text-sm font-semibold text-leaf-700">スマホでひらく栽培メモ</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight text-leaf-900">
          けんゆーの熱帯果樹図鑑
        </h1>
        <p className="mt-3 leading-7 text-leaf-900/75">
          果樹ページを親にして、品種・写真・YouTubeを整理する熱帯果樹PWAです。
          マンゴー、アボカド、バナナなどを現場で見返しやすい形にまとめます。
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/fruits"
            className="inline-flex items-center gap-2 rounded-md bg-leaf-700 px-4 py-3 text-sm font-semibold text-white"
          >
            果樹一覧へ
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-2 rounded-md border border-leaf-200 bg-white px-4 py-3 text-sm font-semibold text-leaf-800"
          >
            管理者ログイン
          </Link>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <Feature icon={<Leaf size={20} />} title="果樹が親ページ" text="品種は果樹に紐づく子ページとして管理します。" />
        <Feature icon={<Smartphone size={20} />} title="スマホ優先" text="下部ナビと大きめのフォームで屋外でも扱いやすく。" />
        <Feature icon={<ShieldCheck size={20} />} title="管理者だけ編集" text="公開ページは一般閲覧、編集はSupabase Authで保護します。" />
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-leaf-900">公開中の果樹</h2>
          <Link href="/fruits" className="text-sm font-semibold text-leaf-700">
            すべて見る
          </Link>
        </div>
        {fruits.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {fruits.map((fruit) => (
              <FruitCard key={fruit.id} fruit={fruit} />
            ))}
          </div>
        ) : (
          <p className="rounded-lg bg-white/80 p-5 text-sm text-leaf-900/70 ring-1 ring-leaf-100">
            まだ公開中の果樹がありません。管理画面から登録してください。
          </p>
        )}
      </section>
    </div>
  );
}

function Feature({
  icon,
  title,
  text
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-lg bg-white/78 p-4 ring-1 ring-leaf-100">
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-fruit-100 text-leaf-800">
        {icon}
      </div>
      <h2 className="mt-3 font-bold text-leaf-900">{title}</h2>
      <p className="mt-1 text-sm leading-6 text-leaf-900/70">{text}</p>
    </div>
  );
}
