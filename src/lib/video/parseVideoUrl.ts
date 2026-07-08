import type { VideoSource } from "@/lib/cms/types";

/**
 * Detects YouTube / Facebook / TikTok links pasted by an admin and normalizes
 * them into a VideoSource the public VideoEmbed component knows how to render.
 * Returns null if the URL doesn't match a known pattern (caller should show
 * an error rather than silently discard it).
 */
export function parseVideoUrl(rawUrl: string): VideoSource | null {
  let url: URL;
  try {
    url = new URL(rawUrl.trim());
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "");

  if (host === "youtube.com" || host === "m.youtube.com") {
    const videoId = url.searchParams.get("v") ?? url.pathname.split("/embed/")[1];
    if (videoId) return { kind: "youtube", videoId: videoId.split("&")[0] };
    return null;
  }

  if (host === "youtu.be") {
    const videoId = url.pathname.slice(1);
    if (videoId) return { kind: "youtube", videoId };
    return null;
  }

  if (host === "facebook.com" || host === "fb.watch") {
    return { kind: "facebook", url: url.toString() };
  }

  if (host === "tiktok.com") {
    const match = url.pathname.match(/\/video\/(\d+)/);
    if (match) return { kind: "tiktok", videoId: match[1], url: url.toString() };
    return null;
  }

  return null;
}

export const VIDEO_URL_HELP =
  "วางลิงก์ YouTube, Facebook หรือ TikTok (สำหรับ TikTok ต้องเป็นลิงก์เต็มรูปแบบ tiktok.com/@user/video/... ลิงก์แบบย่อ vm.tiktok.com ยังไม่รองรับ)";
