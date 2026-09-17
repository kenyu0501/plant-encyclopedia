"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Camera, Heart, Home, Leaf, Sprout } from "lucide-react";

const items = [
  { href: "/", label: "ホーム", icon: Home },
  { href: "/fruits", label: "果樹", icon: Leaf },
  { href: "/favorites", label: "保存", icon: Heart },
  { href: "/garden", label: "栽培", icon: Sprout },
  { href: "/submit-photo", label: "投稿", icon: Camera }
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="メインナビゲーション" className="fixed inset-x-0 bottom-0 z-40 border-t border-leaf-100/80 bg-white/95 px-3 pb-[calc(0.45rem+env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_28px_rgba(20,47,39,0.06)] backdrop-blur-xl">
      <div className="mx-auto grid max-w-5xl grid-cols-5 gap-1">
        {items.map((item) => {
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-14 flex-col items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
                active ? "bg-leaf-900 text-white" : "text-leaf-900/58 hover:bg-leaf-50 hover:text-leaf-900"
              }`}
            >
              <Icon size={20} />
              <span className="mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
