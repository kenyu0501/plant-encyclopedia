import { notFound, redirect } from "next/navigation";
import { FruitForm } from "@/components/fruit-form";
import { PageHeader } from "@/components/page-header";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase-server";
import type { Fruit } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function EditFruitPage({ params }: { params: Promise<{ id: string }> }) {
  const { isAdmin } = await requireAdmin();
  if (!isAdmin) redirect("/admin/login");

  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("fruits").select("*").eq("id", id).maybeSingle();
  const fruit = data as Fruit | null;
  if (!fruit) notFound();

  return (
    <div className="space-y-5">
      <PageHeader title="果樹編集" description={fruit.name_ja} />
      <FruitForm fruit={fruit} />
    </div>
  );
}
