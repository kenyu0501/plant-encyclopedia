"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";

type Message = {
  tone: "success" | "error" | "info";
  text: string;
};

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage({ tone: "info", text: "ログイン情報を確認しています。" });
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoading(false);
      setMessage({ tone: "error", text: `ログインに失敗しました: ${error.message}` });
      return;
    }

    const userId = data.user?.id;
    if (!userId) {
      setLoading(false);
      setMessage({ tone: "error", text: "ログインできましたが、ユーザー情報を取得できませんでした。" });
      return;
    }

    const configuredAdminIds =
      process.env.NEXT_PUBLIC_ADMIN_USER_IDS?.split(",").map((id) => id.trim()).filter(Boolean) ?? [];
    if (configuredAdminIds.includes(userId)) {
      setMessage({ tone: "success", text: "管理者としてログインしました。管理画面へ移動します。" });
      setTimeout(() => {
        router.replace("/admin");
        router.refresh();
      }, 700);
      return;
    }

    setMessage({ tone: "info", text: "ログイン成功。管理者権限を確認しています。" });
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .maybeSingle();

    if (profileError) {
      setLoading(false);
      setMessage({ tone: "error", text: `管理者権限を確認できませんでした: ${profileError.message}` });
      return;
    }

    if (profile?.role !== "admin") {
      setLoading(false);
      setMessage({
        tone: "error",
        text: `ログインは成功しましたが、このユーザーは管理者に登録されていません。User UID: ${userId}`
      });
      return;
    }

    setMessage({ tone: "success", text: "管理者としてログインしました。管理画面へ移動します。" });
    setTimeout(() => {
      router.replace("/admin");
      router.refresh();
    }, 700);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-lg bg-white/86 p-5 ring-1 ring-leaf-100">
      <label className="block">
        <span className="text-sm font-semibold text-leaf-900">メールアドレス</span>
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-2 w-full rounded-md border border-leaf-100 bg-white px-3 py-3 outline-none focus:border-leaf-600"
        />
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-leaf-900">パスワード</span>
        <input
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 w-full rounded-md border border-leaf-100 bg-white px-3 py-3 outline-none focus:border-leaf-600"
        />
      </label>
      {message ? (
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
          {message.text}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-leaf-700 px-4 py-3 font-semibold text-white disabled:opacity-60"
      >
        <LogIn size={18} />
        {loading ? "ログイン中" : "ログイン"}
      </button>
    </form>
  );
}
