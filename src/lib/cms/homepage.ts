import "server-only";
import { getAdminDb } from "@/lib/firebase/admin";
import { toText, type VideoSource } from "./types";
import type { HeroSlide } from "@/lib/dictionaries/types";

export type BannerDoc = {
  id: string;
  type: "image" | "video";
  src: string;
  poster?: string;
  alt: string;
  order?: number;
  deleted?: boolean;
};

export type VideoPopupDoc = {
  videoSource: VideoSource | null;
  thumbnail: string;
  caption: string;
  orientation?: "landscape" | "portrait";
};

const VIDEO_POPUP_DOC_ID = "config";

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const snapshot = await getAdminDb().collection("banners").orderBy("order", "asc").get();
  return snapshot.docs
    .filter((doc) => !doc.data().deleted)
    .map((doc) => {
      const data = doc.data() as Omit<BannerDoc, "id">;
      if (data.type === "video") {
        return { type: "video", src: data.src, poster: data.poster ?? "", alt: toText(data.alt) };
      }
      return { type: "image", src: data.src, alt: toText(data.alt) };
    });
}

export async function getVideoPopup(): Promise<{
  videoSource: VideoSource | null;
  thumbnail: string;
  caption: string;
  orientation?: "landscape" | "portrait";
} | null> {
  const snapshot = await getAdminDb().collection("videoPopup").doc(VIDEO_POPUP_DOC_ID).get();
  if (!snapshot.exists) return null;
  const data = snapshot.data() as VideoPopupDoc;
  return {
    videoSource: data.videoSource ?? null,
    thumbnail: data.thumbnail,
    caption: toText(data.caption),
    orientation: data.orientation,
  };
}

export { VIDEO_POPUP_DOC_ID };
