"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

export function ArticleLikeButton({ articleId, initialCount }: { articleId: string; initialCount: number }) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    if (loading) return;
    setLoading(true);
    try {
      const response = await fetch("/api/article-like", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ articleId }) });
      if (!response.ok) return;
      const result = await response.json() as { liked: boolean; likes: number };
      setLiked(result.liked);
      setCount(result.likes);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button type="button" onClick={toggle} disabled={loading} aria-pressed={liked} className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-bold transition ${liked ? "border-rose-200 bg-rose-50 text-rose-700" : "border-leaf-200 bg-white text-leaf-800"}`}>
      <Heart size={18} fill={liked ? "currentColor" : "none"} /> LIKE {count}
    </button>
  );
}
