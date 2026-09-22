"use client";

import { useEffect } from "react";

declare global {
  interface Window { adsbygoogle?: Record<string, unknown>[]; }
}

export function AdSlot({ slot, format = "auto", className = "" }: { slot?: string; format?: "auto" | "fluid" | "rectangle"; className?: string }) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  useEffect(() => {
    if (!client || !slot) return;
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch { /* Ad blocker or duplicate initialization. */ }
  }, [client, slot]);
  if (!client || !slot) return null;
  return (
    <aside aria-label="広告" className={`overflow-hidden text-center ${className}`}>
      <span className="mb-1 block text-[9px] tracking-widest text-leaf-900/35">ADVERTISEMENT</span>
      <ins className="adsbygoogle block" style={{ display: "block" }} data-ad-client={client} data-ad-slot={slot} data-ad-format={format} data-full-width-responsive="true" />
    </aside>
  );
}
