import { redirect } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { SiteSettingsForm } from "@/components/site-settings-form";
import { requireAdmin } from "@/lib/auth";
import { getSiteSettings } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const { isAdmin } = await requireAdmin();
  if (!isAdmin) redirect("/admin/login");
  const settings = await getSiteSettings();

  return (
    <div className="space-y-5">
      <PageHeader title="トップページ設定" description="トップページ上部の小見出し・タイトル・説明文を編集します．" />
      <SiteSettingsForm settings={settings} />
    </div>
  );
}
