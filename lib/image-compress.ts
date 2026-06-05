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

export type ImageVariantOptions = {
  dateStamp?: string | null;
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

export async function createImageVariantsForUpload(file: File, options: ImageVariantOptions = {}): Promise<ImageVariantSet> {
  if (!file.type.startsWith("image/")) {
    throw new Error("画像ファイルを選択してください．");
  }

  const image = await loadImage(file);
  const baseName = file.name.replace(/\.[^.]+$/, "") || "photo";

  const entries = await Promise.all(
    (Object.entries(imageVariantSettings) as [ImageVariantName, { maxLongEdge: number; quality: number }][])
      .map(async ([name, settings]) => {
        const resized = await resizeLoadedImage(image, file, baseName, settings.maxLongEdge, settings.quality, name, options);
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
  variantName?: ImageVariantName,
  options: ImageVariantOptions = {}
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
  if (options.dateStamp) {
    drawDateStamp(context, options.dateStamp, width, height);
  }

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

function drawDateStamp(context: CanvasRenderingContext2D, text: string, width: number, height: number) {
  const fontSize = Math.min(42, Math.max(14, Math.round(Math.min(width, height) * 0.045)));
  const paddingX = Math.round(fontSize * 0.58);
  const paddingY = Math.round(fontSize * 0.36);
  const margin = Math.round(fontSize * 0.7);

  context.save();
  context.font = `700 ${fontSize}px Arial, sans-serif`;
  context.textBaseline = "alphabetic";

  const metrics = context.measureText(text);
  const textWidth = Math.ceil(metrics.width);
  const textHeight = fontSize;
  const boxWidth = textWidth + paddingX * 2;
  const boxHeight = textHeight + paddingY * 2;
  const x = Math.max(margin, width - boxWidth - margin);
  const y = Math.max(margin, height - boxHeight - margin);

  context.fillStyle = "rgba(0, 0, 0, 0.48)";
  context.fillRect(x, y, boxWidth, boxHeight);
  context.fillStyle = "rgba(255, 255, 255, 0.96)";
  context.shadowColor = "rgba(0, 0, 0, 0.35)";
  context.shadowBlur = Math.max(2, Math.round(fontSize * 0.12));
  context.fillText(text, x + paddingX, y + paddingY + textHeight * 0.82);
  context.restore();
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
