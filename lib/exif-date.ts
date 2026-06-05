"use client";

const dateTags = new Set([0x9003, 0x9004, 0x0132]);

export async function extractExifDateInputValue(file: File) {
  if (!isJpeg(file)) return null;

  const buffer = await file.arrayBuffer();
  const view = new DataView(buffer);
  if (view.byteLength < 4 || view.getUint16(0) !== 0xffd8) return null;

  let offset = 2;
  while (offset + 4 < view.byteLength) {
    if (view.getUint8(offset) !== 0xff) break;
    const marker = view.getUint8(offset + 1);
    const length = view.getUint16(offset + 2);
    if (length < 2 || offset + 2 + length > view.byteLength) break;

    if (marker === 0xe1 && hasExifHeader(view, offset + 4)) {
      return readExifDate(view, offset + 10, length - 8);
    }

    offset += 2 + length;
  }

  return null;
}

function isJpeg(file: File) {
  return file.type === "image/jpeg" || file.type === "image/jpg" || /\.jpe?g$/i.test(file.name);
}

function hasExifHeader(view: DataView, offset: number) {
  return (
    view.getUint8(offset) === 0x45 &&
    view.getUint8(offset + 1) === 0x78 &&
    view.getUint8(offset + 2) === 0x69 &&
    view.getUint8(offset + 3) === 0x66 &&
    view.getUint8(offset + 4) === 0x00 &&
    view.getUint8(offset + 5) === 0x00
  );
}

function readExifDate(view: DataView, tiffStart: number, tiffLength: number) {
  if (tiffStart + 8 > view.byteLength) return null;
  const byteOrder = view.getUint16(tiffStart);
  const littleEndian = byteOrder === 0x4949;
  if (!littleEndian && byteOrder !== 0x4d4d) return null;

  const firstIfdOffset = view.getUint32(tiffStart + 4, littleEndian);
  const result = readIfdForDate(view, tiffStart, tiffLength, firstIfdOffset, littleEndian, 0);
  return result ? toDateInputValue(result) : null;
}

function readIfdForDate(
  view: DataView,
  tiffStart: number,
  tiffLength: number,
  ifdOffset: number,
  littleEndian: boolean,
  depth: number
): string | null {
  if (depth > 4) return null;
  const ifdStart = tiffStart + ifdOffset;
  if (ifdStart + 2 > view.byteLength || ifdOffset >= tiffLength) return null;

  const entryCount = view.getUint16(ifdStart, littleEndian);
  for (let index = 0; index < entryCount; index += 1) {
    const entryOffset = ifdStart + 2 + index * 12;
    if (entryOffset + 12 > view.byteLength) return null;

    const tag = view.getUint16(entryOffset, littleEndian);
    const type = view.getUint16(entryOffset + 2, littleEndian);
    const count = view.getUint32(entryOffset + 4, littleEndian);
    const valueOffset = view.getUint32(entryOffset + 8, littleEndian);

    if (dateTags.has(tag) && type === 2) {
      const value = readAsciiValue(view, tiffStart, tiffLength, entryOffset + 8, valueOffset, count);
      if (value) return value;
    }

    if (tag === 0x8769 && valueOffset < tiffLength) {
      const nested = readIfdForDate(view, tiffStart, tiffLength, valueOffset, littleEndian, depth + 1);
      if (nested) return nested;
    }
  }

  return null;
}

function readAsciiValue(
  view: DataView,
  tiffStart: number,
  tiffLength: number,
  inlineOffset: number,
  valueOffset: number,
  count: number
) {
  const start = count <= 4 ? inlineOffset : tiffStart + valueOffset;
  if (start < tiffStart || start + count > tiffStart + tiffLength || start + count > view.byteLength) return null;

  let value = "";
  for (let index = 0; index < count; index += 1) {
    const charCode = view.getUint8(start + index);
    if (charCode === 0) break;
    value += String.fromCharCode(charCode);
  }
  return value.trim() || null;
}

function toDateInputValue(value: string) {
  const match = value.match(/^(\d{4}):(\d{2}):(\d{2})/);
  if (!match) return null;
  return `${match[1]}-${match[2]}-${match[3]}`;
}
