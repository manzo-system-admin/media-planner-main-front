import "server-only";
import { getAdminDb } from "@/lib/firebase/admin";
import { toText } from "./types";
import type { ClientCategory } from "./clientCategories";
import type { ClientDoc, TeamGalleryDoc } from "./orgTypes";
import type { TeamGalleryPhoto } from "@/lib/dictionaries/types";

export async function getTeamGallery(): Promise<TeamGalleryPhoto[]> {
  const snapshot = await getAdminDb().collection("team").orderBy("order", "asc").get();
  return snapshot.docs
    .filter((doc) => !doc.data().deleted)
    .map((doc) => {
      const data = doc.data() as Omit<TeamGalleryDoc, "id">;
      return { id: doc.id, image: data.image, caption: data.caption ? toText(data.caption) : "" };
    });
}

export async function getClients(): Promise<{ id: string; name: string; category?: ClientCategory; logoUrl?: string }[]> {
  const snapshot = await getAdminDb().collection("clients").orderBy("order", "asc").get();
  return snapshot.docs
    .filter((doc) => !doc.data().deleted)
    .map((doc) => {
      const data = doc.data() as Omit<ClientDoc, "id">;
      return { id: doc.id, name: data.name, category: data.category, logoUrl: data.logoUrl };
    });
}
