"use client";

import { useEffect } from "react";
import { saveRecentCultivar } from "@/lib/recent-cultivars";

export function RecentCultivarTracker({
  id,
  fruitName,
  cultivarName,
  href
}: {
  id: string;
  fruitName: string;
  cultivarName: string;
  href: string;
}) {
  useEffect(() => {
    saveRecentCultivar({ id, fruitName, cultivarName, href });
  }, [id, fruitName, cultivarName, href]);

  return null;
}
