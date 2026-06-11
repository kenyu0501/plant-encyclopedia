import type { Metadata } from "next";
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
      />
      <ViewerPhotoSubmissionForm fruits={fruits} initialUser={userResult.user ?? null} />
    </div>
  );
}
