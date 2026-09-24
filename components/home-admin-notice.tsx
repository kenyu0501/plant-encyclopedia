"use client";

import { useEffect, useState } from "react";
import { PendingSubmissionsNotice } from "@/components/pending-submissions-notice";

export function HomeAdminNotice() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/home-admin-status", { cache: "no-store", signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Admin status could not be loaded");
        return response.json() as Promise<{ pendingViewerPhotoCount?: number }>;
      })
      .then((data) => setCount(data.pendingViewerPhotoCount ?? 0))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        console.error(error);
      });
    return () => controller.abort();
  }, []);

  return <PendingSubmissionsNotice count={count} />;
}
