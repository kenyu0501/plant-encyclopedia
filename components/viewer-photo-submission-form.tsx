"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Camera, CheckCircle2, Mail, Send, Upload } from "lucide-react";
import { createImageVariantsForUpload, formatBytes, formatVariantSummary } from "@/lib/image-compress";
import { uploadPhotoVariants } from "@/lib/photo-upload";
import { createClient } from "@/lib/supabase-browser";
import type { PublicFruitOption } from "@/lib/queries";
import type { User } from "@supabase/supabase-js";

type Message = {
  tone: "success" | "error" | "info";
  text: string;
};

const photoTypes = ["果実", "果実断面", "花", "枝葉", "新芽", "木の様子", "収穫物", "栽培記録", "その他"];

export function ViewerPhotoSubmissionForm({
  fruits,
  initialUser
}: {
  fruits: PublicFruitOption[];
  initialUser: User | null;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialFruitId = searchParams.get("fruit_id") ?? fruits[0]?.id ?? "";
  const initialCultivarId = searchParams.get("cultivar_id") ?? "";
  const [user, setUser] = useState<User | null>(initialUser);
  const [email, setEmail] = useState("");
  const [fruitId, setFruitId] = useState(initialFruitId);
  const [cultivarId, setCultivarId] = useState(initialCultivarId);
  const [locationName, setLocationName] = useState("");
  const [takenAt, setTakenAt] = useState("");
  const [caption, setCaption] = useState("");
  const [contributorName, setContributorName] = useState("");
  const [photoType, setPhotoType] = useState("果実");
  const [file, setFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [message, setMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedFruit = fruits.find((fruit) => fruit.id === fruitId);
  const filteredCultivars = useMemo(() => selectedFruit?.cultivars ?? [], [selectedFruit]);
  const captionRemaining = 100 - caption.length;

  async function sendMagicLink(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email) return;

    setLoading(true);
    setMessage({ tone: "info", text: "確認メールを送信しています．" });
    const supabase = createClient();
    const origin = window.location.origin;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${origin}/auth/callback?next=/submit-photo`
      }
    });

    setLoading(false);
    if (error) {
      setMessage({ tone: "error", text: `メール送信に失敗しました: ${error.message}` });
      return;
    }
    setMessage({ tone: "success", text: "確認メールを送信しました．メール内のリンクから戻ると投稿できます．" });
  }

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    router.refresh();
  }

  async function submitPhoto(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) {
      setMessage({ tone: "error", text: "写真投稿にはログインが必要です．" });
      return;
    }
    if (!file) {
      setMessage({ tone: "error", text: "写真を選択してください．" });
      return;
    }
    if (!fruitId) {
      setMessage({ tone: "error", text: "果樹を選択してください．" });
      return;
    }
    if (!contributorName.trim()) {
      setMessage({ tone: "error", text: "ペンネームを入力してください．" });
      return;
    }
    if (caption.length > 100) {
      setMessage({ tone: "error", text: "キャプションは100文字以内にしてください．" });
      return;
    }

    setLoading(true);
    setMessage({ tone: "info", text: "写真を圧縮しています．" });
    const supabase = createClient();
    const {
      data: { user: currentUser }
    } = await supabase.auth.getUser();
    if (!currentUser) {
      setLoading(false);
      setUser(null);
      setMessage({ tone: "error", text: "ログイン状態を確認できませんでした．もう一度ログインしてください．" });
      return;
    }

    let variants;
    try {
      variants = await createImageVariantsForUpload(file);
    } catch (error) {
      setLoading(false);
      setMessage({ tone: "error", text: error instanceof Error ? error.message : "画像圧縮に失敗しました．" });
      return;
    }

    const basePath = `viewer-submissions/${currentUser.id}/${fruitId}/${cultivarId || "fruit"}/${crypto.randomUUID()}`;
    setMessage({
      tone: "info",
      text: `Storageへアップロードしています．元画像 ${formatBytes(variants.originalBytes)} → ${formatVariantSummary(variants)}`
    });
    const uploaded = await uploadPhotoVariants(supabase, basePath, variants);
    if (uploaded.error || !uploaded.data) {
      setLoading(false);
      setMessage({ tone: "error", text: `Storageアップロードに失敗しました: ${uploaded.error}` });
      return;
    }

    const { error } = await supabase.from("photos").insert({
      fruit_id: fruitId,
      cultivar_id: cultivarId || null,
      ...uploaded.data,
      photo_type: photoType,
      caption: caption.trim() || null,
      taken_at: takenAt || null,
      uploaded_by: currentUser.id,
      contributor_name: contributorName.trim(),
      location_name: locationName.trim() || null,
      source_type: "viewer",
      approval_status: "pending",
      is_main: false
    });

    setLoading(false);
    if (error) {
      setMessage({ tone: "error", text: `投稿に失敗しました: ${error.message}` });
      return;
    }

    setCultivarId("");
    setLocationName("");
    setTakenAt("");
    setCaption("");
    setPhotoType("果実");
    setFile(null);
    setFileInputKey((current) => current + 1);
    setMessage({ tone: "success", text: "写真を投稿しました．管理者の承認後に図鑑へ表示されます．" });
    router.refresh();
  }

  if (!user) {
    return (
      <section className="space-y-4 rounded-lg bg-white/86 p-5 ring-1 ring-leaf-100">
        <div className="flex items-start gap-3">
          <div className="rounded-md bg-fruit-100 p-3 text-leaf-900">
            <Camera size={22} />
          </div>
          <div>
            <h2 className="font-bold text-leaf-900">写真投稿にはログインが必要です</h2>
            <p className="mt-1 text-sm leading-6 text-leaf-900/70">
              投稿写真はすぐには公開されません．管理者が確認してから図鑑に表示されます．
            </p>
          </div>
        </div>

        <form onSubmit={sendMagicLink} className="space-y-3 rounded-md bg-leaf-50 p-4">
          <label className="block">
            <span className="text-sm font-semibold text-leaf-900">メールアドレスでログイン</span>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-md border border-leaf-100 bg-white px-3 py-3 outline-none focus:border-leaf-600"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-leaf-200 bg-white px-4 py-3 text-sm font-semibold text-leaf-800 disabled:opacity-60"
          >
            <Mail size={17} />
            確認メールを送る
          </button>
        </form>

        {message ? <MessageBox message={message} /> : null}
      </section>
    );
  }

  return (
    <form onSubmit={submitPhoto} className="space-y-4 rounded-lg bg-white/86 p-5 ring-1 ring-leaf-100">
      <div className="flex items-start justify-between gap-3 rounded-md bg-leaf-50 p-3">
        <div className="min-w-0 text-sm text-leaf-900/75">
          <span className="block font-semibold text-leaf-900">ログイン中</span>
          <span className="block truncate">{user.email ?? user.id}</span>
        </div>
        <button type="button" onClick={signOut} className="shrink-0 text-sm font-semibold text-leaf-700">
          ログアウト
        </button>
      </div>

      <label className="block">
        <span className="text-sm font-semibold text-leaf-900">果樹</span>
        <select
          required
          value={fruitId}
          onChange={(event) => {
            setFruitId(event.target.value);
            setCultivarId("");
          }}
          className="mt-2 w-full rounded-md border border-leaf-100 bg-white px-3 py-3 outline-none focus:border-leaf-600"
        >
          {fruits.map((fruit) => (
            <option key={fruit.id} value={fruit.id}>
              {fruit.name_ja}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="text-sm font-semibold text-leaf-900">品種</span>
        <select
          value={cultivarId}
          onChange={(event) => setCultivarId(event.target.value)}
          className="mt-2 w-full rounded-md border border-leaf-100 bg-white px-3 py-3 outline-none focus:border-leaf-600"
        >
          <option value="">品種を指定しない</option>
          {filteredCultivars.map((cultivar) => (
            <option key={cultivar.id} value={cultivar.id}>
              {cultivar.name_ja}
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-leaf-900">産地・撮影場所</span>
          <input
            value={locationName}
            onChange={(event) => setLocationName(event.target.value)}
            placeholder="例: 沖縄県糸満市"
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
        <span className={`mt-1 block text-right text-xs ${captionRemaining < 0 ? "text-red-700" : "text-leaf-900/55"}`}>
          残り{captionRemaining}文字
        </span>
      </label>

      <label className="block">
        <span className="text-sm font-semibold text-leaf-900">ペンネーム</span>
        <input
          required
          value={contributorName}
          onChange={(event) => setContributorName(event.target.value)}
          className="mt-2 w-full rounded-md border border-leaf-100 bg-white px-3 py-3 outline-none focus:border-leaf-600"
        />
      </label>

      <label className="block rounded-md border border-dashed border-leaf-200 bg-leaf-50 p-4">
        <span className="text-sm font-semibold text-leaf-900">写真を選択</span>
        <input
          key={fileInputKey}
          type="file"
          accept="image/*"
          required
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          className="mt-3 block w-full text-sm"
        />
      </label>

      <div className="rounded-md bg-fruit-100 p-3 text-sm leading-6 text-leaf-900/76">
        <span className="font-semibold text-leaf-900">投稿前の確認</span>
        <p className="mt-1">投稿写真は承認待ちとして保存され，管理者が確認するまで公開ページには表示されません．</p>
        <p className="mt-1">承認された後の写真は，投稿者側では編集できなくなります．</p>
      </div>

      {message ? <MessageBox message={message} /> : null}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-leaf-700 px-4 py-3 font-semibold text-white disabled:opacity-60"
      >
        {loading ? <Upload size={18} /> : <Send size={18} />}
        {loading ? "投稿中" : "承認待ちで投稿"}
      </button>
    </form>
  );
}

function MessageBox({ message }: { message: Message }) {
  return (
    <p
      className={`rounded-md p-3 text-sm ${
        message.tone === "success"
          ? "bg-leaf-50 text-leaf-800"
          : message.tone === "info"
            ? "bg-fruit-100 text-leaf-900"
            : "bg-red-50 text-red-700"
      }`}
      role="status"
    >
      <span className="inline-flex items-center gap-2">
        {message.tone === "success" ? <CheckCircle2 size={16} /> : null}
        {message.text}
      </span>
    </p>
  );
}
