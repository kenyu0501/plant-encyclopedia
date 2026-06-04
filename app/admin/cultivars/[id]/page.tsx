import { notFound, redirect } from "next/navigation";
import { CultivarForm } from "@/components/cultivar-form";
import { PageHeader } from "@/components/page-header";
import { VideoManager } from "@/components/video-manager";
import { requireAdmin } from "@/lib/auth";
import { getAdminCultivars, getAdminFruits } from "@/lib/queries";
import { createClient } from "@/lib/supabase-server";
import type { Cultivar } from "@/types/database";
import type { AdminVideo } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function EditCultivarPage({ params }: { params: Promise<{ id: string }> }) {
  const { isAdmin } = await requireAdmin();
  if (!isAdmin) redirect("/admin/login");

  const { id } = await params;
  const supabase = await createClient();
  const [{ data }, fruits, cultivars, { data: videos }] = await Promise.all([
    supabase.from("cultivars").select("*").eq("id", id).maybeSingle(),
    getAdminFruits(),
    getAdminCultivars(),
    supabase
      .from("videos")
      .select("*, fruits(name_ja, slug), cultivars(name_ja, slug)")
      .eq("cultivar_id", id)
      .order("created_at", { ascending: false })
  ]);
  const cultivar = data as Cultivar | null;
  if (!cultivar) notFound();

  return (
    <div className="space-y-5">
      <PageHeader title="品種編集" description={cultivar.name_ja} />
      <CultivarForm cultivar={cultivar} fruits={fruits} />
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-leaf-900">この品種のYouTube管理</h2>
        <p className="text-sm leading-6 text-leaf-900/68">
          重複したリンクや誤って登録したリンクを，ここから修正・削除できます．
        </p>
        <VideoManager videos={(videos ?? []) as AdminVideo[]} fruits={fruits} cultivars={cultivars} />
      </section>
    </div>
  );
}
