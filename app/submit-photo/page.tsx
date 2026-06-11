import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { ViewerPhotoSubmissionForm } from "@/components/viewer-photo-submission-form";
import { getPublicFruitOptions } from "@/lib/queries";
import { createClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "写真投稿"
};

export default async function SubmitPhotoPage() {
  const supabase = await createClient();
  const [{ data: userResult }, fruits] = await Promise.all([supabase.auth.getUser(), getPublicFruitOptions()]);

  return (
    <div className="space-y-5">
      <PageHeader
        title="写真投稿"
        description="果樹や品種の写真を投稿できます．投稿写真は管理者の承認後に公開されます．"
        action={
          <Link href="/my-submissions" className="inline-flex items-center rounded-md border border-leaf-200 bg-white px-3 py-2 text-sm font-semibold text-leaf-800">
            自分の投稿
          </Link>
        }
      />
      <ViewerPhotoSubmissionForm fruits={fruits} initialUser={userResult.user ?? null} />
    </div>
  );
}
