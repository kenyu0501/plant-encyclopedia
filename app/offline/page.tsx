import { PageHeader } from "@/components/page-header";

export default function OfflinePage() {
  return (
    <div className="space-y-4">
      <PageHeader title="オフラインです" description="通信が戻ったら，公開中の果樹ページをまた開けます．" />
      <p className="rounded-lg bg-white/84 p-5 leading-7 ring-1 ring-leaf-100">
        PWAとしてホーム画面に追加できます．初回表示後の基本ファイルはキャッシュされます．
      </p>
    </div>
  );
}
