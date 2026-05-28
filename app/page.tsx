import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FruitCard } from "@/components/fruit-card";
import { getPublicFruits, getSiteSettings } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [fruits, settings] = await Promise.all([getPublicFruits(6), getSiteSettings()]);

  return (
    <div className="space-y-8">
      <section className="rounded-lg bg-white/84 p-5 shadow-soft ring-1 ring-leaf-100">
        <p className="text-sm font-semibold text-leaf-700">{settings.home_eyebrow}</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight text-leaf-900">
          {settings.home_title}
        </h1>
        <p className="mt-3 leading-7 text-leaf-900/75">
          {settings.home_description}
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
