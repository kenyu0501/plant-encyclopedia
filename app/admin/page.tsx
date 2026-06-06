import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminCultivarList } from "@/components/admin-cultivar-list";
import { AdminActions } from "@/components/admin-shell";
import { PageHeader } from "@/components/page-header";
import { requireAdmin } from "@/lib/auth";
import { getAdminCultivars, getAdminFruits } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const { isAdmin } = await requireAdmin();
  if (!isAdmin) redirect("/admin/login");

  const [fruits, cultivars] = await Promise.all([getAdminFruits(), getAdminCultivars()]);

  return (
    <div className="space-y-6">
      <PageHeader title="管理画面" description="果樹ページを親にして，品種・写真・YouTubeを登録します．" />
      <AdminActions />

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-leaf-900">果樹</h2>
        <div className="grid gap-3">
          {fruits.map((fruit) => (
            <Link key={fruit.id} href={`/admin/fruits/${fruit.id}`} className="flex items-center justify-between gap-3 rounded-lg bg-white/84 p-4 ring-1 ring-leaf-100">
              <span>
                <span className="font-semibold text-leaf-900">{fruit.name_ja}</span>
                <span className="ml-2 text-xs font-semibold text-leaf-900/48">
                  表示順 {fruit.display_order ?? "未設定"}
                </span>
              </span>
              <span className={`shrink-0 rounded-md px-2 py-1 text-xs font-bold ${fruit.is_public ? "bg-leaf-50 text-leaf-800" : "bg-stone-100 text-stone-600"}`}>
                {fruit.is_public ? "公開" : "非公開"}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <AdminCultivarList cultivars={cultivars} fruits={fruits} />
    </div>
  );
}
