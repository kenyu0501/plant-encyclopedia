"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { getPhotoUrl } from "@/lib/photo-url";
import type { Photo } from "@/types/database";

export function PhotoLightboxGallery({
  photos,
  altFallback,
  gridClassName = "grid grid-cols-2 gap-3 sm:grid-cols-3",
  aspectClassName = "aspect-square",
  sizes = "(min-width: 640px) 33vw, 50vw"
}: {
  photos: Photo[];
  altFallback: string;
  gridClassName?: string;
  aspectClassName?: string;
  sizes?: string;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activePhoto = activeIndex === null ? null : photos[activeIndex];

  useEffect(() => {
    if (activeIndex === null) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowLeft") setActiveIndex((current) => moveIndex(current, photos.length, -1));
      if (event.key === "ArrowRight") setActiveIndex((current) => moveIndex(current, photos.length, 1));
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, photos.length]);

  if (photos.length === 0) return null;

  return (
    <>
      <div className={gridClassName}>
        {photos.map((photo, index) => (
          <figure key={photo.id} className="overflow-hidden rounded-lg bg-white/84 ring-1 ring-leaf-100">
            <button
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative block w-full ${aspectClassName} bg-leaf-100`}
              aria-label={`${photo.caption ?? altFallback}を拡大表示`}
            >
              <Image src={getPhotoUrl(photo, "thumb")} alt={photo.caption ?? altFallback} fill className="object-cover" sizes={sizes} />
              <DateBadge photo={photo} />
            </button>
            {photo.caption || photo.photo_type ? (
              <figcaption className="space-y-1 p-2 text-xs leading-5 text-leaf-900/68">
                {photo.photo_type ? <span className="inline-flex rounded-md bg-leaf-50 px-2 py-1 font-semibold">{photo.photo_type}</span> : null}
                {photo.caption ? <p>{photo.caption}</p> : null}
              </figcaption>
            ) : null}
          </figure>
        ))}
      </div>

      {activePhoto && activeIndex !== null ? (
        <div
          className="fixed inset-0 z-50 bg-black/86 p-3 text-white sm:p-6"
          role="dialog"
          aria-modal="true"
          onPointerDownCapture={(event) => {
            const target = event.target;
            if (target instanceof HTMLElement && target.closest("[data-lightbox-interactive]")) return;
            setActiveIndex(null);
          }}
        >
          <button
            type="button"
            className="absolute inset-0 z-0 cursor-default"
            onClick={() => setActiveIndex(null)}
            aria-label="背景をクリックして閉じる"
          />

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setActiveIndex(null);
            }}
            className="absolute right-3 top-3 z-30 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/18 text-white backdrop-blur transition hover:bg-white/26"
            aria-label="閉じる"
            data-lightbox-interactive
          >
            <X size={24} />
          </button>

          {photos.length > 1 ? (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setActiveIndex((current) => moveIndex(current, photos.length, -1));
                }}
                className="absolute left-3 top-1/2 z-30 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/18 text-white backdrop-blur transition hover:bg-white/26"
                aria-label="前の写真"
                data-lightbox-interactive
              >
                <ChevronLeft size={26} />
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setActiveIndex((current) => moveIndex(current, photos.length, 1));
                }}
                className="absolute right-3 top-1/2 z-30 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/18 text-white backdrop-blur transition hover:bg-white/26"
                aria-label="次の写真"
                data-lightbox-interactive
              >
                <ChevronRight size={26} />
              </button>
            </>
          ) : null}

          <div className="pointer-events-none relative z-10 flex h-full flex-col items-center justify-center gap-3 px-10">
            <div className="pointer-events-auto relative h-[78vh] w-full max-w-5xl" data-lightbox-interactive>
              <Image
                src={getPhotoUrl(activePhoto, "original")}
                alt={activePhoto.caption ?? altFallback}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
              <DateBadge photo={activePhoto} className="bottom-3 right-3 text-sm" />
            </div>
            {activePhoto.caption || activePhoto.photo_type ? (
              <div className="pointer-events-auto max-w-3xl text-center text-sm leading-6 text-white/82" data-lightbox-interactive>
                {activePhoto.photo_type ? <span className="font-semibold">{activePhoto.photo_type}</span> : null}
                {activePhoto.caption ? <p>{activePhoto.caption}</p> : null}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}

function moveIndex(current: number | null, length: number, direction: -1 | 1) {
  if (current === null || length === 0) return current;
  return (current + direction + length) % length;
}

function DateBadge({ photo, className = "" }: { photo: Photo; className?: string }) {
  const label = getPhotoDateLabel(photo);
  if (!label) return null;
  return (
    <span className={`pointer-events-none absolute bottom-2 right-2 z-10 rounded-sm bg-black/55 px-2 py-1 text-xs font-bold leading-none text-white shadow-sm ${className}`}>
      {label}
    </span>
  );
}

function getPhotoDateLabel(photo: Photo) {
  if (!photo.taken_at) return null;
  const [year, month, day] = photo.taken_at.slice(0, 10).split("-");
  if (!year || !month || !day) return null;
  return `${year}/${month}/${day}`;
}
