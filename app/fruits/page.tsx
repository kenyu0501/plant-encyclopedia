import type { Metadata } from "next";
import { FruitCard } from "@/components/fruit-card";
import { PageHeader } from "@/components/page-header";
import { getPublicFruits } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "果樹一覧"
};

export default async function FruitsPage() {
  const fruits = await getPublicFruits();

  return (
    <div className="space-y-5">
      <PageHeader title="果樹一覧" description="公開中の熱帯果樹ページです。果樹ページの中に品種ページが紐づきます。" />
      {fruits.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {fruits.map((fruit) => (
            <FruitCard key={fruit.id} fruit={fruit} />
          ))}
        </div>
      ) : (
        <p className="rounded-lg bg-white/80 p-5 text-leaf-900/70 ring-1 ring-leaf-100">
          公開中の果樹がありません。
        </p>
      )}
    </div>
  );
}
