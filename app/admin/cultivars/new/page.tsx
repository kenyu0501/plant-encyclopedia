import { redirect } from "next/navigation";
import { CultivarForm } from "@/components/cultivar-form";
import { PageHeader } from "@/components/page-header";
import { requireAdmin } from "@/lib/auth";
import { getAdminFruits } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function NewCultivarPage() {
  const { isAdmin } = await requireAdmin();
  if (!isAdmin) redirect("/admin/login");
  const fruits = await getAdminFruits();

  return (
    <div className="space-y-5">
      <PageHeader title="品種追加" description="品種は必ず親の果樹ページに紐づきます。" />
      <CultivarForm fruits={fruits} />
    </div>
  );
}
