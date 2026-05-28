import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { PageHeader } from "@/components/page-header";
import { getCurrentUser, isAdminUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (await isAdminUser(user)) redirect("/admin");

  return (
    <div className="space-y-5">
      <PageHeader title="管理者ログイン" description="果樹・品種・写真・YouTubeを管理するためのログインです。" />
      <LoginForm />
    </div>
  );
}
