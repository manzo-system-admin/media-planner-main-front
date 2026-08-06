import "server-only";
import { getAdminDb } from "@/lib/firebase/admin";
import { toText, type VideoSource } from "./types";

export type VideoLibraryDoc = {
  id: string;
  title: string;
  thumbnail: string;
  videoSource: VideoSource;
  order?: number;
  deleted?: boolean;
};

export type EventGalleryDoc = {
  id: string;
  image: string;
  caption?: string;
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

export async function getVideoLibrary(): Promise<CmsVideoItem[]> {
  const snapshot = await getAdminDb().collection("videoLibrary").orderBy("order", "asc").get();
  return snapshot.docs
    .filter((doc) => !doc.data().deleted)
    .map((doc) => {
      const data = doc.data() as Omit<VideoLibraryDoc, "id">;
      return {
        id: doc.id,
        title: toText(data.title),
        thumbnail: data.thumbnail,
        videoSource: data.videoSource,
      };
    });
}

export async function getEventGallery(): Promise<CmsGalleryItem[]> {
  const snapshot = await getAdminDb().collection("eventGallery").orderBy("order", "asc").get();
  return snapshot.docs
    .filter((doc) => !doc.data().deleted)
    .map((doc) => {
      const data = doc.data() as Omit<EventGalleryDoc, "id">;
      return { id: doc.id, image: data.image, caption: data.caption ? toText(data.caption) : "" };
    });
}
