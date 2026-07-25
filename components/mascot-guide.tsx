"use client";

import { BookOpenText, Heart, Sprout, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type MascotPose = "idle" | "wave" | "eat" | "laugh";

const mascotImages: Record<MascotPose, string> = {
  idle: "/mascot/kenchan-mascot-pixel-v3.png",
  wave: "/mascot/kenchan-mascot-wave.png",
  eat: "/mascot/kenchan-mascot-eat-mango.png",
  laugh: "/mascot/kenchan-mascot-laugh.png"
};

const mascotPoseTransforms: Record<MascotPose, string> = {
  idle: "scale(1) rotate(0deg)",
  wave: "scale(1.012) rotate(-1deg)",
  eat: "scale(1.01) rotate(0deg)",
  laugh: "scale(1.018) rotate(0deg)"
};

const mascotActions: {
  pose: Exclude<MascotPose, "idle">;
  duration: number;
}[] = [
  { pose: "wave", duration: 1800 },
  { pose: "eat", duration: 2400 },
  { pose: "laugh", duration: 1900 }
];

const MASCOT_INITIAL_IDLE_MS = 3000;
const MASCOT_BETWEEN_ACTIONS_MS = 5000;
const MASCOT_BETWEEN_CYCLES_MS = 9000;
const MASCOT_INITIAL_SPEECH_DELAY_MS = 8000;
const MASCOT_SPEECH_VISIBLE_MS = 5200;
const MASCOT_SPEECH_INTERVAL_MIN_MS = 20000;
const MASCOT_SPEECH_INTERVAL_RANGE_MS = 15000;

const mascotMessages = [
  "気になる品種を探してみよう！",
  "お気に入りに保存できるよ",
  "栽培記録もつけてみてね",
  "今日も元気に育ってるかな？",
  "マンゴー、おいしいね！",
  "シェアも大歓迎！ありがとー！！"
];

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
  const [pose, setPose] = useState<MascotPose>("idle");
  const [allowsMotion, setAllowsMotion] = useState(true);
  const [isJumping, setIsJumping] = useState(false);
  const [imagesReady, setImagesReady] = useState(false);
  const [speechMessage, setSpeechMessage] = useState<string | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setAllowsMotion(!mediaQuery.matches);
    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);
    return () => mediaQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const preloadImages = Object.values(mascotImages).map((src) => {
      const image = new window.Image();
      image.src = src;
      return image.decode().catch(() => undefined);
    });

    void Promise.all(preloadImages).then(() => {
      if (!cancelled) setImagesReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!imagesReady || !allowsMotion) {
      setPose("idle");
      setIsJumping(false);
      return;
    }

    let actionIndex = 0;
    let timeoutId: number;
    let stopped = false;

    const scheduleNextAction = (idleDuration: number) => {
      timeoutId = window.setTimeout(() => {
        if (stopped) return;
        const action = mascotActions[actionIndex % mascotActions.length];
        const cycleIndex = Math.floor(actionIndex / mascotActions.length);
        setIsJumping(action.pose === "laugh" && cycleIndex % 2 === 0);
        setPose(action.pose);
        timeoutId = window.setTimeout(() => {
          if (stopped) return;
          setPose("idle");
          setIsJumping(false);
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
  }, [allowsMotion, imagesReady]);

  useEffect(() => {
    if (isOpen) {
      setSpeechMessage(null);
      return;
    }

    let messageIndex = 0;
    let showTimeoutId: number;
    let hideTimeoutId: number;
    let stopped = false;

    const scheduleMessage = (delay: number) => {
      showTimeoutId = window.setTimeout(() => {
        if (stopped) return;

        setSpeechMessage(mascotMessages[messageIndex % mascotMessages.length]);
        messageIndex += 1;

        hideTimeoutId = window.setTimeout(() => {
          if (stopped) return;

          setSpeechMessage(null);
          const nextDelay =
            MASCOT_SPEECH_INTERVAL_MIN_MS +
            Math.random() * MASCOT_SPEECH_INTERVAL_RANGE_MS;
          scheduleMessage(nextDelay);
        }, MASCOT_SPEECH_VISIBLE_MS);
      }, delay);
    };

    scheduleMessage(allowsMotion ? MASCOT_INITIAL_SPEECH_DELAY_MS : 12000);

    return () => {
      stopped = true;
      window.clearTimeout(showTimeoutId);
      window.clearTimeout(hideTimeoutId);
    };
  }, [allowsMotion, isOpen]);

  if (pathname.startsWith("/admin")) return null;

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
        {speechMessage ? (
          <div
            className="mascot-speech-bubble absolute bottom-[calc(100%-0.45rem)] right-1 z-10 w-max max-w-[min(15rem,calc(100vw-1rem))] rounded-2xl bg-white px-4 py-2.5 text-sm font-bold leading-5 text-leaf-900 shadow-soft ring-1 ring-leaf-100"
          >
            <p>{speechMessage}</p>
            <span
              aria-hidden="true"
              className="absolute -bottom-2 right-8 h-4 w-4 rotate-45 border-b border-r border-leaf-100 bg-white"
            />
          </div>
        ) : null}
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          aria-expanded={isOpen}
          aria-label={isOpen ? "図鑑の案内を閉じる" : "図鑑の案内を開く"}
          className="mascot-float block rounded-full outline-none focus-visible:ring-2 focus-visible:ring-leaf-600 focus-visible:ring-offset-2"
        >
          <span
            className={`relative block h-[7.25rem] w-[7.25rem] sm:h-[8.25rem] sm:w-[8.25rem] ${
              isJumping ? "mascot-celebrate" : ""
            }`}
          >
            <Image
              src={mascotImages[pose]}
              alt=""
              fill
              unoptimized
              priority={false}
              sizes="(min-width: 640px) 132px, 116px"
              className="mascot-pose-image object-contain"
              style={{
                imageRendering: "pixelated",
                transform: mascotPoseTransforms[pose]
              }}
            />
          </span>
        </button>
      </div>
    </aside>
  );
}
