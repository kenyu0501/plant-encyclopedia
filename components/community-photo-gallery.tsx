"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, UserRound, X } from "lucide-react";
import { getPhotoUrl } from "@/lib/photo-url";
import type { Photo } from "@/types/database";

export type CommunityPhotoItem = {
  photo: Photo;
  fruitName: string;
  cultivarName: string | null;
};

export function CommunityPhotoGallery({ items }: { items: CommunityPhotoItem[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeItem = activeIndex === null ? null : items[activeIndex];

  useEffect(() => {
    if (activeIndex === null) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowLeft") setActiveIndex((current) => moveIndex(current, items.length, -1));
      if (event.key === "ArrowRight") setActiveIndex((current) => moveIndex(current, items.length, 1));
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, items.length]);

  if (items.length === 0) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-leaf-900">みんなの写真</h2>
          <p className="mt-1 text-sm text-leaf-900/62">承認された閲覧者投稿です．</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item, index) => (
          <article key={item.photo.id} className="overflow-hidden rounded-lg bg-white/86 shadow-soft ring-1 ring-leaf-100">
            <button
              type="button"
              onClick={() => setActiveIndex(index)}
              className="relative block aspect-[4/3] w-full bg-leaf-100"
              aria-label={`${item.photo.caption ?? item.photo.photo_type ?? "投稿写真"}を拡大表示`}
            >
              <Image
                src={getPhotoUrl(item.photo, "thumb")}
                alt={item.photo.caption ?? item.photo.photo_type ?? "投稿写真"}
                fill
                className="object-cover"
                sizes="(min-width: 640px) 50vw, 100vw"
              />
            </button>
            <CommunityPhotoMeta item={item} />
          </article>
        ))}
      </div>

      {activeItem && activeIndex !== null ? (
        <div
          className="fixed inset-0 z-50 bg-black/86 p-3 text-white sm:p-6"
          role="dialog"
          aria-modal="true"
          onPointerDownCapture={(event) => {
            const target = event.target;
            if (target instanceof Element && target.closest("[data-community-lightbox-interactive]")) return;
            setActiveIndex(null);
          }}
        >
          <button type="button" className="absolute inset-0 z-20 cursor-default" onClick={() => setActiveIndex(null)} aria-label="背景をクリックして閉じる" />

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setActiveIndex(null);
            }}
            className="absolute right-3 top-3 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/18 text-white backdrop-blur transition hover:bg-white/26"
            aria-label="閉じる"
            data-community-lightbox-interactive
          >
            <X size={24} />
          </button>

          {items.length > 1 ? (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setActiveIndex((current) => moveIndex(current, items.length, -1));
                }}
                className="absolute left-3 top-1/2 z-50 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/18 text-white backdrop-blur transition hover:bg-white/26"
                aria-label="前の写真"
                data-community-lightbox-interactive
              >
                <ChevronLeft size={26} />
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setActiveIndex((current) => moveIndex(current, items.length, 1));
                }}
                className="absolute right-3 top-1/2 z-50 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/18 text-white backdrop-blur transition hover:bg-white/26"
                aria-label="次の写真"
                data-community-lightbox-interactive
              >
                <ChevronRight size={26} />
              </button>
            </>
          ) : null}

          <div className="pointer-events-none relative z-30 flex h-full flex-col items-center justify-center gap-3 px-10">
            <div className="pointer-events-auto relative h-[72vh] w-full max-w-5xl" data-community-lightbox-interactive>
              <Image
                src={getPhotoUrl(activeItem.photo, "original")}
                alt={activeItem.photo.caption ?? activeItem.photo.photo_type ?? "投稿写真"}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
            <div className="pointer-events-auto max-w-3xl rounded-lg bg-black/38 p-3 text-sm leading-6 text-white/86" data-community-lightbox-interactive>
              <CommunityPhotoMeta item={activeItem} compact />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function CommunityPhotoMeta({ item, compact = false }: { item: CommunityPhotoItem; compact?: boolean }) {
  const photo = item.photo;
  return (
    <div className={compact ? "space-y-2 text-white/86" : "space-y-3 p-4 text-sm leading-6 text-leaf-900/74"}>
      <div className="flex flex-wrap gap-2">
        {photo.photo_type ? (
          <span className={compact ? "text-white/76" : "rounded-md bg-white px-2 py-1 font-semibold text-leaf-900 ring-1 ring-leaf-100"}>
            {photo.photo_type}
          </span>
        ) : null}
      </div>

      {photo.caption ? <p className={compact ? "text-white" : "font-medium text-leaf-900"}>{photo.caption}</p> : null}

      <div className={compact ? "flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/72" : "flex flex-wrap gap-x-4 gap-y-1 text-xs text-leaf-900/58"}>
        {photo.location_name ? (
          <span className="inline-flex items-center gap-1">
            <MapPin size={13} />
            {photo.location_name}
          </span>
        ) : null}
        {photo.taken_at ? <span>{formatDate(photo.taken_at)}</span> : null}
        {photo.contributor_name ? (
          <span className="inline-flex items-center gap-1">
            <UserRound size={13} />
            {photo.contributor_name}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function formatDate(value: string) {
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${year}/${month}/${day}`;
}

function moveIndex(current: number | null, length: number, direction: -1 | 1) {
  if (current === null || length === 0) return current;
  return (current + direction + length) % length;
}
