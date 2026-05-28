"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Leaf, Lock, PlusCircle } from "lucide-react";

const items = [
  { href: "/", label: "ホーム", icon: Home },
  { href: "/fruits", label: "果樹", icon: Leaf },
  { href: "/admin", label: "管理", icon: Lock },
  { href: "/admin/photos", label: "写真", icon: PlusCircle }
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-leaf-100 bg-white/95 px-3 pb-[calc(0.45rem+env(safe-area-inset-bottom))] pt-2 shadow-soft backdrop-blur">
      <div className="mx-auto grid max-w-4xl grid-cols-4 gap-1">
        {items.map((item) => {
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-14 flex-col items-center justify-center rounded-md text-xs font-semibold ${
                active ? "bg-leaf-50 text-leaf-800" : "text-leaf-900/60"
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
