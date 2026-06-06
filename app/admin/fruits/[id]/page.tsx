import { notFound, redirect } from "next/navigation";
import { FruitForm } from "@/components/fruit-form";
import { FruitPhotoEditor } from "@/components/fruit-photo-editor";
import { PageHeader } from "@/components/page-header";
import { VideoForm } from "@/components/video-form";
import { VideoManager } from "@/components/video-manager";
import { requireAdmin } from "@/lib/auth";
import { getAdminCultivars, getAdminFruits } from "@/lib/queries";
import { createClient } from "@/lib/supabase-server";
import type { AdminPhoto, AdminVideo } from "@/lib/queries";
import type { Fruit } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function EditFruitPage({ params }: { params: Promise<{ id: string }> }) {
  const { isAdmin } = await requireAdmin();
  if (!isAdmin) redirect("/admin/login");

  const { id } = await params;
  const supabase = await createClient();
  const [{ data }, photosResult, videosResult, fruits, cultivars] = await Promise.all([
    supabase.from("fruits").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("photos")
      .select("*, fruits(name_ja, slug), cultivars(name_ja, slug)")
      .eq("fruit_id", id)
      .is("cultivar_id", null)
      .order("is_main", { ascending: false })
      .order("created_at", { ascending: false }),
    supabase
      .from("videos")
      .select("*, fruits(name_ja, slug), cultivars(name_ja, slug)")
      .eq("fruit_id", id)
      .is("cultivar_id", null)
      .order("created_at", { ascending: false }),
    getAdminFruits(),
    getAdminCultivars()
  ]);
  const fruit = data as Fruit | null;
  if (!fruit) notFound();
  const photos = (photosResult.data ?? []) as AdminPhoto[];
  const videos = (videosResult.data ?? []) as AdminVideo[];

  return (
    <div className="space-y-5">
      <PageHeader title="果樹編集" description={fruit.name_ja} />
      <FruitForm fruit={fruit} />
      <FruitPhotoEditor fruit={fruit} photos={photos} />
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-leaf-900">この果樹のYouTube管理</h2>
        <p className="text-sm leading-6 text-leaf-900/68">
          品種ではなく，果樹ページ全体に紐づく動画を登録します．育て方，剪定，歴史，栽培暦などの動画をここで管理できます．
        </p>
        <VideoForm fruits={fruits} cultivars={cultivars} initialFruitId={fruit.id} lockFruit lockCultivar />
        <VideoManager videos={videos} fruits={fruits} cultivars={cultivars} />
      </section>
    </div>
  );
}
