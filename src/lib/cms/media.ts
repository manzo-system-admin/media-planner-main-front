import "server-only";
import { getAdminDb } from "@/lib/firebase/admin";
import { toText, type VideoSource } from "./types";
import { sortMediaByDate } from "./mediaSort";

export type VideoLibraryDoc = {
  id: string;
  title: string;
  thumbnail: string;
  videoSource: VideoSource;
  date?: string;
  order?: number;
  deleted?: boolean;
};

export type EventGalleryDoc = {
  id: string;
  image: string;
  caption?: string;
  date?: string;
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
  const snapshot = await getAdminDb().collection("videoLibrary").get();
  const items = snapshot.docs
    .filter((doc) => !doc.data().deleted)
    .map((doc) => {
      const data = doc.data() as Omit<VideoLibraryDoc, "id">;
      return {
        id: doc.id,
        date: data.date,
        order: data.order,
        title: toText(data.title),
        thumbnail: data.thumbnail,
        videoSource: data.videoSource,
      };
    });
  return sortMediaByDate(items).map(({ id, title, thumbnail, videoSource }) => ({
    id,
    title,
    thumbnail,
    videoSource,
  }));
}

export async function getEventGallery(): Promise<CmsGalleryItem[]> {
  const snapshot = await getAdminDb().collection("eventGallery").get();
  const items = snapshot.docs
    .filter((doc) => !doc.data().deleted)
    .map((doc) => {
      const data = doc.data() as Omit<EventGalleryDoc, "id">;
      return {
        id: doc.id,
        date: data.date,
        order: data.order,
        image: data.image,
        caption: data.caption ? toText(data.caption) : "",
      };
    });
  return sortMediaByDate(items).map(({ id, image, caption }) => ({ id, image, caption }));
}
