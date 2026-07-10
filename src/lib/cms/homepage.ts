import "server-only";
import { getAdminDb } from "@/lib/firebase/admin";
import { pick, type Localized, type VideoSource } from "./types";
import type { Locale } from "@/lib/i18n/config";
import type { HeroSlide } from "@/lib/dictionaries/types";

export type BannerDoc = {
  id: string;
  type: "image" | "video";
  src: string;
  poster?: string;
  alt: Localized;
  order?: number;
  deleted?: boolean;
};

export type VideoPopupDoc = {
  videoSource: VideoSource | null;
  thumbnail: string;
  caption: Localized;
  orientation?: "landscape" | "portrait";
};

const VIDEO_POPUP_DOC_ID = "config";

export async function getHeroSlides(locale: Locale): Promise<HeroSlide[]> {
  const snapshot = await getAdminDb().collection("banners").orderBy("order", "asc").get();
  return snapshot.docs
    .filter((doc) => !doc.data().deleted)
    .map((doc) => {
      const data = doc.data() as Omit<BannerDoc, "id">;
      if (data.type === "video") {
        return { type: "video", src: data.src, poster: data.poster ?? "", alt: pick(data.alt, locale) };
      }
      return { type: "image", src: data.src, alt: pick(data.alt, locale) };
    });
}

export async function getVideoPopup(locale: Locale): Promise<{
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
    caption: pick(data.caption, locale),
    orientation: data.orientation,
  };
}

export { VIDEO_POPUP_DOC_ID };
