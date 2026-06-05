"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { ImageVariantSet } from "@/lib/image-compress";

export type UploadedPhotoVariants = {
  image_url: string;
  storage_path: string;
  thumbnail_url: string;
  thumbnail_storage_path: string;
  medium_url: string;
  medium_storage_path: string;
  original_url: string;
  original_storage_path: string;
};

export async function uploadPhotoVariants(
  supabase: SupabaseClient,
  basePath: string,
  variants: ImageVariantSet
): Promise<{ data?: UploadedPhotoVariants; error?: string }> {
  const uploadedPaths: string[] = [];

  const paths = {
    thumb: `${basePath}/thumb.jpg`,
    medium: `${basePath}/medium.jpg`,
    original: `${basePath}/original.jpg`
  };

  for (const variantName of ["thumb", "medium", "original"] as const) {
    const { error } = await supabase.storage.from("fruit-photos").upload(paths[variantName], variants[variantName].file, {
      cacheControl: variantName === "thumb" ? "604800" : "86400",
      upsert: false
    });

    if (error) {
      if (uploadedPaths.length > 0) {
        await supabase.storage.from("fruit-photos").remove(uploadedPaths);
      }
      return { error: error.message };
    }

    uploadedPaths.push(paths[variantName]);
  }

  const urls = {
    thumb: supabase.storage.from("fruit-photos").getPublicUrl(paths.thumb).data.publicUrl,
    medium: supabase.storage.from("fruit-photos").getPublicUrl(paths.medium).data.publicUrl,
    original: supabase.storage.from("fruit-photos").getPublicUrl(paths.original).data.publicUrl
  };

  return {
    data: {
      image_url: urls.medium,
      storage_path: paths.medium,
      thumbnail_url: urls.thumb,
      thumbnail_storage_path: paths.thumb,
      medium_url: urls.medium,
      medium_storage_path: paths.medium,
      original_url: urls.original,
      original_storage_path: paths.original
    }
  };
}
