"use client";

import { BookOpenText, Heart, Sprout, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const MASCOT_HIDDEN_KEY = "kenchan-mascot-hidden";

type MascotPose = "idle" | "wave" | "eat" | "laugh";

const mascotImages: Record<MascotPose, string> = {
  idle: "/mascot/kenchan-mascot-pixel-v3.png",
  wave: "/mascot/kenchan-mascot-wave.png",
  eat: "/mascot/kenchan-mascot-eat-mango.png",
  laugh: "/mascot/kenchan-mascot-laugh.png"
};

const mascotActions: {
  pose: Exclude<MascotPose, "idle">;
  duration: number;
}[] = [
  { pose: "wave", duration: 1800 },
  { pose: "eat", duration: 2400 },
  { pose: "laugh", duration: 1900 }
];

const MASCOT_INITIAL_IDLE_MS = 2000;
const MASCOT_BETWEEN_ACTIONS_MS = 2000;
const MASCOT_BETWEEN_CYCLES_MS = 6000;

const guideLinks = [
  {
    href: "/fruits",
    label: "果樹・品種を探す",
    description: "図鑑から育てたい果樹を見つけよう",
    icon: BookOpenText
  },
  {
    href: "/favorites",
    label: "お気に入りを見る",
    description: "気になる品種を振り返ろう",
    icon: Heart
  },
  {
    href: "/garden",
    label: "栽培記録をつける",
    description: "育てている株の様子を残そう",
    icon: Sprout
  }
];

export function MascotGuide() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [pose, setPose] = useState<MascotPose>("idle");
  const [allowsMotion, setAllowsMotion] = useState(true);

  useEffect(() => {
    setIsHidden(window.localStorage.getItem(MASCOT_HIDDEN_KEY) === "true");
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setAllowsMotion(!mediaQuery.matches);
    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);
    return () => mediaQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    Object.values(mascotImages)
      .filter((src) => src !== mascotImages.idle)
      .forEach((src) => {
        const image = new window.Image();
        image.src = src;
      });
  }, []);

  useEffect(() => {
    if (!allowsMotion || isHidden) {
      setPose("idle");
      return;
    }

    let actionIndex = 0;
    let timeoutId: number;
    let stopped = false;

    const scheduleNextAction = (idleDuration: number) => {
      timeoutId = window.setTimeout(() => {
        if (stopped) return;
        const action = mascotActions[actionIndex % mascotActions.length];
        setPose(action.pose);
        timeoutId = window.setTimeout(() => {
          if (stopped) return;
          setPose("idle");
          actionIndex += 1;
          const completedCycle = actionIndex % mascotActions.length === 0;
          scheduleNextAction(
            completedCycle ? MASCOT_BETWEEN_CYCLES_MS : MASCOT_BETWEEN_ACTIONS_MS
          );
        }, action.duration);
      }, idleDuration);
    };

    scheduleNextAction(MASCOT_INITIAL_IDLE_MS);

    return () => {
      stopped = true;
      window.clearTimeout(timeoutId);
    };
  }, [allowsMotion, isHidden]);

  if (pathname.startsWith("/admin")) return null;

  function hideMascot() {
    setIsOpen(false);
    setIsHidden(true);
    window.localStorage.setItem(MASCOT_HIDDEN_KEY, "true");
  }

  function showMascot() {
    setIsHidden(false);
    window.localStorage.removeItem(MASCOT_HIDDEN_KEY);
  }

  if (isHidden) {
    return (
      <button
        type="button"
        onClick={showMascot}
        aria-label="図鑑の案内キャラクターを表示"
        className="fixed right-3 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-white text-leaf-700 shadow-soft ring-1 ring-leaf-100 transition hover:-translate-y-0.5 hover:bg-leaf-50"
        style={{ bottom: "calc(5.3rem + env(safe-area-inset-bottom))" }}
      >
        <Sprout size={21} />
      </button>
    );
  }

  return (
    <aside
      className="fixed right-2 z-30 flex flex-col items-end sm:right-5"
      style={{ bottom: "calc(5.15rem + env(safe-area-inset-bottom))" }}
      aria-label="図鑑の案内キャラクター"
    >
      {isOpen ? (
        <div className="mb-1 w-[min(19rem,calc(100vw-1rem))] overflow-hidden rounded-xl bg-white shadow-soft ring-1 ring-leaf-100">
          <div className="flex items-start justify-between gap-3 bg-leaf-50 px-4 py-3">
            <div>
              <p className="font-bold text-leaf-900">何を見にいく？</p>
              <p className="mt-0.5 text-xs text-leaf-900/58">図鑑をご案内します</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="案内を閉じる"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-leaf-700 hover:bg-white"
            >
              <X size={17} />
            </button>
          </div>
          <nav className="space-y-1 p-2" aria-label="キャラクターからの案内">
            {guideLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition hover:bg-leaf-50"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-leaf-100 text-leaf-700">
                    <Icon size={19} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-bold text-leaf-900">{item.label}</span>
                    <span className="mt-0.5 block text-xs leading-5 text-leaf-900/58">
                      {item.description}
                    </span>
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      ) : null}

      <div className="relative">
        <button
          type="button"
          onClick={hideMascot}
          aria-label="案内キャラクターをしまう"
          className="absolute right-0 top-1 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-leaf-700 shadow-sm ring-1 ring-leaf-100 hover:bg-leaf-50"
        >
          <X size={14} />
        </button>
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          aria-expanded={isOpen}
          aria-label={isOpen ? "図鑑の案内を閉じる" : "図鑑の案内を開く"}
          className="mascot-float block rounded-full outline-none focus-visible:ring-2 focus-visible:ring-leaf-600 focus-visible:ring-offset-2"
        >
          <Image
            key={pose}
            src={mascotImages[pose]}
            alt=""
            width={132}
            height={132}
            unoptimized
            priority={false}
            className="mascot-frame-change h-[7.25rem] w-[7.25rem] object-contain sm:h-[8.25rem] sm:w-[8.25rem]"
            style={{ imageRendering: "pixelated" }}
          />
        </button>
      </div>
    </aside>
  );
}
