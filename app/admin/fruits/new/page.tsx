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
      <PageHeader title="果樹追加" description="果樹ページは品種ページの親になります。" />
      <FruitForm />
    </div>
  );
}
