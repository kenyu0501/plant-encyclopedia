"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const VIEW_DEDUPLICATION_MS = 30 * 60 * 1000;
const VIEW_STORAGE_PREFIX = "kenyu-page-view:";

export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin") || pathname === "/offline") return;

    const path = window.location.pathname;
    const storageKey = `${VIEW_STORAGE_PREFIX}${path}`;
    const now = Date.now();

    try {
      const lastViewedAt = Number(window.localStorage.getItem(storageKey));
      if (Number.isFinite(lastViewedAt) && now - lastViewedAt < VIEW_DEDUPLICATION_MS) return;
      window.localStorage.setItem(storageKey, String(now));
    } catch {
      // プライベートブラウズ等でlocalStorageが使えなくてもPV記録自体は継続します。
    }

    void fetch("/api/page-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
      cache: "no-store",
      keepalive: true
    }).then((response) => {
      if (response.ok) return;
      try {
        if (window.localStorage.getItem(storageKey) === String(now)) window.localStorage.removeItem(storageKey);
      } catch {
        // localStorageが利用できない場合は何もしません。
      }
    }).catch(() => {
      try {
        if (window.localStorage.getItem(storageKey) === String(now)) window.localStorage.removeItem(storageKey);
      } catch {
        // localStorageが利用できない場合は何もしません。
      }
    });
  }, [pathname]);

  return null;
}
