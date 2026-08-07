// Uploaded images from phone cameras/screenshots can be 4000px+ across,
// which is massive overkill for thumbnails and slows/breaks loading on the
// public site (Firebase Hosting can't run Next's image optimizer, so images
// are served at their original size — see next.config.ts `unoptimized`).
// Downscale client-side before upload so files stay reasonably sized.
const MAX_DIMENSION = 1920;
const JPEG_QUALITY = 0.82;
const SKIP_IF_UNDER_BYTES = 1_500_000;

export async function resizeImageFile(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml" || file.type === "image/gif") {
    return file;
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return file;
  }

  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  if (scale === 1 && file.size <= SKIP_IF_UNDER_BYTES) {
    bitmap.close();
    return file;
  }

  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    return file;
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY));
  if (!blob || blob.size >= file.size) return file;

  const newName = file.name.replace(/\.[^./]+$/, "") + ".jpg";
  return new File([blob], newName, { type: "image/jpeg" });
}
