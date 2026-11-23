export const MAX_IMAGE_BYTES = 20 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 250 * 1024 * 1024;

const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "gif", "avif", "svg"];
const VIDEO_EXTENSIONS = ["mp4", "webm", "mov"];

export function isVideoUrl(url: string): boolean {
  try {
    const pathname = decodeURIComponent(new URL(url, "https://example.invalid").pathname);
    return /\.(mp4|webm|mov)$/i.test(pathname);
  } catch {
    return /\.(mp4|webm|mov)(?:[?#]|$)/i.test(url);
  }
}

export function validateMediaFile(file: File, accept: string): string | null {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  const imageAllowed = accept.includes("image") && IMAGE_EXTENSIONS.includes(extension) && file.type.startsWith("image/");
  const videoAllowed = accept.includes("video") && VIDEO_EXTENSIONS.includes(extension) &&
    (file.type.startsWith("video/") || (extension === "mov" && file.type === "application/octet-stream"));
  if (!imageAllowed && !videoAllowed) return "ไฟล์ชนิดนี้ไม่รองรับ กรุณาเลือกภาพหรือวิดีโอตามประเภทที่ระบุ";
  if (imageAllowed && file.size > MAX_IMAGE_BYTES) return "รูปภาพต้องมีขนาดไม่เกิน 20 MB";
  if (videoAllowed && file.size > MAX_VIDEO_BYTES) return "วิดีโอต้องมีขนาดไม่เกิน 250 MB";
  return null;
}

export function mediaUploadErrorMessage(error: unknown): string {
  const code = typeof error === "object" && error !== null && "code" in error
    ? String((error as { code?: unknown }).code ?? "")
    : "";
  if (code === "storage/unauthorized") return "ไม่มีสิทธิ์อัปโหลดไฟล์นี้ กรุณาตรวจสอบบัญชีที่ใช้งาน";
  if (code === "storage/canceled") return "ยกเลิกการอัปโหลดแล้ว กรุณาลองเลือกไฟล์อีกครั้ง";
  if (code === "storage/quota-exceeded") return "พื้นที่จัดเก็บเต็ม กรุณาติดต่อผู้ดูแลระบบ";
  if (code === "storage/retry-limit-exceeded") return "อัปโหลดใช้เวลานานเกินไป กรุณาลองใหม่";
  if (error instanceof Error && error.message) return `อัปโหลดไม่สำเร็จ: ${error.message}`;
  return "อัปโหลดไม่สำเร็จ กรุณาลองใหม่";
}
