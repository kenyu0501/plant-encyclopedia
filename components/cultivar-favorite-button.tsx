"use client";

import { Check, Heart, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  CULTIVAR_FAVORITES_EVENT,
  favoriteStatusOptions,
  getFavoriteStatus,
  getFavoriteStatusLabel,
  removeFavoriteCultivar,
  saveFavoriteCultivar,
  type FavoriteStatus
} from "@/lib/cultivar-favorites";

type Props = {
  id: string;
  fruitName: string;
  cultivarName: string;
  href: string;
};

export function CultivarFavoriteButton({ id, fruitName, cultivarName, href }: Props) {
  const [status, setStatus] = useState<FavoriteStatus | null>(null);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const refresh = () => setStatus(getFavoriteStatus(id));
    refresh();
    window.addEventListener(CULTIVAR_FAVORITES_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(CULTIVAR_FAVORITES_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [id]);

  useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const chooseStatus = (nextStatus: FavoriteStatus) => {
    saveFavoriteCultivar({ id, fruitName, cultivarName, href }, nextStatus);
    setStatus(nextStatus);
    setOpen(false);
  };

  const remove = () => {
    removeFavoriteCultivar(id);
    setStatus(null);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={status ? `お気に入り：${getFavoriteStatusLabel(status)}` : "お気に入りに保存"}
        className={[
          "inline-flex min-h-10 items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold transition",
          status
            ? "border-fruit-200 bg-fruit-50 text-fruit-700"
            : "border-leaf-200 bg-white text-leaf-800"
        ].join(" ")}
      >
        <Heart size={17} fill={status ? "currentColor" : "none"} />
        {status ? getFavoriteStatusLabel(status) : "保存"}
      </button>

      {open ? (
        <div
          role="menu"
          aria-label={`${cultivarName}の保存先`}
          className="absolute right-0 top-[calc(100%+0.5rem)] z-30 w-64 overflow-hidden rounded-lg bg-white shadow-xl ring-1 ring-leaf-100"
        >
          <div className="border-b border-leaf-100 px-4 py-3">
            <p className="text-sm font-bold text-leaf-900">リストに保存</p>
            <p className="mt-1 truncate text-xs text-leaf-900/54">{cultivarName}</p>
          </div>
          <div className="p-2">
            {favoriteStatusOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                role="menuitemradio"
                aria-checked={status === option.value}
                onClick={() => chooseStatus(option.value)}
                className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-left transition hover:bg-leaf-50"
              >
                <span
                  className={[
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border",
                    status === option.value
                      ? "border-leaf-700 bg-leaf-700 text-white"
                      : "border-leaf-200 text-transparent"
                  ].join(" ")}
                >
                  <Check size={14} />
                </span>
                <span>
                  <span className="block text-sm font-bold text-leaf-900">{option.label}</span>
                  <span className="mt-0.5 block text-xs text-leaf-900/50">{option.description}</span>
                </span>
              </button>
            ))}
          </div>
          {status ? (
            <div className="border-t border-leaf-100 p-2">
              <button
                type="button"
                role="menuitem"
                onClick={remove}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50"
              >
                <Trash2 size={16} />
                リストから削除
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
