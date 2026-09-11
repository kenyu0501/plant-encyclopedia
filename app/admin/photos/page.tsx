import Link from "next/link";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { PhotoManager } from "@/components/photo-manager";
import { PhotoUploadForm } from "@/components/photo-upload-form";
import { requireAdmin } from "@/lib/auth";
import { getAdminCultivars, getAdminFruits, getAdminPhotos } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function PhotosPage({ searchParams }: { searchParams: Promise<{ page?: string | string[] }> }) {
  const { isAdmin } = await requireAdmin();
  if (!isAdmin) redirect("/admin/login");
  const requestedPage = (await searchParams).page;
  const parsedPage = Number(Array.isArray(requestedPage) ? requestedPage[0] : requestedPage);
  const page = Number.isFinite(parsedPage) ? Math.max(1, Math.floor(parsedPage)) : 1;
  const [fruits, cultivars, photoPage] = await Promise.all([getAdminFruits(), getAdminCultivars(), getAdminPhotos(page)]);

  return (
    <div className="space-y-5">
      <PageHeader title="写真追加" description="スマホのカメラ・写真ライブラリからSupabase Storageへアップロードします．" />
      <PhotoUploadForm fruits={fruits} cultivars={cultivars} />
      <PhotoManager photos={photoPage.items} />
      <nav className="flex items-center justify-between gap-3 rounded-lg bg-white/84 p-4 ring-1 ring-leaf-100" aria-label="写真一覧のページ移動">
        {photoPage.page > 1 ? (
          <Link href={`/admin/photos?page=${photoPage.page - 1}`} prefetch={false} className="rounded-md border border-leaf-200 bg-white px-4 py-2 text-sm font-bold text-leaf-800">
            前の20件
          </Link>
        ) : <span />}
        <span className="text-center text-xs font-semibold text-leaf-900/60">
          全{photoPage.total}件・{photoPage.page}/{photoPage.totalPages}ページ
        </span>
        {photoPage.page < photoPage.totalPages ? (
          <Link href={`/admin/photos?page=${photoPage.page + 1}`} prefetch={false} className="rounded-md border border-leaf-200 bg-white px-4 py-2 text-sm font-bold text-leaf-800">
            次の20件
          </Link>
        ) : <span />}
      </nav>
    </div>
  );
}
