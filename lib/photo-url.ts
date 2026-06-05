import type { Photo } from "@/types/database";

export function getPhotoUrl(photo: Photo, size: "thumb" | "medium" | "original" = "medium") {
  if (size === "thumb") return photo.thumbnail_url ?? photo.medium_url ?? photo.image_url;
  if (size === "original") return photo.original_url ?? photo.medium_url ?? photo.image_url;
  return photo.medium_url ?? photo.image_url;
}

export function getPhotoStoragePaths(photo: Photo) {
  return Array.from(
    new Set(
      [
        photo.storage_path,
        photo.thumbnail_storage_path,
        photo.medium_storage_path,
        photo.original_storage_path
      ].filter((path): path is string => Boolean(path))
    )
  );
}
