import "server-only";
import { getAdminDb } from "@/lib/firebase/admin";
import { pick, type Localized, type VideoSource } from "./types";
import type { Locale } from "@/lib/i18n/config";

export type VideoLibraryDoc = {
  id: string;
  title: Localized;
  thumbnail: string;
  videoSource: VideoSource;
  order?: number;
  deleted?: boolean;
};

export type EventGalleryDoc = {
  id: string;
  image: string;
  caption?: Localized;
  order?: number;
  deleted?: boolean;
};

export type CmsVideoItem = {
  id: string;
  title: string;
  thumbnail: string;
  videoSource: VideoSource;
};

export type CmsGalleryItem = {
  id: string;
  image: string;
  caption: string;
};

export async function getVideoLibrary(locale: Locale): Promise<CmsVideoItem[]> {
  const snapshot = await getAdminDb().collection("videoLibrary").orderBy("order", "asc").get();
  return snapshot.docs
    .filter((doc) => !doc.data().deleted)
    .map((doc) => {
      const data = doc.data() as Omit<VideoLibraryDoc, "id">;
      return {
        id: doc.id,
        title: pick(data.title, locale),
        thumbnail: data.thumbnail,
        videoSource: data.videoSource,
      };
    });
}

export async function getEventGallery(locale: Locale): Promise<CmsGalleryItem[]> {
  const snapshot = await getAdminDb().collection("eventGallery").orderBy("order", "asc").get();
  return snapshot.docs
    .filter((doc) => !doc.data().deleted)
    .map((doc) => {
      const data = doc.data() as Omit<EventGalleryDoc, "id">;
      return { id: doc.id, image: data.image, caption: data.caption ? pick(data.caption, locale) : "" };
    });
}
