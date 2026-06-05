import type { Photo } from "@/types/database";

export function PhotoDateBadge({ photo, className = "" }: { photo: Photo; className?: string }) {
  const label = getPhotoDateLabel(photo);
  if (!label) return null;

  return (
    <span
      className={`pointer-events-none absolute bottom-2 right-2 z-10 rounded-sm bg-black/55 px-2 py-1 text-xs font-bold leading-none text-white shadow-sm ${className}`}
    >
      {label}
    </span>
  );
}

export function getPhotoDateLabel(photo: Photo) {
  if (!photo.taken_at) return null;
  const datePart = photo.taken_at.slice(0, 10);
  const [year, month, day] = datePart.split("-");
  if (!year || !month || !day) return null;
  return `${year}/${month}/${day}`;
}
