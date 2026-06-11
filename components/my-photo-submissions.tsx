"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Trash2 } from "lucide-react";
import { getPhotoUrl } from "@/lib/photo-url";
import { createClient } from "@/lib/supabase-browser";
import type { ViewerPhotoSubmission } from "@/lib/queries";

const photoTypes = ["果実", "果実断面", "花", "枝葉", "新芽", "木の様子", "収穫物", "栽培記録", "その他"];

export function MyPhotoSubmissions({ submissions }: { submissions: ViewerPhotoSubmission[] }) {
  if (submissions.length === 0) {
    return (
      <section className="rounded-lg bg-white/80 p-5 text-sm leading-6 text-leaf-900/70 ring-1 ring-leaf-100">
        まだ投稿した写真はありません．写真投稿ページから投稿できます．
      </section>
    );
  }

  return (
    <section className="grid gap-4">
      {submissions.map((submission) => (
        <SubmissionCard key={submission.id} submission={submission} />
      ))}
    </section>
  );
}

function SubmissionCard({ submission }: { submission: ViewerPhotoSubmission }) {
  const router = useRouter();
  const [caption, setCaption] = useState(submission.caption ?? "");
  const [locationName, setLocationName] = useState(submission.location_name ?? "");
  const [takenAt, setTakenAt] = useState(submission.taken_at ?? "");
  const [contributorName, setContributorName] = useState(submission.contributor_name ?? "");
  const [photoType, setPhotoType] = useState(submission.photo_type ?? "果実");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const isPending = submission.approval_status === "pending";
  const captionRemaining = 100 - caption.length;

  async function saveSubmission() {
    if (!isPending) return;
    if (!contributorName.trim()) {
      setMessage("ペンネームを入力してください．");
      return;
    }
    if (caption.length > 100) {
      setMessage("キャプションは100文字以内にしてください．");
      return;
    }

    setLoading(true);
    setMessage("保存しています．");
    const supabase = createClient();
    const { error } = await supabase.rpc("update_own_pending_photo_submission", {
      p_photo_id: submission.id,
      p_caption: caption.trim() || null,
      p_taken_at: takenAt || null,
      p_contributor_name: contributorName.trim(),
      p_location_name: locationName.trim() || null,
      p_photo_type: photoType || null
    });

    setLoading(false);
    if (error) {
      setMessage(`保存に失敗しました: ${error.message}`);
      return;
    }
    setMessage("投稿内容を保存しました．");
    router.refresh();
  }

  async function withdrawSubmission() {
    if (!isPending) return;
    if (!confirm("この投稿を取り下げますか？")) return;

    setLoading(true);
    setMessage("取り下げています．");
    const supabase = createClient();
    const { error } = await supabase.rpc("withdraw_own_pending_photo_submission", {
      p_photo_id: submission.id
    });

    setLoading(false);
    if (error) {
      setMessage(`取り下げに失敗しました: ${error.message}`);
      return;
    }
    setMessage("投稿を取り下げました．");
    router.refresh();
  }

  return (
    <article className="overflow-hidden rounded-lg bg-white/86 shadow-soft ring-1 ring-leaf-100">
      <div className="relative aspect-[4/3] bg-leaf-100">
        <Image src={getPhotoUrl(submission, "thumb")} alt={submission.caption ?? submission.photo_type ?? "投稿写真"} fill className="object-cover" sizes="100vw" />
      </div>
      <div className="space-y-4 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-bold text-leaf-900">{submission.cultivars?.name_ja ?? submission.fruits?.name_ja ?? "投稿写真"}</h2>
            <p className="mt-1 text-xs text-leaf-900/58">投稿日: {formatDateTime(submission.created_at)}</p>
          </div>
          <StatusBadge status={submission.approval_status} />
        </div>

        {isPending ? (
          <>
            <label className="block">
              <span className="text-sm font-semibold text-leaf-900">写真タイプ</span>
              <select
                value={photoType}
                onChange={(event) => setPhotoType(event.target.value)}
                className="mt-2 w-full rounded-md border border-leaf-100 bg-white px-3 py-3 outline-none focus:border-leaf-600"
              >
                {photoTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-leaf-900">キャプション</span>
              <textarea
                value={caption}
                maxLength={100}
                onChange={(event) => setCaption(event.target.value)}
                rows={3}
                className="mt-2 w-full rounded-md border border-leaf-100 bg-white px-3 py-3 outline-none focus:border-leaf-600"
              />
              <span className="mt-1 block text-right text-xs text-leaf-900/55">残り{captionRemaining}文字</span>
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-leaf-900">産地・撮影場所</span>
                <input
                  value={locationName}
                  onChange={(event) => setLocationName(event.target.value)}
                  className="mt-2 w-full rounded-md border border-leaf-100 bg-white px-3 py-3 outline-none focus:border-leaf-600"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-leaf-900">撮影日</span>
                <input
                  type="date"
                  value={takenAt}
                  onChange={(event) => setTakenAt(event.target.value)}
                  className="mt-2 w-full rounded-md border border-leaf-100 bg-white px-3 py-3 outline-none focus:border-leaf-600"
                />
              </label>
            </div>
            <label className="block">
              <span className="text-sm font-semibold text-leaf-900">ペンネーム</span>
              <input
                value={contributorName}
                onChange={(event) => setContributorName(event.target.value)}
                className="mt-2 w-full rounded-md border border-leaf-100 bg-white px-3 py-3 outline-none focus:border-leaf-600"
              />
            </label>
          </>
        ) : (
          <div className="rounded-md bg-leaf-50 p-3 text-sm leading-6 text-leaf-900/72">
            {submission.photo_type ? <p>写真タイプ: {submission.photo_type}</p> : null}
            {submission.caption ? <p>キャプション: {submission.caption}</p> : null}
            {submission.location_name ? <p>産地・撮影場所: {submission.location_name}</p> : null}
            {submission.taken_at ? <p>撮影日: {formatDate(submission.taken_at)}</p> : null}
            {submission.contributor_name ? <p>ペンネーム: {submission.contributor_name}</p> : null}
          </div>
        )}

        {message ? <p className="rounded-md bg-leaf-50 p-3 text-sm text-leaf-900">{message}</p> : null}

        {isPending ? (
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <button
              type="button"
              onClick={saveSubmission}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-leaf-700 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              <Save size={17} />
              修正を保存
            </button>
            <button
              type="button"
              onClick={withdrawSubmission}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-700 disabled:opacity-60"
            >
              <Trash2 size={17} />
              取り下げ
            </button>
          </div>
        ) : null}
      </div>
    </article>
  );
}

function StatusBadge({ status }: { status: ViewerPhotoSubmission["approval_status"] }) {
  const label = status === "approved" ? "承認済み" : status === "pending" ? "承認待ち" : "取り下げ・非公開";
  const className =
    status === "approved"
      ? "bg-leaf-50 text-leaf-800"
      : status === "pending"
        ? "bg-fruit-100 text-leaf-900"
        : "bg-red-50 text-red-700";
  return <span className={`rounded-md px-2 py-1 text-xs font-bold ${className}`}>{label}</span>;
}

function formatDate(value: string) {
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${year}/${month}/${day}`;
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}
