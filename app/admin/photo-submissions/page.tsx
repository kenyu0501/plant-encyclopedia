import { redirect } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { PhotoManager } from "@/components/photo-manager";
import { requireAdmin } from "@/lib/auth";
import { getPendingViewerPhotos } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function PhotoSubmissionsPage() {
  const { isAdmin } = await requireAdmin();
  if (!isAdmin) redirect("/admin/login");
  const photos = await getPendingViewerPhotos();

  return (
    <div className="space-y-5">
      <PageHeader
        title="投稿写真の審査"
        description="閲覧者から投稿された写真を確認し，公開・非公開・削除を選べます．"
        action={
          <Link href="/admin/photos" className="inline-flex items-center rounded-md border border-leaf-200 bg-white px-3 py-2 text-sm font-semibold text-leaf-800">
            全写真管理
          </Link>
        }
      />
      <PhotoManager photos={photos} emptyMessage="承認待ちの投稿写真はありません．" />
    </div>
  );
}
