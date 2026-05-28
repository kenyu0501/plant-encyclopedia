"use client";

export type CompressedImage = {
  file: File;
  originalBytes: number;
  compressedBytes: number;
  width: number;
  height: number;
};

const maxLongEdge = 1600;
const jpegQuality = 0.82;

export async function compressImageForUpload(file: File): Promise<CompressedImage> {
  if (!file.type.startsWith("image/")) {
    throw new Error("画像ファイルを選択してください。");
  }

  const image = await loadImage(file);
  const scale = Math.min(1, maxLongEdge / Math.max(image.naturalWidth, image.naturalHeight));
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("画像を圧縮できませんでした。");
  }

  context.drawImage(image, 0, 0, width, height);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (result) resolve(result);
        else reject(new Error("画像を書き出せませんでした。"));
      },
      "image/jpeg",
      jpegQuality
    );
  });

  const baseName = file.name.replace(/\.[^.]+$/, "") || "photo";
  const compressedFile = new File([blob], `${baseName}.jpg`, {
    type: "image/jpeg",
    lastModified: Date.now()
  });

  return {
    file: compressedFile,
    originalBytes: file.size,
    compressedBytes: compressedFile.size,
    width,
    height
  };
}

export function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
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
      reject(new Error("画像を読み込めませんでした。別の形式で試してください。"));
    };

    image.src = url;
  });
}
