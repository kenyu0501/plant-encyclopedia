import type { Photo } from "@/types/database";
import { getPhotoUrl } from "@/lib/photo-url";
import { getAbsoluteUrl } from "@/lib/site-url";

export type BreadcrumbItem = {
  name: string;
  url: string;
};

export function buildBreadcrumbList(id: string, items: BreadcrumbItem[]) {
  return {
    "@type": "BreadcrumbList",
    "@id": id,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

export function buildImageObjects({
  photos,
  pageUrl,
  subjectId,
  subjectName
}: {
  photos: Photo[];
  pageUrl: string;
  subjectId: string;
  subjectName: string;
}) {
  return photos.map((photo, index) => ({
    "@type": "ImageObject",
    "@id": `${pageUrl}#image-${photo.id}`,
    contentUrl: getAbsoluteUrl(getPhotoUrl(photo, "original")),
    thumbnailUrl: getAbsoluteUrl(getPhotoUrl(photo, "thumb")),
    caption: photo.caption ?? subjectName,
    representativeOfPage: index === 0,
    about: { "@id": subjectId },
    ...(photo.taken_at ? { dateCreated: photo.taken_at } : {}),
    ...(photo.contributor_name
      ? { creator: { "@type": "Person", name: photo.contributor_name } }
      : {}),
    ...(photo.location_name ? { contentLocation: { "@type": "Place", name: photo.location_name } } : {})
  }));
}
