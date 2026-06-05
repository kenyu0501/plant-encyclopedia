import { notFound, redirect } from "next/navigation";
import { FruitForm } from "@/components/fruit-form";
import { FruitPhotoEditor } from "@/components/fruit-photo-editor";
import { PageHeader } from "@/components/page-header";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase-server";
import type { AdminPhoto } from "@/lib/queries";
import type { Fruit } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function EditFruitPage({ params }: { params: Promise<{ id: string }> }) {
  const { isAdmin } = await requireAdmin();
  if (!isAdmin) redirect("/admin/login");

  const { id } = await params;
  const supabase = await createClient();
  const [{ data }, photosResult] = await Promise.all([
    supabase.from("fruits").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("photos")
      .select("*, fruits(name_ja, slug), cultivars(name_ja, slug)")
      .eq("fruit_id", id)
      .is("cultivar_id", null)
      .order("is_main", { ascending: false })
      .order("created_at", { ascending: false })
  ]);
  const fruit = data as Fruit | null;
  if (!fruit) notFound();
  const photos = (photosResult.data ?? []) as AdminPhoto[];

  return (
    <div className="space-y-5">
      <PageHeader title="果樹編集" description={fruit.name_ja} />
      <FruitForm fruit={fruit} />
      <FruitPhotoEditor fruit={fruit} photos={photos} />
    </div>
  );
}
