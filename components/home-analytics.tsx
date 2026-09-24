"use client";

import { useEffect, useState } from "react";
import { AnalyticsSummary } from "@/components/analytics-summary";
import type { SiteAnalytics } from "@/lib/queries";

export function HomeAnalytics() {
  const [analytics, setAnalytics] = useState<SiteAnalytics | null | undefined>(undefined);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/home-analytics", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Analytics could not be loaded");
        return response.json() as Promise<{ analytics: SiteAnalytics | null }>;
      })
      .then((data) => setAnalytics(data.analytics))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        console.error(error);
        setAnalytics(null);
      });
    return () => controller.abort();
  }, []);

  if (analytics === undefined) {
    return <section className="editorial-card h-64 animate-pulse bg-leaf-50/60" aria-label="閲覧データを読み込み中" />;
  }

  return <AnalyticsSummary analytics={analytics} />;
}
