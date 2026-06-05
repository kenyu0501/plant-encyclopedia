"use client";

export type CompressedImage = {
  file: File;
  originalBytes: number;
  compressedBytes: number;
  width: number;
  height: number;
};

export type ImageVariantName = "thumb" | "medium" | "original";

export type ImageVariant = CompressedImage & {
  name: ImageVariantName;
  maxLongEdge: number;
};

export type ImageVariantSet = {
  originalBytes: number;
  thumb: ImageVariant;
  medium: ImageVariant;
  original: ImageVariant;
};

const defaultMaxLongEdge = 1600;
const defaultJpegQuality = 0.82;

const imageVariantSettings: Record<ImageVariantName, { maxLongEdge: number; quality: number }> = {
  thumb: { maxLongEdge: 320, quality: 0.68 },
  medium: { maxLongEdge: 900, quality: 0.74 },
  original: { maxLongEdge: 1200, quality: 0.78 }
};

export async function compressImageForUpload(file: File): Promise<CompressedImage> {
  return resizeImage(file, defaultMaxLongEdge, defaultJpegQuality);
}

export async function createImageVariantsForUpload(file: File): Promise<ImageVariantSet> {
  if (!file.type.startsWith("image/")) {
    throw new Error("画像ファイルを選択してください．");
  }

  const image = await loadImage(file);
  const baseName = file.name.replace(/\.[^.]+$/, "") || "photo";

  const entries = await Promise.all(
    (Object.entries(imageVariantSettings) as [ImageVariantName, { maxLongEdge: number; quality: number }][])
      .map(async ([name, settings]) => {
        const resized = await resizeLoadedImage(image, file, baseName, settings.maxLongEdge, settings.quality, name);
        return [name, resized] as const;
      })
  );

  return Object.fromEntries([["originalBytes", file.size], ...entries]) as ImageVariantSet;
}

async function resizeImage(file: File, maxLongEdge: number, jpegQuality: number): Promise<CompressedImage> {
  if (!file.type.startsWith("image/")) {
    throw new Error("画像ファイルを選択してください．");
  }

  const image = await loadImage(file);
  const baseName = file.name.replace(/\.[^.]+$/, "") || "photo";
  return resizeLoadedImage(image, file, baseName, maxLongEdge, jpegQuality);
}

async function resizeLoadedImage(
  image: HTMLImageElement,
  file: File,
  baseName: string,
  maxLongEdge: number,
  jpegQuality: number,
  variantName?: ImageVariantName
): Promise<CompressedImage | ImageVariant> {
  const scale = Math.min(1, maxLongEdge / Math.max(image.naturalWidth, image.naturalHeight));
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("画像を圧縮できませんでした．");
  }

  context.drawImage(image, 0, 0, width, height);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (result) resolve(result);
        else reject(new Error("画像を書き出せませんでした．"));
      },
      "image/jpeg",
      jpegQuality
    );
  });

  const compressedFile = new File([blob], `${baseName}${variantName ? `-${variantName}` : ""}.jpg`, {
    type: "image/jpeg",
    lastModified: Date.now()
  });

  const result = {
    file: compressedFile,
    originalBytes: file.size,
    compressedBytes: compressedFile.size,
    width,
    height
  };

  return variantName ? { ...result, name: variantName, maxLongEdge } : result;
}

export function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}

export function formatVariantSummary(variants: ImageVariantSet) {
  return `thumb ${formatBytes(variants.thumb.compressedBytes)} / ${variants.thumb.width}x${variants.thumb.height}px，medium ${formatBytes(
    variants.medium.compressedBytes
  )} / ${variants.medium.width}x${variants.medium.height}px，original ${formatBytes(variants.original.compressedBytes)} / ${variants.original.width}x${variants.original.height}px`;
}

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("画像を読み込めませんでした．別の形式で試してください．"));
    };

    image.src = url;
  });
}
