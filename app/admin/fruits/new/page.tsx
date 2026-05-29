import { redirect } from "next/navigation";
import { FruitForm } from "@/components/fruit-form";
import { PageHeader } from "@/components/page-header";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function NewFruitPage() {
  const { isAdmin } = await requireAdmin();
  if (!isAdmin) redirect("/admin/login");

  return (
    <div className="space-y-5">
      <PageHeader
        title="果樹追加"
        description="マンゴー、アボカド、バナナ以外の果樹もここから追加できます。果樹ページを作ると、その下に品種・写真・YouTubeを紐づけられます。"
      />
      <FruitForm />
    </div>
  );
}
