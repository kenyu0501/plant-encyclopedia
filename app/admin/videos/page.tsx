import { redirect } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { VideoForm } from "@/components/video-form";
import { VideoManager } from "@/components/video-manager";
import { requireAdmin } from "@/lib/auth";
import { getAdminCultivars, getAdminFruits, getAdminVideos } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function VideosPage() {
  const { isAdmin } = await requireAdmin();
  if (!isAdmin) redirect("/admin/login");
  const [fruits, cultivars, videos] = await Promise.all([getAdminFruits(), getAdminCultivars(), getAdminVideos()]);

  return (
    <div className="space-y-5">
      <PageHeader title="YouTube追加" description="果樹ページまたは品種ページにYouTubeリンクを紐づけます．" />
      <VideoForm fruits={fruits} cultivars={cultivars} />
      <VideoManager videos={videos} fruits={fruits} cultivars={cultivars} />
    </div>
  );
}
