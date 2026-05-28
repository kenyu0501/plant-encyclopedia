"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ImagePlus, Leaf, LogOut, PlaySquare, Sprout } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";

export function AdminActions() {
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/");
    router.refresh();
  }

  return (
    <div className="grid gap-3 sm:grid-cols-4">
      <AdminLink href="/admin/fruits/new" icon={<Leaf size={18} />} label="果樹追加" />
      <AdminLink href="/admin/cultivars/new" icon={<Sprout size={18} />} label="品種追加" />
      <AdminLink href="/admin/photos" icon={<ImagePlus size={18} />} label="写真追加" />
      <AdminLink href="/admin/videos" icon={<PlaySquare size={18} />} label="YouTube追加" />
      <button
        type="button"
        onClick={signOut}
        className="inline-flex items-center justify-center gap-2 rounded-md border border-leaf-200 bg-white px-4 py-3 text-sm font-semibold text-leaf-800 sm:col-span-4"
      >
        <LogOut size={18} />
        ログアウト
      </button>
    </div>
  );
}

function AdminLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="inline-flex items-center justify-center gap-2 rounded-md bg-leaf-700 px-4 py-3 text-sm font-semibold text-white">
      {icon}
      {label}
    </Link>
  );
}
