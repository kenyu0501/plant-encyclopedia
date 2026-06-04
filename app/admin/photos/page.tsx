import { redirect } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { PhotoManager } from "@/components/photo-manager";
import { PhotoUploadForm } from "@/components/photo-upload-form";
import { requireAdmin } from "@/lib/auth";
import { getAdminCultivars, getAdminFruits, getAdminPhotos } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function PhotosPage() {
  const { isAdmin } = await requireAdmin();
  if (!isAdmin) redirect("/admin/login");
  const [fruits, cultivars, photos] = await Promise.all([getAdminFruits(), getAdminCultivars(), getAdminPhotos()]);

  return (
    <div className="space-y-5">
      <PageHeader title="写真追加" description="スマホのカメラ・写真ライブラリからSupabase Storageへアップロードします．" />
      <PhotoUploadForm fruits={fruits} cultivars={cultivars} />
      <PhotoManager photos={photos} />
    </div>
  );
}
