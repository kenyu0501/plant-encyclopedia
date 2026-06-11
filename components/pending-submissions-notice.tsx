import Link from "next/link";
import { ClipboardCheck } from "lucide-react";

export function PendingSubmissionsNotice({ count }: { count: number }) {
  if (count === 0) return null;

  return (
    <section className="rounded-lg bg-fruit-100 p-4 ring-1 ring-fruit-200">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-md bg-white/80 p-2 text-leaf-800">
            <ClipboardCheck size={22} />
          </div>
          <div>
            <h2 className="font-bold text-leaf-900">承認待ちの投稿が{count}件あります</h2>
            <p className="mt-1 text-sm leading-6 text-leaf-900/70">閲覧者から届いた写真を確認できます．</p>
          </div>
        </div>
        <Link
          href="/admin/photo-submissions"
          className="inline-flex items-center justify-center rounded-md bg-leaf-700 px-4 py-3 text-sm font-semibold text-white"
        >
          投稿を確認
        </Link>
      </div>
    </section>
  );
}
