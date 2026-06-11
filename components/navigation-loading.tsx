"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { FruitLoading } from "@/components/fruit-loading";

export function NavigationLoading() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);
  const showTimer = useRef<number | null>(null);
  const hideTimer = useRef<number | null>(null);

  useEffect(() => {
    const clearTimers = () => {
      if (showTimer.current) window.clearTimeout(showTimer.current);
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
      showTimer.current = null;
      hideTimer.current = null;
    };

    const hide = () => {
      clearTimers();
      setVisible(false);
    };

    hideTimer.current = window.setTimeout(hide, 180);
    return clearTimers;
  }, [pathname, searchParams]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (event.button !== 0) return;

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;

      const nextUrl = new URL(anchor.href, window.location.href);
      if (nextUrl.origin !== window.location.origin) return;
      if (nextUrl.pathname === window.location.pathname && nextUrl.search === window.location.search) return;

      if (showTimer.current) window.clearTimeout(showTimer.current);
      showTimer.current = window.setTimeout(() => setVisible(true), 60);
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
      hideTimer.current = window.setTimeout(() => setVisible(false), 6000);
    };

    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      if (showTimer.current) window.clearTimeout(showTimer.current);
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-leaf-950/18 px-5 backdrop-blur-[2px]" role="status" aria-live="polite">
      <FruitLoading label="ページをひらいています" />
    </div>
  );
}
