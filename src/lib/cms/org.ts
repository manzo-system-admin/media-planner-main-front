import "server-only";
import { getAdminDb } from "@/lib/firebase/admin";
import { toText } from "./types";
import type { TeamGalleryPhoto } from "@/lib/dictionaries/types";

export type TeamGalleryDoc = {
  id: string;
  image: string;
  caption?: string;
  order?: number;
  deleted?: boolean;
};

export type ClientDoc = {
  id: string;
  name: string;
  logoUrl?: string;
  order?: number;
  deleted?: boolean;
};

export async function getTeamGallery(): Promise<TeamGalleryPhoto[]> {
  const snapshot = await getAdminDb().collection("team").orderBy("order", "asc").get();
  return snapshot.docs
    .filter((doc) => !doc.data().deleted)
    .map((doc) => {
      const data = doc.data() as Omit<TeamGalleryDoc, "id">;
      return { id: doc.id, image: data.image, caption: data.caption ? toText(data.caption) : "" };
    });
}

export async function getClients(): Promise<{ id: string; name: string; logoUrl?: string }[]> {
  const snapshot = await getAdminDb().collection("clients").orderBy("order", "asc").get();
  return snapshot.docs
    .filter((doc) => !doc.data().deleted)
    .map((doc) => {
      const data = doc.data() as Omit<ClientDoc, "id">;
      return { id: doc.id, name: data.name, logoUrl: data.logoUrl };
    });
}
