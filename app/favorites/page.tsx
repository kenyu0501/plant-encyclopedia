import type { Metadata } from "next";
import { FavoriteCultivarList } from "@/components/favorite-cultivar-list";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "保存した品種",
  description: "育てている、育てたい、気になる品種をまとめて確認できます。"
};

export default function FavoritesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="保存した品種"
        description="育てている・育てたい・気になる品種を、あとから見返せます。"
      />
      <FavoriteCultivarList />
    </div>
  );
}
