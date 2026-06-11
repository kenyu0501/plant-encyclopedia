import Link from "next/link";
import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { MyPhotoSubmissions } from "@/components/my-photo-submissions";
import { getCurrentUser } from "@/lib/auth";
import { getOwnViewerPhotoSubmissions } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "自分の投稿"
};

export default async function MySubmissionsPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="space-y-5">
        <PageHeader title="自分の投稿" description="投稿した写真の状態を確認できます．" />
        <section className="rounded-lg bg-white/86 p-5 ring-1 ring-leaf-100">
          <p className="text-sm leading-6 text-leaf-900/74">自分の投稿を見るにはログインが必要です．</p>
          <Link
            href="/submit-photo"
            className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-leaf-700 px-4 py-3 text-sm font-semibold text-white"
          >
            写真投稿ページでログイン
          </Link>
        </section>
      </div>
    );
  }

  const submissions = await getOwnViewerPhotoSubmissions(user.id);

  return (
    <div className="space-y-5">
      <PageHeader
        title="自分の投稿"
        description="承認待ちの投稿は，キャプション・産地・撮影日・ペンネームを修正できます．"
        action={
          <Link href="/submit-photo" className="inline-flex items-center rounded-md bg-leaf-700 px-3 py-2 text-sm font-semibold text-white">
            新しく投稿
          </Link>
        }
      />
      <MyPhotoSubmissions submissions={submissions} />
    </div>
  );
}
