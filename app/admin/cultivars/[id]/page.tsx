import { notFound, redirect } from "next/navigation";
import { CultivarForm } from "@/components/cultivar-form";
import { PageHeader } from "@/components/page-header";
import { requireAdmin } from "@/lib/auth";
import { getAdminFruits } from "@/lib/queries";
import { createClient } from "@/lib/supabase-server";
import type { Cultivar } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function EditCultivarPage({ params }: { params: Promise<{ id: string }> }) {
  const { isAdmin } = await requireAdmin();
  if (!isAdmin) redirect("/admin/login");

  const { id } = await params;
  const supabase = await createClient();
  const [{ data }, fruits] = await Promise.all([
    supabase.from("cultivars").select("*").eq("id", id).maybeSingle(),
    getAdminFruits()
  ]);
  const cultivar = data as Cultivar | null;
  if (!cultivar) notFound();

  return (
    <div className="space-y-5">
      <PageHeader title="品種編集" description={cultivar.name_ja} />
      <CultivarForm cultivar={cultivar} fruits={fruits} />
    </div>
  );
}
