"use client";

import { useEffect, useState } from "react";
import { AtSign, Check, Copy, MessageCircle, Share2 } from "lucide-react";

type ShareButtonsProps = {
  title: string;
  text: string;
  url: string;
};

export function ShareButtons({ title, text, url }: ShareButtonsProps) {
  const [canUseNativeShare, setCanUseNativeShare] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCanUseNativeShare(typeof navigator.share === "function");
  }, []);

  const conciseText = text.length > 80 ? `${text.slice(0, 79)}…` : text;
  const shareText = `${title}\n${conciseText}`.trim();
  const xUrl = `https://x.com/intent/tweet?${new URLSearchParams({ text: shareText, url }).toString()}`;
  const threadsUrl = `https://www.threads.net/intent/post?${new URLSearchParams({ text: `${shareText}\n${url}` }).toString()}`;
  const lineUrl = `https://social-plugins.line.me/lineit/share?${new URLSearchParams({ url, text: title }).toString()}`;

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  async function nativeShare() {
    try {
      await navigator.share({ title, text: conciseText, url });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
    }
  }

  return (
    <section aria-label="このページを共有" className="rounded-lg bg-white/76 p-3 ring-1 ring-leaf-100">
      <div className="flex flex-wrap items-center gap-2">
        <p className="mr-1 text-xs font-bold text-leaf-900/70">このページを共有</p>
        <ShareLink href={xUrl} label="Xで共有" icon={<span className="text-base font-black leading-none">X</span>} />
        <ShareLink href={threadsUrl} label="Threadsで共有" icon={<AtSign size={16} />} />
        <ShareLink href={lineUrl} label="LINEで共有" icon={<MessageCircle size={16} />} />
        <button
          type="button"
          onClick={copyUrl}
          className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-leaf-200 bg-white px-3 py-1.5 text-xs font-semibold text-leaf-800 transition hover:bg-leaf-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf-500"
          aria-label="ページのリンクをコピー"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? "コピー済み" : "リンク"}
        </button>
        {canUseNativeShare ? (
          <button
            type="button"
            onClick={nativeShare}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-leaf-700 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-leaf-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf-500"
          >
            <Share2 size={16} />
            その他
          </button>
        ) : null}
      </div>
      <span className="sr-only" aria-live="polite">
        {copied ? "リンクをコピーしました" : ""}
      </span>
    </section>
  );
}

function ShareLink({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-leaf-200 bg-white px-3 py-1.5 text-xs font-semibold text-leaf-800 transition hover:bg-leaf-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf-500"
    >
      {icon}
      {label.replace("で共有", "")}
    </a>
  );
}
