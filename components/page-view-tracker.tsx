"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    const supabase = createClient();
    const path = `${window.location.pathname}${window.location.search}`;

    void supabase.rpc("track_page_view", { p_path: path });
  }, [pathname]);

  return null;
}
